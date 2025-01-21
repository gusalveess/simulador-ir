import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DeclarationSpecific } from '../../interfaces/DeclarationInterface';
import { getDeclarationsSpecific } from '../../services/declarationService';

const DeclarationDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [declaration, setDeclaration] = useState<DeclarationSpecific | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const userId = localStorage.getItem("user") || "";

    const fetchDeclarationData = async () => {
        if (!id) {
            navigate("/not-found");
            return;
        }

        try {
            const response: DeclarationSpecific = await getDeclarationsSpecific(userId, id);

            if (response.userId !== userId) {
                navigate("/not-found");
                return;
            }

            setDeclaration(response);
        } catch (error) {
            console.error('Erro ao buscar os dados da declaração:', error);
            navigate("/not-found");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeclarationData();
    }, [id, userId]);

    if (loading) {
        return <div className="flex justify-center items-center">
            <div className="spinner-border animate-spin border-t-2 border-b-2 border-[#465EFF] rounded-full w-12 h-12"></div>
        </div>;
    }

    if (!declaration) {
        return <p className="text-center text-lg font-semibold text-red-500">Página não encontrada.</p>;
    }

    return (
        <div className="p-8 max-w-4xl mx-auto bg-white shadow-2xl rounded-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Declaração - {declaration.declaracao.ano}</h1>

            <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">Informações Pessoais</h2>
                <div className="grid grid-cols-2 gap-4">
                    <p><strong>Estado Civil:</strong> {declaration.declaracao.dados.estadoCivil}</p>
                    <p><strong>Número de Dependentes:</strong> {declaration.declaracao.dados.numeroDependentes}</p>
                    <p><strong>Rendimentos:</strong> R$ {declaration.declaracao.dados.rendimentos.toLocaleString()}</p>
                    <p><strong>Salário Bruto:</strong> R$ {declaration.declaracao.dados.salarioBruto.toLocaleString()}</p>
                    <p><strong>Outras Fontes:</strong> R$ {declaration.declaracao.dados.rendimentosOutrasFontes.toLocaleString()}</p>
                    <p><strong>Isentos:</strong> R$ {declaration.declaracao.dados.rendimentosIsentos.toLocaleString()}</p>
                    <p><strong>Deduções:</strong> R$ {declaration.declaracao.dados.deducoes.toLocaleString()}</p>
                    <p><strong>Bens e Direitos:</strong> R$ {declaration.declaracao.dados.bensEDireitos.toLocaleString()}</p>
                </div>
            </section>

            {declaration.declaracao.dados.imoveis.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">Imóveis</h2>
                    {declaration.declaracao.dados.imoveis.map((imovel, index) => (
                        <div key={index} className="p-4 border rounded-lg shadow-sm mb-4">
                            <p><strong>Localização:</strong> {imovel.logradouro}, {imovel.bairro}, {imovel.cidade} - {imovel.uf}</p>
                            <p><strong>CEP:</strong> {imovel.cep}</p>
                            <p><strong>Tipo:</strong> {imovel.tipoImovel}</p>
                            <p><strong>Valor de Aquisição:</strong> R$ {imovel.valorAquisicao.toLocaleString()}</p>
                            <p><strong>Ano de Aquisição:</strong> {imovel.anoAquisicao}</p>
                        </div>
                    ))}
                </section>
            )}

            {declaration.declaracao.dados.veiculos.length > 0 && (
                <section>
                    <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">Veículos</h2>
                    {declaration.declaracao.dados.veiculos.map((veiculo, index) => (
                        <div key={index} className="p-4 border rounded-lg shadow-sm mb-4">
                            <p><strong>Marca:</strong> {veiculo.marca}</p>
                            <p><strong>Modelo:</strong> {veiculo.modelo}</p>
                            <p><strong>Placa:</strong> {veiculo.placa}</p>
                            <p><strong>Ano:</strong> {veiculo.anoVeiculo}</p>
                            <p><strong>Valor de Aquisição:</strong> R$ {veiculo.valorAquisicao.toLocaleString()}</p>
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
};

export default DeclarationDetails;
