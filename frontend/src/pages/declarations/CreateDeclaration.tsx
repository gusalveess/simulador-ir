import React, { useState, useEffect } from 'react';
import { NumericFormat } from 'react-number-format';
import SaveIcon from '@mui/icons-material/Save';
import { sendDeclaration, updateDeclaration } from '../../services/declarationService';
import { useParams } from 'react-router-dom';
import { Imoveis, Veiculos, DeclarationSpecific, DeclarationData } from '../../interfaces/DeclarationInterface';
import { getDeclarationsSpecific } from '../../services/declarationService';
import { useNavigate } from 'react-router-dom';
import { Fields, FieldsImoveis, FieldsVeiculos } from '../../utils/fields';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatCEP, formatPlaca } from '../../utils/format';
import { ToastContainer, Bounce, toast } from "react-toastify";
import ModalConfirmation from '../../components/ModalConfirm';

const CreateDeclaration: React.FC = () => {
    const [declaration, setDeclaration] = useState<DeclarationSpecific | null>(null);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const imoveisLength = declaration?.declaracao?.dados?.imoveis?.length ?? 0
    const veiculosLength = declaration?.declaracao?.dados?.imoveis?.length ?? 0
    const [isSaving, setIsSaving] = useState(false);
    const [estadoCivil, setEstadoCivil] = useState(declaration?.declaracao.dados.estadoCivil ?? "");
    const [numeroDependentes, setNumeroDependentes] = useState(declaration?.declaracao.dados.numeroDependentes ?? 0);
    const [rendimentos, setRendimentos] = useState(declaration?.declaracao.dados.rendimentos ?? 0);
    const [salarioBruto, setSalarioBruto] = useState(declaration?.declaracao.dados.salarioBruto ?? 0);
    const [rendimentosOutrasFontes, setRendimentosOutrasFontes] = useState(declaration?.declaracao.dados.rendimentosOutrasFontes ?? 0);
    const [rendimentosIsentos, setRendimentosIsentos] = useState(declaration?.declaracao.dados.rendimentosIsentos ?? 0);
    const [deducoes, setDeducoes] = useState(declaration?.declaracao.dados.deducoes ?? 0);
    const [despesasMedicas, setDespesasMedicas] = useState(declaration?.declaracao.dados.despesasMedicas ?? 0);
    const [despesasEducacao, setDespesasEducacao] = useState(declaration?.declaracao.dados.despesasEducacao ?? 0);
    const [pensaoAlimenticia, setPensaoAlimenticia] = useState(declaration?.declaracao.dados.pensaoAlimenticia ?? 0);
    const [previdenciaPrivada, setPrevidenciaPrivada] = useState(declaration?.declaracao.dados.previdenciaPrivada ?? 0);
    const [bensEDireitos, setBensEDireitos] = useState(declaration?.declaracao.dados.bensEDireitos ?? 0);
    const [showImoveis, setShowImoveis] = useState(imoveisLength > 0);
    const [showVeiculos, setShowVeiculos] = useState(veiculosLength > 0);
    const [Imoveis, setImoveis] = useState<Imoveis[]>(declaration?.declaracao.dados.imoveis ?? []);
    const [Veiculos, setVeiculos] = useState<Veiculos[]>(declaration?.declaracao.dados.veiculos ?? []);
    const [formData, setFormData] = useState<{
        [key: string]: string | number;
    }>({
        cep: '',
        logradouro: '',
        bairro: '',
        cidade: '',
        uf: '',
        tipoImovel: '',
        valorAquisicao: 0,
        anoAquisicao: '',
    });

    const [formDataVeiculos, setFormDataVeiculos] = useState<{
        [key: string]: string | number;
    }>({
        marca: '',
        modelo: '',
        placa: '',
        valorAquisicao: 0,
        anoAquisicao: '',
    });

    let userId = localStorage.getItem("user") || "";
    const { id } = useParams<{ id?: string }>();
    const declarationId = id || "";
    const navigate = useNavigate();

    const returnData = () => {
        const updatedData: DeclarationData = {
            estadoCivil,
            numeroDependentes,
            rendimentos,
            salarioBruto,
            rendimentosOutrasFontes,
            rendimentosIsentos,
            deducoes,
            despesasMedicas,
            despesasEducacao,
            pensaoAlimenticia,
            previdenciaPrivada,
            bensEDireitos,
            imoveis: Imoveis,
            veiculos: Veiculos
        };

        return updatedData
    };




    useEffect(() => {
        fetchDeclarationData();
    }, [id, userId]);

    useEffect(() => {
        if (declaration?.declaracao.dados) {
            setEstadoCivil(declaration.declaracao.dados.estadoCivil ?? "");
            setNumeroDependentes(declaration.declaracao.dados.numeroDependentes ?? 0);
            setRendimentos(declaration.declaracao.dados.rendimentos ?? 0);
            setSalarioBruto(declaration.declaracao.dados.salarioBruto ?? 0);
            setRendimentosOutrasFontes(declaration.declaracao.dados.rendimentosOutrasFontes ?? 0);
            setRendimentosIsentos(declaration.declaracao.dados.rendimentosIsentos ?? 0);
            setDeducoes(declaration.declaracao.dados.deducoes ?? 0);
            setDespesasMedicas(declaration.declaracao.dados.despesasMedicas ?? 0);
            setDespesasEducacao(declaration.declaracao.dados.despesasEducacao ?? 0);
            setPensaoAlimenticia(declaration.declaracao.dados.pensaoAlimenticia ?? 0);
            setPrevidenciaPrivada(declaration.declaracao.dados.previdenciaPrivada ?? 0);
            setBensEDireitos(declaration.declaracao.dados.bensEDireitos ?? 0);
            setImoveis(declaration.declaracao.dados.imoveis ?? []);
            setVeiculos(declaration.declaracao.dados.veiculos ?? []);
            setShowImoveis(declaration.declaracao.dados.imoveis?.length > 0);
            setShowVeiculos(declaration.declaracao.dados.veiculos?.length > 0);
        }
    }, [declaration]);

    const handleSave = async () => {
        if (isSaving) return;

        setIsSaving(true);
        const data = returnData();

        try {
                await updateDeclaration(userId, declarationId, data);
                toast.success('Declaração salva com sucesso.', {
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
                setIsModalOpen(false);
        } catch (error) {
            toast.error('Erro ao salvar declaração', {
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
            setIsModalOpen(false);
        } finally {
            setIsSaving(false);
        }
    };


    const handleCancelFill = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async () => {
        const data = returnData();

        try {
                await sendDeclaration(userId, declarationId, data);
                toast.success('Declaração enviada com sucesso.', {
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
                setIsModalOpen(false);
                navigate("/dashboard")
        } catch (error) {
            toast.error('Erro ao salvar declaração', {
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
            setIsModalOpen(false);
        }
    };

    const handleDeleteImovel = (cep: string, logradouro: string) => {
        const updatedImoveis = Imoveis.filter(imovel => imovel.cep !== cep || imovel.logradouro !== logradouro);
        setImoveis(updatedImoveis);
    };

    const handleDeleteVeiculo = (placa: string) => {
        const updatedVeiculos = Veiculos.filter(veiculo => veiculo.placa !== placa);
        setVeiculos(updatedVeiculos);
    };

    const handleFormSubmitGridImoveis = (formData: FormData) => {
        const novoImovel: Imoveis = {
            cep: formData.get("cep") as string,
            logradouro: formData.get("logradouro") as string,
            bairro: formData.get("bairro") as string,
            cidade: formData.get("cidade") as string,
            uf: formData.get("uf") as string,
            tipoImovel: formData.get("tipoImovel") as string,
            valorAquisicao: parseFloat(formData.get("valorAquisicao") as string),
            anoAquisicao: parseInt(formData.get("anoAquisicao") as string, 10),
        };

        setFormData({
            cep: '',
            logradouro: '',
            bairro: '',
            cidade: '',
            uf: '',
            tipoImovel: '',
            valorAquisicao: 0,
            anoAquisicao: '',
        });

        setImoveis([...Imoveis, novoImovel]);
    };

    const handleFormSubmitGridVeiculos = (formData: FormData) => {
        const novoVeiculo: Veiculos = {
            marca: formData.get("marca") as string,
            modelo: formData.get("modelo") as string,
            placa: formData.get("placa") as string,
            anoVeiculo: parseInt(formData.get("anoVeiculo") as string, 10),
            valorAquisicao: parseFloat(formData.get("valorAquisicao") as string),
        };

        setFormDataVeiculos({
            marca: '',
            modelo: '',
            placa: '',
            valorAquisicao: 0,
            anoVeiculo: '',
        });

        setVeiculos([...Veiculos, novoVeiculo]);
    };

    const objectToFormData = (obj: { [key: string]: string | number }): FormData => {
        const formData = new FormData();

        Object.keys(obj).forEach(key => {
            formData.append(key, obj[key].toString());
        });

        return formData;
    };

    const handlePlacaChange = (value: string) => {
        const formattedPlaca = formatPlaca(value)

        handleInputChangeVeiculos('placa', formattedPlaca);
    };

    const handleInputChangeVeiculos = (field: string, value: any) => {
        setFormDataVeiculos((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    }

    const fetchDeclarationData = async () => {
        if (!id) {
            navigate("/not-found");
            return;
        }

        try {
            setLoading(true);
            const response: DeclarationSpecific = await getDeclarationsSpecific(userId, id);

            if (response.userId !== userId) {
                navigate("/not-found");
                return;
            }

            setDeclaration(response);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Erro ao buscar os dados da declaração:', error);
            toast.error('Erro ao buscar os dados da declaração:', {
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
            navigate("/not-found");
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handleCepChange = (value: string) => {
        const formattedCep = formatCEP(value);
        handleInputChange('cep', formattedCep);
    };

    return (
        <>
            <div className="p-6 bg-white rounded-md max-w-3xl mx-auto">

                {loading && (
                    <div className="flex justify-center items-center">
                        <div className="spinner-border animate-spin border-t-2 border-b-2 border-[#465EFF] rounded-full w-12 h-12"></div>
                    </div>
                )}
                {
                    !loading && (
                        <>
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

                            <h2 className="text-2xl font-bold mb-6">Preencher Declaração</h2>

                            <form>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label htmlFor="ano" className="block text-sm font-medium text-gray-700">Ano</label>
                                        <input
                                            type="text"
                                            id="ano"
                                            value={declaration?.declaracao.ano}
                                            onChange={(e) => handleInputChange('ano', e.target.value)}
                                            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                                            disabled={true}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="estadoCivil" className="block text-sm font-medium text-gray-700">Estado Civil</label>
                                        <select
                                            value={estadoCivil}
                                            onChange={(e) => setEstadoCivil(e.target.value)}
                                            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                                            required
                                        >
                                            <option value="" disabled>Selecione o estado civil</option>
                                            <option value="Solteiro">Solteiro</option>
                                            <option value="Casado">Casado</option>
                                            <option value="Divorciado">Divorciado</option>
                                            <option value="Viúvo">Viúvo</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="numeroDependentes" className="block text-sm font-medium text-gray-700">Número de Dependentes</label>
                                        <input
                                            type="number"
                                            value={numeroDependentes}
                                            onChange={(e) => setNumeroDependentes(Number(e.target.value))}
                                            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                                            required
                                            min={0}
                                        />
                                    </div>

                                    {Fields.map((fieldName) => {
                                        const currentValue = declaration?.declaracao.dados[fieldName.field];
                                        const setValueFunc = eval(`set${fieldName.field.charAt(0).toUpperCase() + fieldName.field.slice(1)}`);

                                        return (
                                            <div key={fieldName.field}>
                                                <label htmlFor={fieldName.field} className="block text-sm font-medium text-gray-700">{fieldName.name}</label>
                                                <NumericFormat
                                                    value={typeof currentValue === "number" ? currentValue : 0}
                                                    onValueChange={(values) => setValueFunc(values.floatValue)}
                                                    thousandSeparator="."
                                                    decimalSeparator=","
                                                    prefix="R$ "
                                                    className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                                                    decimalScale={2}
                                                    fixedDecimalScale={true}
                                                    required
                                                />
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex items-center gap-2 pb-4">
                                    <label htmlFor="imoveis" className="text-sm font-medium text-gray-700">Possui imóveis em seu nome?</label>
                                    <input
                                        type="checkbox"
                                        checked={showImoveis}
                                        onChange={(e) => setShowImoveis(e.target.checked)}
                                    />
                                </div>

                                {showImoveis && (
                                    <>
                                        <form>
                                            <div className="grid grid-cols-2 gap-4">
                                                {FieldsImoveis.map((fieldName) => {
                                                    const currentValue = formData[fieldName.field];

                                                    return (
                                                        <div key={fieldName.field} className="flex flex-col">
                                                            <label
                                                                htmlFor={fieldName.field}
                                                                className="block text-sm font-medium text-gray-700"
                                                            >
                                                                {fieldName.name}
                                                            </label>

                                                            {fieldName.field === "valorAquisicao" ? (
                                                                <NumericFormat
                                                                    value={typeof currentValue === "number" ? currentValue : 0}
                                                                    onValueChange={(values) => handleInputChange(fieldName.field, values.floatValue)}
                                                                    thousandSeparator="."
                                                                    decimalSeparator=","
                                                                    prefix="R$ "
                                                                    className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                                                                    decimalScale={2}
                                                                    fixedDecimalScale={true}
                                                                    allowNegative={false}
                                                                    required
                                                                    maxLength={fieldName.maxLength}
                                                                />
                                                            ) : fieldName.field == "tipoImovel" ? <select
                                                                value={currentValue}
                                                                onChange={(e) => handleInputChange(fieldName.field, e.target.value)}
                                                                className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                                                                required
                                                            >
                                                                <option value="" disabled>Selecione o tipo de imóvel</option>
                                                                <option value="Casa">Casa</option>
                                                                <option value="Apartamento">Apartamento</option>
                                                                <option value="Sobrado">Sobrado</option>
                                                                <option value="Kitnet">Kitnet</option>
                                                                <option value="Outros">Outros</option>
                                                            </select> : (
                                                                <input
                                                                    id={fieldName.field}
                                                                    value={currentValue}
                                                                    onChange={(e) => {
                                                                        if (fieldName.field === "cep") {
                                                                            handleCepChange(e.target.value);
                                                                        } else if (fieldName.field == "anoAquisicao") {
                                                                            const newValue = e.target.value.replace(/\D/g, '')
                                                                            handleInputChange(fieldName.field, newValue);
                                                                        } else if (fieldName.field != "logradouro" && fieldName.field !== "anoAquisicao") {
                                                                            const newValue = e.target.value.replace(/[0-9]/g, '');
                                                                            handleInputChange(fieldName.field, newValue);
                                                                        } else {
                                                                            handleInputChange(fieldName.field, e.target.value);
                                                                        }
                                                                    }}
                                                                    className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                                                                    placeholder={`Digite ${fieldName.name}`}
                                                                    maxLength={fieldName.maxLength}
                                                                    required
                                                                />
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="mt-4 flex justify-start">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        handleFormSubmitGridImoveis(objectToFormData(formData));
                                                    }}
                                                    className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                                >
                                                    Adicionar
                                                </button>
                                            </div>
                                        </form>

                                        <div className="mt-4 pb-4">
                                            <label htmlFor="imoveisDetails" className="block text-sm font-medium text-gray-700 pb-2.5">Detalhes dos Imóveis</label>
                                            <table className="w-full border border-gray-300 text-center">
                                                <thead>
                                                    <tr className="bg-[#465EFF] text-white">
                                                        <th className="py-2 px-4">CEP</th>
                                                        <th className="py-2 px-4">Logradouro</th>
                                                        <th className="py-2 px-4">Ações</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Imoveis.map((dec: Imoveis) => (
                                                        <tr key={dec.cep} className="border-t border-gray-300">
                                                            <td className="py-2 px-4">{dec.cep}</td>
                                                            <td className="py-2 px-4">{dec.logradouro}</td>
                                                            <td className="py-2 px-4 flex justify-center gap-2">
                                                                <button onClick={() => handleDeleteImovel(dec.cep, dec.logradouro)}>
                                                                    <DeleteIcon className="text-[#FF6B6B]" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}

                                <div className="flex items-center gap-2 pb-4">
                                    <label htmlFor="veiculos" className="text-sm font-medium text-gray-700">Possui veículos em seu nome?</label>
                                    <input
                                        type="checkbox"
                                        checked={showVeiculos}
                                        onChange={(e) => setShowVeiculos(e.target.checked)}
                                    />
                                </div>

                                {showVeiculos && (
                                    <>
                                        <form>
                                            <div className="grid grid-cols-2 gap-4">
                                                {FieldsVeiculos.map((fieldName) => {
                                                    const currentValue = formDataVeiculos[fieldName.field];

                                                    return (
                                                        <div key={fieldName.field} className="flex flex-col">
                                                            <label
                                                                htmlFor={fieldName.field}
                                                                className="block text-sm font-medium text-gray-700"
                                                            >
                                                                {fieldName.name}
                                                            </label>

                                                            {fieldName.field === "valorAquisicao" ? (
                                                                <NumericFormat
                                                                    value={typeof currentValue === "number" ? currentValue : 0}
                                                                    onValueChange={(values) => handleInputChangeVeiculos(fieldName.field, values.floatValue)}
                                                                    thousandSeparator="."
                                                                    decimalSeparator=","
                                                                    prefix="R$ "
                                                                    className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                                                                    decimalScale={2}
                                                                    fixedDecimalScale={true}
                                                                    allowNegative={false}
                                                                    required
                                                                    maxLength={fieldName.maxLength}
                                                                />
                                                            ) : (
                                                                <input
                                                                    id={fieldName.field}
                                                                    value={currentValue}
                                                                    onChange={(e) => {
                                                                        fieldName.field === "placa" ?
                                                                            handlePlacaChange(e.target.value)
                                                                            : fieldName.field === "anoVeiculo" ?
                                                                                handleInputChangeVeiculos(fieldName.field, e.target.value.replace(/\D/g, ''))
                                                                                :
                                                                                handleInputChangeVeiculos(fieldName.field, e.target.value);

                                                                    }}
                                                                    className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                                                                    placeholder={`Digite ${fieldName.name}`}
                                                                    maxLength={fieldName.maxLength}
                                                                    required
                                                                />
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="mt-4 flex justify-start">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        handleFormSubmitGridVeiculos(objectToFormData(formDataVeiculos));
                                                    }}
                                                    className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                                >
                                                    Adicionar
                                                </button>
                                            </div>
                                        </form>

                                        <div className="mt-4 pb-4">
                                            <label htmlFor="veiculosDetails" className="block text-sm font-medium text-gray-700 pb-2.5">Detalhes dos Veículos</label>
                                            <table className="w-full border border-gray-300 text-center">
                                                <thead>
                                                    <tr className="bg-[#465EFF] text-white">
                                                        <th className="py-2 px-4">Marca</th>
                                                        <th className="py-2 px-4">Modelo</th>
                                                        <th className="py-2 px-4">Placa</th>
                                                        <th className="py-2 px-4">Ações</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Veiculos.map((veiculo) => (
                                                        <tr key={veiculo.placa} className="border-t border-gray-300">
                                                            <td className="py-2 px-4">{veiculo.marca}</td>
                                                            <td className="py-2 px-4">{veiculo.modelo}</td>
                                                            <td className="py-2 px-4">{veiculo.placa}</td>
                                                            <td className="py-2 px-4 flex justify-center gap-2">
                                                                <button onClick={() => handleDeleteVeiculo(veiculo.placa)}>
                                                                    <DeleteIcon className="text-[#FF6B6B]" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}

                                <div className="flex justify-between items-center mt-6">
                                    <div>
                                        <button
                                            type="button"
                                            onClick={handleSave}
                                            className="px-4 py-2 bg-green-500 text-white rounded-md flex items-center hover:bg-green-600"
                                        >
                                            {isSaving ? (
                                                <p>Salvando...</p>
                                            ) : (
                                                <div className='flex justify-around'>
                                                    <SaveIcon />
                                                    <p>Salvar</p>
                                                </div>
                                            )}
                                        </button>
                                    </div>

                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(true)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center"
                                        >
                                            Enviar
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </>
                    )
                }



            </div>

            <ModalConfirmation
                isOpen={isModalOpen}
                Message={"Deseja enviar a declaração anual?"}
                labelConfirm="Enviar"
                onConfirm={handleSubmit}
                onCancel={handleCancelFill}
            />
        </>
    );
};

export default CreateDeclaration;