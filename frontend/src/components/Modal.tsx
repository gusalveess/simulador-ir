import React, { ReactNode } from "react";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl font-bold text-gray-600"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold text-center mb-4">Autenticação de 2 Fatores</h2>
        
        <div className="text-xs text-gray-700">
          <ul className="list-disc pl-5 space-y-2">
            <li>Abra o aplicativo de autenticação no seu celular.</li>
            <li>Digite o código gerado no campo abaixo.</li>
            <li>O código expira em 30 segundos, então não demore.</li>
          </ul>
        </div>
        
        <div className="mt-4">
          {children}
        </div>
      </div>
    </div>
  );
};