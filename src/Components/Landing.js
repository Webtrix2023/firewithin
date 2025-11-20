// // // import React from 'react';
// // // import { Link } from 'react-router-dom';
// // // import { useLanguage } from "../LanguageContext";

// // // const Landing = () => {
// // //   const { t, lang, changeLanguage } = useLanguage();
// // //   return (
// // //     <section className="relative overflow-hidden">
// // //       {/* Background (fills the section) */}
// // //       <div className="absolute inset-0 hero-bg bg-cover bg-center" />
// // //       {/* Subtle gradient overlay for legibility without making it “too black” */}
// // //       <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-transparent md:from-black/20 md:via-black/10" />

// // //       {/* Content: subtract a compact header if you use one (h-12 mobile / h-14 desktop) */}
// // //       <div
// // //         className="
// // //           relative text-white
// // //           min-h-[calc(100svh-3rem)] md:min-h-[calc(100svh-3.5rem)]
// // //           flex items-center
// // //         "
// // //       >
// // //         <div className="w-full px-5 sm:px-8">
// // //           <div className="max-w-[52rem] mx-auto md:mx-0 md:ml-20">
// // //             <h2
// // //                 className="font-light leading-[1.08] mb-5 text-[clamp(3rem,7.2vw,6.25rem)]">
// // //                 <span className="md:block">{t("discover")} </span>
// // //                 {/* <span className="md:block">Discover a </span>
// // //                 <span className="md:block">world of digital </span>
// // //                 <span className="md:block">content</span> */}
// // //                 </h2>

// // //             <Link to="/signup" className="inline-block mt-6">
// // //               <span
// // //                 className="
// // //                   bg-white text-black rounded-full transition hover:bg-white/90
// // //                   px-6 md:px-7 py-2.5 md:py-3
// // //                   text-[clamp(1rem,2vw,1.1rem)]     /* modest size */
// // //                 "
// // //               >
// // //                 {t("register_now")}
// // //               </span>
// // //             </Link>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </section>
// // //   );
// // // };

// // // export default Landing;

// // import React, { useState } from "react";
// // import { useLanguage } from "../LanguageContext";
// // import Henry from "../assets/Henry.jpg"; // Background image

// // const Landing = () => {
// //   const { t } = useLanguage();
// //   const [showModal, setShowModal] = useState(false);
// //   const [modalType, setModalType] = useState(null); // "login" or "register"

// //   const openModal = (type) => {
// //     setModalType(type);
// //     setShowModal(true);
// //   };

// //   const closeModal = () => {
// //     setShowModal(false);
// //     setModalType(null);
// //   };

// //   return (
// //     <section className="relative w-screen h-screen overflow-hidden">
// //       {/* Background Image */}
// //       <div
// //         className="absolute inset-0 bg-cover bg-center"
// //         style={{ backgroundImage: `url(${Henry})` }}
// //       />
// //       {/* Gradient Overlay */}
// //       <div className="absolute inset-0 bg-black/30" />

// //       {/* Centered Content */}
// //       <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-5 text-center">
// //         <h1 className="text-[clamp(2rem,5vw,5rem)] font-bold mb-8">
// //           {t("welcome")}
// //         </h1>
// //         <div className="flex gap-4">
// //           <button
// //             onClick={() => openModal("login")}
// //             className="bg-white text-black px-6 py-3 rounded-full hover:bg-white/90 transition"
// //           >
// //             {t("login")}
// //           </button>
// //           <button
// //             onClick={() => openModal("register")}
// //             className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition"
// //           >
// //             {t("register_now")}
// //           </button>
// //         </div>
// //       </div>

// //       {/* Popup Modal */}
// //       {showModal && (
// //         <div
// //           className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
// //           onClick={closeModal} // close if background clicked
// //         >
// //           <div
// //             className="bg-white rounded-xl w-11/12 max-w-md p-6 relative"
// //             onClick={(e) => e.stopPropagation()} // prevent closing when modal clicked
// //           >
// //             <button
// //               onClick={closeModal}
// //               className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold"
// //             >
// //               &times;
// //             </button>

// //             {modalType === "login" && (
// //               <div>
// //                 <h2 className="text-2xl font-semibold mb-4">{t("login")}</h2>
// //                 {/* Replace below with your actual Login form */}
// //                 <form className="flex flex-col gap-3">
// //                   <input
// //                     type="email"
// //                     placeholder={t("email")}
// //                     className="border p-2 rounded"
// //                   />
// //                   <input
// //                     type="password"
// //                     placeholder={t("password")}
// //                     className="border p-2 rounded"
// //                   />
// //                   <button className="bg-black text-white py-2 rounded mt-2">
// //                     {t("login")}
// //                   </button>
// //                 </form>
// //               </div>
// //             )}

