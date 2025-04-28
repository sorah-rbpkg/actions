import * as crypto from "node:crypto";
import { constants as fsConstants } from "node:fs";
import * as fs from "node:fs/promises";
import * as path from "path";
import * as exec from "@actions/exec";
import * as cache from "@actions/cache";
import * as platform from "./platform";

function existsFile(path: string): Promise<boolean> {
  return fs
    .access(path, fsConstants.R_OK)
    .then(() => true)
    .catch(() => false);
}

async function inferLockfilePath(): Promise<string> {
  return `${process.env.BUNDLE_GEMFILE || "Gemfile"}.lock`;
}

async function hash(content: crypto.BinaryLike) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

export async function bundleInstall() {
  const execOptions = {};

  const bundleConfigPath = "vendor/bundle";
  await exec.exec(
    "bundle",
    ["config", "--local", "path", path.join(process.cwd(), bundleConfigPath)],
    execOptions
  );
  await exec.exec(
    "bundle",
    ["config", "--local", "deployment", "true"],
    execOptions
  );
  await exec.exec(
    "bundle",
    ["config", "--local", "clean", "true"],
    execOptions
  );

  const lockfilePath = await inferLockfilePath();
  if (!(await existsFile(lockfilePath))) {
    throw new Error(`Missing lockfile in expected path: ${lockfilePath}`);
  }

  const baseKey = await buildBaseKey(
    process.cwd(),
    process.env.BUNDLER_VERSION || "",
    process.env.BUNDLE_WITH || "",
    process.env.BUNDLE_WITHOUT || ""
  );
  const lockfileHash = await fs.readFile(lockfilePath).then(hash);
  const cacheOptions = {
    paths: [bundleConfigPath],
    primaryKey: `${baseKey}-${lockfileHash}`,
    restoreKeys: [baseKey],
  };

  const cacheHit = await cache.restoreCache(
    // https://github.com/actions/toolkit/issues/1377
    cacheOptions.paths.slice(),
    cacheOptions.primaryKey,
    cacheOptions.restoreKeys
  );

  await exec.exec("bundle", ["install"], execOptions);

  if (cacheHit !== cacheOptions.primaryKey) {
    await cache.saveCache(cacheOptions.paths, cacheOptions.primaryKey);
  }
}

async function buildBaseKey(
  cwd: string,
  bundlerVersion: string,
  bundleWith: string,
  bundleWithout: string
) {
  return `sorah-rbpkg-actions-bundler-cache-v2-${await platform.text()}-cwd-${cwd}-bundler-${bundlerVersion}-with-${bundleWith}-without-${bundleWithout}`;
}
