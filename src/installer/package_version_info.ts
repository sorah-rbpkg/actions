export type PackageVersionInfo = {
  rubyVersion: string;
  defaultsPackageVersion: string;
  rubyPackageVersion: string | null;
};

const DebPackageVersionMap = {
  "2.7": {
    rubyVersion: "2.7",
    defaultsPackageVersionPrefix: "1:2.7.0+0nkmi2~",
  },
  "3.0": {
    rubyVersion: "3.0",
    defaultsPackageVersionPrefix: "1:3.0.0+0nkmi1~",
  },
  "3.1": {
    rubyVersion: "3.1",
    defaultsPackageVersionPrefix: "1:3.1.0+0nkmi1~",
  },
  "3.2": {
    rubyVersion: "3.2",
    defaultsPackageVersionPrefix: "1:3.2+0nkmi1~",
  },
};

export type RubyVersion = keyof typeof DebPackageVersionMap;

export function validateRubyVersionText(value: string): value is RubyVersion {
  return Object.keys(DebPackageVersionMap).includes(value);
}

export function buildPackageVersionInfo(
  codename: string,
  rubyVersion: RubyVersion,
  rubyPackageVersion: string | null
): PackageVersionInfo {
  const template = DebPackageVersionMap[rubyVersion];
  return {
    rubyVersion: template.rubyVersion,
    defaultsPackageVersion: template.defaultsPackageVersionPrefix + codename,
    rubyPackageVersion,
  };
}
