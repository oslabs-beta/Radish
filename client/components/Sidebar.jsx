import React, { useState } from "react";
import { FaDocker } from "react-icons/fa";
import { GiDiamondTrophy } from "react-icons/gi";
import { MdOutlineMonitorHeart } from "react-icons/md";
import { GrDocumentConfig } from "react-icons/gr";
import { IoIosMenu } from "react-icons/io";

function Sidebar() {
  return (
    <nav className="bg-gray-800 text-white w-64 min-h-screen">
      <div className="px-4 py-6">
        <ul className="space-y-4">
          <li>
            <a href="#" className="text-gray-300 hover:text-white">
              Configuration
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-300 hover:text-white">
              Pricing
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-300 hover:text-white">
              Performance
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-300 hover:text-white">
              Docker
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
export default Sidebar;
