import { useEffect, useRef, useState, useMemo } from "react";
import Navbar2 from "./Navbar2";
import axios from "axios";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { FiType, FiSun, FiMoon } from "react-icons/fi";
import { api } from "../api";
import DOMPurify from "dompurify";
import { toast } from "react-toastify";
import { API_URL } from "../config";
import { useLanguage } from "../LanguageContext";

export const Text = () => {
  const { t, lang, changeLanguage } = useLanguage();
  const [pageContent, setPageContent] = useState("");
  let debounceTimer;
  const safeHtml = useMemo(
    () =>
      DOMPurify.sanitize(pageContent, {
        ADD_ATTR: ["target", "rel"], // allow opening links in new tab safely
      }),
    [pageContent]
  );

  const [chapterName, setChapterName] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageNumberDisplay, setPageNumbeDisplay] = useState(1);
  const [sections, setSections] = useState([]);
  const [lessonIndex, setLessonIndex] = useState(0); // number, not string
  const [currentSection, setCurrentSection] = useState(0);
const [pageInput, setPageInput] = useState("");
const [editing, setEditing] = useState(false);
const debounceRef = useRef(null);
  // UI state (layout/placements unchanged)
  const [controlsVisible, setControlsVisible] = useState(true);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [fontSize, setFontSize] = useState(1.05); // rem
  const [theme, setTheme] = useState("light");
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState([]);
const [flip, setFlip] = useState(false);
  const activeChapterRef = useRef(null);
  const sectionListRef = useRef(null);

  // refs for outside click on font menu
  const fontBtnRef = useRef(null);
  const fontMenuRef = useRef(null);

  function splitContent(html) {
    const temp = document.createElement("div");
    temp.innerHTML = html;

    return {
      pageContent: temp.innerHTML, // take everything as-is
    };
  }
  // --- API Helpers ---

  const loadPage = async ({
    sectionId = currentSection,
    index = lessonIndex,
    type = "current",
    saveProgress = false, // ✅ true only for next/prev/section
  } = {}) => {
    console.log("Loading page →", { sectionId, index, type });

    try {
      const body = new URLSearchParams();
      body.append("type", type);
      body.append("section_id", String(sectionId));
      body.append("course_id", "1");
      body.append("lesson_index", String(index));
      body.append("ttpe", "listen");
      const { data } = await api.post("/pageDetails", body, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          Accept: "*/*",
        },
        withCredentials: true,
      });
      console.log("item.pageNumber");
      if (data.flag === "S" && data.data?.[0]) {
        const item = data.data[0];

        if (item.introduction) {
          const { pageContent } = splitContent(item.introduction);
          setPageContent(pageContent || "");
        }
        if (item.chapter_name != null)
          setChapterName(
            lang !== "en"
              ? item?.[`section_name_${lang}`]?.trim()
              : item.section_name
          );

        console.log("item.pageNumber");
        console.log(item.pageNumber);
        if (typeof item.pageNumber === "number") setPageNumber(item.pageNumber);
        if (item.section_id != null) setCurrentSection(Number(item.section_id));
        if (item.lesson_index != null)
          setLessonIndex(Number(item.lesson_index));

        // ✅ only update autopage on navigation
        if (saveProgress && item.lesson_id) updateAutoPage(item.lesson_id);
      }
      if (data.flag === "F") {
        console.log("Errot occured");
        toast.error(data.msg);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateAutoPage = async (page) => {
    try {
      //setPageNumber(page);
      const pagenp = page - 1;
      setPageNumbeDisplay(pagenp === 0 ? 1 : pagenp);
      await axios.get(`${API_URL}autopageSet/${page}`);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Variant that takes opts object (kept intact, but aligned)
  const getPageDetails = async (opts = {}) => {
    const payload = {
      type: opts.type,
      section_id: String(currentSection),
      course_id: 1,
      lesson_index: String(lessonIndex),
      ttpe: "listen",
      ...opts,
    };
    try {
      const res = await axios.post(`${API_URL}pageDetails`, payload, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          Accept: "*/*",
        },
        withCredentials: true,
      });

      const data = res.data;

      if (data.flag === "S" && data.data?.[0]) {
        const item = data.data[0];

        if (item.introduction) {
          const { chapterName, pageContent } = splitContent(item.introduction);
          setPageContent(pageContent || "");
        }
        if (data?.chapterName != null)
          setChapterName(data?.chapterName);
        
          console.log("item.pageNumber",item.pageNumber);
          
        if (typeof item.pageNumber === "number") setPageNumber(item.pageNumber);
        if (item.section_id != null) setCurrentSection(Number(item.section_id));
        if (item.lesson_index != null)
          setLessonIndex(Number(item.lesson_index));

        // ✅ safe: only when explicitly called for navigation
        if (item.lesson_id) updateAutoPage(item.lesson_id);
      }
      if (data.flag === "F") {
        toast.error(data.msg);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ For refresh — does not save progress
  const getCurrentPageDetails = async () => {
    try {
      const res = await api.post("/currentPageDetails", { ttpe: "listen" });
      const data = res.data.data;

      if (res.data.flag === "S" && data?.bookpage?.[0]) {
        const item = data.bookpage[0];
        if(data?.currentChapterDetails?.section_name){
          console.log(lang);
           setChapterName(
            lang !== "en"
              ? data?.currentChapterDetails?.[`section_name_${lang}`]?.trim()
              : data?.currentChapterDetails?.section_name
          );
        }

        if (item.introduction) {
          const { chapterName, pageContent } = splitContent(item.introduction);
          setPageContent(pageContent || "");
        }

        if (typeof item.pageNumber === "number") setPageNumber(item.pageNumber);
        if (item.section_id != null) setCurrentSection(Number(item.section_id));
        if (item.lesson_index != null)
          setLessonIndex(Number(item.lesson_index));

        setSections(
          Array.isArray(data.bookSectionDetails) ? data.bookSectionDetails : []
        );
        //customer_details
        setCustomerDetails(res.data?.customer_details?.[0]);
        setTheme(data?.customer_details?.[0]?.mode || "light");
        //setFontSize(data?.customer_details?.[0]?.selected_font || 1.05);
        setFontSize(Number(data?.customer_details?.[0]?.selected_font) || 1.05);
        setPageNumber(Number(item.lesson_id));
        setPageNumbeDisplay(Number(item.lesson_id) === 0 ? 1 : ((Number(item.lesson_id) - 1) === 0 ? 1 : (Number(item.lesson_id) - 1)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getLessonByPageNumber = async (pageNumber) => {
    try {
      const formData = new URLSearchParams();
      formData.append("page_number", pageNumber);
      formData.append("course_id", 1);

      const res = await axios.post(
        `${API_URL}get_lession_by_pageNo`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            Accept: "*/*",
          },
          withCredentials: true,
        }
      );
      const item = res.data;
      if (item.introduction !== "") {
        if (item.introduction) {
          //const { chapterName, pageContent } = splitContent(item.introduction);
          setPageContent(item.introduction || "");
        }
        if (item.section_name != null)
          setChapterName(
            lang !== "en"
              ? item?.[`section_name_${lang}`]?.trim()
              : item.section_name
          );

        if (typeof item.pageNumber === "number") setPageNumber(item.pageNumber);
        if (item.lesson_index != null)
          setLessonIndex(Number(item.lesson_index));
        if (item.section_id != null) setCurrentSection(Number(item.section_id));
//currentSection
        // ✅ safe: only when explicitly called for navigation
        if (item.lesson_id) updateAutoPage(item.lesson_id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- Navigation handlers ---
  const openSection = (section, i) => {
    const sectionId = section.section_id ?? section.id ?? section.sectionId;
    setIsSliderOpen(false);
    setCurrentSection(Number(sectionId));
    setLessonIndex(0);

    loadPage({ sectionId, index: 0, type: "section", saveProgress: true });

    // const label =
    //   section.section_name ||
    //   section.chapter_name ||
    //   section.title ||
    //   `Chapter ${i + 1}`;
    // setChapterName(label);
    const label =
      (lang !== "en"
        ? section?.[`section_name_${lang}`]?.trim()
        : section.section_name) ||
      section?.chapter_name?.trim() ||
      section?.title?.trim() ||
      `Chapter ${i + 1}`;
    setChapterName(label);
  };

  // --- Initial load ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get(`${API_URL}automodeSet/read`);
        getCurrentPageDetails();
      } catch (error) {
        console.error("Error in useEffect:", error);
      }
    };

    fetchData();
  }, []);

  // Click anywhere in reading area

  const handleReadingAreaTap = () => {
    // If font menu is open, close it and DON'T toggle controls/navbar
    if (showFontMenu) {
      setShowFontMenu(false);
      return;
    }
    // Toggle both overlays together
    const next = !controlsVisible;
    setControlsVisible(next);
    //setNavbarVisible(next);
  };

  // Outside click / Esc to close font menu only
  useEffect(() => {
    const onDocMouseDown = (e) => {
      if (!showFontMenu) return;
      const btn = fontBtnRef.current;
      const menu = fontMenuRef.current;
      if (menu && !menu.contains(e.target) && btn && !btn.contains(e.target)) {
        setShowFontMenu(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setShowFontMenu(false);
    };
    document.addEventListener("mousedown", onDocMouseDown, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [showFontMenu]);
  // // Auto-scroll active chapter when slider opens
  // useEffect(() => {
  //   if (isSliderOpen && activeChapterRef.current && sectionListRef.current) {
  //     const list = sectionListRef.current;
  //     const itemTop = activeChapterRef.current.offsetTop;
  //     list.scrollTo({ top: itemTop, behavior: "smooth" });
  //   }
  // }, [isSliderOpen, currentSection]);

  // Auto-scroll active chapter when slider opens
  useEffect(() => {
    if (isSliderOpen && activeChapterRef.current && sectionListRef.current) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        const list = sectionListRef.current;
        const activeItem = activeChapterRef.current;
        if (list && activeItem) {
          // Calculate position to scroll active item to top
          const itemTop = activeItem.offsetTop;
          const listTop = list.offsetTop;
          const scrollPosition = itemTop - listTop;
          list.scrollTo({
            top: scrollPosition,
            behavior: "smooth",
          });
        }
      });
    }
  }, [isSliderOpen, currentSection, sections]); // Added sections to dependencies

  // Theme classes (no layout/color placement changes)
  const themeClasses = {
    light: "bg-[#ffffff] text-[#333c4e]",
    sepia: "bg-[#f4ecd8] text-[#2b2a27]",
    dark: "bg-[#111] text-[#f1f1f1]",
  };
  // Requested: light text color should be white
  const contentColor = {
    light: "text-[#111]", // changed as requested
    sepia: "text-[#2b2a27]",
    dark: "text-[#e9e9e9]",
  };
  const mutedColor = {
    light: "text-neutral-600", // adjust for white text on light bg
    sepia: "text-[#6b5e48]",
    dark: "text-neutral-400",
  };
  // Chapter list specific theme classes
  const chapterListTheme = {
    light: "bg-white text-gray-800 border-gray-200",
    sepia: "bg-[#f4ecd8] text-[#2b2a27] border-[#d9c9a3]",
    dark: "bg-[#1a1a1a] text-[#e9e9e9] border-[#333]",
  };
  const increaseFont = async () => {
    const size = Math.min(fontSize + 0.1, 1.8);
    setFontSize((s) => size);
    const payload = {
      size: size,
    };
    const res = await axios.post(`${API_URL}updateFontSize`, payload, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        Accept: "*/*",
      },
      withCredentials: true,
    });
    const data = res.data;
    if (data.flag === "F") {
      toast.error(data.msg);
    }
  };
  const decreaseFont = async () => {
    const size = Math.max(fontSize - 0.1, 0.9);
    setFontSize((s) => size);
    const payload = {
      size: size,
    };
    const res = await axios.post(`${API_URL}updateFontSize`, payload, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        Accept: "*/*",
      },
      withCredentials: true,
    });
    const data = res.data;
    if (data.flag === "F") {
      toast.error(data.msg);
    }
  };
  const updateDefaultTheme = async () => {
    const nextTheme =
      theme === "dark" ? "light" : theme === "light" ? "sepia" : "dark";
    setTheme(nextTheme);
    const payload = {
      theme: nextTheme,
    };
    const res = await axios.post(`${API_URL}updateTheme`, payload, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        Accept: "*/*",
      },
      withCredentials: true,
    });
    const data = res.data;
    if (data.flag === "F") {
      toast.error(data.msg);
    }
  };
  const handlePrev = async () => {
  setFlip(true);

  // Start fetching immediately
  const data = await getPageDetails({
    type: "prev",
    section_id: currentSection,
    course_id: 1,
    lessonIndex: pageNumber - 1,
  });
  // Finish flip
  setTimeout(() => {
    setFlip(false);
  }, 500);
};
const handleNext = async () => {
  setFlip(true);

  // Start fetching immediately
  const data = await getPageDetails({
    type: "next",
    section_id: currentSection,
    course_id: 1,
    lessonIndex: pageNumber +1,
  });
  // Finish flip
  setTimeout(() => {
    setFlip(false);
  }, 500);
};
  /** ------------------- UI ------------------- **/
  return (
    <div
      className={`h-screen flex flex-col ${themeClasses[theme]} transition-colors duration-300  opacity-0 animate-[fadeUp_0.6s_ease-out_forwards]`}
    >
      {/* Navbar */}
      <div className={navbarVisible ? "block" : "hidden"}>
        <Navbar2 chapterName={chapterName} chapterNumber={currentSection} />
      </div>

      {/* Main reading surface */}
      <main className="relative flex-1 overflow-hidden">
        {/* Top bar */}
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 z-10 px-3 sm:px-6 pt-[env(safe-area-inset-top)]
            transition-opacity duration-300 ${
              controlsVisible ? "opacity-100" : "opacity-0"
            }`}
        >
          <div className="pointer-events-auto mx-auto max-w-[100ch] flex items-center justify-between rounded-b-xl bg-black/10 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-3">
            <div className="text-xs sm:text-sm font-medium truncate">
              {chapterName}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme toggle */}
              <button
                aria-label="Toggle theme"
                onClick={(e) => {
                  e.stopPropagation();
                  updateDefaultTheme();
                }}
                className="p-2 rounded-full hover:bg-black/10 transition"
              >
                {theme === "dark" ? <FiSun /> : <FiMoon />}
              </button>

              {/* Font menu */}
              <div className="relative">
                <button
                  ref={fontBtnRef}
                  aria-haspopup="true"
                  aria-expanded={showFontMenu}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFontMenu((v) => !v);
                  }}
                  className="p-2 rounded-full hover:bg-black/10 transition"
                  title="Font size"
                >
                  <FiType />
                </button>
                {showFontMenu && (
                  <div
                    ref={fontMenuRef}
                    // className="absolute right-0 mt-2 w-44 rounded-xl bg-white text-neutral-900 shadow-lg ring-1 ring-black/5 overflow-hidden"
                    className={`absolute right-0 mt-2 w-44 rounded-xl ${
                      theme === "dark"
                        ? "bg-[#2d2d2d] text-white"
                        : "bg-white text-neutral-900"
                    } shadow-lg ring-1 ring-black/5 overflow-hidden`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-sm">Text size</span>
                      <span className={`text-xs ${mutedColor[theme]}`}>
                        {Math.round(fontSize * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-3 pb-3 gap-2">
                      <button
                        onClick={decreaseFont}
                        // className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-sm"
                        className={`px-3 py-1.5 rounded-full text-sm ${
                          theme === "dark"
                            ? "bg-[#3d3d3d] hover:bg-[#4d4d4d] text-white"
                            : "bg-neutral-100 hover:bg-neutral-200"
                        }`}
                      >
                        A–
                      </button>
                      <button
                        onClick={() => setFontSize(1.05)}
                        //className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-sm"
                        className={`px-3 py-1.5 rounded-full text-sm ${
                          theme === "dark"
                            ? "bg-[#3d3d3d] hover:bg-[#4d4d4d] text-white"
                            : "bg-neutral-100 hover:bg-neutral-200"
                        }`}
                      >
                        Reset
                      </button>
                      <button
                        onClick={increaseFont}
                        // className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-sm"
                        className={`px-3 py-1.5 rounded-full text-sm ${
                          theme === "dark"
                            ? "bg-[#3d3d3d] hover:bg-[#4d4d4d] text-white"
                            : "bg-neutral-100 hover:bg-neutral-200"
                        }`}
                      >
                        A+
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div
          className="relative h-full w-full overflow-y-auto pt-[50px] px-3 sm:px-4 md:px-6 pb-20 sm:pb-24 scroll-smooth"
          onClick={handleReadingAreaTap}
        >
          <div className="page-wrapper mx-auto max-w-[100ch]">
            {/* Chapter title */}
            {/* <h1
              className={`text-center mb-6 sm:mb-8 font-light ${contentColor[theme]
                } text-[clamp(1.5rem,5vw,3rem)] leading-tight`}
              style={{ fontFamily: "Arsis DReg, serif" }}
            >
              {chapterName}
            </h1> */}

            {/* Content */}
            <div
             className={`reader-html page-content leading-[1.85] mt-4 text-justify ${
    flip ? "page-flip" : ""
  }`}
  style={{
    fontSize: `${fontSize}rem`,
    WebkitHyphens: "auto",
    hyphens: "auto",
  }}
              dangerouslySetInnerHTML={{ __html: safeHtml }}
            />
          </div>
        </div>

        {/* Bottom navigation */}
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 z-11 px-3 sm:px-6 pb-[env(safe-area-inset-bottom)]
            transition-opacity duration-300 ${
              controlsVisible ? "opacity-100" : "opacity-0"
            }`}
        >
          <div className="pointer-events-auto mx-auto max-w-[100ch] flex items-center justify-between rounded-t-xl bg-black/10 backdrop-blur-sm px-2 py-2 sm:px-3 sm:py-2">
            <div className="flex items-center gap-2">
              <button
                aria-label="Previous page"
                className="flex items-center justify-center rounded-full bg-red-700 hover:bg-red-800 text-white h-10 w-10 sm:h-11 sm:w-11 transition"
                onClick={handlePrev}
              >
                <FaAngleLeft size={18} />
              </button>
              <button
                aria-label="Next page"
                className="flex items-center justify-center rounded-full bg-red-700 hover:bg-red-800 text-white h-10 w-10 sm:h-11 sm:w-11 transition"
                onClick={handleNext}
              >
                <FaAngleRight size={18} />
              </button>
            </div>

            <div
              // className={`flex items-center gap-2 text-xs sm:text-sm ${themeClasses[theme]} bg-white text-gray-700 pr-2 rounded-full`}
              className={`flex items-center gap-2 text-xs sm:text-sm ${
                theme === "dark"
                  ? "bg-[#2d2d2d] text-white"
                  : "bg-white text-gray-700"
              } pr-2 rounded-full`}
              aria-live="polite"
            >
              {/* <span className="inline-flex  items-center justify-center bg-black text-white h-7 px-4 rounded-full text-xs sm:text-sm">
                {pageNumber}
              </span>
               */}
              {/* <input
  type="text"
  value={pageNumberDisplay}
  onChange={(e) => {
    const val = e.target.value;

    // allow empty or numeric only
    if (/^\d*$/.test(val)) {
      setPageInput(val);

      // clear debounce
      clearTimeout(debounceRef.current);

      // debounce trigger
      debounceRef.current = setTimeout(() => {
        if (!val) return; // empty → do nothing

        const num = Number(val);

        if (num > 0 && num <= 388) {
          getLessonByPageNumber(num);
        } else if (num > 388) {
          alert("Page limit exceeded");
        }
      }, 600);
    }
  }}
                className={`w-8 sm:w-8 py-1 pl-2 sm:py-2 rounded-full text-center focus:outline-none

                  [&::-webkit-outer-spin-button]:appearance-none

                  [&::-webkit-inner-spin-button]:appearance-none

                  [appearance:textfield] ${
                    theme === "dark"
                      ? "bg-[#1a1a1a] border-gray-600 text-white"
                      : "border-gray-300"
                  }`}
              /> */}
              <div className="flex items-center gap-2">
  {!editing ? (
    // ✅ SPAN DISPLAY MODE
    <span
      onClick={() => setEditing(true)}
      className="cursor-pointer px-3 py-1 bg-gray-200 rounded-full text-sm"
    >
      {pageNumberDisplay}
    </span>
  ) : (
    // ✅ INPUT EDIT MODE
    <input
      autoFocus
      type="text"
      onChange={(e) => {
        const val = e.target.value;

        // allow only numbers
        if (/^\d*$/.test(val)) {
          setPageInput(val);

          clearTimeout(debounceRef.current);

          debounceRef.current = setTimeout(() => {
            if (!val) return;

            const num = Number(val);

            if (num > 0 && num <= 388) {
              getLessonByPageNumber(num);
            } else if (num > 388) {
              alert("Page limit exceeded");
            }
            // ✅ switch back after done
            setEditing(false);
          }, 1000);
        }
      }}
      onBlur={() => setEditing(false)} // ✅ exit on blur
      className="w-12 text-center border border-gray-300 rounded-full py-1 focus:outline-none"
    />
  )}
</div>
              <span>of</span>
              <span>325</span>
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
          // className={`fixed top-1/2 -translate-y-1/2 z-40 text-red-600 bg-white border border-neutral-200 pl-2 py-5 rounded-l-full shadow-lg transition-all duration-300
          //       ${isSliderOpen ? "right-[85vw] sm:right-96" : "right-0"}`}
          className={`fixed top-1/2 -translate-y-1/2 z-40 ${
            theme === "dark"
              ? "text-red-400 bg-[#2d2d2d] border-gray-700"
              : "text-red-600 bg-white border-neutral-200"
          } pl-2 py-5 rounded-l-full shadow-lg transition-all duration-300

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
          className={`absolute right-0 top-0 h-full z-40 transform transition-transform duration-300 ease-in-out
       ${chapterListTheme[theme]} w-[85%] sm:w-96
      ${isSliderOpen ? "translate-x-0" : "translate-x-full"}`}
          role="dialog"
          aria-label="Chapters"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            {/* <h2 className="text-xl font-light border-b p-5 bg-red-500 text-white">{t("chapters")}</h2>
            <h2 className="text-xl font-light border-b p-5 text-gray-500">{t("contents")}</h2> */}
            <h2 className="text-xl font-light border-b p-5 bg-red-500 text-white">
              {t("chapters")}
              <span className="text-sm ml-2 opacity-80 font-normal">
                {t("contents")}
              </span>
            </h2>
            <div className="flex-1 overflow-y-auto" ref={sectionListRef}>
              <ul className="text-gray-500 font-semibold text-md sm:text-base">
                {sections.length === 0 ? (
                  <li className="border-b border-b-gray-200 p-3">
                    {t("loading")}
                  </li>
                ) : (
                  sections.map((s, i) => {
                    const label =
                      (lang !== "en"
                        ? s?.[`section_name_${lang}`]?.trim()
                        : s.section_name) ||
                      s?.chapter_name?.trim() ||
                      s?.title?.trim() ||
                      `Chapter ${i + 1}`;
                    return (
                      <li
                        key={s.section_id ?? s.id ?? i}
                        className={`border-b border-b-gray-200 p-3 cursor-pointer
    ${
      Number(s.section_id) === Number(currentSection)
        ? "bg-red-100 text-red-700 font-bold"
        : "hover:bg-neutral-50"
    }
  `}
                        ref={
                          Number(s.section_id) === Number(currentSection)
                            ? activeChapterRef
                            : null
                        }
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
      </main>
    </div>
  );
};
