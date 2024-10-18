/* eslint-disable react/prop-types */
import { useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-blue-400 p-5 h-full w-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-mono text-gray-600 font-bold">Predict</h1>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-600">
            <i className={`fa-solid ${isOpen ? 'fa-times' : 'fa-bars'}`} style={{ fontSize: '24px' }}></i>
          </button>
        </div>
        <ul
          className={`md:flex md:flex-row font-mono font-medium md:gap-8 md:items-center md:ml-auto md:static absolute inset-0 bg-blue-400 p-5 md:p-0 transition-transform transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          {isOpen && (
            <div className="absolute top-4 right-4">
              <button onClick={toggleMenu} className="text-gray-600">
                <i className="fa-solid fa-times" style={{ fontSize: '24px' }}></i>
              </button>
            </div>
          )}
          <li className="hover:text-blue-50 py-2 md:py-0">
            <a href="https://imagesharvest.my.id" onClick={() => setIsOpen(false)}>
              ImagesHarvest
            </a>
          </li>
          <li className="hover:text-blue-50 py-2 md:py-0">
            <a href="https://inspirablog.web.id" onClick={() => setIsOpen(false)}>
              InspiraBlog
            </a>
          </li>
          <li className="hover:text-blue-50 py-2 md:py-0">
            <a href="https://al-quranonline.web.id" onClick={() => setIsOpen(false)}>
              MyQuran
            </a>
          </li>
          <li className="hover:text-blue-50 py-2 md:py-0">
            <a href="http://blog.digitaldev.web.id" onClick={() => setIsOpen(false)}>
              Blog
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
