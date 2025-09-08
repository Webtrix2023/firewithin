import React from 'react';
import { Link } from 'react-router-dom';
const Navbar = () => {
  return (
    <nav className="flex justify-between items-center md:px-8 py-16 bg-white shadow-md">
      <h1 className="text-3xl font-bold ml-7">THE FIRE WITHIN</h1>
      <button className="bg-black mr-8 hover:text-blue-500 hover:cursor-pointer text-white px-4 py-2 rounded-full font-inter hover:opacity-80 hover:underline text-lg">
        <Link to={'/login'}>Login
        </Link>
      </button>
    </nav>
  );
};

export default Navbar;
