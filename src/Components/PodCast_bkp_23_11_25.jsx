import { useState, useEffect, useRef } from "react";
import { Howl } from "howler";
import { api } from "../api";
import axios from "axios";
import { CiPlay1, CiPause1 } from "react-icons/ci";
import Navbar2 from "./Navbar2";
import { API_URL, APP_URL } from "../config";
import { toast } from "react-toastify";
import podcast_img from "../assets/podcast-red.svg";
import { useLanguage } from "../LanguageContext";
import BG from "../assets/BG.jpg";
import { AudioLines, Disc2Icon, Disc3 } from "lucide-react";

export const PodCast = () => {
  // ADD THIS ENTIRE COMPONENT
  const AudioEqualizer = ({ isPlaying }) => {
    return (
      <div className="flex items-center justify-center gap-0.5 h-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`w-1 bg-red-600 rounded-full ${
              isPlaying ? "animate-pulse" : ""
            }`}
            style={{
              height: isPlaying ? "100%" : "20%",
              animation: isPlaying
                ? `wave 0.8s ease-in-out infinite ${i * 0.1}s`
                : "none",
            }}
          />
        ))}
        <style>{`
        @keyframes wave {
          0%, 100% { height: 20%; }
          50% { height: 100%; }
        }
      `}</style>
      </div>
    );
  };
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
  const [chapterNumber, setChapterNumber] = useState(1);
  const [lesson_id, setlessonId] = useState(0);
  const [file_id, setFileId] = useState();
  const soundRef = useRef(null);
  const intervalRef = useRef(null);
  const [audioLang, setAudioLang] = useState(lang);
  const [resumeTime, setResumeTime] = useState(0);

  useEffect(() => {
    if (!audioSrc) return;

    if (soundRef.current) {
      soundRef.current.unload();
    }
    setIsPlaying(false);

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
          if (soundRef.current) {
            soundRef.current.seek(resumeTime);
          }
          setCurrentTime(resumeTime);
        } else {
          setCurrentTime(0);
        }
      },
      onend: () => {
        setIsPlaying(false);
        clearInterval(intervalRef.current);
      },
    });

    soundRef.current = sound;

    // Play-pause trick to force metadata load
    sound.play();
    setTimeout(() => {
      sound.pause();
      if (soundRef.current) {
        soundRef.current.seek(resumeTime > 0 ? resumeTime : 0);
      }
      //sound.seek(resumeTime > 0 ? resumeTime : 0);
    }, 10);

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
        soundRef.current = null;
      }
    };
  }, [audioSrc]);

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
        console.log("API Response:", data); // Debug log

        if (data.currentChapterDetails) {
          const chapter = data.currentChapterDetails;
          console.log("Current Chapter:", chapter); // Debug log

          // Fix for chapter name - check all possible fields
          const chapterNameText =
            (lang !== "en" && chapter?.[`section_name_${lang}`]?.trim()) ||
            chapter?.section_name?.trim() ||
            chapter?.chapter_name?.trim() ||
            chapter?.title?.trim() ||
            `Chapter ${currentSection}`;

          setChapterName(chapterNameText);

          if (chapter.section_id != null)
            await setCurrentSection(Number(chapter.section_id));
          if (chapter.section_index != null)
            setLessonIndex(Number(chapter.section_index));

          if (data.file_id) {
            const audioDetails = data.firstAudiofile;
            setlessonId(audioDetails[0]?.lesson_id);
            setFileId(data.file_id);

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

            if (timedata[audioDetails[0]?.lesson_id] != null) {
              setResumeTime(timedata[audioDetails[0]?.lesson_id] || 0);
            }

            const generatedFileName = `1@${chapter.section_id}@${data.firstAudiofile[0].lesson_id}@${data.firstAudiofile[0].file_name}`;
            setAudioSrc(`${APP_URL}audio.php?file=${generatedFileName}`);
          }
        }

        if (data.nextChapterDetails) setNextChapter(data.nextChapterDetails);
        if (data.prevChapterDetails) setPrevChapter(data.prevChapterDetails);

        // Debug sections data
        console.log("Sections data:", data.bookSectionDetails);
        setSections(
          Array.isArray(data.bookSectionDetails) ? data.bookSectionDetails : []
        );
      }
    } catch (err) {
      console.error("Error fetching page details:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}automodeSet/podcast`);
        const savedTime = res.data?.time || 0;
        await getCurrentPageDetails();

        if (soundRef.current) {
          soundRef.current.once("load", () => {
            soundRef.current.seek(savedTime);
            setCurrentTime(savedTime);

            soundRef.current.play();
            setIsPlaying(false);
            if (soundRef.current) {
              soundRef.current.pause(); // FIX 1
            }

            if (intervalRef.current) {
              clearInterval(intervalRef.current); // FIX 2
            }

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
    } catch (err) {
      console.error("Error saving time:", err);
    }
  };

  const togglePlayPause = () => {
    if (!soundRef.current) return;
    if (isPlaying) {
      soundRef.current.pause();
      clearInterval(intervalRef.current);
      saveCurrentTime(soundRef.current.seek());
    } else {
      soundRef.current.play();
      intervalRef.current = setInterval(() => {
        const current = soundRef.current.seek();
        setCurrentTime(current);

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
    setIsPlaying(false); // FIX ADDED

    try {
      const chapter = prevChapter;
      console.log("Previous Chapter:", chapter);

      const chapterNameText =
        (lang !== "en" && chapter?.[`section_name_${lang}`]?.trim()) ||
        chapter?.section_name?.trim() ||
        chapter?.chapter_name?.trim() ||
        chapter?.title?.trim() ||
        `Chapter ${chapter.section_id}`;

      setChapterName(chapterNameText);

      if (soundRef.current) soundRef.current.pause();
      if (intervalRef.current) clearInterval(intervalRef.current);

      await updateAutoPage(chapter.section_id);
      await getCurrentPageDetails();
    } catch (err) {
      console.error("Error fetching page details:", err);
    }
  };

  const handleNext = async () => {
    setIsPlaying(false); // FIX ADDED

    try {
      const chapter = nextChapter;

      if (soundRef.current) soundRef.current.pause();
      if (intervalRef.current) clearInterval(intervalRef.current);

      await updateAutoPage(chapter.section_id);
      await getCurrentPageDetails();
    } catch (err) {
      console.error("Error fetching page details:", err);
    }
  };
  const openSection = async (section, i) => {
    setIsPlaying(false); // FIX ADDED

    const sectionId = section.section_id ?? section.id ?? section.sectionId;
    setCurrentSection(Number(sectionId));
    setLessonIndex(0);

    await updateAutoPage(sectionId);
    await getCurrentPageDetails();

    if (soundRef.current) soundRef.current.pause();
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const setLangUpdate = async (newLang) => {
    await updatePodcastLang(newLang);
    setAudioLang(newLang);
    await getCurrentPageDetails();
  };

  // Helper function to get section label
  const getSectionLabel = (section, index) => {
    return (
      (lang !== "en" && section?.[`section_name_${lang}`]?.trim()) ||
      section?.section_name?.trim() ||
      section?.chapter_name?.trim() ||
      section?.title?.trim() ||
      `Chapter ${index + 1}`
    );
  };

  return (
    // <div className="h-screen flex flex-col bg-black">
    <div className="h-screen flex flex-col bg-black bg-opacity-70 overflow-hidden ">
      {/* Navbar */}
      <Navbar2 chapterName={chapterName} chapterNumber={currentSection} />

      {/* Main Content Area - Scrollable Chapters */}
      <div
        className="flex-1 overflow-y-auto pb-32 md:pb-40"
        style={{
          backgroundImage: `url(${BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="w-full px-3 py-4 md:px-6 md:py-6">
          {/* Chapters List */}
          <div className="bg-black bg-opacity-70 rounded-xl md:rounded-2xl p-3 md:p-6 max-w-4xl mx-auto">
            <h2 className="text-white text-base md:text-xl font-bold mb-3 md:mb-4 flex items-center">
              <svg
                className="w-4 h-4 md:w-5 md:h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
              {t("podcast")}
            </h2>

            <div className="space-y-2">
              {sections.length === 0 ? (
                <div className="text-center text-gray-400 py-8 text-sm">
                  {t("loading")}
                </div>
              ) : (
                sections.map((section, index) => {
                  const label = getSectionLabel(section, index);
                  const isActive = currentSection === index + 1;

                  return (
                    <div
                      key={section.section_id ?? section.id ?? index}
                      className={`flex items-center p-3 md:p-4 rounded-lg cursor-pointer transition-all ${
                        isActive
                          ? "bg-gray-800 text-white"
                          : "text-gray-300 hover:bg-gray-800"
                      }`}
                      onClick={() => openSection(section, index)}
                    >
                      {/* <div
                        className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full mr-3 md:mr-4 flex-shrink-0 ${
                          isActive ? "bg-gray-700 text-red-600" : "bg-gray-600"
                        }`}
                      >
                        {isActive && isPlaying ? (
                          <AudioEqualizer isPlaying={isPlaying} />
                        ) : isActive ? (
                          <AudioEqualizer isPlaying={false} />
                        ) : (
                          <Disc3
                            size={24}
                            className="md:w-7 md:h-7 "
                          />
                        )}
                      </div> */}
                      <div
                        className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full mr-3 md:mr-4 flex-shrink-0 ${
                          isActive ? "bg-gray-700 text-red-600" : "bg-gray-600"
                        }`}
                      >
                        {isActive && isPlaying ? (
                          <AudioEqualizer isPlaying={isPlaying} />
                        ) : isActive ? (
                          <AudioEqualizer isPlaying={false} />
                        ) : (
                          <Disc3
                            size={24}
                            className="md:w-7 md:h-7 text-white"
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm opacity-75">
                          Chapter {index + 1}
                        </p>
                        <p className="font-medium text-sm md:text-lg truncate">
                          {label}
                        </p>
                        <p className="text-xs md:text-sm opacity-75 mt-1 line-clamp-2">
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the 1500s,
                          when an unknown printer took a galley of type and
                          scrambled it to make a type specimen book. It has
                          survived not only five centuries, but also the leap
                          into electronic typesetting, remaining essentially
                          unchanged.
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Player - Improved Design */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-black border-t border-gray-700 z-50">
        <div className="w-full px-3 py-3 md:px-6 md:py-4">
          {/* Progress Bar */}
          <div className="flex items-center justify-between text-xs mb-2 md:mb-3">
            <span className="text-gray-400 text-xs md:text-sm min-w-[35px] md:min-w-[45px]">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={duration ? (currentTime / duration) * 100 : 0}
              onChange={handleSeek}
              className="flex-1 mx-2 md:mx-4 h-1 md:h-2 rounded-full appearance-none bg-gray-600 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 md:[&::-webkit-slider-thumb]:h-4 md:[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white cursor-pointer"
              style={{
                background: `linear-gradient(to right, #FF2C00 ${
                  (currentTime / duration) * 100
                }%, #404040 ${(currentTime / duration) * 100}%)`,
              }}
            />
            <span className="text-gray-400 text-xs md:text-sm min-w-[35px] md:min-w-[45px] text-right">
              {formatTime(duration)}
            </span>
          </div>

          {/* Player Controls */}
          <div className="flex items-center justify-between gap-2 md:gap-4">
            {/* Song Info */}
            <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg flex items-center justify-center flex-shrink-0">
                <img
                  src={podcast_img}
                  className="w-14 h-14 rounded-lg shadow-lg"
                  alt="Podcast"
                />
              </div>
              <div className="min-w-0 hidden md:block">
                <p className="text-white font-semibold text-sm md:text-base truncate">
                  {chapterName}
                </p>
                <p className="text-gray-400 text-xs md:text-sm">
                  {t("podcast_upper")}
                </p>
              </div>
            </div>

            {/* Main Controls - Improved styling */}
            <div className="flex items-center gap-2 md:gap-6">
              <button
                onClick={handlePrev}
                disabled={currentSection === 1}
                className="text-gray-400 hover:text-white transition-colors disabled:opacity-30 "
                title="Previous Chapter"
              >
                <svg
                  className="w-5 h-5 md:w-7 md:h-7"
                  viewBox="0 0 33 37"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 6.27147V30.3178M28.651 2.10423C28.8648 1.93616 29.1218 1.83141 29.3926 1.80198C29.6634 1.77256 29.9371 1.81965 30.1823 1.93786C30.4275 2.05607 30.6342 2.24062 30.7788 2.47036C30.9235 2.7001 31.0001 2.96573 31 3.23682V33.3525C30.9997 33.6234 30.9227 33.8887 30.7779 34.1181C30.6331 34.3475 30.4263 34.5317 30.1812 34.6496C29.9361 34.7675 29.6626 34.8144 29.392 34.7849C29.1214 34.7554 28.8646 34.6506 28.651 34.4827L9.48442 19.4272C9.31244 19.2922 9.17345 19.1201 9.07789 18.924C8.98233 18.7278 8.93269 18.5126 8.93269 18.2947C8.93269 18.0767 8.98233 17.8615 9.07789 17.6653C9.17345 17.4692 9.31244 17.2971 9.48442 17.1621L28.651 2.10423Z"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                onClick={() => handleSkip(-15)}
                className="text-gray-400 hover:text-white transition-colors"
                title="Rewind 15s"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 48 53"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 28.7228C2 33.0471 3.28231 37.2743 5.68477 40.8698C8.08723 44.4654 11.5019 47.2678 15.4971 48.9226C19.4922 50.5774 23.8884 51.0104 28.1296 50.1668C32.3708 49.3232 36.2666 47.2408 39.3244 44.183C42.3822 41.1253 44.4645 37.2295 45.3081 32.9883C46.1518 28.747 45.7188 24.3509 44.064 20.3557C42.4091 16.3606 39.6067 12.9459 36.0112 10.5434C32.4157 8.14095 28.1884 6.85864 23.8641 6.85864M16.5761 19.0054V36.0108"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M31.1522 19.0054H26.2935C25.6492 19.0054 25.0313 19.2614 24.5757 19.717C24.1201 20.1726 23.8642 20.7905 23.8642 21.4348V25.0788C23.8642 25.7231 24.1201 26.341 24.5757 26.7966C25.0313 27.2522 25.6492 27.5082 26.2935 27.5082H28.7228C29.3671 27.5082 29.9851 27.7641 30.4407 28.2197C30.8962 28.6753 31.1522 29.2932 31.1522 29.9375V33.5815C31.1522 34.2258 30.8962 34.8437 30.4407 35.2993C29.9851 35.7549 29.3671 36.0109 28.7228 36.0109H23.8642M23.8642 6.8587H5.64404M5.64404 6.8587L10.5027 2M5.64404 6.8587L10.5027 11.7174"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Improved Play/Pause Button */}
              <button
                onClick={togglePlayPause}
                className="bg-white rounded-full p-2 md:p-4 hover:scale-105 transition-transform shadow-lg"
              >
                {isPlaying ? (
                  <CiPause1 className="w-6 h-6 md:w-8 md:h-8 text-black" />
                ) : (
                  <CiPlay1 className="w-6 h-6 md:w-8 md:h-8 text-black ml-0.5" />
                )}
              </button>

              <button
                onClick={() => handleSkip(15)}
                className="text-gray-400 hover:text-white transition-colors"
                title="Forward 15s"
              >
                <svg
                  className="w-4 h-4 md:w-6 md:h-6"
                  viewBox="0 0 47 53"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M45.4568 28.7228C45.4568 33.0471 44.1745 37.2743 41.772 40.8699C39.3696 44.4654 35.9548 47.2678 31.9597 48.9226C27.9646 50.5775 23.5684 51.0105 19.3272 50.1668C15.086 49.3232 11.1901 47.2409 8.13238 44.1831C5.07463 41.1253 2.99227 37.2295 2.14864 32.9883C1.30501 28.7471 1.73799 24.3509 3.39283 20.3558C5.04768 16.3606 7.85006 12.9459 11.4456 10.5435C15.0411 8.141 19.2683 6.8587 23.5927 6.8587H41.8128M41.8128 6.8587L36.9541 2M41.8128 6.8587L36.9541 11.7174M16.3046 19.0054V36.0109"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M30.8808 19.0054H26.0221C25.3778 19.0054 24.7599 19.2613 24.3043 19.7169C23.8487 20.1725 23.5928 20.7904 23.5928 21.4347V25.0787C23.5928 25.723 23.8487 26.341 24.3043 26.7965C24.7599 27.2521 25.3778 27.5081 26.0221 27.5081H28.4515C29.0958 27.5081 29.7137 27.764 30.1693 28.2196C30.6249 28.6752 30.8808 29.2931 30.8808 29.9374V33.5815C30.8808 34.2258 30.6249 34.8437 30.1693 35.2993C29.7137 35.7549 29.0958 36.0108 28.4515 36.0108H23.5928"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                onClick={handleNext}
                disabled={currentSection === sections.length}
                className="text-gray-400 hover:text-white transition-colors disabled:opacity-30"
                title="Next Chapter"
              >
                <svg
                  className="w-5 h-5 md:w-7 md:h-7"
                  viewBox="0 0 33 37"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M31.4565 6.27147V30.3178M4.80554 2.10423C4.59179 1.93616 4.33476 1.83141 4.06393 1.80198C3.7931 1.77256 3.51942 1.81965 3.27424 1.93786C3.02907 2.05607 2.82233 2.24062 2.6777 2.47036C2.53308 2.7001 2.45643 2.96573 2.45654 3.23682V33.3525C2.45689 33.6234 2.53387 33.8887 2.67867 34.1181C2.82347 34.3475 3.03024 34.5317 3.27533 34.6496C3.52042 34.7675 3.79392 34.8144 4.06453 34.7849C4.33515 34.7554 4.59195 34.6506 4.80554 34.4827L23.9721 19.4272C24.1441 19.2922 24.2831 19.1201 24.3787 18.924C24.4742 18.7278 24.5239 18.5126 24.5239 18.2947C24.5239 18.0767 24.4742 17.8615 24.3787 17.6653C24.2831 17.4692 24.1441 17.2971 23.9721 17.1621L4.80554 2.10423Z"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Right side - Empty space since language selector is removed */}
            <div className="flex-1">
              {/* Mobile: Show track info below controls */}
              <div className="md:hidden mt-2 text-center">
                {/* <p className="text-white font-semibold text-xs truncate px-4">
                  {chapterName}
                </p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default function AudioEqualizer() {
  return (
    <div className="flex items-end gap-1 h-6">
      <div className="w-[2px] bg-white animate-[bar_0.8s_ease-in-out_infinite]"></div>
      <div className="w-[2px] bg-white animate-[bar_0.9s_ease-in-out_infinite]"></div>
      <div className="w-[2px] bg-white animate-[bar_1.0s_ease-in-out_infinite]"></div>
      <div className="w-[2px] bg-white animate-[bar_0.7s_ease-in-out_infinite]"></div>
    </div>
  );
}
