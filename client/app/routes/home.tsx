import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Karaoke din Cartier" }];
}

// 2000s Boom Bap Hip-Hop classics
const karaokeSongs = [
  {
    id: 1,
    title: "The Light",
    artist: "Common",
    background:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    duration: "4:14",
  },
  {
    id: 2,
    title: "Ms. Jackson",
    artist: "OutKast",
    background:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop",
    duration: "4:31",
  },
  {
    id: 3,
    title: "The Next Episode",
    artist: "Dr. Dre ft. Snoop Dogg",
    background:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop",
    duration: "2:41",
  },
  {
    id: 4,
    title: "Get By",
    artist: "Talib Kweli",
    background:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    duration: "3:28",
  },
  {
    id: 5,
    title: "The Corner",
    artist: "Common ft. The Last Poets",
    background:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop",
    duration: "4:12",
  },
  {
    id: 6,
    title: "Definition",
    artist: "Black Star",
    background:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    duration: "3:17",
  },
  {
    id: 7,
    title: "The Blast",
    artist: "Reflection Eternal",
    background:
      "https://images.unsplash.com/photo-1520637836862-4d197d17c53a?w=400&h=300&fit=crop",
    duration: "3:42",
  },
  {
    id: 8,
    title: "Move",
    artist: "Little Brother",
    background:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    duration: "3:55",
  },
];

export default function Home() {
  const handleSongSelect = (song: (typeof karaokeSongs)[0]) => {
    console.log("Selected song:", song);
    // Add your song selection logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hip-Hop Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-2xl mb-6 transform rotate-3">
            <svg
              className="w-12 h-12 text-white transform -rotate-3"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 3v9.28l-2.44-2.44-1.42 1.42L12 15.12l3.86-3.86-1.42-1.42L12 12.28V3h-1zm7.5 3.5v10a2.5 2.5 0 01-2.5 2.5H7a2.5 2.5 0 01-2.5-2.5v-10A2.5 2.5 0 017 4h1.5v1.5H7a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1v-10a1 1 0 00-1-1h-1.5V4H17a2.5 2.5 0 012.5 2.5z" />
            </svg>
          </div>
          <h1 className="text-6xl font-black text-white mb-2 tracking-tight">
            KARAOKE
          </h1>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-6">
            DIN CARTIER
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            „Hip-hop românesc, din ăla care ne place.”
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
          {karaokeSongs.map((song) => (
            <div
              key={song.id}
              onClick={() => handleSongSelect(song)}
              className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border border-gray-200 hover:border-gray-300"
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={song.background}
                  alt={song.title}
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
                      {song.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-1 truncate">
                      {song.artist}
                    </p>
                    <p className="text-gray-500 text-xs">
                      Hip-Hop • {song.duration}
                    </p>
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

        {/* Add More Button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            Vezi mai multe piese
          </button>
        </div>
      </div>
    </div>
  );
}
