export type PackageVersionInfo = {
  rubyVersion: string;
  defaultsPackageVersion: string;
  rubyPackageVersion: string | null;
};

const DebPackageVersionMap = {
  "2.7": {
    rubyVersion: "2.7",
    defaultsPackageVersionPrefix: "1:2.7.0+0nkmi2~",
    rubyPackageVersionPatternMiddle: "*-0nkmi1~",
  },
  "3.0": {
    rubyVersion: "3.0",
    defaultsPackageVersionPrefix: "1:3.0.0+0nkmi1~",
    rubyPackageVersionPatternMiddle: "*-0nkmi1~",
  },
  "3.1": {
    rubyVersion: "3.1",
    defaultsPackageVersionPrefix: "1:3.1.0+0nkmi1~",
    rubyPackageVersionPatternMiddle: "*-0nkmi1~",
  },
  "3.2": {
    rubyVersion: "3.2",
    defaultsPackageVersionPrefix: "1:3.2+0nkmi1~",
    rubyPackageVersionPatternMiddle: "*-0nkmi1~",
  },
  "3.3": {
    rubyVersion: "3.3",
    defaultsPackageVersionPrefix: "1:3.3+0nkmi1~",
    rubyPackageVersionPatternMiddle: "*-0nkmi1~",
  },
  "3.4": {
    rubyVersion: "3.4",
    defaultsPackageVersionPrefix: "1:3.4+0nkmi1~",
    rubyPackageVersionPatternMiddle: "*-0nkmi1~",
  },
  "4.0": {
    rubyVersion: "4.0",
    defaultsPackageVersionPrefix: "1:4.0+0nkmi1~",
    rubyPackageVersionPatternMiddle: "*-0nkmi1~",
  },
};

type RubyVersion = keyof typeof DebPackageVersionMap;

function removePatchVersion(rubyVersionText: string) {
  const matches = rubyVersionText.match(/^(\d+\.\d+)\.\d+$/);
  if (matches != null) {
    return matches[1];
  } else {
    return rubyVersionText;
  }
}

function validateRubyVersionText(value: string): value is RubyVersion {
  return Object.keys(DebPackageVersionMap).includes(value);
}

export function buildPackageVersionInfo(
  codename: string,
  rubyVersionText: string,
  rubyPackageVersion: string | null,
): PackageVersionInfo {
  const rubyVersionWithoutPatchVersion = removePatchVersion(rubyVersionText);
  if (!validateRubyVersionText(rubyVersionWithoutPatchVersion)) {
    throw new Error(`Invalid version text: ${rubyVersionText}`);
  }

  const template = DebPackageVersionMap[rubyVersionWithoutPatchVersion];
  return {
    rubyVersion: template.rubyVersion,
    defaultsPackageVersion: template.defaultsPackageVersionPrefix + codename,
    rubyPackageVersion:
      rubyPackageVersion ??
      rubyVersionText + template.rubyPackageVersionPatternMiddle + codename,
  };
}
