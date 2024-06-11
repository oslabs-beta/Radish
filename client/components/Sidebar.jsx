import React, { useState } from 'react';
import { FaDocker } from 'react-icons/fa';
import { GiDiamondTrophy } from 'react-icons/gi';
import { MdOutlineMonitorHeart } from 'react-icons/md';
import { GrDocumentConfig } from 'react-icons/gr';
import { IoIosMenu } from 'react-icons/io';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        <IoIosMenu />
      </button>
      <div className="sidebar-content">
        <ul>
          <li>
            <GrDocumentConfig className="icon" />
            <span className="label">Configuration</span>
          </li>
          <li>
            <MdOutlineMonitorHeart className="icon" />
            <span className="label">
              Performance <br /> monitor
            </span>
          </li>
          <li>
            <GiDiamondTrophy className="icon" />
            <span className="label">Benchmark</span>
          </li>
          <li>
            <FaDocker className="icon" />
            <span className="label">
              Docker <br />
              Image
              <br /> Generator
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
export default Sidebar;
