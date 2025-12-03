import * as path from "node:path";
import * as exec from "@actions/exec";
import * as platform from "../platform";

import {
  PackageVersionInfo,
  buildPackageVersionInfo,
} from "./package_version_info";

async function apt_install(
  platformInfo: platform.PlatformInfo,
  info: PackageVersionInfo,
) {
  await exec.exec(path.join(__dirname, "../apt_install.sh"), [], {
    env: {
      CODENAME: platformInfo.codename,
      RUBY_VERSION: info.rubyVersion,
      DEFAULTS_PACKAGE_VERSION: info.defaultsPackageVersion,
      RUBY_PACKAGE_VERSION: info.rubyPackageVersion ?? "*",
    },
  });
}

export async function installRuby(
  rubyVersionText: string,
  rubyPackageVersion: string | null,
) {
  const platformInfo = await platform.read();
  const packageVersionInfo = await buildPackageVersionInfo(
    platformInfo.codename,
    rubyVersionText,
    rubyPackageVersion,
  );
  await apt_install(platformInfo, packageVersionInfo);
}
