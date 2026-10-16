import { getSql } from "./db";

export async function isSystemActive(): Promise<boolean> {
  try {
    const sql = await getSql();
    const rows = await sql.query<{ value: string }>(
      "SELECT value FROM system_settings WHERE key = 'system_active' LIMIT 1"
    );
    if (!rows[0]) return true;
    return rows[0].value !== "false";
  } catch (error) {
    console.error("[settings] error reading system_active:", error);
    return true;
  }
}

export async function setSystemActive(active: boolean): Promise<boolean> {
  const sql = await getSql();
  const value = active ? "true" : "false";
  await sql.query(
    `INSERT INTO system_settings (key, value, updated_at)
     VALUES ('system_active', $1, now())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
    [value]
  );
  return active;
}
