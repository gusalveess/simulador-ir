import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createDeclaration, getDeclarations } from "../services/declarationService";
import LOGO from '../../public/LOGO.png';
import { ToastContainer, Bounce, toast } from "react-toastify";
import ModalConfirmation from "./ModalConfirm";
import { Declaration } from "../interfaces/DeclarationInterface";

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const [dados, setDados] = useState({
        estadoCivil: null,
        numeroDependentes: null,
        rendimentos: null,
        salarioBruto: null,
        rendimentosOutrasFontes: null,
        rendimentosIsentos: null,
        deducoes: null,
        despesasMedicas: null,
        despesasEducacao: null,
        pensaoAlimenticia: null,
        previdenciaPrivada: null,
        bensEDireitos: null,
        imoveis: [],
        veiculos: []
    });
    const [declarations, setDeclarations] = useState<Declaration[]>([]);
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMenuAccountOpen, setIsMenuAccountOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDeclaration, setCurrentDeclaration] = useState(false)
    const navigate = useNavigate();
    let userId = localStorage.getItem("user") || "";

    useEffect(() => {
        if (user) {
            fetchDeclarations();
        }
    }, [user, location.pathname]);


    const fetchDeclarations = async () => {
        try {
            const data = await getDeclarations(userId);
    
            const declarations = data?.declaracoes ?? [];
    
            setDeclarations(declarations);
    
            const currentYear = new Date().getFullYear();
            const currentDecl = declarations.find((decl: Declaration) => decl.ano === currentYear);
    
            if (currentDecl) {
                setCurrentDeclaration(true);
            }
        } catch (error) {
            navigate("/error");
        }
    };

    

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate("/");
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleMenuAccount = () => {
        setIsMenuAccountOpen(!isMenuAccountOpen);
    };

    const handleFillDeclaration = () => {
        setIsModalOpen(true);
    };

    const handleConfirmFill = async () => {
        try {
            const data = {
                ano: new Date().getFullYear(),
                dados: dados
            };

            const response: any = await createDeclaration(userId, data);
            navigate(`/create-declaration/${response.data.declaracao.id}`);
        } catch (error) {
            console.error("Erro ao criar declaração", error);
            alert("Houve um erro ao criar a declaração. Tente novamente mais tarde.");
        }
        setIsModalOpen(false);
    };

    const handleCancelFill = () => {
        setIsModalOpen(false);
    };

    return (
        <nav className="bg-[#465EFF] p-4">
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <button onClick={() => navigate("/")} className="text-white text-2xl font-bold">
                    <img src={LOGO} alt="SimuladorIR Logo" />
                </button>

                <div className="hidden md:flex space-x-6">
                    {user ? (
                        <>
                            <button onClick={() => {
                                console.log(currentDeclaration)
                                if (!currentDeclaration) {
                                    handleFillDeclaration();
                                } else {
                                    toast.info('Já existe uma declaração preenchida para este ano.', {
                                        position: "top-center",
                                        autoClose: 5000,
                                        hideProgressBar: false,
                                        closeOnClick: false,
                                        pauseOnHover: true,
                                        draggable: true,
                                        progress: undefined,
                                        theme: "light",
                                        transition: Bounce,
                                    });
                                }
                            }} className="text-white hover:text-[#F5F5F5] font-black">
                                Preenchimento
                            </button>
                            <button onClick={() => navigate("/dashboard")} className="text-white hover:text-[#F5F5F5] font-black">
                                Histórico
                            </button>
                            <div className="relative">
                                <button onClick={() => toggleMenuAccount()} className="text-white hover:text-[#F5F5F5] font-black">
                                    Minha Conta
                                </button>
                                {isMenuAccountOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-lg overflow-hidden">
                                        <button onClick={() => { navigate("/user-settings"); setIsMenuAccountOpen(false) }} className="block w-full px-4 py-2 text-black hover:bg-[#F5F5F5] transition duration-200">
                                            Configurações
                                        </button>
                                        <button onClick={handleLogout} className="block w-full px-4 py-2 text-black hover:bg-[#F5F5F5] transition duration-200">
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <button onClick={() => navigate("/")} className="bg-[#FFED2F] text-[#576EF8] px-6 py-2 rounded-lg hover:bg-[#333333] font-black transition duration-200">
                                Login
                            </button>
                            <button onClick={() => navigate("/register")} className="bg-[#FFED2F] text-[#576EF8] px-6 py-2 rounded-lg hover:bg-[#333333] font-black transition duration-200">
                                Cadastro
                            </button>
                        </>
                    )}
                </div>

                <div className="md:hidden flex items-center">
                    <button onClick={toggleMenu} className="text-white text-4xl">
                        ☰
                    </button>
                    {isMenuOpen && (
                        <>
                            <div onClick={() => setIsMenuOpen(false)} className="fixed inset-0 bg-black opacity-50 z-10"></div>
                            <div className="absolute top-16 right-0 bg-[#465EFF] shadow-xl p-4 w-52 rounded-lg z-20">
                                {user ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                if (!currentDeclaration) {
                                                    handleFillDeclaration();
                                                } else {
                                                    toast.info('Já existe uma declaração preenchida para este ano.', {
                                                        position: "top-center",
                                                        autoClose: 5000,
                                                        hideProgressBar: false,
                                                        closeOnClick: false,
                                                        pauseOnHover: true,
                                                        draggable: true,
                                                        progress: undefined,
                                                        theme: "light",
                                                        transition: Bounce,
                                                    });
                                                }
                                            }}
                                            className="block px-4 py-2 text-white hover:bg-[#F5F5F5] transition duration-200 rounded-lg"
                                        >
                                            Preenchimento
                                        </button>
                                        <button onClick={() => { navigate("/dashboard"); setIsMenuOpen(false); }} className="block px-4 py-2 text-white hover:bg-[#F5F5F5] transition duration-200 rounded-lg">
                                            Histórico
                                        </button>
                                        <button onClick={() => { navigate("/user-settings"); setIsMenuOpen(false); }} className="block px-4 py-2 text-white hover:bg-[#F5F5F5] transition duration-200 rounded-lg">
                                            Configurações
                                        </button>
                                        <button onClick={handleLogout} className="block px-4 py-2 text-white hover:bg-[#F5F5F5] transition duration-200 rounded-lg">
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => { navigate("/"); setIsMenuOpen(false); }} className="block px-4 py-2 text-white hover:bg-[#F5F5F5] transition duration-200 rounded-lg">
                                            Login
                                        </button>
                                        <button onClick={() => { navigate("/register"); setIsMenuOpen(false); }} className="block px-4 py-2 text-white hover:bg-[#F5F5F5] transition duration-200 rounded-lg">
                                            Cadastro
                                        </button>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <ModalConfirmation
                isOpen={isModalOpen}
                Message={"Deseja iniciar o preenchimento da declaração anual?"}
                labelConfirm="Sim, iniciar"
                onConfirm={handleConfirmFill}
                onCancel={handleCancelFill}
            />
        </nav>
    );
};

export default Navbar;