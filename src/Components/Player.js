import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  FaVolumeMute,
  FaStepBackward,
  FaStepForward,
  FaListUl,
} from "react-icons/fa";
import { MdReplay10, MdForward10, MdPlayArrow, MdPause } from "react-icons/md";
import { CiPlay1 } from "react-icons/ci";
import { CiPause1 } from "react-icons/ci";
import { TbRewindBackward15 } from "react-icons/tb";
import { TbRewindForward15 } from "react-icons/tb";
import { TfiControlSkipBackward } from "react-icons/tfi";
import { TfiControlSkipForward } from "react-icons/tfi";
import Navbar2 from "./Navbar2";

const Player = () => {
  const [audioSrc, setAudioSrc] = useState("/music.mp3");
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const [pageContent, setPageContent] = useState("Loading content...");
  const [pageNumber, setPageNumber] = useState(1);

  const audioRef = useRef(null);

  // Fetch page content when pageNumber changes
  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await axios.post("/get_lession_by_page_no", {
          page_number: pageNumber,
          course_id: 1,
        });
        if (res.data?.introduction) {
          setPageContent(res.data.introduction);
        } else {
          setPageContent("No content found for this page.");
        }
      } catch (err) {
        console.error(err);
        setPageContent("Error loading content.");
      }
    };
    fetchPage();
  }, [pageNumber]);

  // Audio metadata loaded
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Update time
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Play/Pause toggle
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Seek in audio
  const handleSeek = (e) => {
    if (!audioRef.current) return;
    const progress = (e.target.value / 100) * duration;
    audioRef.current.currentTime = progress;
    setCurrentTime(progress);
  };

  // Forward/Rewind
  const handleSkip = (seconds) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime += seconds;
  };

  // Format time
  const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
  <div className="flex flex-col min-h-screen bg-gray-100">
  <Navbar2 />

  <div className="flex flex-col items-center flex-1 py-20">
    {/* Player Card */}
    <div className="w-full max-w-[90%] sm:max-w-[80%] md:max-w-[65%] rounded-[6vw] sm:rounded-[4vw] overflow-hidden shadow-lg">
      {/* Top White Section */}
      <div className="bg-white p-6 sm:p-10 md:p-16">
        <h2 className="text-gray-500 font-light text-base sm:text-lg md:text-xl mb-4">
          Chapter-1 Hot Metal
        </h2>

        {/* Progress bar */}
        <input
          type="range"
          min="0"
          max="100"
          value={duration ? (currentTime / duration) * 100 : 0}
          onChange={handleSeek}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #0075FF ${
              (currentTime / duration) * 100
            }%, #e5e7eb ${(currentTime / duration) * 100}%)`,
          }}
        />

        {/* Time */}
        <div className="flex justify-between text-xs sm:text-sm md:text-md text-gray-500 mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Bottom Blue Section */}
      <div className="bg-[#0075FF] p-6 sm:p-8 md:p-10 lg:p-12 flex justify-center items-center gap-4 sm:gap-6 md:gap-8">
        <TfiControlSkipBackward
          className="text-white cursor-pointer"
          size={30}
        />
        <TbRewindBackward15
          className="text-white cursor-pointer"
          onClick={() => handleSkip(-15)}
          size={35}
        />
        <button
          onClick={togglePlayPause}
          className="text-white rounded-full p-2 sm:p-3"
        >
          {isPlaying ? (
            <CiPause1 size={40} />
          ) : (
            <CiPlay1 size={40} />
          )}
        </button>
        <TbRewindForward15
          className="text-white cursor-pointer"
          onClick={() => handleSkip(15)}
          size={35}
        />
        <TfiControlSkipForward className="text-white cursor-pointer" size={30} />
        <FaListUl className="text-white cursor-pointer" size={30} />
      </div>
    </div>

    {/* Hidden audio element */}
    <audio
      ref={audioRef}
      src={audioSrc}
      onLoadedMetadata={handleLoadedMetadata}
      onTimeUpdate={handleTimeUpdate}
    />
  </div>
</div>

  );
};

export default Player;
