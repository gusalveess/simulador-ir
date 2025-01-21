import { Link } from "react-router-dom";

const ErrorPage = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="text-center p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold text-red-500">Ocorreu um erro!</h1>
                <p className="mt-4 text-lg text-gray-700">
                    Não foi possível carregar os dados. Tente novamente mais tarde.
                </p>
                <div className="mt-6">
                    <Link to="/dashboard" className="text-blue-500 hover:text-blue-700">
                        Voltar para a página inicial
                    </Link>
                    <br />
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;