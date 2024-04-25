import { PathLike } from "node:fs";

import { Low, Memory } from "lowdb";
import { JSONFile } from "lowdb/node";

export default async function JSONFilePreset<Data>(
  filename: PathLike,
  defaultData: Data,
): Promise<Low<Data>> {
  const adapter =
    process.env.NODE_ENV === "test"
      ? new Memory<Data>()
      : new JSONFile<Data>(filename);
  const db = new Low<Data>(adapter, defaultData);
  await db.read();
  return db;
}
