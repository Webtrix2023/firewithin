import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { CiPlay1, CiPause1 } from "react-icons/ci";
import Navbar2 from "./Navbar2";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { api } from "../api";
import { Howl } from "howler";
import { toast } from "react-toastify";
import { APP_URL } from "../config";

const Player = () => {
  const [audioSrc, setAudioSrc] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [chapterName, setChapterName] = useState("");
  const [nextChapter, setNextChapter] = useState({});
  const [prevChapter, setPrevChapter] = useState({});
  const [sections, setSections] = useState([]);
  const [file_id, setFileId] = useState();
  const [lessonIndex, setLessonIndex] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [chapterNumber, setChapterNumber] = useState(1);
  const soundRef = useRef(null);
  const intervalRef = useRef(null);
  const [resumeTime, setResumeTime] = useState(0);

  useEffect(() => {
  const fetchData = async () => {
    try {
      // 1. Fetch backend progress
      const res = await axios.get(`${APP_URL}automodeSet/listen`);
      const savedTime = res.data?.time || 0; // adjust key based on backend response
      console.log("INside UseEffect")
      updateAutoPage(lessonIndex);
      getCurrentPageDetails();

      console.log("UseEffect", lessonIndex, "savedTime:", savedTime);

      // 2. When Howler loads, seek to savedTime
      if (soundRef.current) {
        soundRef.current.once("load", () => {
          soundRef.current.seek(savedTime);
          setCurrentTime(savedTime);

          // 3. Auto-play if you want
          soundRef.current.play();
          setIsPlaying(true);

          intervalRef.current = setInterval(() => {
            const current = soundRef.current.seek();
            setCurrentTime(current);

            if (Math.floor(current) % 5 === 0) {
              saveCurrentTime(current);
            }
          }, 1000);
        });
      }
    } catch (error) {
      console.error("Error in useEffect:", error);
    }
  };

  fetchData();

  return () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
}, []);

  // ✅ Setup Howler when src changes
  useEffect(() => {
    if (!audioSrc) return;

    // Kill old instance
    if (soundRef.current) {
      soundRef.current.unload();
      soundRef.current = null;
    }

    const sound = new Howl({
      src: [audioSrc],
      html5: true,
      preload: true,
      onload: () => {
        const dur = sound.duration();
        if (dur > 0) {
          setDuration(dur);
        }

        if (resumeTime > 0 && resumeTime < dur) {
          sound.seek(resumeTime);
          setCurrentTime(resumeTime);
        } else {
          setCurrentTime(0);
        }
      },
      onend: () => {
        setIsPlaying(false);
      }
    });

    soundRef.current = sound;

    // ✅ Trick: play-pause quickly to force duration calculation
    sound.play();
    setTimeout(() => {
      sound.pause();
      sound.seek(resumeTime > 0 ? resumeTime : 0);
    }, 10); // 50ms is enough to trigger metadata load

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
        soundRef.current = null;
      }
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
      body.append("ttpe", "read");
      await updateAutoPage(index);
      const res = await api.post("/getpageDetails", body, {
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        withCredentials: true,
      });
      console.log("Full res:", res);

      const { flag, data } = res.data;
      if (flag === "S" && data) {
        // ✅ Current Chapter
        console.log("Inside GetPage Details");

        if (data.chapterName) setChapterName(data.chapterName);

        if (data?.[0]) {
          console.log("Hellllo")
          const chapter = data[0];

          // ✅ Set current section
          if (chapter.section_id != null)
            setCurrentSection(Number(chapter.section_id));
          // ✅ File name (section_id + file_id)
          if (res?.data?.file) {
            // console.log("res file")
            // console.log(chapter.section_id, res.data.file.file_id)
            setFileId(res.data.file.file_id);
            setResumeTime(res.data.file.timeStart || 0);
            const generatedFileName = `1@${chapter.section_id}@${res.data.file.file_id}@The_Fire_Within_Chapter_${chapter.section_id}_R1.mp3`;
            setAudioSrc(`${APP_URL}audio.php?file=${generatedFileName}`);
            //console.log("Generated filename:", generatedFileName);
          }
        }
      }
      if (flag === "F") {
        toast.error(res.msg);
      }
      

    } catch (e) {
      console.error(e);
    }
  };

  const updateAutoPage = async (page) => {
    try {
      await axios.get(`${APP_URL}autopageSet/${page}`);
    } catch (err) {
      console.error(err);
    }
  };

  const getCurrentPageDetails = async () => {
    try {
      const res = await api.post("/currentPageDetails", { type: "read" });
      const { flag, data } = res.data;
      if (flag === "S" && data) {
        // ✅ Current Chapter

        if (data.currentChapterDetails) {

          const chapter = data.currentChapterDetails;
          // console.log(chapter)
          if (chapter.section_name) setChapterName(chapter.section_name);
          if (chapter.section_id != null) await setCurrentSection(Number(chapter.section_id));
          if (chapter.section_index != null) setLessonIndex(Number(chapter.section_index));
          console.log(chapter.section_id)
          // ✅ File name (using section_id + file_id directly)
          if (data.file_id) {
            setFileId(data.file_id);
            const generatedFileName = `1@${chapter.section_id}@${data.file_id}@The_Fire_Within_Chapter_${chapter.section_id}_R1.mp3`;

            setAudioSrc(`${APP_URL}audio.php?file=${generatedFileName}`); // use it immediately

            console.log("Generated filename:", generatedFileName);
          }

        }

        // ✅ Next/Prev Chapters
        if (data.nextChapterDetails) setNextChapter(data.nextChapterDetails);
        if (data.prevChapterDetails) setPrevChapter(data.prevChapterDetails);

        // ✅ Sections
        setSections(Array.isArray(data.bookSectionDetails) ? data.bookSectionDetails : []);

      }
    } catch (err) {
      console.error("Error fetching page details:", err);
    }
  };

  // --- Initial Load ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get(`${APP_URL}automodeSet/listen`);
        updateAutoPage(lessonIndex);
        getCurrentPageDetails();
        console.log("UseEffect", lessonIndex)

      } catch (error) {
        console.error("Error in useEffect:", error);
      }
    };

    fetchData();
  }, []);

  // --- Audio Controls (Howler) ---
  const togglePlayPause = () => {
    if (!soundRef.current) return;
    if (isPlaying) {
      soundRef.current.pause();
      clearInterval(intervalRef.current);
      saveCurrentTime(soundRef.current.seek()); // save on pause
    } else {
      soundRef.current.play();
      intervalRef.current = setInterval(() => {
        const current = soundRef.current.seek();
        setCurrentTime(current);

        // Auto-save every 5s
        if (Math.floor(current) % 5 === 0) {
          saveCurrentTime(current);
        }
      }, 1000);
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
    setIsPlaying(false)
    const label =
      section.section_name ||
      section.chapter_name ||
      section.title ||
      `Chapter ${i + 1}`;
    setChapterNumber(i + 1);
    setChapterName(label);
  };

  const handlePrev = async () => {
    console.log(prevChapter);

    try {
      const chapter = prevChapter;

      if (chapter.section_name) setChapterName(chapter.section_name);
      if (chapter.section_id != null) setCurrentSection(Number(chapter.section_id));
      if (chapter.section_index != null) setLessonIndex(Number(chapter.section_index));

      console.log("Section ID:", chapter.section_id);

      // ✅ File name generation
      // if (data.file_id && chapter.section_id != null) {
      //   const generatedFileName = `1@${chapter.section_id}@${data.file_id}@The_Fire_Within_Chapter_${chapter.section_id}_R1.mp3`;
      //   setAudioSrc(`${appUrl}audio.php?file=${generatedFileName}`);

      //   console.log("Generated filename:", generatedFileName);
      // }
    } catch (err) {
      console.error("Error fetching page details:", err);
    }
  };


  const handleNext = () => {
    console.log(nextChapter)

    try {
      const chapter = nextChapter;

      if (chapter.section_name) setChapterName(chapter.section_name);
      if (chapter.section_id != null) setCurrentSection(Number(chapter.section_id));
      if (chapter.section_index != null) setLessonIndex(Number(chapter.section_index));

      console.log("Section ID:", chapter.section_id);

      // ✅ File name generation
      // if (data.file_id && chapter.section_id != null) {
      //   const generatedFileName = `1@${chapter.section_id}@${data.file_id}@The_Fire_Within_Chapter_${chapter.section_id}_R1.mp3`;
      //   setAudioSrc(`${appUrl}audio.php?file=${generatedFileName}`);

      //   console.log("Generated filename:", generatedFileName);
      // }
    } catch (err) {
      console.error("Error fetching page details:", err);
    }

  }
  // --- Save current time to backend ---
  const saveCurrentTime = async (time) => {
    try {
      await axios.post(`${APP_URL}updateAutoTimeSet/${file_id}`, { time });
    } catch (err) {
      console.error("Error saving time:", err);
    }
  };

  // --- UI ---
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar2 chapterName={chapterName} chapterNumber={currentSection} />
      {/* Main Div */}
      <div className="flex flex-1 bg-gray-100 justify-center relative overflow-hidden">
        <div className="w-full max-w-[90%] mt-20 h-fit sm:max-w-[80%] md:max-w-[65%] rounded-[5vw] overflow-hidden shadow-lg">
          {/* White Section */}
          <div className="bg-white p-6 sm:p-10 md:p-16">
            <h2 className="text-gray-500 font-normal text-base sm:text-lg md:text-xl mb-4">
              Chapter-{currentSection} {chapterName}
            </h2>
            <input
              type="range"
              min="0"
              max="100"
              value={duration > 0 ? (currentTime / duration) * 100 : 0}
              onChange={handleSeek}
              className="
    w-full h-2 rounded-lg cursor-pointer appearance-none
  "
              style={{
                background:
                  duration > 0
                    ? `linear-gradient(
            to right, 
            #0075FF ${(currentTime / duration) * 100}%, 
            #e5e7eb ${(currentTime / duration) * 100}%, 
            #e5e7eb 100%
          )`
                    : `linear-gradient(
            to right, 
            #e5e7eb 0%, 
            #e5e7eb 100%
          )`,
              }}
            />

            <div className="flex justify-between text-xs sm:text-sm md:text-md text-gray-500 mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          {/* Blue Section */}
          <div className="bg-[#0075FF] p-10 flex text-lg justify-center items-center gap-6">
            <button id="prev-page" class="changePage" data-type="section" data-section="4" data-course="1" data-lessonindex="0" onClick={() => handlePrev()}>
              <svg width="33" height="37" viewBox="0 0 33 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 6.27147V30.3178M28.651 2.10423C28.8648 1.93616 29.1218 1.83141 29.3926 1.80198C29.6634 1.77256 29.9371 1.81965 30.1823 1.93786C30.4275 2.05607 30.6342 2.24062 30.7788 2.47036C30.9235 2.7001 31.0001 2.96573 31 3.23682V33.3525C30.9997 33.6234 30.9227 33.8887 30.7779 34.1181C30.6331 34.3475 30.4263 34.5317 30.1812 34.6496C29.9361 34.7675 29.6626 34.8144 29.392 34.7849C29.1214 34.7554 28.8646 34.6506 28.651 34.4827L9.48442 19.4272C9.31244 19.2922 9.17345 19.1201 9.07789 18.924C8.98233 18.7278 8.93269 18.5126 8.93269 18.2947C8.93269 18.0767 8.98233 17.8615 9.07789 17.6653C9.17345 17.4692 9.31244 17.2971 9.48442 17.1621L28.651 2.10423Z" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </button>
            <button id="rewindBtn" onClick={() => handleSkip(-15)}><svg width="48" height="53" viewBox="0 0 48 53" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 28.7228C2 33.0471 3.28231 37.2743 5.68477 40.8698C8.08723 44.4654 11.5019 47.2678 15.4971 48.9226C19.4922 50.5774 23.8884 51.0104 28.1296 50.1668C32.3708 49.3232 36.2666 47.2408 39.3244 44.183C42.3822 41.1253 44.4645 37.2295 45.3081 32.9883C46.1518 28.747 45.7188 24.3509 44.064 20.3557C42.4091 16.3606 39.6067 12.9459 36.0112 10.5434C32.4157 8.14095 28.1884 6.85864 23.8641 6.85864M16.5761 19.0054V36.0108" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M31.1522 19.0054H26.2935C25.6492 19.0054 25.0313 19.2614 24.5757 19.717C24.1201 20.1726 23.8642 20.7905 23.8642 21.4348V25.0788C23.8642 25.7231 24.1201 26.341 24.5757 26.7966C25.0313 27.2522 25.6492 27.5082 26.2935 27.5082H28.7228C29.3671 27.5082 29.9851 27.7641 30.4407 28.2197C30.8962 28.6753 31.1522 29.2932 31.1522 29.9375V33.5815C31.1522 34.2258 30.8962 34.8437 30.4407 35.2993C29.9851 35.7549 29.3671 36.0109 28.7228 36.0109H23.8642M23.8642 6.8587H5.64404M5.64404 6.8587L10.5027 2M5.64404 6.8587L10.5027 11.7174" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg></button>
            <button onClick={togglePlayPause} className="text-white rounded-full p-2">
              {isPlaying ? <CiPause1 size={54} /> : <CiPlay1 size={54} />}
            </button>
            <button id="forwardBtn" onClick={() => handleSkip(15)}><svg width="47" height="53" viewBox="0 0 47 53" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M45.4568 28.7228C45.4568 33.0471 44.1745 37.2743 41.772 40.8699C39.3696 44.4654 35.9548 47.2678 31.9597 48.9226C27.9646 50.5775 23.5684 51.0105 19.3272 50.1668C15.086 49.3232 11.1901 47.2409 8.13238 44.1831C5.07463 41.1253 2.99227 37.2295 2.14864 32.9883C1.30501 28.7471 1.73799 24.3509 3.39283 20.3558C5.04768 16.3606 7.85006 12.9459 11.4456 10.5435C15.0411 8.141 19.2683 6.8587 23.5927 6.8587H41.8128M41.8128 6.8587L36.9541 2M41.8128 6.8587L36.9541 11.7174M16.3046 19.0054V36.0109" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M30.8808 19.0054H26.0221C25.3778 19.0054 24.7599 19.2613 24.3043 19.7169C23.8487 20.1725 23.5928 20.7904 23.5928 21.4347V25.0787C23.5928 25.723 23.8487 26.341 24.3043 26.7965C24.7599 27.2521 25.3778 27.5081 26.0221 27.5081H28.4515C29.0958 27.5081 29.7137 27.764 30.1693 28.2196C30.6249 28.6752 30.8808 29.2931 30.8808 29.9374V33.5815C30.8808 34.2258 30.6249 34.8437 30.1693 35.2993C29.7137 35.7549 29.0958 36.0108 28.4515 36.0108H23.5928" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            </button>
            <button id="next-page" class="changePage" data-type="section" data-section="6" data-course="1" data-lessonindex="0" onClick={() => handleNext()}>
              <svg width="33" height="37" viewBox="0 0 33 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M31.4565 6.27147V30.3178M4.80554 2.10423C4.59179 1.93616 4.33476 1.83141 4.06393 1.80198C3.7931 1.77256 3.51942 1.81965 3.27424 1.93786C3.02907 2.05607 2.82233 2.24062 2.6777 2.47036C2.53308 2.7001 2.45643 2.96573 2.45654 3.23682V33.3525C2.45689 33.6234 2.53387 33.8887 2.67867 34.1181C2.82347 34.3475 3.03024 34.5317 3.27533 34.6496C3.52042 34.7675 3.79392 34.8144 4.06453 34.7849C4.33515 34.7554 4.59195 34.6506 4.80554 34.4827L23.9721 19.4272C24.1441 19.2922 24.2831 19.1201 24.3787 18.924C24.4742 18.7278 24.5239 18.5126 24.5239 18.2947C24.5239 18.0767 24.4742 17.8615 24.3787 17.6653C24.2831 17.4692 24.1441 17.2971 23.9721 17.1621L4.80554 2.10423Z" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </button>
            <button class="indexact" onClick={() => setIsSliderOpen(!isSliderOpen)}>
              <svg width="42" height="34" viewBox="0 0 42 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.1546 2.29584H39.957M4.77185 2.31965L4.7953 2.29346M4.77185 16.6042L4.7953 16.578M1.95703 30.3888L3.83357 32.2935L8.52493 27.5319M14.1546 16.5804H39.957M14.1546 30.865H39.957" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </button>
          </div>
        </div>
        {/* Slider Button */}
        <button
          aria-label={isSliderOpen ? "Close chapters" : "Open chapters"}
          onClick={(e) => { e.stopPropagation(); setIsSliderOpen(!isSliderOpen); }}
          className={`fixed top-1/2 -translate-y-1/2 z-40 text-blue-600 bg-white border border-neutral-200 pl-2 py-5 rounded-l-full shadow-lg transition-all duration-300
                ${isSliderOpen ? "right-[85vw] sm:right-96" : "right-0"}`}
        >
          {isSliderOpen ? <FaAngleRight size={28} /> : <FaAngleLeft size={28} />}
        </button>

        {/* Right Sidebar (Slide-in Drawer) */}
        <div
          className={`absolute right-0 top-0 h-full z-40 transform transition-transform duration-300 ease-in-out bg-white border-l border-neutral-200 w-[85%] sm:w-96
        ${isSliderOpen ? "translate-x-0" : "translate-x-full"}`}
          role="dialog"
          aria-label="Chapters"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            <h2 className="text-xl font-light border-b p-5 bg-blue-500 text-white">Chapters</h2>
            <h2 className="text-xl font-light border-b p-5 text-gray-500">Contents</h2>
            <div className="flex-1 overflow-y-auto">
              <ul className="text-gray-500 font-semibold text-md sm:text-base">
                {sections.length === 0 ? (
                  <li className="border-b border-b-gray-200 p-3">Loading…</li>
                ) : (
                  sections.map((s, i) => {
                    const label =
                      s.section_name || s.chapter_name || s.title || `Chapter ${i + 1}`;
                    return (
                      <li
                        key={s.section_id ?? s.id ?? i}
                        className="border-b border-b-gray-200 p-3 hover:bg-neutral-50 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          openSection(s, i);
                        }}
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
