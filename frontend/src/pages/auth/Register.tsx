import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [error]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (senha !== confirmPassword) {
      setError("As senhas não coincidem!");
      setIsLoading(false);
      return;
    }

    try {
      const result: any = await register({ nome, email, senha }, setError);

      if (result.message == "Usuário registrado com sucesso!") {
        toast.success("Cadastro realizado com sucesso!", {
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
            navigate("/");
          }, 1500);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} />

      <form className="w-full max-w-sm p-8 bg-white rounded-lg shadow-xl border border-gray" onSubmit={handleRegister}>
        <h1 className="text-2xl text-center text-[#4F4F4F] font-semibold mb-6">Cadastro</h1>

        <Input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} className="mb-4" maxLength={100} />
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-4" maxLength={100} />
        <Input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} className="mb-4" maxLength={100} />
        <Input type="password" placeholder="Confirmar Senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mb-6" maxLength={100} />

        <Button type="submit" className="w-full text-white bg-[#465EFF]">{isLoading ? "Carregando..." : "Cadastrar"}</Button>

        <div className="text-center mt-4">
          <span className="text-xs">Já tem uma conta? </span>
          <a href="/login" className="text-blue-500 text-xs">Faça login</a>
        </div>
      </form>
    </div>
  );
};

export default Register;