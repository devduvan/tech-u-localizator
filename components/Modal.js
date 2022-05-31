import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

const Modal = ({ show, onClose, onCreate, children, title }) => {
  
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleCloseClick = (e) => {
    e.preventDefault();
    onClose();
  };

  const handleCreateClick = (e) => {
    e.preventDefault();
    onCreate({
      name: document.getElementById("name").value,
      jobTitle: document.getElementById("jobTitle").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
    });
    onClose();
  };

  const modalContent = show ? (
    <dh-component>
      <div className="py-12 bg-gray-700 transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0" id="modal">
          <div role="alert" className="container mx-auto w-11/12 md:w-2/3 max-w-lg">
              <div className="relative py-8 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400">
                  <label htmlFor="name" className="text-gray-800 text-sm font-bold leading-tight tracking-normal">Name</label>
                  <input id="name" required className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-orange-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="Duvan" />
                  <label htmlFor="name" className="text-gray-800 text-sm font-bold leading-tight tracking-normal">Job Title</label>
                  <input id="jobTitle" className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-orange-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="Pro serve" />
                  <label htmlFor="name" className="text-gray-800 text-sm font-bold leading-tight tracking-normal">Address</label>
                  <input id="address" className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-orange-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="Dg 4b # 31 - 20" />
                  <label htmlFor="name" className="text-gray-800 text-sm font-bold leading-tight tracking-normal">City</label>
                  <input id="city" className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-orange-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="Zipaquirá" />
                  <div className="flex items-center justify-start w-full">
                      <button className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-700 transition duration-150 ease-in-out hover:bg-orange-600 bg-orange-700 rounded text-white px-8 py-2 text-sm" onClick={handleCreateClick}>Create</button>
                      <button className="focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-gray-400 ml-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm"  onClick={handleCloseClick}>Cancel</button>
                  </div>
                  <button className="cursor-pointer absolute top-0 right-0 mt-4 mr-5 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out rounded focus:ring-2 focus:outline-none focus:ring-gray-600" onClick={handleCloseClick} aria-label="close modal" role="button">
                      <svg  xmlns="http://www.w3.org/2000/svg"  className="icon icon-tabler icon-tabler-x" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" />
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                  </button>
              </div>
          </div>
      </div>  
    </dh-component>
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-root")
    );
  } else {
    return null;
  }
};

export default Modal;