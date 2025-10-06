import Navbar2 from "./Navbar2";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { FiType, FiSun, FiMoon } from "react-icons/fi";
import { api } from "../api";
import DOMPurify from "dompurify";
import { useMemo } from "react";
import "./text.css"
import { toast } from "react-toastify";
import { APP_URL } from "../config";
export const Text2 = () => {
    const [pageContent, setPageContent] = useState("");
    const safeHtml = useMemo(

        () => DOMPurify.sanitize(pageContent, {
            ADD_ATTR: ["target", "rel"], // allow opening links in new tab safely
        }),
        [pageContent]
    );

    const [chapterName, setChapterName] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const [sections, setSections] = useState([]);
    const [lessonIndex, setLessonIndex] = useState(0);    // number, not string
    const [currentSection, setCurrentSection] = useState(0);

    // UI state (layout/placements unchanged)
    const [controlsVisible, setControlsVisible] = useState(true);
    const [navbarVisible, setNavbarVisible] = useState(true);
    const [showFontMenu, setShowFontMenu] = useState(false);
    const [fontSize, setFontSize] = useState(2.08); // rem
    const [theme, setTheme] = useState("light");
    const [isSliderOpen, setIsSliderOpen] = useState(false);

    // refs for outside click on font menu
    const fontBtnRef = useRef(null);
    const fontMenuRef = useRef(null);
    // helper: extracts <h1> text and removes it from HTML
    function splitContent(html) {
        const temp = document.createElement("div");
        temp.innerHTML = html;

        return {
            pageContent: temp.innerHTML,  // take everything as-is
        };
    }


    // --- API Helpers ---

    // ✅ API call to load a page (navigation or section switch)
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
            {/*Endpoint changed from pageDetails to getpageDetails */ }
            const { data } = await api.post(`${APP_URL}/getpageDetails`, body, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    Accept: "*/*",
                },
                withCredentials: true,
            });

            if (data.flag === "S" && data.data?.[0]) {
                const item = data.data[0];

                if (item.introduction) {
                    const { pageContent } = splitContent(item.introduction);
                    setPageContent(pageContent || "");

                }
                if (item.chapter_name != null) setChapterName(item.chapter_name);
                if (typeof item.pageNumber === "number") setPageNumber(item.pageNumber);
                if (item.section_id != null) setCurrentSection(Number(item.section_id));
                if (item.lesson_index != null) setLessonIndex(Number(item.lesson_index));

                // ✅ only update autopage on navigation
                if (saveProgress && item.lesson_id) updateAutoPage(item.lesson_id);
            }
            if (data.flag === "F") {
                toast.error(data.msg);
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
        {/*Endpoint changed from pageDetails to getpageDetails */ }
        try {
            const res = await axios.post(`${APP_URL}getpageDetails`, payload, {
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
                if (item.chapter_name != null) setChapterName(item.chapter_name);

                if (typeof item.pageNumber === "number") setPageNumber(item.pageNumber);
                if (item.lesson_index != null) setLessonIndex(Number(item.lesson_index));

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
            if (data.currentChapterDetails.section_name) setChapterName(data.currentChapterDetails.section_name)
            if (res.data.flag === "S" && data?.bookpage?.[0]) {
                const item = data.bookpage[0];
                console.log(item);

                if (item.introduction) {
                    const { chapterName, pageContent } = splitContent(item.introduction);
                    setPageContent(pageContent || "");
                }

                if (typeof item.pageNumber === "number") setPageNumber(item.pageNumber);
                if (item.section_id != null) setCurrentSection(Number(item.section_id));
                if (item.lesson_index != null) setLessonIndex(Number(item.lesson_index));

                setSections(
                    Array.isArray(data.bookSectionDetails) ? data.bookSectionDetails : []
                );

                // 🚫 don’t call updateAutoPage here → avoid overwriting progress on refresh
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
                `${APP_URL}get_lession_by_pageNo`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                        Accept: "*/*",
                    },
                    withCredentials: true,
                }
            );
            const data = res.data;
            if (res.data.flag === "S" && data.data) {
                const item = data.data;
                console.log(item)
                if (item.introduction) {
                    const { chapterName, pageContent } = splitContent(item.introduction);
                    setPageContent(pageContent || "");
                }
                if (item.section_name != null) setChapterName(item.section_name);

                if (typeof item.pageNumber === "number") setPageNumber(item.pageNumber);
                if (item.lesson_index != null) setLessonIndex(Number(item.lesson_index));

                // ✅ safe: only when explicitly called for navigation
                if (item.lesson_id) updateAutoPage(item.lesson_id);

                // 🚫 don’t call updateAutoPage here → avoid overwriting progress on refresh
            }
        } catch (e) {
            console.error(e);
        }
    };

    // --- Navigation handlers ---
    const handleNext = (e) => {
        e.stopPropagation();
        const nextIndex = lessonIndex + 1;
        setLessonIndex(nextIndex);
        loadPage({ index: nextIndex, type: "next", saveProgress: true });
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        const prevIndex = Math.max(lessonIndex - 1, 0);
        setLessonIndex(prevIndex);
        loadPage({ index: prevIndex, type: "prev", saveProgress: true });
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
        setChapterName(label);
    };

    // --- Initial load ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                await axios.get(`${APP_URL}automodeSet/read`);
                getCurrentPageDetails();
            } catch (error) {
                console.error("Error in useEffect:", error);
            }
        };

        fetchData();
    }, []);


    {/*REmoved extra useEffect */ }

    // useEffect(() => {
    //     (async () => {

    //         try {
    //             const { data: res } = await api.post("/currentPageDetails", {});
    //             if (res.flag === "S" && res.data?.bookpage?.[0]) {
    //                 const item = res.data.bookpage[0];
    //                 if (item.introduction) {
    //                     const { chapterName, pageContent } = splitContent(item.introduction);
    //                     setPageContent(pageContent || "");
    //                     setChapterName(item.chapter_name || chapterName || "");
    //                 }

    //                 if (typeof item.pageNumber === "number") setPageNumber(item.pageNumber);
    //                 if (item.section_id != null) setCurrentSection(Number(item.section_id));
    //                 if (item.lesson_index != null) setLessonIndex(Number(item.lesson_index));
    //                 setSections(Array.isArray(res.data.bookSectionDetails) ? res.data.bookSectionDetails : []);
    //                 if (item.lesson_id) updateAutoPage(item.lesson_id);
    //             }
    //         } catch (e) {
    //             console.error(e);
    //         }
    //     })();
    // }, []);



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
        <div className="h-screen flex flex-col overflow-hidden">
            <Navbar2 chapterName={chapterName} chapterNumber={currentSection} />

            {/* Full Screen Layout */}
            <div className="flex flex-1 bg-gray-100 justify-center relative overflow-hidden">

                {/* Left Sidebar Controls */}
                <div className="flex flex-col mx-2 sm:mx-20 my-4 sm:my-10 justify-end fixed left-2 bottom-12 sm:bottom-20 sm:static z-40">
                    {/* Font size menu */}
                    <div className="bg-white shadow-lg rounded-full flex flex-col gap-2">
                        {showFontMenu && (
                            <div className="space-y-1">
                                {[0.8, 1, 1.2, 1.5].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => {
                                            setFontSize(size);
                                            setShowFontMenu(false);
                                        }}
                                        style={{ fontSize: `${size}rem` }}
                                        className="w-10 h-10 sm:w-14 sm:h-14 rounded-full hover:bg-blue-600 hover:text-white text-black flex items-center justify-center"
                                    >
                                        Aa
                                    </button>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={() => setShowFontMenu(!showFontMenu)}
                            className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700"
                        >
                            Tt
                        </button>
                    </div>
                </div>

                {/* Scrollable Book Page */}
                <div className="w-full max-w-5xl bg-white shadow-lg my-10 rounded-sm p-6 sm:p-12 overflow-y-auto h-full">
                    {/* Page Content */}
                    <div
                        className={`mx-auto leading-extra-loose font-serif px-6 sm:px-16 text-2xl  ${lessonIndex === 0 ? "first-page" : ""
                            }`}
                        style={{
                            fontSize: `${fontSize}rem`,
                            textIndent: "50px",
                            lineHeight: "1.8",
                        }}
                    >
                        <div 
                            className="page-content [&_p]:text-inherit [&_span]:text-inherit [&_em]:text-inherit [&_strong]:text-inherit"
                            dangerouslySetInnerHTML={{ __html: safeHtml }}
                        />
                    </div>
                </div>


                {/* Bottom Right Pagination */}
                <div className="absolute bottom-4 right-4 sm:static sm:self-end flex flex-col items-center gap-3 m-4 sm:m-10">
                    <div className="flex space-x-2">
                        <button
                            className="flex items-center text-white p-4 sm:p-5 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700"
                            onClick={() =>
                                getPageDetails({
                                    type: "prev",
                                    section_id: currentSection,
                                    course_id: 1,
                                    lessonIndex: pageNumber - 1,
                                })
                            }
                        >
                            <FaAngleLeft size={20} />
                        </button>

                        <button
                            className="flex items-center text-white p-4 sm:p-5 bg-blue-600 cursor-pointer rounded-full hover:bg-blue-700"
                            onClick={() =>
                                getPageDetails({
                                    type: "next",
                                    section_id: currentSection,
                                    course_id: 1,
                                    lessonIndex: pageNumber + 1,
                                })
                            }
                        >
                            <FaAngleRight size={20} />
                        </button>
                    </div>

                    {/* Page Number */}
                    <div className="w-full justify-center flex items-center gap-1 bg-white shadow-md rounded-full text-xs sm:text-sm font-medium pl-0 pr-1">
                        <input
                            type="number"
                            value={pageNumber}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                setPageNumber(value);

                                if (value > 0 && value <= 388) {
                                    getLessonByPageNumber(value); // ✅ use 'value', not 'pageNumber'
                                } else {
                                    alert("Page limit exceeded");
                                }
                            }}
                            className="w-12 sm:w-16 py-1 sm:py-2 rounded-full text-center border-gray-300 focus:outline-none  
    [&::-webkit-outer-spin-button]:appearance-none 
    [&::-webkit-inner-spin-button]:appearance-none 
    [appearance:textfield]"
                        />



                        <span className="text-gray-500">of</span>
                        <span className="text-gray-500">325</span>
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
                    className={`absolute right-0 top-0 h-full z-40 transform transition-transform duration-300 ease-in-out 
      bg-white border-l border-neutral-200 w-[85%] sm:w-96
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
                                        const label = s.section_name || s.chapter_name || s.title || `Chapter ${i + 1}`;
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
        </div >

    )
}

{/* Chapter Title */ }
{/* <h1
                        className="text-center mb-8 sm:mb-12 text-3xl sm:text-[120px]"
                        style={{
                            fontFamily: "Arsis DReg, serif",
                            fontWeight: 400,
                            lineHeight: "100%",
                        }}
                    >
                        {chapterName}
                    </h1> */}