// //             {modalType === "register" && (
// //               <div>
// //                 <h2 className="text-2xl font-semibold mb-4">
// //                   {t("register_now")}
// //                 </h2>
// //                 {/* Replace below with your actual Register form */}
// //                 <form className="flex flex-col gap-3">
// //                   <input
// //                     type="text"
// //                     placeholder={t("username")}
// //                     className="border p-2 rounded"
// //                   />
// //                   <input
// //                     type="email"
// //                     placeholder={t("email")}
// //                     className="border p-2 rounded"
// //                   />
// //                   <input
// //                     type="password"
// //                     placeholder={t("password")}
// //                     className="border p-2 rounded"
// //                   />
// //                   <button className="bg-red-600 text-white py-2 rounded mt-2">
// //                     {t("register_now")}
// //                   </button>
// //                 </form>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       )}
// //     </section>
// //   );
// // };

// // export default Landing;

// import React, { useState } from "react";
// import { useLanguage } from "../LanguageContext";
// import { useNavigate } from "react-router-dom";
// import Henry from "../assets/Henry.jpg"; // Background image
// import Login from "./Login";
// import Register from "./Register";

// const Landing = () => {
//   const { t } = useLanguage();
//   const navigate = useNavigate();

//   // State for modal
//   const [showModal, setShowModal] = useState(false);
//   const [modalType, setModalType] = useState(null); // "login" or "register"

//   // Handlers
//   const openModal = (type) => {
//     setModalType(type);
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setModalType(null);
//   };

//   // Navigate to forgot password page
//   const openForgot = () => {
//     setShowModal(false); // close any open modal
//     navigate("/forgot-password");
//   };

//   return (
//     <section className="relative w-screen h-screen overflow-hidden">
//       {/* Background Image */}
//       <div
//         className="absolute inset-0 bg-cover bg-center"
//         style={{ backgroundImage: `url(${Henry})` }}
//       />
//       {/* Gradient Overlay */}
//       <div className="absolute inset-0 bg-black/30" />

//       {/* Centered Content */}
//       <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-5 text-center">
//         <h1 className="text-[clamp(2rem,5vw,5rem)] font-bold mb-8">
//           {t("welcome")}
//         </h1>
//         <div className="flex gap-4">
//           <button
//             onClick={() => openModal("login")}
//             className="bg-white text-black px-6 py-3 rounded-full hover:bg-white/90 transition"
//           >
//             {t("login")}
//           </button>
//           <button
//             onClick={() => openModal("register")}
//             className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition"
//           >
//             {t("register_now")}
//           </button>
//         </div>
//       </div>

//       {/* Popup Modal */}
//       {showModal && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
//           onClick={closeModal} // close if background clicked
//         >
//           <div
//             className="bg-white rounded-xl w-11/12 max-w-md p-6 relative"
//             onClick={(e) => e.stopPropagation()} // prevent closing when modal clicked
//           >
//             <button
//               onClick={closeModal}
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold"
//             >
//               &times;
//             </button>

//             {/* Render Login or Register */}
//             {modalType === "login" && (
//               <Login
//                 openRegister={() => openModal("register")}
//                 openForgot={openForgot}
//               />
//             )}
//             {modalType === "register" && (
//               <Register
//                 openLogin={() => openModal("login")}
//                 openForgot={openForgot}
//               />
//             )}
//           </div>
//         </div>
//       )}
//     </section>
//   );
// };

// export default Landing;
import React, { useState } from "react";
import { useLanguage } from "../LanguageContext";
import { useNavigate } from "react-router-dom";
import Henry from "../assets/Henry.jpg"; // Background image
import Login from "./Login";
import Register from "./Register";

const Landing = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // "login" or "register"

  // Handlers
  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
  };

  // Navigate to forgot password page
  const openForgot = () => {
    setShowModal(false); // close any open modal
    navigate("/forgot-password");
  };

  return (
    <section className="relative w-screen h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${Henry})` }}
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Right-aligned Content */}
      <div className="relative z-10 flex flex-col items-end justify-center h-full text-white pr-10 text-right">
        {/* Changed: items-end + pr-10 + text-right to move content to right */}
        <h1 className="text-[clamp(2rem,5vw,5rem)] font-bold mb-8">
          {t("welcome")}
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => openModal("login")}
            className="bg-white text-black px-6 py-3 rounded-full hover:bg-white/90 transition"
          >
            {t("login")}
          </button>
          <button
            onClick={() => openModal("register")}
            className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition"
          >
            {t("register_now")}
          </button>
        </div>
      </div>

      {/* Popup Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeModal} // close if background clicked
        >
          <div
            className="bg-white rounded-xl w-11/12 max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()} // prevent closing when modal clicked
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold"
            >
              &times;
            </button>

            {/* Render Login or Register */}
            {modalType === "login" && (
              <Login
                openRegister={() => openModal("register")}
                openForgot={openForgot}
              />
            )}
            {modalType === "register" && (
              <Register
                openLogin={() => openModal("login")}
                openForgot={openForgot}
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Landing;
