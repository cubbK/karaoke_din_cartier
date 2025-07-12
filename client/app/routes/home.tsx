import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Karaoke din Cartier" }];
}

// Boom bap and rap songs data
const karaokeSongs = [
  {
    id: 1,
    title: "N.Y. State of Mind",
    artist: "Nas",
    background:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    title: "C.R.E.A.M.",
    artist: "Wu-Tang Clan",
    background:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    title: "The World Is Yours",
    artist: "Nas",
    background:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    title: "93 'Til Infinity",
    artist: "Souls of Mischief",
    background:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
  },
  {
    id: 5,
    title: "Mass Appeal",
    artist: "Gang Starr",
    background:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop",
  },
  {
    id: 6,
    title: "They Reminisce Over You",
    artist: "Pete Rock & CL Smooth",
    background:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
  },
  {
    id: 7,
    title: "Award Tour",
    artist: "A Tribe Called Quest",
    background:
      "https://images.unsplash.com/photo-1520637836862-4d197d17c53a?w=400&h=300&fit=crop",
  },
  {
    id: 8,
    title: "Juicy",
    artist: "The Notorious B.I.G.",
    background:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
  },
];

export default function Home() {
  const handleSongSelect = (song: (typeof karaokeSongs)[0]) => {
    console.log("Selected song:", song);
    // Add your song selection logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6 relative overflow-hidden">
      {/* Urban Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_40%,rgba(255,215,0,0.02)_50%,transparent_60%)] bg-[length:40px_40px]"></div>
      </div>

      {/* Graffiti-style corner elements */}
      <div className="absolute top-10 left-10 w-20 h-20 border-l-4 border-t-4 border-yellow-400 opacity-30"></div>
      <div className="absolute bottom-10 right-10 w-20 h-20 border-r-4 border-b-4 border-yellow-400 opacity-30"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            {/* Main Title */}
            <h1
              className="text-7xl font-black text-white mb-2 transform -rotate-1"
              style={{
                fontFamily: "Arial Black, Impact, sans-serif",
                textShadow:
                  "6px 6px 0px #000, 3px 3px 0px #ffd700, -2px -2px 0px #ffd700",
                letterSpacing: "0.05em",
              }}
            >
              🎤KARAOKE
            </h1>

            {/* Subtitle with urban styling */}
            <div
              className="text-2xl font-bold text-yellow-400 -mt-1 tracking-[0.3em] transform rotate-1"
              style={{
                fontFamily: "Arial Black, Impact, sans-serif",
                textShadow: "2px 2px 0px #000, 1px 1px 0px #000",
              }}
            >
              DIN CARTIER
            </div>

            {/* Boom Bap subtitle */}
            <div className="mt-3 inline-block bg-black border-2 border-yellow-400 px-4 py-1 transform -rotate-1">
              <span className="text-yellow-400 font-bold text-sm tracking-widest uppercase">
                ★ BOOM BAP HITS ★
              </span>
            </div>
          </div>

          <p className="text-lg text-gray-300 mt-6 font-semibold tracking-wide"></p>

          {/* Hip-hop style divider */}
          <div className="flex items-center justify-center mt-6 space-x-4">
            <div className="w-16 h-1 bg-yellow-400"></div>
            <div className="w-4 h-4 bg-yellow-400 rotate-45"></div>
            <div className="w-16 h-1 bg-yellow-400"></div>
          </div>
        </div>

        {/* Songs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {karaokeSongs.map((song) => (
            <div
              key={song.id}
              onClick={() => handleSongSelect(song)}
              className="group relative overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 bg-gradient-to-br from-gray-800 to-black border-2 border-gray-700 hover:border-yellow-400 shadow-2xl hover:shadow-yellow-400/25"
            >
              {/* Cassette tape style design */}
              <div className="relative bg-black">
                {/* Background Image with Urban Filter */}
                <div
                  className="h-48 bg-cover bg-center relative"
                  style={{
                    backgroundImage: `url(${song.background})`,
                    filter: "grayscale(60%) contrast(130%) brightness(70%)",
                  }}
                >
                  {/* Dark overlay with gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 group-hover:from-black/95 transition-all duration-300" />

                  {/* Hip-hop style corner tape */}
                  <div className="absolute top-3 left-3 w-8 h-3 bg-yellow-400 transform -rotate-12"></div>
                  <div className="absolute top-3 right-3 w-8 h-3 bg-yellow-400 transform rotate-12"></div>

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="bg-yellow-400 text-black rounded-none p-4 border-4 border-black shadow-lg transform group-hover:scale-110 transition-transform duration-200 rotate-45">
                      <svg
                        className="w-8 h-8 text-black -rotate-45"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Vinyl record style circle */}
                  <div className="absolute bottom-3 right-3 w-8 h-8 border-2 border-yellow-400 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  </div>
                </div>

                {/* Song Info - Cassette label style */}
                <div className="p-4 bg-gradient-to-r from-black via-gray-900 to-black border-t-2 border-yellow-400 relative">
                  {/* Label tape effect */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-yellow-400"></div>

                  <h3
                    className="text-lg font-black text-white mb-1 line-clamp-2 tracking-wide uppercase"
                    style={{
                      fontFamily: "Arial Black, Impact, sans-serif",
                      textShadow: "2px 2px 0px #000",
                    }}
                  >
                    {song.title}
                  </h3>
                  <p className="text-yellow-400 text-sm font-bold tracking-wider uppercase border-l-2 border-yellow-400 pl-2">
                    {song.artist}
                  </p>

                  {/* Equalizer bars animation */}
                  <div className="flex items-end space-x-1 mt-3 h-4">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-yellow-400 w-1 rounded-sm group-hover:animate-pulse"
                        style={{
                          height: `${Math.random() * 16 + 4}px`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add More Tracks Button */}
        <div className="text-center mt-12">
          <button
            className="relative bg-black border-4 border-yellow-400 hover:bg-yellow-400 hover:text-black text-yellow-400 font-black py-4 px-12 transition-all duration-300 transform hover:scale-105 shadow-2xl uppercase tracking-wider text-lg"
            style={{ fontFamily: "Arial Black, Impact, sans-serif" }}
          >
            <span className="relative z-10">+ Drop More Beats</span>
            <div className="absolute top-1 left-1 right-1 bottom-1 border border-gray-600"></div>
          </button>
        </div>
      </div>
    </div>
  );
}
