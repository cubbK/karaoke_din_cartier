import { join } from "path";
import type { Route } from "./+types/home";
import { readdir, readFile } from "fs/promises";
import { existsSync } from "fs";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Karaoke din Cartier" }];
}

export async function loader({ params }: Route.LoaderArgs) {
  try {
    // Read the JSON file from the public directory
    const filePath = join(process.cwd(), "public", "songs");

    // Get all directories
    const files = await readdir(filePath, { withFileTypes: true });
    const folders = files
      .filter((file) => file.isDirectory())
      .map((file) => file.name);

    // Process each folder
    const songsData = [];
    for (const folder of folders) {
      const folderPath = join(filePath, folder);

      try {
        console.log(`Processing folder: ${folder}`);

        // Check if metadata file exists
        const metadataPath = join(folderPath, "output", "metadata.json");
        let metadata: { title: string; artist: string } = {
          title: "",
          artist: "",
        };

        if (existsSync(metadataPath)) {
          try {
            const metadataContent = await readFile(metadataPath, "utf-8");
            metadata = JSON.parse(metadataContent);
          } catch (metadataError) {
            console.error(
              `Error reading metadata for ${folder}:`,
              metadataError
            );
          }
        }

        // Check if screen.png exists
        const screenPath = join(folderPath, "output", "screen.png");
        const hasScreenshot = existsSync(screenPath);

        // Add the folder to your songs data
        songsData.push({
          id: folder,
          path: folderPath,
          metadata,
        });
      } catch (folderError) {
        console.error(`Error processing folder ${folder}:`, folderError);
      }
    }

    return { songs: songsData, folders };
  } catch (error) {
    console.error("Error reading songs directory:", error);
    return { songs: [], folders: [] };
  }
}

// 2000s Boom Bap Hip-Hop classics

export default function Home({ loaderData }: Route.ComponentProps) {
  console.log("Loader Data:", loaderData);
  const navigate = useNavigate();

  const handleSongSelect = (songId: string) => {
    console.log("Selected song:", songId);
    navigate(`/player/${songId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hip-Hop Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-2xl mb-6 transform rotate-3 text-6xl">
            🎤
          </div>
          <h1 className="text-6xl font-black text-white mb-2 tracking-tight">
            KARAOKE
          </h1>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-6">
            DIN CARTIER
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            „Hip-hop românesc, din ăla care ne place."
          </p>

          {/* Urban divider */}
          <div className="flex items-center justify-center mt-8 space-x-4">
            <div className="w-12 h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
            <div className="w-3 h-3 bg-orange-500 rotate-45"></div>
            <div className="w-12 h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
          </div>
        </div>

        {/* Hip-Hop Songs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loaderData.songs.map((song) => (
            <div
              key={song.id}
              onClick={() => handleSongSelect(song.id)}
              className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border border-gray-200 hover:border-gray-300"
            >
              {/* Image */}
              <div className="relative h-60 overflow-hidden">
                <img
                  src={`/songs/${song.id}/output/screen.png`}
                  alt={`Song ${song.id}`}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/40"></div>

                {/* Simple Play Indicator */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-gray-800 ml-0.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {/* Track Number */}
                <div className="absolute top-3 left-3 text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
                  #{song.id}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                      {song.metadata.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-1 truncate">
                      {song.metadata.artist}
                    </p>
                    <p className="text-gray-500 text-xs">Hip-Hop</p>
                  </div>
                </div>

                {/* Simple Status */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500 flex items-center"></span>
                  <div className="text-orange-600 text-sm font-medium">
                    Cântă
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-700">
          <div className="text-center">
            <p className="text-gray-400 text-sm">Made by Dan</p>
            <p className="text-gray-400 text-sm">
              Contribute a new song:{" "}
              <a
                className="text-orange-500 hover:underline"
                href="https://github.com/cubbK/karaoke_din_cartier"
              >
                github
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
