import React, { useState, useEffect } from "react";
import { getUserInfo, enableTwoFactorAuth, disableTwoFactorAuth } from "../../services/userService";
import ModalChildren from "../../components/ModalChildren";
import ModalConfirmation from "../../components/ModalConfirm";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UserSettings = () => {
    const [userInfo, setUserInfo] = useState<any>(null);
    const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [qrCodeImage, setQrCodeImage] = useState<string>("");
    let userId = localStorage.getItem("user") || "";
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserInfo();
    }, [userId]);

    const fetchUserInfo = async () => {
        setLoading(true);
        try {
            const data = await getUserInfo(userId);
            setUserInfo(data.info);
            setIsTwoFactorEnabled(data.info.is2FAEnabled);
            setLoading(false);
        } catch (error) {
            toast.error("Erro ao carregar informações do usuário");
            navigate('/error');
        }
    };

    const enableTwoFactor = async () => {
        try {
            const response = await enableTwoFactorAuth(userId);
            if (response.statusCode == 200) {
                setIsTwoFactorEnabled(true);
                setQrCodeImage(response.qrCodeUrl);
                setIsModalOpen(true);
            } else {
                toast.error("Erro ao ativar a autenticação de 2 fatores.");
            }
        } catch (error) {
            toast.error("Erro ao ativar a autenticação de 2 fatores");
        }
    };

    const disableTwoFactor = async () => {
        setIsTwoFactorEnabled(false);
    
        try {
            const response = await disableTwoFactorAuth(userId);
            if (response.statusCode !== 200) {
                setIsTwoFactorEnabled(true);
                toast.error("Erro ao desativar a autenticação de 2 fatores.");
            } else {
                setIsModalOpen(false);
                setQrCodeImage("");
                toast.success("Autenticação de 2 fatores desativada.");
            }
        } catch (error) {
            setIsTwoFactorEnabled(true);
            toast.error("Erro ao desativar a autenticação de 2 fatores.");
        }
    
        setIsConfirmModalOpen(false);
    };

    const handleSwitchChange = () => {
        if (isTwoFactorEnabled) {
            setIsConfirmModalOpen(true);
        } else {
            enableTwoFactor();
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-semibold text-center mb-6">Configurações do Usuário</h1>

            {loading && (
                <div className="flex justify-center items-center">
                    <div className="spinner-border animate-spin border-t-2 border-b-2 border-[#465EFF] rounded-full w-12 h-12"></div>
                </div>
            )}

            {userInfo && !loading && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="font-medium">Nome:</span>
                        <span>{userInfo.nome}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-medium">E-mail:</span>
                        <span>{userInfo.email}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="font-medium">Autenticação de 2 Fatores:</span>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={isTwoFactorEnabled}
                                onChange={handleSwitchChange}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <ModalChildren onClose={() => setIsModalOpen(false)}>
                    <div className="flex justify-between items-center">
                        <span className="text-xl font-semibold">Autenticação de 2 Fatores</span>
                        <button onClick={() => setIsModalOpen(false)} className="text-xl font-bold">X</button>
                    </div>
                    <div className="flex flex-col items-center justify-center mt-6">
                        <img src={qrCodeImage} alt="QR Code de 2FA" className="w-40 h-40" />
                        <p className="mt-4 text-gray-600 text-center">
                            Escaneie este código com o Google Authenticator.
                        </p>
                    </div>
                </ModalChildren>
            )}

            <ModalConfirmation
                isOpen={isConfirmModalOpen}
                Message="Tem certeza de que deseja desativar a autenticação de dois fatores?"
                labelConfirm="Desativar"
                onConfirm={disableTwoFactor}
                onCancel={() => setIsConfirmModalOpen(false)}
            />
        </div>
    );
};

export default UserSettings;
