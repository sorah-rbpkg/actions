import * as fs from "node:fs/promises";

const OsReleaseFilePath = "/etc/os-release";

export type OsRelease = {
  id: string;
  versionCodename: string;
};

export async function read(): Promise<OsRelease> {
  const text = await fs.readFile(OsReleaseFilePath, "utf8");
  const lines = text.split("\n");

  let id: string | null = null,
    versionCodename: string | null = null;
  for (const line of lines) {
    if (line.startsWith("ID=")) {
      id = line.substring("ID=".length);
    }

    if (line.startsWith("VERSION_CODENAME=")) {
      versionCodename = line.substring("VERSION_CODENAME=".length);
    }
  }

  if (id == null || versionCodename == null) {
    throw new Error(`invalid contents: ${OsReleaseFilePath}`);
  }

  return { id, versionCodename };
}
