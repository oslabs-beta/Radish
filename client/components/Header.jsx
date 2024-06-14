import React from "react";
function Header() {
  return (
    <header className="bg-black text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-xl font-bold">RADISH</span>
        </div>
        <div className="flex space-x-4">
          <button className="text-gray-300 hover:text-white">Log In</button>
          <button className="text-gray-300 hover:text-white">Log Out</button>
          <button className="text-gray-300 hover:text-white">Register</button>
        </div>
      </div>
    </header>
  );
}
export default Header;
