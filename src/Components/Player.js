import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  FaListUl
} from "react-icons/fa";
import { CiPlay1, CiPause1 } from "react-icons/ci";
import { TbRewindBackward15, TbRewindForward15 } from "react-icons/tb";
import { TfiControlSkipBackward, TfiControlSkipForward } from "react-icons/tfi";
import Navbar2 from "./Navbar2";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { api } from "../api";
import { Howl } from "howler";

const Player = () => {
  const [audioSrc, setAudioSrc] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [chapterName, setChapterName] = useState("HOT METAL");
  const [sections, setSections] = useState([]);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [fileName] = useState("1@1@2@The_Fire_Within_Chapter_1_R1.mp3");
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [chapterNumber, setChapterNumber] = useState(1);
  const appUrl = `https://firewithin.coachgenie.in/`;
  const soundRef = useRef(null);
  const intervalRef = useRef(null);

  // ✅ Setup Howler when src changes
  useEffect(() => {
    if (!audioSrc) return;

    if (soundRef.current) {
      soundRef.current.unload(); // cleanup old
    }

    const sound = new Howl({
      src: [audioSrc],
      html5: true,
      preload: true,
      onload: () => {
        setDuration(sound.duration());
      },
      onend: () => {
        setIsPlaying(false);
        clearInterval(intervalRef.current);
      }
    });

    soundRef.current = sound;

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      clearInterval(intervalRef.current);
    };
  }, [audioSrc]);

  // --- API Methods (same as your code) ---
  const loadPage = async ({ sectionId = currentSection, index = lessonIndex, type = "current", saveProgress = false } = {}) => {
    try {
      const body = new URLSearchParams();
      body.append("type", type);
      body.append("section_id", String(sectionId));
      body.append("course_id", "1");
      body.append("lesson_index", String(index));
      body.append("ttpe", "listen");

      const { data } = await api.post("/getpageDetails", body, {
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        withCredentials: true,
      });

      if (data.flag === "S" && data.data?.[0]) {
        const item = data.data[0];
        if (item.chapter_name) setChapterName(item.chapter_name);
        if (item.section_id != null) setCurrentSection(Number(item.section_id));
        if (item.lesson_index != null) setLessonIndex(Number(item.lesson_index));

        // ✅ set audio file
        if (item.file) {
          setAudioSrc(`${appUrl}audio.php?file=${item.file}`);
        } else {
          setAudioSrc(`${appUrl}audio.php?file=${fileName}`);
        }

        if (saveProgress && item.lesson_id) updateAutoPage(item.lesson_id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateAutoPage = async (page) => {
    try {
      await axios.get(`${appUrl}autopage/${page}`);
    } catch (err) {
      console.error(err);
    }
  };

  const getCurrentPageDetails = async () => {
    try {
      const res = await api.post("/currentPageDetails", { ttpe: "read" });
      const data = res.data.data;

      if (res.data.flag === "S" && data?.bookpage?.[0]) {
        const item = data.bookpage[0];
        if (item.chapter_name) setChapterName(item.chapter_name);
        if (item.section_id != null) setCurrentSection(Number(item.section_id));
        if (item.lesson_index != null) setLessonIndex(Number(item.lesson_index));

        setSections(Array.isArray(data.bookSectionDetails) ? data.bookSectionDetails : []);
        setAudioSrc(`${appUrl}audio.php?file=${fileName}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- Initial Load ---
  useEffect(() => {
    getCurrentPageDetails();
  }, []);

  // --- Audio Controls (Howler) ---
  const togglePlayPause = () => {
    if (!soundRef.current) return;
    if (isPlaying) {
      soundRef.current.pause();
      clearInterval(intervalRef.current);
    } else {
      soundRef.current.play();
      intervalRef.current = setInterval(() => {
        setCurrentTime(soundRef.current.seek());
      }, 500);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    if (!soundRef.current) return;
    const progress = (e.target.value / 100) * duration;
    soundRef.current.seek(progress);
    setCurrentTime(progress);
  };

  const handleSkip = (seconds) => {
    if (!soundRef.current) return;
    const newTime = Math.max(0, Math.min(duration, soundRef.current.seek() + seconds));
    soundRef.current.seek(newTime);
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };
  const openSection = (section, i) => {
    const sectionId = section.section_id ?? section.id ?? section.sectionId;
    setIsSliderOpen(false);
    setCurrentSection(Number(sectionId));
    setLessonIndex(0);

    loadPage({ sectionId, index: 0, type: "section", saveProgress: true });

    const label =
      section.section_name ||
      section.chapter_name ||
      section.title ||
      `Chapter ${i + 1}`;
    setChapterNumber(i + 1)
    setChapterName(label);
  };

  // --- UI ---
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar2 chapterName={chapterName} chapterNumber={currentSection} />
      <div className="flex flex-1 bg-gray-100 justify-center relative overflow-hidden">
        <div className="w-full max-w-[90%] mt-20 h-fit sm:max-w-[80%] md:max-w-[65%] rounded-[5vw] overflow-hidden shadow-lg">
          {/*White Section */}
          <div className="bg-white p-6 sm:p-10 md:p-16">
            <h2 className="text-gray-500 font-normal text-base sm:text-lg md:text-xl mb-4">
              Chapter-{chapterNumber} {chapterName}
            </h2>
            <input
              type="range"
              min="0"
              max="100"
              value={duration ? (currentTime / duration) * 100 : 0}
              onChange={handleSeek}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #0075FF ${(currentTime / duration) * 100}%, #e5e7eb ${(currentTime / duration) * 100}%)`
              }}
            />
            <div className="flex justify-between text-xs sm:text-sm md:text-md text-gray-500 mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          {/*blue Section */}
          <div className="bg-[#0075FF] p-10 flex text-lg justify-center items-center gap-6">
            <TfiControlSkipBackward className="text-white cursor-pointer" size={44} />
            <TbRewindBackward15 className="text-white cursor-pointer" onClick={() => handleSkip(-15)} size={48} />
            <button onClick={togglePlayPause} className="text-white rounded-full p-2">
              {isPlaying ? <CiPause1 size={54} /> : <CiPlay1 size={54} />}
            </button>
            <TbRewindForward15 className="text-white cursor-pointer" onClick={() => handleSkip(15)} size={48} />
            <TfiControlSkipForward className="text-white cursor-pointer" size={44} />
            <FaListUl className="text-white cursor-pointer" size={44} onClick={() => setIsSliderOpen(!isSliderOpen)} />
          </div>
        </div>
        {/* Slider Button */}
        <button
          aria-label={isSliderOpen ? "Close chapters" : "Open chapters"}
          onClick={(e) => { e.stopPropagation(); setIsSliderOpen(!isSliderOpen); }}
          className={`fixed top-1/2 -translate-y-1/2 z-40 text-blue-600 bg-white border border-neutral-200 px-3 py-4 rounded-l-full shadow-lg transition-all duration-300
                      ${isSliderOpen ? "right-[85vw] sm:right-96" : "right-0"}`}
        >
          {isSliderOpen ? <FaAngleRight /> : <FaAngleLeft />}
        </button>

        {/* Right Sidebar (Slide-in Drawer) */}
        <div
          className={`fixed right-0 h-full z-40 transform transition-transform duration-300 ease-in-out bg-white border-l border-neutral-200 w-[85vw] sm:w-96
                      ${isSliderOpen ? "translate-x-0" : "translate-x-full"}`}
          role="dialog"
          aria-label="Chapters"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full flex flex-col">
            <h2 className="text-xl font-light border-b p-5 bg-blue-500 text-white">Chapters</h2>
            <h2 className="text-xl font-light border-b p-5 text-gray-500">Contents</h2>
            <div className="flex-1 overflow-y-auto">
              <ul className="text-gray-500 font-semibold text-md sm:text-base">
                {sections.length === 0 ? (
                  <>
                    <li className="border-b border-b-gray-200 p-3">Loading…</li>
                  </>
                ) : (
                  sections.map((s, i) => {
                    const label = s.section_name || s.chapter_name || s.title || `Chapter ${i + 1}`;
                    return (
                      <li
                        key={s.section_id ?? s.id ?? i}
                        className="border-b border-b-gray-200 p-3 hover:bg-neutral-50 cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); openSection(s, i); }}
                      >
                        {`${i + 1}. ${label}`}
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Player;
