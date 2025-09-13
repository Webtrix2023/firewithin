import Navbar2 from "./Navbar2";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { FiType, FiSun, FiMoon } from "react-icons/fi";
import { api } from "../api";
import DOMPurify from "dompurify";
import { useMemo } from "react";
export const Text = () => {
  const [pageContent, setPageContent] = useState("");
  const safeHtml = useMemo(
  () => DOMPurify.sanitize(pageContent, {
    ADD_ATTR: ["target", "rel"], // allow opening links in new tab safely
  }),
  [pageContent]
);
  const [chapterName, setChapterName] = useState("CHAPTER 1 · HOT METAL");
  const [pageNumber, setPageNumber] = useState(1);
const [sections, setSections] = useState([]);
const [lessonIndex, setLessonIndex] = useState(0);    // number, not string
const [currentSection, setCurrentSection] = useState(0);

  // UI state (layout/placements unchanged)
  const [controlsVisible, setControlsVisible] = useState(true);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [fontSize, setFontSize] = useState(1.05); // rem
  const [theme, setTheme] = useState("light");
  const [isSliderOpen, setIsSliderOpen] = useState(false);

  // refs for outside click on font menu
  const fontBtnRef = useRef(null);
  const fontMenuRef = useRef(null);

  const appUrl = `https://firewithin.coachgenie.in/`;

  const loadPage = async ({
  sectionId = currentSection,
  index = lessonIndex,
  type = "next",
} = {}) => {
  try {
    const body = new URLSearchParams();
    body.append("type", type);
    body.append("section_id", String(sectionId));
    body.append("course_id", "1");
    body.append("lesson_index", String(index));
    body.append("ttpe", "listen"); // keep if your API expects this

    const { data } = await api.post("/pageDetails", body, {
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    });

    if (data.flag === "S" && data.data?.[0]) {
      const item = data.data[0];
      setPageContent(item.introduction || "");
      if (typeof item.pageNumber === "number") setPageNumber(item.pageNumber);
      if (item.chapter_name) setChapterName(item.chapter_name);
      if (item.lesson_id) updateAutoPage(item.lesson_id);

      // ensure numeric
      if (item.lesson_index != null) setLessonIndex(Number(item.lesson_index));
    }
  } catch (e) {
    console.error(e);
  }
};


  const updateAutoPage = async (page) => {
    try { await axios.get(`${appUrl}autopage/${page}`); } catch (err) { console.error(err); }
  };

  
  const getPageDetails = async (opts = {}) => {
    const payload = {
      type: "next",
      section_id: currentSection,
      course_id:1,
      lesson_index:lessonIndex,
      ttpe: "listen",
      ...opts,
    };
    try {
      const res = await axios.post(`${appUrl}pageDetails`, payload, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8','Accept': '*/*' },
        withCredentials: true,
      });
      const data = res.data;
      
      if (data.flag === "S") {
        
        const item = data.data[0];
        //console.log(item.introduction);
        setPageContent(item.introduction || "");
        if (typeof item.pageNumber === "number") setPageNumber(item.pageNumber);
        if (item.chapter_name) setChapterName(item.chapter_name);
        if (item.lesson_id) updateAutoPage(item.lesson_id);
        console.log("coming",item.lesson_index);
        if (item.lesson_index) setLessonIndex(item.lesson_index);
      }
    } catch (err) {
      console.error(err);
    }
  };
 const getCurrentPageDetails = async () => {
  try {
    const res = await api.post("/currentPageDetails", {}); // CSRF auto-handled
    const data = res.data.data;
    
    if (res.data.flag === "S") {
      const item = data.bookpage[0];
      setPageContent(item.introduction || "");
      if (typeof item.pageNumber === "number") setPageNumber(item.pageNumber);
      if (item.chapter_name) setChapterName(item.chapter_name);
      if (item.section_id) setCurrentSection(item.section_id);
      
      if (item.lesson_id) updateAutoPage(item.lesson_id);
      setSections(Array.isArray(data.bookSectionDetails) ? data.bookSectionDetails : []);
    }
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  (async () => {
    try {
      const { data: res } = await api.post("/currentPageDetails", {});
      if (res.flag === "S" && res.data?.bookpage?.[0]) {
        const item = res.data.bookpage[0];
        setPageContent(item.introduction || "");
        if (typeof item.pageNumber === "number") setPageNumber(item.pageNumber);
        if (item.chapter_name) setChapterName(item.chapter_name);
        if (item.section_id != null) setCurrentSection(Number(item.section_id));
        if (item.lesson_index != null) setLessonIndex(Number(item.lesson_index));
        setSections(Array.isArray(res.data.bookSectionDetails) ? res.data.bookSectionDetails : []);
        if (item.lesson_id) updateAutoPage(item.lesson_id);
      }
    } catch (e) {
      console.error(e);
    }
  })();
}, []);

const handleNext = (e) => {
  e.stopPropagation();
  const nextIndex = lessonIndex;
  // optimistic update (optional)
  setLessonIndex(nextIndex);
  loadPage({ index: nextIndex, type: "next" });
};

const handlePrev = (e) => {
  e.stopPropagation();
  const prevIndex = Math.max(lessonIndex, 0);
  setLessonIndex(prevIndex);
  loadPage({ index: prevIndex, type: "prev" });
};


const openSection = (section, i) => {
  const sectionId = section.section_id ?? section.id ?? section.sectionId;
  setIsSliderOpen(false);
  setCurrentSection(Number(sectionId));
  setLessonIndex(0);                       // start at first lesson of that section
  loadPage({ sectionId, index: 0, type: "next" });
  const label = section.section_name || section.chapter_name || section.title || `Chapter ${i + 1}`;
  setChapterName(label);
};
  // Initial load
  useEffect(() => { getPageDetails({ type: "next", lesson_index: 0 }); }, []);

  useEffect(() => { getCurrentPageDetails(); }, []);

  // Controls & navbar visible by default on md+, hidden on mobile until tap
  useEffect(() => {
    const setByWidth = () => {
      const vis = window.innerWidth >= 768;
      setControlsVisible(vis);
      //setNavbarVisible(vis);
    };
    setByWidth();
    window.addEventListener("resize", setByWidth);
    return () => window.removeEventListener("resize", setByWidth);
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

  // Theme classes (no layout/color placement changes)
  const themeClasses = {
    light: "bg-[#ffffff] text-[#111]",
    sepia: "bg-[#f4ecd8] text-[#2b2a27]",
    dark: "bg-[#111] text-[#f1f1f1]",
  };
  // Requested: light text color should be white
  const contentColor = {
    light: "text-[#111]",   // changed as requested
    sepia: "text-[#2b2a27]",
    dark: "text-[#e9e9e9]",
  };
  const mutedColor = {
    light: "text-neutral-300", // adjust for white text on light bg
    sepia: "text-[#6b5e48]",
    dark: "text-neutral-400",
  };

  const increaseFont = () => setFontSize((s) => Math.min(s + 0.1, 1.8));
  const decreaseFont = () => setFontSize((s) => Math.max(s - 0.1, 0.9));

  return (
    <div className={`h-screen flex flex-col ${themeClasses[theme]} transition-colors duration-300`}>
      {/* Toggle Navbar visibility with the same tap */}
      <div className={navbarVisible ? "block" : "hidden"}>
        <Navbar2 />
      </div>

      {/* Reading surface */}
      <main className="relative flex-1 overflow-hidden">
        {/* Top overlay bar (chapter, theme, font) — unchanged placement */}
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 z-30 px-3 sm:px-6 pt-[env(safe-area-inset-top)]
          transition-opacity duration-300 ${controlsVisible ? "opacity-100" : "opacity-0"}`}
        >
          <div className="pointer-events-auto mx-auto max-w-[72ch] flex items-center justify-between rounded-b-xl bg-black/10 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-3">
            <div className="text-xs sm:text-sm font-medium truncate">
              {chapterName}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme toggle */}
              <button
                aria-label="Toggle theme"
                onClick={(e) => {
                  e.stopPropagation();
                  setTheme((t) => (t === "dark" ? "light" : t === "light" ? "sepia" : "dark"));
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
                  onClick={(e) => { e.stopPropagation(); setShowFontMenu((v) => !v); }}
                  className="p-2 rounded-full hover:bg-black/10 transition"
                  title="Font size"
                >
                  <FiType />
                </button>
                {showFontMenu && (
                  <div
                    ref={fontMenuRef}
                    className="absolute right-0 mt-2 w-44 rounded-xl bg-white text-neutral-900 shadow-lg ring-1 ring-black/5 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-sm">Text size</span>
                      <span className={`text-xs ${mutedColor[theme]}`}>{Math.round(fontSize * 100)}%</span>
                    </div>
                    <div className="flex items-center justify-between px-3 pb-3 gap-2">
                      <button onClick={decreaseFont} className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-sm">A–</button>
                      <button onClick={() => setFontSize(1.05)} className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-sm">Reset</button>
                      <button onClick={increaseFont} className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-sm">A+</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable reading column (unchanged structure) */}
        <div
          className="relative h-full w-full overflow-y-auto px-3 sm:px-4 md:px-6 pb-20 sm:pb-24 scroll-smooth"
          onClick={handleReadingAreaTap}
        >
          <div className="mx-auto max-w-[72ch]">
            {/* Chapter Title */}
            <h1
              className={`text-center mb-6 sm:mb-8 font-light ${contentColor[theme]} text-[clamp(1.5rem,5vw,3rem)] leading-tight`}
              style={{ fontFamily: "Arsis DReg, serif" }}
            >
              Hot Metal
            </h1>

            {/* Page Content */}
            {/* <article
              className={`leading-[1.85] ${contentColor[theme]} text-justify`}
              style={{ fontSize: `${fontSize}rem`, WebkitHyphens: "auto", hyphens: "auto" }}
            >
              <p className="indent-6 sm:indent-8">
                {pageContent ||
                  "Common ringed plover. The common ringed plover (Charadrius hiaticula) ..."}
              </p>
            </article>
             */}
             <article
  className={`leading-[1.85] ${contentColor[theme]} text-justify`}
  style={{ fontSize: `${fontSize}rem`, WebkitHyphens: "auto", hyphens: "auto" }}
  onClick={handleReadingAreaTap}
></article>
  <div
    className="reader-html" // optional hook for extra CSS
    dangerouslySetInnerHTML={{ __html: safeHtml }}
  />
          </div>
        </div>

        {/* Bottom navigation (unchanged placement) */}
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 z-30 px-3 sm:px-6 pb-[env(safe-area-inset-bottom)]
                      transition-opacity duration-300 ${controlsVisible ? "opacity-100" : "opacity-0"}`}
        >
          <div className="pointer-events-auto mx-auto max-w-[72ch] flex items-center justify-between rounded-t-xl bg-black/10 backdrop-blur-sm px-2 py-2 sm:px-3 sm:py-2">
            <div className="flex items-center gap-2">
              <button
                aria-label="Previous page"
                className="flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white h-10 w-10 sm:h-11 sm:w-11 transition"
                 onClick={handlePrev}
              >
                <FaAngleLeft size={18} />
              </button>

              <button
                aria-label="Next page"
                className="flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white h-10 w-10 sm:h-11 sm:w-11 transition"
                onClick={handleNext}
              >
                <FaAngleRight size={18} />
              </button>
            </div>

            <div className={`flex items-center gap-2 text-xs sm:text-sm ${mutedColor[theme]}`} aria-live="polite">
              <span className="inline-flex items-center justify-center bg-black text-white h-7 px-3 rounded-full text-xs sm:text-sm">
                {pageNumber}
              </span>
              <span>of</span>
              <span>325</span>
            </div>
          </div>
        </div>

        {/* Chapters toggle (unchanged placement) */}
        <button
          aria-label={isSliderOpen ? "Close chapters" : "Open chapters"}
          onClick={(e) => { e.stopPropagation(); setIsSliderOpen(!isSliderOpen); }}
          className={`fixed top-1/2 -translate-y-1/2 z-40 text-blue-600 bg-white border border-neutral-200 px-3 py-4 rounded-l-full shadow-lg transition-all duration-300
                      ${isSliderOpen ? "right-[85vw] sm:right-96" : "right-0"}`}
        >
          {isSliderOpen ? <FaAngleRight /> : <FaAngleLeft />}
        </button>

        {/* Chapters Drawer (unchanged UI) */}
        <aside
          className={`fixed right-0 top-0 h-full z-40 transform transition-transform duration-300 ease-in-out bg-white border-l border-neutral-200 w-[85vw] sm:w-96
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
        </aside>
      </main>
    </div>
  );
};
