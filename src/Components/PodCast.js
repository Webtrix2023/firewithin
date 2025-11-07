import { useState, useEffect, useRef } from "react";
import { Howl } from "howler";
import { api } from "../api";
import axios from "axios";
import { CiPlay1, CiPause1 } from "react-icons/ci";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Navbar2 from "./Navbar2";
import { API_URL } from "../config";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react";
import { toast } from "react-toastify";
import podcast_img from "../assets/podcast-red.svg";
import { useLanguage } from "../LanguageContext";

export const PodCast = () => {
  const { t, lang, changeLanguage } = useLanguage();
  const [audioSrc, setAudioSrc] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [chapterName, setChapterName] = useState("");
  const [nextChapter, setNextChapter] = useState({});
  const [prevChapter, setPrevChapter] = useState({});
  const [sections, setSections] = useState([]);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [chapterNumber, setChapterNumber] = useState(1);
  const [lesson_id, setlessonId] = useState(0);
  const [file_id, setFileId] = useState();
  const soundRef = useRef(null);
  const intervalRef = useRef(null);
  const [audioLang, setAudioLang] = useState(lang);
  const [open, setOpen] = useState(false);
  const [resumeTime, setResumeTime] = useState(0);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "bottom-start",
    middleware: [offset(6), flip(), shift()],
    whileElementsMounted: autoUpdate, // keeps position synced on scroll/resize
  });

  useEffect(() => {
    if (!audioSrc) return;

    if (soundRef.current) {
      soundRef.current.unload(); // cleanup old
    }

    // const sound = new Howl({
    //     src: [audioSrc],
    //     html5: true,
    //     preload: true,
    //     onload: () => {
    //         setDuration(sound.duration());
    //     },
    //     onend: () => {
    //         setIsPlaying(false);
    //         clearInterval(intervalRef.current);
    //     }
    // });
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
      },
    });

    soundRef.current = sound;
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
    // return () => {
    //     if (soundRef.current) {
    //         soundRef.current.unload();
    //     }
    //     clearInterval(intervalRef.current);
    // };
  }, [audioSrc]);

  // --- API Methods (same as your code) ---

  const updateAutoPage = async (page) => {
    try {
      await axios.get(`${API_URL}autoPodcastSet/${page}`);
    } catch (err) {
      console.error(err);
    }
  };
  const updatePodcastLang = async (lang) => {
    try {
      const body = new URLSearchParams();
      body.append("lang", lang);
      const res = await api.post("/updatePodcastLang", body, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        withCredentials: true,
      });
      const { flag, data } = res.data;
      if (flag === "F" && data) {
        toast.error(res.msg);
      }
      //  await axios.post(`${API_URL}updatePodcastLang`);
    } catch (err) {
      console.error(err);
    }
  };

  const getCurrentPageDetails = async () => {
    try {
      const body = new URLSearchParams();
      body.append("type", "podcast");
      body.append("lang", audioLang);
      const res = await api.post("/currentPageDetails", body, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        withCredentials: true,
      });
      const { flag, data } = res.data;
      if (flag === "S" && data) {
        // ✅ Current Chapter

        if (data.currentChapterDetails) {
          const chapter = data.currentChapterDetails;

          // console.log(chapter)
          if (chapter.section_name) setChapterName(chapter.section_name);
          if (chapter.section_id != null)
            await setCurrentSection(Number(chapter.section_id));
          if (chapter.section_index != null)
            setLessonIndex(Number(chapter.section_index));
          console.log(chapter.section_id);
          // ✅ File name (using section_id + file_id directly)
          if (data.file_id) {
            const audioDetails = data.firstAudiofile;
            setlessonId(audioDetails[0]?.lesson_id);
            setFileId(data.file_id);
            //setFileId(data.file_id);
            // check the resume time for this chapter
            //const timedata = data.customer_details[0].audio_time;
            let timedata = {};
            const rawTime = data?.customer_details?.[0]?.podcast_time;

            if (rawTime && rawTime.trim() !== "") {
              try {
                timedata = JSON.parse(rawTime);
              } catch (err) {
                console.error("Invalid JSON in audio_time:", err);
                timedata = {};
              }
            }
            if (
              timedata[audioDetails[0]?.lesson_id] != null ||
              timedata[audioDetails[0]?.lesson_id] !== ""
            ) {
              console.log("time data");
              setResumeTime(timedata[audioDetails[0]?.lesson_id] || 0);
            }
            //const generatedFileName = `1@${chapter.section_id}@${data.file_id}@The_Fire_Within_Chapter_${chapter.section_id}_R1.mp3`;
            const generatedFileName = `1@${chapter.section_id}@${data.firstAudiofile[0].lesson_id}@${data.firstAudiofile[0].file_name}`;

            //                     setAudioSrc(`${API_URL}audio.php?file=${generatedFileName}`); // use it immediately
            setAudioSrc(`${API_URL}audio.php?file=${generatedFileName}`); // use it immediately

            console.log("Generated filename:", generatedFileName);
          }
        }

        // ✅ Next/Prev Chapters
        if (data.nextChapterDetails) setNextChapter(data.nextChapterDetails);
        if (data.prevChapterDetails) setPrevChapter(data.prevChapterDetails);

        // ✅ Sections
        setSections(
          Array.isArray(data.bookSectionDetails) ? data.bookSectionDetails : []
        );
      }
    } catch (err) {
      console.error("Error fetching page details:", err);
    }
  };

  // const getCurrentPageDetails = async () => {
  //     try {
  //         const res = await api.post("/currentPageDetails", { type: "podcast",lang:audioLang });
  //         const { flag, data } = res.data;
  //         if (flag === "S" && data) {
  //             // ✅ Current Chapter

  //             if (data.currentChapterDetails) {

  //                 const chapter = data.currentChapterDetails;
  //                 // console.log(chapter)
  //                 if (chapter.section_name) setChapterName(chapter.section_name);
  //                 if (chapter.section_id != null) await setCurrentSection(Number(chapter.section_id));
  //                 if (chapter.section_index != null) setLessonIndex(Number(chapter.section_index));
  //                 console.log()
  //                 // ✅ File name (using section_id + file_id directly)
  //                 if (data.file_id) {
  //                     const generatedFileName = `1@${chapter.section_id}@${data.firstAudiofile[0].lesson_id}@${data.firstAudiofile[0].file_name}`;

  //                     setAudioSrc(`${API_URL}audio.php?file=${generatedFileName}`); // use it immediately

  //                     console.log("Generated filename:", generatedFileName);
  //                     console.log("inside current");
  //                 }

  //             }

  //             // ✅ Next/Prev Chapters
  //             if (data.nextChapterDetails) setNextChapter(data.nextChapterDetails);
  //             if (data.prevChapterDetails) setPrevChapter(data.prevChapterDetails);

  //             // ✅ Sections
  //             setSections(Array.isArray(data.bookSectionDetails) ? data.bookSectionDetails : []);

  //         }
  //     } catch (err) {
  //         console.error("Error fetching page details:", err);
  //     }
  // };

  // --- Initial Load ---
  // useEffect(() => {
  //     const fetchData = async () => {
  //         try {
  //             await axios.get(`${API_URL}automodeSet/podcast`);
  //             getCurrentPageDetails();
  //             console.log("UseEffect", lessonIndex)

  //         } catch (error) {
  //             console.error("Error in useEffect:", error);
  //         }
  //     };

  //     fetchData();
  // }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch backend progress
        const res = await axios.get(`${API_URL}automodeSet/podcast`);
        const savedTime = res.data?.time || 0; // adjust key based on backend response
        getCurrentPageDetails();

        //console.log("UseEffect", lessonIndex, "savedTime:", savedTime);

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

  // --- Save current time to backend ---
  const saveCurrentTime = async (time) => {
    try {
      const body = new URLSearchParams();
      body.append("time", time);
      const res = await api.post(
        `${API_URL}updateAutoPodTime/${lesson_id}`,
        body,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          withCredentials: true,
        }
      );
      console.log(res);
      //await axios.post(`${API_URL}/${file_id}`, { time });
    } catch (err) {
      console.error("Error saving time:", err);
    }
  };

  // --- Audio Controls (Howler) ---
  // const togglePlayPause = () => {
  //     if (!soundRef.current) return;
  //     if (isPlaying) {
  //         soundRef.current.pause();
  //         clearInterval(intervalRef.current);
  //     } else {
  //         soundRef.current.play();
  //         intervalRef.current = setInterval(() => {
  //             setCurrentTime(soundRef.current.seek());
  //         }, 500);
  //     }
  //     setIsPlaying(!isPlaying);
  // };
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
    const newTime = Math.max(
      0,
      Math.min(duration, soundRef.current.seek() + seconds)
    );
    soundRef.current.seek(newTime);
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };
  const handlePrev = async () => {
    console.log(prevChapter);

    try {
      const chapter = prevChapter;

      if (chapter.section_name) setChapterName(chapter.section_name);
      if (chapter.section_id != null)
        setCurrentSection(Number(chapter.section_id));
      if (chapter.section_index != null)
        setLessonIndex(Number(chapter.section_index));
      await updateAutoPage(chapter.section_id);
      await getCurrentPageDetails();
    } catch (err) {
      console.error("Error fetching page details:", err);
    }
  };
  //podcast_chapter
  const handleNext = async () => {
    try {
      const chapter = nextChapter;
      if (chapter.section_name) setChapterName(chapter.section_name);
      if (chapter.section_id != null)
        setCurrentSection(Number(chapter.section_id));
      if (chapter.section_index != null)
        setLessonIndex(Number(chapter.section_index));
      await updateAutoPage(chapter.section_id);
      await getCurrentPageDetails();
    } catch (err) {
      console.error("Error fetching page details:", err);
    }
  };
  const openSection = async (section, i) => {
    const sectionId = section.section_id ?? section.id ?? section.sectionId;
    setIsSliderOpen(false);
    setCurrentSection(Number(sectionId));
    setLessonIndex(0);
    await updateAutoPage(sectionId);
    await getCurrentPageDetails();
    setIsPlaying(false);
    const label =
      section.section_name ||
      section.chapter_name ||
      section.title ||
      `Chapter ${i + 1}`;
    setChapterNumber(i + 1);
    setChapterName(label);
  };
  const setLangUpdate = async (lang) => {
    await updatePodcastLang(lang);
    setOpen(false);
    setAudioLang(lang);
    await getCurrentPageDetails();
  };
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Navbar fixed at top */}
      <Navbar2 chapterName={chapterName} chapterNumber={currentSection} />

      {/* Main wrapper */}
      <div className="flex-1 flex items-center justify-center bg-[#626971] relative ">
        {/* Player Card */}
        <div className="max-h-[400px] h-[70vh] w-[95%] sm:w-4/5 md:w-2/3 lg:w-1/2 rounded-3xl flex flex-col justify-between bg-[#000000] shadow-xl">
          {/* Top Section */}
          <div className="flex flex-1 flex-col sm:flex-row items-center justify-center gap-6 p-6">
            <div className="flex-shrink-0">
              <img
                src={podcast_img}
                className="w-20 sm:w-28 md:w-32 lg:w-40"
                alt="Podcast"
              />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-[#FF2C00] text-lg sm:text-xl md:text-4xl font-extrabold">
                PODCAST
              </h4>
              <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight break-words">
                {chapterName}
              </h1>
            </div>
          </div>

          {/* Bottom Player Controls */}
          <div className="w-full shadow-lg flex flex-col rounded-b-3xl">
            {/* Seekbar */}
            <input
              type="range"
              min="0"
              max="100"
              value={duration ? (currentTime / duration) * 100 : 0}
              onChange={handleSeek}
              className="w-[95%] h-2 rounded-lg appearance-none cursor-pointer self-center"
              style={{
                "accent-color": "#FF2C00",
                background: `linear-gradient(to right, #FF2C00 ${
                  (currentTime / duration) * 100
                }%, #e5e7eb ${(currentTime / duration) * 100}%)`,
              }}
            />

            <div className="flex justify-between text-xs sm:text-sm md:text-md text-white my-2 px-6">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            <div className="bg-[#FF2C00] w-full py-6 flex text-lg justify-center items-center gap-6 rounded-b-3xl">
              <button
                id="prev-page"
                class="group transition-all duration-300"
                data-type="section"
                data-section="4"
                data-course="1"
                data-lessonindex="0"
                onClick={() => handlePrev()}
              >
                <svg
                  className="w-6 h-6 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 transition-transform duration-300 ease-in-out group-hover:scale-110"
                  viewBox="0 0 33 37"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 6.27147V30.3178M28.651 2.10423C28.8648 1.93616 29.1218 1.83141 29.3926 1.80198C29.6634 1.77256 29.9371 1.81965 30.1823 1.93786C30.4275 2.05607 30.6342 2.24062 30.7788 2.47036C30.9235 2.7001 31.0001 2.96573 31 3.23682V33.3525C30.9997 33.6234 30.9227 33.8887 30.7779 34.1181C30.6331 34.3475 30.4263 34.5317 30.1812 34.6496C29.9361 34.7675 29.6626 34.8144 29.392 34.7849C29.1214 34.7554 28.8646 34.6506 28.651 34.4827L9.48442 19.4272C9.31244 19.2922 9.17345 19.1201 9.07789 18.924C8.98233 18.7278 8.93269 18.5126 8.93269 18.2947C8.93269 18.0767 8.98233 17.8615 9.07789 17.6653C9.17345 17.4692 9.31244 17.2971 9.48442 17.1621L28.651 2.10423Z"
                    stroke="white"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </button>
              <button
                id="rewindBtn"
                class="group transition-all duration-300"
                onClick={() => handleSkip(-15)}
              >
                <svg
                  className="w-6 h-6 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8"
                  viewBox="0 0 48 53"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 28.7228C2 33.0471 3.28231 37.2743 5.68477 40.8698C8.08723 44.4654 11.5019 47.2678 15.4971 48.9226C19.4922 50.5774 23.8884 51.0104 28.1296 50.1668C32.3708 49.3232 36.2666 47.2408 39.3244 44.183C42.3822 41.1253 44.4645 37.2295 45.3081 32.9883C46.1518 28.747 45.7188 24.3509 44.064 20.3557C42.4091 16.3606 39.6067 12.9459 36.0112 10.5434C32.4157 8.14095 28.1884 6.85864 23.8641 6.85864M16.5761 19.0054V36.0108"
                    stroke="white"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M31.1522 19.0054H26.2935C25.6492 19.0054 25.0313 19.2614 24.5757 19.717C24.1201 20.1726 23.8642 20.7905 23.8642 21.4348V25.0788C23.8642 25.7231 24.1201 26.341 24.5757 26.7966C25.0313 27.2522 25.6492 27.5082 26.2935 27.5082H28.7228C29.3671 27.5082 29.9851 27.7641 30.4407 28.2197C30.8962 28.6753 31.1522 29.2932 31.1522 29.9375V33.5815C31.1522 34.2258 30.8962 34.8437 30.4407 35.2993C29.9851 35.7549 29.3671 36.0109 28.7228 36.0109H23.8642M23.8642 6.8587H5.64404M5.64404 6.8587L10.5027 2M5.64404 6.8587L10.5027 11.7174"
                    stroke="white"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </button>
              <button
                onClick={togglePlayPause}
                className="text-white rounded-full p-2 group transition-all duration-300 hover:scale-110 active:scale-95"
              >
                {isPlaying ? (
                  <CiPause1 className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
                ) : (
                  <CiPlay1 className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
                )}
              </button>

              <button
                id="forwardBtn"
                class="group transition-all duration-300"
                onClick={() => handleSkip(15)}
              >
                <svg
                  className="w-6 h-6 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8"
                  viewBox="0 0 47 53"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M45.4568 28.7228C45.4568 33.0471 44.1745 37.2743 41.772 40.8699C39.3696 44.4654 35.9548 47.2678 31.9597 48.9226C27.9646 50.5775 23.5684 51.0105 19.3272 50.1668C15.086 49.3232 11.1901 47.2409 8.13238 44.1831C5.07463 41.1253 2.99227 37.2295 2.14864 32.9883C1.30501 28.7471 1.73799 24.3509 3.39283 20.3558C5.04768 16.3606 7.85006 12.9459 11.4456 10.5435C15.0411 8.141 19.2683 6.8587 23.5927 6.8587H41.8128M41.8128 6.8587L36.9541 2M41.8128 6.8587L36.9541 11.7174M16.3046 19.0054V36.0109"
                    stroke="white"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M30.8808 19.0054H26.0221C25.3778 19.0054 24.7599 19.2613 24.3043 19.7169C23.8487 20.1725 23.5928 20.7904 23.5928 21.4347V25.0787C23.5928 25.723 23.8487 26.341 24.3043 26.7965C24.7599 27.2521 25.3778 27.5081 26.0221 27.5081H28.4515C29.0958 27.5081 29.7137 27.764 30.1693 28.2196C30.6249 28.6752 30.8808 29.2931 30.8808 29.9374V33.5815C30.8808 34.2258 30.6249 34.8437 30.1693 35.2993C29.7137 35.7549 29.0958 36.0108 28.4515 36.0108H23.5928"
                    stroke="white"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </button>
              <button
                id="next-page"
                class="group transition-all duration-300"
                data-type="section"
                data-section="6"
                data-course="1"
                data-lessonindex="0"
                onClick={() => handleNext()}
              >
                <svg
                  className="w-6 h-6 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8"
                  viewBox="0 0 33 37"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M31.4565 6.27147V30.3178M4.80554 2.10423C4.59179 1.93616 4.33476 1.83141 4.06393 1.80198C3.7931 1.77256 3.51942 1.81965 3.27424 1.93786C3.02907 2.05607 2.82233 2.24062 2.6777 2.47036C2.53308 2.7001 2.45643 2.96573 2.45654 3.23682V33.3525C2.45689 33.6234 2.53387 33.8887 2.67867 34.1181C2.82347 34.3475 3.03024 34.5317 3.27533 34.6496C3.52042 34.7675 3.79392 34.8144 4.06453 34.7849C4.33515 34.7554 4.59195 34.6506 4.80554 34.4827L23.9721 19.4272C24.1441 19.2922 24.2831 19.1201 24.3787 18.924C24.4742 18.7278 24.5239 18.5126 24.5239 18.2947C24.5239 18.0767 24.4742 17.8615 24.3787 17.6653C24.2831 17.4692 24.1441 17.2971 23.9721 17.1621L4.80554 2.10423Z"
                    stroke="white"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </button>
              <button
                className="indexact group transition-all duration-300"
                onClick={() => setIsSliderOpen(!isSliderOpen)}
              >
                <svg
                  className="w-6 h-6 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8"
                  viewBox="0 0 42 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.1546 2.29584H39.957M4.77185 2.31965L4.7953 2.29346M4.77185 16.6042L4.7953 16.578M1.95703 30.3888L3.83357 32.2935L8.52493 27.5319M14.1546 16.5804H39.957M14.1546 30.865H39.957"
                    stroke="white"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </button>
              <div className="relative inline-block">
                {/* Trigger button */}
                {/* <button
                  ref={refs.setReference}
                  onClick={() => setOpen((prev) => !prev)}
                  className="group transition-all duration-300 mt-2"
                >
                  <svg
                    className="w-6 h-6 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 transition-transform duration-300 ease-in-out group-hover:scale-110"
                    version="1.1"
                    viewBox="0 0 24 24"
                    fill="#fff"
                  >
                    <g>
                      <g>
                        <path d="M17,20H2.5C1.122,20,0,18.878,0,17.5v-15C0,1.122,1.122,0,2.5,0h8c0.214,0,0.404,0.136,0.473,0.338l6.5,19    c0.052,0.152,0.027,0.321-0.066,0.452C17.313,19.922,17.162,20,17,20z M2.5,1C1.673,1,1,1.673,1,2.5v15C1,18.327,1.673,19,2.5,19    h13.8L10.143,1H2.5z" />
                      </g>
                      <g>
                        <path d="M21.5,24h-8c-0.208,0-0.395-0.129-0.468-0.324l-1.5-4c-0.097-0.259,0.034-0.547,0.292-0.644    c0.259-0.096,0.547,0.034,0.644,0.292L13.847,23H21.5c0.827,0,1.5-0.673,1.5-1.5v-15C23,5.673,22.327,5,21.5,5H12    c-0.276,0-0.5-0.224-0.5-0.5S11.724,4,12,4h9.5C22.878,4,24,5.122,24,6.5v15C24,22.878,22.878,24,21.5,24z" />
                      </g>
                      <g>
                        <path d="M13.5,24c-0.117,0-0.234-0.041-0.329-0.124c-0.208-0.182-0.229-0.498-0.047-0.706l3.5-4    c0.182-0.209,0.498-0.229,0.706-0.047c0.208,0.182,0.229,0.498,0.047,0.706l-3.5,4C13.777,23.942,13.639,24,13.5,24z" />
                      </g>
                      <g>
                        <path d="M9.5,14c-0.206,0-0.398-0.127-0.471-0.332L7,7.987l-2.029,5.681c-0.093,0.26-0.38,0.396-0.639,0.303    c-0.26-0.093-0.396-0.379-0.303-0.639l2.5-7c0.142-0.398,0.8-0.398,0.941,0l2.5,7c0.093,0.26-0.042,0.546-0.303,0.639    C9.613,13.991,9.556,14,9.5,14z" />
                      </g>
                      <g>
                        <path d="M8,11H6c-0.276,0-0.5-0.224-0.5-0.5S5.724,10,6,10h2c0.276,0,0.5,0.224,0.5,0.5S8.276,11,8,11z" />
                      </g>
                      <g>
                        <path d="M21.5,11h-7c-0.276,0-0.5-0.224-0.5-0.5s0.224-0.5,0.5-0.5h7c0.276,0,0.5,0.224,0.5,0.5S21.776,11,21.5,11z" />
                      </g>
                      <g>
                        <path d="M17.5,11c-0.276,0-0.5-0.224-0.5-0.5v-1C17,9.224,17.224,9,17.5,9S18,9.224,18,9.5v1C18,10.776,17.776,11,17.5,11z" />
                      </g>
                      <g>
                        <path d="M16,17c-0.157,0-0.311-0.073-0.408-0.21c-0.16-0.225-0.107-0.537,0.118-0.697c2.189-1.555,3.79-4.727,3.79-5.592    c0-0.276,0.224-0.5,0.5-0.5s0.5,0.224,0.5,0.5c0,1.318-1.927,4.785-4.21,6.408C16.202,16.97,16.101,17,16,17z" />
                      </g>
                      <g>
                        <path d="M20,18c-0.121,0-0.242-0.043-0.337-0.131c-0.363-0.332-3.558-3.283-4.126-4.681c-0.104-0.256,0.02-0.547,0.275-0.651    c0.253-0.103,0.547,0.019,0.651,0.275c0.409,1.007,2.936,3.459,3.875,4.319c0.204,0.187,0.217,0.502,0.031,0.707    C20.27,17.945,20.135,18,20,18z" />
                      </g>
                    </g>
                    <g />
                    <g />
                    <g />
                    <g />
                    <g />
                    <g />
                    <g />
                    <g />
                    <g />
                    <g />
                    <g />
                    <g />
                    <g />
                    <g />
                    <g />
                  </svg>
                </button> */}

                {/* Dropdown */}
                {open && (
                  <div
                    ref={refs.setFloating}
                    style={floatingStyles}
                    className="bg-white border border-gray-200 rounded-md shadow-lg w-48 z-50"
                  >
                    <ul className="py-2 text-sm text-gray-700">
                      <li>
                        <button
                          onClick={() => {
                            setLangUpdate("en");
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          English
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setLangUpdate("ko");
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          korean (한국인)
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setLangUpdate("zh");
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Chinese (中国人)
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Slider Button */}
          <button
            aria-label={isSliderOpen ? "Close chapters" : "Open chapters"}
            onClick={(e) => {
              e.stopPropagation();
              setIsSliderOpen(!isSliderOpen);
            }}
            className={`fixed top-1/2 -translate-y-1/2 z-40 text-red-600 bg-white border border-neutral-200 pl-2 py-5 rounded-l-full shadow-lg transition-all duration-300
                ${isSliderOpen ? "right-[85vw] sm:right-96" : "right-0"}`}
          >
            {isSliderOpen ? (
              <FaAngleRight size={28} />
            ) : (
              <FaAngleLeft size={28} />
            )}
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
              <h2 className="text-xl font-light border-b p-5 bg-red-500 text-white">
                {t("chapters")}
              </h2>
              <h2 className="text-xl font-light border-b p-5 text-gray-500">
                {t("contents")}
              </h2>
              <div className="flex-1 overflow-y-auto">
                <ul className="text-gray-500 font-semibold text-md sm:text-base">
                  {sections.length === 0 ? (
                    <li className="border-b border-b-gray-200 p-3">
                      {t("loading")}
                    </li>
                  ) : (
                    sections.map((s, i) => {
                      const label =
                        s.section_name ||
                        s.chapter_name ||
                        s.title ||
                        `Chapter ${i + 1}`;
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
    </div>
  );
};
