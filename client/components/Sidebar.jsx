import React, { useState } from "react";
import { FaDocker } from "react-icons/fa";
import { GiDiamondTrophy } from "react-icons/gi";
import { MdOutlineMonitorHeart } from "react-icons/md";
import { GrDocumentConfig } from "react-icons/gr";
import { IoIosMenu } from "react-icons/io";

function Sidebar() {
  return (
    <nav className="bg-white text-black w-64 min-h-screen shadow-lg">
      <div className="px-4 py-6">
        <ul className="space-y-4">
          <li>
            <a
              href="#"
              className="flex items-center space-x-2 text-gray-700 hover:text-black"
            >
              <GiDiamondTrophy className="text-xl" />
              <span>Configuration</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center space-x-2 text-gray-700 hover:text-black"
            >
              <MdOutlineMonitorHeart className="text-xl" />
              <span>Pricing</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center space-x-2 text-gray-700 hover:text-black"
            >
              <GrDocumentConfig className="text-xl" />
              <span>Performance</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center space-x-2 text-gray-700 hover:text-black"
            >
              <FaDocker className="text-xl" />
              <span>Docker</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
export default Sidebar;
