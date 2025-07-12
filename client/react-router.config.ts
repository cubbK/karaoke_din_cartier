import { readdir } from "fs/promises";
import { join } from "path";
import type { Config } from "@react-router/dev/config";

export default {
  async prerender() {
    const routes = ["/"];

    try {
      // Read available songs from the public/songs directory
      const songsDir = join(process.cwd(), "public", "songs");
      const songIds = await readdir(songsDir);

      // Add player routes for each song
      for (const songId of songIds) {
        routes.push(`/player/${songId}`);
      }
    } catch (error) {
      console.warn("Could not read songs directory for prerendering:", error);
    }

    return routes;
  },
} satisfies Config;
