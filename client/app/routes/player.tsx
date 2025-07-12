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
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);

  // Filter transcription data to only include entries with lyrics
  const lyricsData = transcription?.result?.filter(
    (item: any) => item.correct_lyric && item.correct_lyric.trim() !== ""
  ) || [];

  // Update current time and find current lyric
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      const time = audio.currentTime;
      setCurrentTime(time);

      // Find current lyric based on timing
      const currentIndex = lyricsData.findIndex(
        (item: any, index: number) => {
          const nextItem = lyricsData[index + 1];
          return time >= item.start && (!nextItem || time < nextItem.start);
        }
      );

      setCurrentLyricIndex(currentIndex);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [lyricsData]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const seekTo = (time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
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
            <div className="text-center">
              {currentLyricIndex >= 0 && lyricsData[currentLyricIndex] ? (
                <p className="text-3xl font-bold text-yellow-400 leading-relaxed">
                  {lyricsData[currentLyricIndex].correct_lyric}
                </p>
              ) : (
                <p className="text-xl text-gray-500">
                  {isPlaying ? "♪ Instrumental ♪" : "Press play to start karaoke"}
                </p>
              )}
            </div>
          </div>

          {/* Next Lyric Preview */}
          {currentLyricIndex >= 0 && lyricsData[currentLyricIndex + 1] && (
            <div className="text-center mb-6">
              <p className="text-lg text-gray-400">
                Next: {lyricsData[currentLyricIndex + 1].correct_lyric}
              </p>
            </div>
          )}
        </div>

        {/* Audio Player Controls */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <audio
            ref={audioRef}
            src={audioUrls.instrumental}
            preload="metadata"
            className="hidden"
          />
          
          {/* Main Controls */}
          <div className="flex items-center justify-center space-x-4 mb-4">
            <button
              onClick={togglePlayPause}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-full font-bold text-xl transition-colors"
            >
              {isPlaying ? "⏸️ Pause" : "▶️ Play"}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(audioRef.current?.duration || 0)}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full transition-all duration-200"
                style={{
                  width: `${
                    audioRef.current?.duration
                      ? (currentTime / audioRef.current.duration) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Track Selection */}
          <div className="flex space-x-4">
            <button
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.src = audioUrls.instrumental;
                  audioRef.current.load();
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
            >
              🎵 Instrumental
            </button>
            <button
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.src = audioUrls.vocal;
                  audioRef.current.load();
                }
              }}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded transition-colors"
            >
              🎤 With Vocals
            </button>
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
