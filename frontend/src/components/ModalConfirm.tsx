import React from 'react';

interface ModalProps {
    isOpen: boolean;
    Message: string;
    labelConfirm: string
    onConfirm: () => void;
    onCancel: () => void;
}

const ModalConfirmation: React.FC<ModalProps> = ({ isOpen, Message, labelConfirm,onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg max-w-lg w-full shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">
                    {Message}
                </h3>
                <div className="flex justify-around mt-4">
                    <button
                        onClick={onCancel}
                        className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg text-lg hover:bg-gray-300 transition duration-200"
                    >
                        Não, obrigado
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition duration-200"
                    >
                        {labelConfirm}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalConfirmation;