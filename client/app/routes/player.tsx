import { useParams, useLoaderData } from "react-router";
import { useState, useEffect, useRef } from "react";
import type { Route } from "./+types/player";
import { join } from "path";
import { readFile } from "fs/promises";
import { existsSync } from "fs";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Karaoke Player - Song ${params.id || "Unknown"}` },
    { name: "description", content: "Karaoke player for your favorite songs" },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const songId = params.id;

  if (!songId) {
    throw new Response("Song ID is required", { status: 400 });
  }

  try {
    const songPath = join(process.cwd(), "public", "songs", songId, "output");

    // Load song metadata
    const metadataPath = join(songPath, "metadata.json");
    let metadata = { title: "Unknown Song", artist: "Unknown Artist" };

    if (existsSync(metadataPath)) {
      const metadataContent = await readFile(metadataPath, "utf-8");
      metadata = JSON.parse(metadataContent);
    }

    // Load lyrics
    const lyricsPath = join(songPath, "lyrics.txt");
    let lyrics = "";

    if (existsSync(lyricsPath)) {
      lyrics = await readFile(lyricsPath, "utf-8");
    }

    // Load transcription data
    const transcriptionPath = join(songPath, "matched_transcription.json");
    let transcription = null;

    if (existsSync(transcriptionPath)) {
      const transcriptionContent = await readFile(transcriptionPath, "utf-8");
      transcription = JSON.parse(transcriptionContent);
    }

    return {
      songId,
      metadata,
      lyrics,
      transcription,
      audioUrls: {
        instrumental: `/songs/${songId}/output/songs_audio/instrumental.mp3`,
        vocal: `/songs/${songId}/output/songs_audio/vocal.mp3`,
      },
    };
  } catch (error) {
    console.error(`Error loading song ${songId}:`, error);
    throw new Response("Song not found", { status: 404 });
  }
}

export default function Player() {
  const { songId, metadata, lyrics, transcription, audioUrls } =
    useLoaderData<typeof loader>();

  const instrumentalRef = useRef<HTMLAudioElement>(null);
  const vocalRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);
  const [vocalVolume, setVocalVolume] = useState(0);

  // Filter transcription data to only include entries with lyrics
  const lyricsData =
    transcription?.result?.filter(
      (item: any) => item.correct_lyric && item.correct_lyric.trim() !== ""
    ) || [];

  // Update current time and find current lyric
  useEffect(() => {
    const instrumental = instrumentalRef.current;
    const vocal = vocalRef.current;
    if (!instrumental || !vocal) return;

    const updateTime = () => {
      const time = instrumental.currentTime;
      setCurrentTime(time);

      // Find current lyric based on timing
      const currentIndex = lyricsData.findIndex((item: any, index: number) => {
        const nextItem = lyricsData[index + 1];
        return time >= item.start && (!nextItem || time < nextItem.start);
      });

      setCurrentLyricIndex(currentIndex);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    // Sync vocal track with instrumental
    const syncTracks = () => {
      if (Math.abs(vocal.currentTime - instrumental.currentTime) > 0.1) {
        vocal.currentTime = instrumental.currentTime;
      }
    };

    instrumental.addEventListener("timeupdate", updateTime);
    instrumental.addEventListener("timeupdate", syncTracks);
    instrumental.addEventListener("play", handlePlay);
    instrumental.addEventListener("pause", handlePause);

    return () => {
      instrumental.removeEventListener("timeupdate", updateTime);
      instrumental.removeEventListener("timeupdate", syncTracks);
      instrumental.removeEventListener("play", handlePlay);
      instrumental.removeEventListener("pause", handlePause);
    };
  }, [lyricsData]);

  // Update vocal volume when slider changes
  useEffect(() => {
    if (vocalRef.current) {
      vocalRef.current.volume = vocalVolume / 100;
    }
  }, [vocalVolume]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePlayPause = () => {
    const instrumental = instrumentalRef.current;
    const vocal = vocalRef.current;
    if (!instrumental || !vocal) return;

    if (isPlaying) {
      instrumental.pause();
      vocal.pause();
    } else {
      instrumental.play();
      vocal.play();
    }
  };

  const seekTo = (time: number) => {
    const instrumental = instrumentalRef.current;
    const vocal = vocalRef.current;
    if (instrumental && vocal) {
      instrumental.currentTime = time;
      vocal.currentTime = time;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">{metadata.title}</h1>
          <p className="text-xl text-gray-300">by {metadata.artist}</p>
        </div>

        {/* Main Karaoke Display */}
        <div className="mb-8">
          {/* Current Lyric Display */}
          <div className="bg-gray-800 rounded-lg p-8 mb-6 min-h-[200px] flex items-center justify-center">
            <div className="text-center w-full max-w-4xl">
              {currentLyricIndex >= 0 && lyricsData[currentLyricIndex] ? (
                <div className="text-3xl font-bold leading-relaxed">
                  {(() => {
                    const currentLyric = lyricsData[currentLyricIndex];
                    const nextLyric = lyricsData[currentLyricIndex + 1];
                    const lyricStart = currentLyric.start;
                    const lyricEnd = nextLyric
                      ? nextLyric.start
                      : currentLyric.start + 3; // Default 3 seconds if no next lyric
                    const lyricDuration = lyricEnd - lyricStart;
                    const timeInLyric = currentTime - lyricStart;

                    // Create a unique animation name for this lyric
                    const animationName = `lyric-fill-${currentLyricIndex}`;

                    return (
                      <>
                        <style>
                          {`
                            .lyric-container-${currentLyricIndex} {
                              position: relative;
                              display: inline-block;
                              color: #9ca3af;
                            }
                            .lyric-container-${currentLyricIndex}::before {
                              content: "${currentLyric.correct_lyric.replace(
                                /"/g,
                                '\\"'
                              )}";
                              position: absolute;
                              top: 0;
                              left: 0;
                              width: 100%;
                              height: 100%;
                              color: #fbbf24;
                              clip-path: inset(0 100% 0 0);
                              animation: ${animationName} ${lyricDuration}s linear ${
                            timeInLyric < 0 ? Math.abs(timeInLyric) : 0
                          }s forwards;
                            }
                            @keyframes ${animationName} {
                              from {
                                clip-path: inset(0 100% 0 0);
                              }
                              to {
                                clip-path: inset(0 0% 0 0);
                              }
                            }
                          `}
                        </style>
                        <div className={`lyric-container-${currentLyricIndex}`}>
                          {currentLyric.correct_lyric}
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <p className="text-xl text-gray-500">
                  {isPlaying
                    ? "♪ Instrumental ♪"
                    : "Press play to start karaoke"}
                </p>
              )}
              {/* Next Lyric Preview */}
              {currentLyricIndex >= 0 && lyricsData[currentLyricIndex + 1] && (
                <div className="text-center mt-6">
                  <p className="text-2xl font-bold text-gray-400 leading-relaxed">
                    {lyricsData[currentLyricIndex + 1].correct_lyric}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Audio Player Controls */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <audio
            ref={instrumentalRef}
            src={audioUrls.instrumental}
            preload="metadata"
            className="hidden"
          />
          <audio
            ref={vocalRef}
            src={audioUrls.vocal}
            preload="metadata"
            className="hidden"
          />

          {/* Main Controls */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <button
              onClick={togglePlayPause}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-full font-bold text-xl transition-colors"
            >
              {isPlaying ? "⏸️ Pause" : "▶️ Play"}
            </button>
          </div>

          {/* Vocal Volume Slider */}
          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300 w-20">🎤 Vocals:</span>
              <div className=" flex items-center space-x-4">
                <span className="text-sm text-gray-400">0%</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={vocalVolume}
                  onChange={(e) => setVocalVolume(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #eab308 0%, #eab308 ${vocalVolume}%, #374151 ${vocalVolume}%, #374151 100%)`,
                  }}
                />
                <span className="text-sm text-gray-400">100%</span>
                <span className="text-sm text-yellow-400 w-12">
                  {vocalVolume}%
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(instrumentalRef.current?.duration || 0)}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full transition-all duration-200"
                style={{
                  width: `${
                    instrumentalRef.current?.duration
                      ? (currentTime / instrumentalRef.current.duration) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Lyrics Timeline */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Lyrics Timeline</h3>
          <div className="bg-gray-800 p-4 rounded-lg max-h-96 overflow-y-auto">
            {lyricsData.map((item: any, index: number) => (
              <div
                key={index}
                className={`flex items-center space-x-4 p-2 rounded cursor-pointer transition-colors ${
                  index === currentLyricIndex
                    ? "bg-yellow-600 text-black"
                    : "hover:bg-gray-700"
                }`}
                onClick={() => seekTo(item.start)}
              >
                <span className="text-sm text-gray-400 w-16">
                  {formatTime(item.start)}
                </span>
                <span className="flex-1">{item.correct_lyric}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Debug Info */}
        {transcription && (
          <div className="mb-8">
            <details className="bg-gray-800 p-4 rounded-lg">
              <summary className="cursor-pointer text-gray-300 hover:text-white">
                Show transcription data (for development)
              </summary>
              <pre className="mt-4 text-sm overflow-auto max-h-64 text-gray-400">
                {JSON.stringify(transcription, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <a
            href="/"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            ← Back to Songs
          </a>
        </div>
      </div>
    </div>
  );
}
