import React from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg rounded-2xl bg-base-100 shadow-xl">
        <div className="flex items-center justify-between border-b border-base-200 px-6 py-4">
          <h3 className="text-xl font-semibold text-base-content">{title}</h3>
          <button
            onClick={onClose}
            className="text-base-content hover:text-error transition duration-150"
          >
            ✕
          </button>
        </div>
        <div className="p-6 text-base-content">{children}</div>
        {/* Uncomment jika ingin footer */}
        {/* <div className="flex justify-end border-t border-base-200 px-6 py-4">
          <button onClick={onClose} className="btn btn-neutral">Close</button>
        </div> */}
      </div>
    </div>
  );
};

export default Modal;
