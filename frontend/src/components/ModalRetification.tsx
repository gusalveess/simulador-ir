import React, { useState } from 'react';
import { updateDeclaration } from '../services/declarationService';
import CloseIcon from '@mui/icons-material/Close';
import { Imoveis, Veiculos, DeclarationData } from '../interfaces/DeclarationInterface';
import { NumericFormat } from 'react-number-format';
import { Fields, FieldsImoveis, FieldsVeiculos } from '../utils/fields';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatCEP, formatCurrency, formatPlaca } from '../utils/format';

interface ModalRetificationProps {
    declarationData: DeclarationData;
    userId: string,
    Year: string
    declarationId: string,
    onClose: any;
}

const ModalRetification: React.FC<ModalRetificationProps> = ({ declarationData, userId, Year, declarationId, onClose }) => {

    const [estadoCivil, setEstadoCivil] = useState(declarationData.estadoCivil);
    const [numeroDependentes, setNumeroDependentes] = useState(declarationData.numeroDependentes);
    const [rendimentos, setRendimentos] = useState(declarationData.rendimentos);
    const [salarioBruto, setSalarioBruto] = useState(declarationData.salarioBruto);
    const [rendimentosOutrasFontes, setRendimentosOutrasFontes] = useState(declarationData.rendimentosOutrasFontes);
    const [rendimentosIsentos, setRendimentosIsentos] = useState(declarationData.rendimentosIsentos);
    const [deducoes, setDeducoes] = useState(declarationData.deducoes);
    const [despesasMedicas, setDespesasMedicas] = useState(declarationData.despesasMedicas);
    const [despesasEducacao, setDespesasEducacao] = useState(declarationData.despesasEducacao);
    const [pensaoAlimenticia, setPensaoAlimenticia] = useState(declarationData.pensaoAlimenticia);
    const [previdenciaPrivada, setPrevidenciaPrivada] = useState(declarationData.previdenciaPrivada);
    const [bensEDireitos, setBensEDireitos] = useState(declarationData.bensEDireitos);
    const [showImoveis, setShowImoveis] = useState(declarationData.imoveis.length > 0);
    const [showVeiculos, setShowVeiculos] = useState(declarationData.veiculos.length > 0);
    const [Imoveis, setImoveis] = useState<Imoveis[]>(declarationData.imoveis);
    const [Veiculos, setVeiculos] = useState<Veiculos[]>(declarationData.veiculos);
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

    const handleFormSubmit = async () => {
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

        await updateDeclaration(userId, declarationId, updatedData);
        onClose(false);
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

    const handleCepChange = (value: string) => {
        const formattedCep = formatCEP(value)
        handleInputChange('cep', formattedCep);
    };

    const handlePlacaChange = (value: string) => {
        const formattedPlaca = formatPlaca(value)

        handleInputChangeVeiculos('placa', formattedPlaca);
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handleInputChangeVeiculos = (field: string, value: any) => {
        setFormDataVeiculos((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md w-[90%] sm:w-[80%] md:w-[60%] max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Retificar Declaração</h2>
                    <button onClick={() => onClose(false)} className="text-xl text-gray-500">
                        <CloseIcon />
                    </button>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="ano" className="block text-sm font-medium text-gray-700">Ano</label>
                            <p className="w-full mt-2 p-2 rounded-md">
                                {Year}
                            </p>
                        </div>

                        <div>
                            <label htmlFor="estadoCivil" className="block text-sm font-medium text-gray-700">Estado Civil</label>
                            <select
                                value={estadoCivil}
                                onChange={(e) => setEstadoCivil(e.target.value)}
                                className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="Solteiro">Solteiro</option>
                                <option value="Casado">Casado</option>
                                <option value="Divorciado">Divorciado</option>
                                <option value="Viúvo">Viúvo</option>
                            </select>
                            {estadoCivil !== declarationData.estadoCivil && (
                                <p className="text-red-500 text-xs text-center mt-1">
                                    Valor anterior: {declarationData.estadoCivil}
                                </p>
                            )}
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
                            {numeroDependentes !== declarationData.numeroDependentes && (
                                <p className="text-red-500 text-xs text-center mt-1">
                                    Valor anterior: {declarationData.numeroDependentes}
                                </p>
                            )}
                        </div>


                        {Fields.map((fieldName) => {
                            const currentValue = eval(fieldName.field);
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
                                    {currentValue !== declarationData[fieldName.field as keyof DeclarationData] && (
                                        <p className="text-red-500 text-xs text-center mt-1">
                                            Valor anterior: {formatCurrency(declarationData[fieldName.field as keyof DeclarationData] as number)}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-2">
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

                            <div className="mt-4">
                                <label htmlFor="imoveisDetails" className="block text-sm font-medium text-gray-700">Detalhes dos Imóveis</label>
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

                    <div className="flex items-center gap-2">
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

                            <div className="mt-4">
                                <label htmlFor="veiculosDetails" className="block text-sm font-medium text-gray-700">Detalhes dos Veículos</label>
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

                    <div className="flex justify-end mt-6">
                        <button onClick={() => handleFormSubmit} type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Atualizar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalRetification;