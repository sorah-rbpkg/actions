import * as fs from "node:fs";
import { unreachable } from "./util/helper";

import * as core from "@actions/core";

export type Input = (
  | {
      rubyVersion: string;
    }
  | {
      rubyVersionFile: string;
    }
) & { rubyPackageVersion: string | null; bundlerCache: boolean };

function readRubyVersion() {
  const rawRubyVersion = core.getInput("ruby-version");
  const rawRubyVersionFile = core.getInput("ruby-version-file");

  const rubyVersion = rawRubyVersion === "" ? null : rawRubyVersion;
  const rubyVersionFile = rawRubyVersionFile === "" ? null : rawRubyVersionFile;

  if (rubyVersion == null && rubyVersionFile == null) {
    return {
      rubyVersionFile: ".ruby-version",
    };
  } else if (rubyVersion != null && rubyVersionFile == null) {
    return {
      rubyVersion,
    };
  } else if (rubyVersion == null && rubyVersionFile != null) {
    return {
      rubyVersionFile,
    };
  } else if (rubyVersion != null && rubyVersionFile != null) {
    throw new Error(
      "invalid input, input is mutually exclusive: ruby-version, ruby-version-file"
    );
  } else {
    return unreachable();
  }
}

function readRubyPackageVersion() {
  const rawRubyPackageVersion = core.getInput("ruby-package-version");
  const rubyPackageVersion =
    rawRubyPackageVersion === "" ? null : rawRubyPackageVersion;
  return { rubyPackageVersion };
}

function readBundlerCache() {
  return { bundlerCache: core.getBooleanInput("bundler-cache") };
}

export function readInput(): Input {
  return {
    ...readRubyVersion(),
    ...readRubyPackageVersion(),
    ...readBundlerCache(),
  };
}

export function extractRubyVersionText(input: Input): string {
  if ("rubyVersion" in input) {
    return input.rubyVersion;
  } else if ("rubyVersionFile" in input) {
    return fs.readFileSync(input.rubyVersionFile).toString().trim();
  } else {
    throw new Error(input satisfies never);
  }
}
