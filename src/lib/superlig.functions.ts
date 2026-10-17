import { createServerFn } from "@tanstack/react-start";
import type { SuperLigData } from "@/lib/superlig.server";

export const getSuperLigDataFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<SuperLigData> => {
    try {
      const { getSuperLigData } = await import("@/lib/superlig.server");
      return await getSuperLigData();
    } catch (err) {
      console.error("[superlig] server fn failed", err);
      const { getSuperLigData } = await import("@/lib/superlig.server");
      return await getSuperLigData();
    }
  }
);
