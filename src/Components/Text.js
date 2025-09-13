import Navbar2 from "./Navbar2";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";

export const Text = () => {
    const [pageContent, setPageContent] = useState("");
    const [chapterName, setChapterName] = useState("CHAPTER-1 HOT METAL");
    const [pageNumber, setPageNumber] = useState(1);
    const [showFontMenu, setShowFontMenu] = useState(false);
    const [fontSize, setFontSize] = useState(1.2); // default size
    const [isSliderOpen, setIsSliderOpen] = useState(false);

    // === API helpers ===
    const appUrl = `https://firewithin.coachgenie.in/`;

    const updateAutoPage = async (page) => {
        try {
            await axios.get(`${appUrl}autopage/${page}`);
        } catch (err) {
            console.error(err);
        }
    };
//{ type, section_id, course_id, lessonIndex }
    const getPageDetails = async () => {
        try {
            const res = await axios.post(`${appUrl}getpageDetails`, {
                type:"next",
                section_id:4,
                course_id:1,
                lesson_index: 0,
                ttpe: "read",
            });
            const data = res.data;
            if (data.flag === "S") {
                setPageContent(data.data[0].introduction);
                setPageNumber(data.data[0].pageNumber);
                updateAutoPage(data.data[0].lesson_id);
            }
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(()=>{
        getPageDetails()
    },[])

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <Navbar2 />

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
                <div className="w-full max-w-4xl bg-white shadow-lg rounded-sm my-6 sm:my-10 p-6 sm:p-12 overflow-y-auto h-full">
                    {/* Chapter Title */}
                    <h1
                        className="text-center mb-8 sm:mb-12 text-4xl sm:text-[150px]"
                        style={{
                            fontFamily: "Arsis DReg, serif",
                            fontWeight: 400,
                            lineHeight: "100%",
                        }}
                    >
                        Hot Metal
                    </h1>

                    {/* Page Content */}
                    <div
                        className="page-content leading-relaxed text-justify"
                        style={{ fontSize: `${fontSize}rem`, textIndent: "50px" }}
                    >
                        <p className="p-16">
                            {pageContent ||
                                " Common ringed plover. Common ringed plove. The common ringed plover (Charadrius hiaticula) is a species of bird in the family Charadriidae. Its breeding range consists of much of northern Eurasia, as well as Greenland. It is a migratory bird and many individuals spend their winters in locations across Africa. Its breeding habitat is generally open ground on beaches or flats although some birds breed inland. They are commonly found both in low coastal plains and in cold uplands with sparse vegetation, in open habitats with little or no plant cover, where they nest on the ground. Breeding occurs from one year of age, with egg laying generally beginning around May. A clutch of three to four eggs is laid at intervals of one to three days, with the downy grey-buff chicks hatching after twenty-one to twenty-seven days. The common ringed plover forages for food on beaches, tidal flats and fields, usually by sight. It eats insects, crustaceans and worms, forages both by day and by night, and sometimes uses foot-trembling to reveal location of prey. This common ringed plover was photographed near Orkelsjøen, a lake in Oppdal, Norway.The common ringed plover (Charadrius hiaticula) is a species of bird in the family Charadriidae. Its breeding range consists of much of northern Eurasia, as well as Greenland. It is a migratory bird and many individuals spend their winters in locations across Africa. Its breeding habitat is generally open ground on beaches or flats although some birds breed inland. They are commonly found both in low coastal plains and in cold uplands with sparse vegetation, in open habitats with little or no plant cover, where they nest on the ground. Breeding occurs from one year of age, with egg laying generally beginning around May. A clutch of three to four eggs is laid at intervals of one to three days, with the downy grey-buff chicks hatching after twenty-one to twenty-seven days. The common ringed plover forages for food on beaches, tidal flats and fields, usually by sight. It eats insects, crustaceans and worms, forages both by day and by night, and sometimes uses foot-trembling to reveal location of prey. This common ringed plover was photographed near Orkelsjøen, a lake in Oppdal, Norway."}
                        </p>
                    </div>
                </div>

                {/* Bottom Right Pagination */}
                <div className="fixed bottom-4 right-4 sm:static sm:self-end flex flex-col items-center gap-3 m-4 sm:m-10">
                    <div className="flex space-x-2">
                        <button
                            className="flex items-center text-white p-4 sm:p-5 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700"
                            onClick={() =>
                                getPageDetails({
                                    type: "prev",
                                    section_id: 1,
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
                                    section_id: 1,
                                    course_id: 1,
                                    lessonIndex: pageNumber + 1,
                                })
                            }
                        >
                            <FaAngleRight size={20} />
                        </button>
                    </div>

                    {/* Page Number */}
                    <div className="w-max flex items-center gap-1 bg-white shadow-md rounded-full text-xs sm:text-sm font-medium pl-0 pr-2">
                        <span className=" bg-black w-14 py-1 sm:py-2 rounded-full text-center text-white">
                            {pageNumber}
                        </span>
                        <span className="text-gray-500 ">of</span>
                        <span className="text-gray-500 ">325</span>
                    </div>
                </div>

                {/* Slider Button */}
                <button
                    onClick={() => setIsSliderOpen(!isSliderOpen)}
                    className={`fixed top-1/2 transform -translate-y-1/2 
              text-blue-600 bg-white p-3 text-lg py-5 pr-0 
              rounded-l-full shadow-lg z-50 
              transition-all duration-300 ease-in-out
              ${isSliderOpen ? "right-96" : "right-0"}`}
                >
                    {isSliderOpen ? <FaAngleRight /> : <FaAngleLeft />}
                </button>

                {/* Right Sidebar (Slide-in Drawer) */}
                <div
                    className={`fixed right-0 h-full w-96 bg-white shadow-lg transform 
              transition-transform duration-300 ease-in-out z-40 
              ${isSliderOpen ? "translate-x-0" : "translate-x-full"}`}
                >
                    <div className="overflow-y-auto h-full">
                        <h2 className="text-xl font-light border-b p-5 bg-blue-500 text-white">
                            Chapters
                        </h2>
                        <h2 className="text-xl font-light border-b p-5 text-gray-500">
                            Contents
                        </h2>
                        <ul className="text-gray-500 font-semibold text-md sm:text-base">
                            <li className="border-b border-b-gray-200 p-3">1. Hot Metal</li>
                            <li className="border-b border-b-gray-200 p-3">2. A Quest Begins</li>
                            <li className="border-b border-b-gray-200 p-3">3. MIT on a Shoestring</li>
                            <li className="border-b border-b-gray-200 p-3">4. The Lair of the Dragon</li>
                            <li className="border-b border-b-gray-200 p-3">5. No Retreat</li>
                            <li className="border-b border-b-gray-200 p-3">6. Escape</li>
                            <li className="border-b border-b-gray-200 p-3">
                                7. “How Would You Like to Build a Furnace?”
                            </li>
                            <li className="border-b border-b-gray-200 p-3">8. Dashed Hopes</li>
                            <li className="border-b border-b-gray-200 p-3">9. Flying Solo</li>
                            <li className="border-b border-b-gray-200 p-3">10. Controlling Crisis</li>
                        </ul>
                    </div>
                </div>


            </div>
        </div>

    );
};
