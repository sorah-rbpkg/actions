import * as os from "node:os";
import * as linuxOsRelease from "./util/linux_os_release";

type LinuxPlatformInfo = {
  os: "linux";
  distribution: string;
  codename: string;
};

export type PlatformInfo = LinuxPlatformInfo;

export async function read(): Promise<PlatformInfo> {
  const platform = os.platform();
  if (platform !== "linux") {
    throw new Error(`Unsupported operating system: ${platform}`);
  }

  const osRelease = await linuxOsRelease.read();

  return {
    os: platform,
    distribution: osRelease.id,
    codename: osRelease.versionCodename,
  };
}

export async function text() {
  const platformInfo = await read();
  return `${platformInfo.os}-${platformInfo.distribution}-${platformInfo.codename}`;
}
