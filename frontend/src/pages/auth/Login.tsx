import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { Modal } from "../../components/Modal";
import { ToastContainer, Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [twoFaCode, setTwoFaCode] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (user && token) {
            setIsLoggedIn(true);
        }
    }, []);

    useEffect(() => {
        if (error) {
            toast.error(error, {
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

            const timeoutId = setTimeout(() => {
                setError(null);
            }, 5000);

            return () => clearTimeout(timeoutId);
        }
    }, [error]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await login(email, password, setError);
            if (typeof result === "string" && result === "Código de 2FA obrigatório.") {
                setIsModalOpen(true);
            } else {
                    navigate("/dashboard");
                }
            
        } catch (error: any) {
            setError("Erro no login");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit2FA = async () => {
        setIsLoading(true);
        try {
            await login(email, password, setError, twoFaCode);

            toast.success("Login realizado com sucesso!", {
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
        
              setTimeout(() => {
                navigate("/dashboard");
              }, 5000);
        } catch (error) {
            setError("Código 2FA inválido");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoggedIn) {
        navigate("/dashboard");
        return null;
    }

    return (
        <div className="flex justify-center items-center h-screen bg-white">

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

            <form
                className="w-full max-w-sm p-8 bg-white rounded-lg shadow-xl border border-gray"
                onSubmit={handleLogin}
            >
                <h1 className="text-2xl text-center text-[#4F4F4F] font-semibold mb-6">Login</h1>

                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mb-4"
                    maxLength={100}
                />
                <Input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-6"
                    maxLength={100}
                />

                <Button type="submit" className="w-full text-white bg-[#465EFF]">
                    {isLoading ? "Carregando..." : "Entrar"}
                </Button>

                <div className="text-center mt-4">
                    <span className="text-xs">Não tem uma conta? </span>
                    <a href="/register" className="text-blue-500 text-xs">Registre-se</a>
                </div>
            </form>

            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <h2 className="text-xl mb-4 text-[#4F4F4F]">Código de Autenticação</h2>
                    <Input
                        type="text"
                        placeholder="Digite o código de 2FA"
                        value={twoFaCode}
                        onChange={(e) => setTwoFaCode(e.target.value)}
                        className="mb-4"
                        maxLength={6}
                    />
                    <Button type="submit" onClick={handleSubmit2FA} className="w-full text-white bg-[#465EFF]">
                        Entrar
                    </Button>
                </Modal>
            )}
        </div>
    );
};

export default Login;