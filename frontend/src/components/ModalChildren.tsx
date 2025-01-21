import React from "react";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const ModalChildren: React.FC<ModalProps> = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <button onClick={onClose} className="absolute top-2 right-2 text-xl font-bold">X</button>
        {children}
      </div>
    </div>
  );
};

export default ModalChildren;