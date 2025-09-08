import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white text-md py-4">
      <div className=" mx-12 flex flex-col ">
        {/* Links */}
        <div className="flex space-x-3 underline mb-2 sm:mb-0">
          <a href="#" className="">
            Privacy Policy
          </a>
          <a href="#" className="">
            Terms of Service
          </a>
          <a href="#" className="">
            Accessibility Statement
          </a>
          <a href="#" className="">
            Cookie Policy
          </a>
        </div>

        {/* Copyright */}
        <p className="text-sm">
          © 2025 Indel Services, LLC. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

