import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDeclarations, deleteDeclaration } from "../../services/declarationService";
import { format } from "date-fns";
import Input from "../../components/Input";
import Button from "../../components/Button";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import DatePicker from "react-datepicker";
import ModalRetification from "../../components/ModalRetification";
import "react-datepicker/dist/react-datepicker.css";
import { Declaration } from "../../interfaces/DeclarationInterface";
import { formatCurrency } from '../../utils/format';

const Dashboard = () => {
    const navigate = useNavigate();
    let userId = localStorage.getItem("user") || "";

    const [declarations, setDeclarations] = useState<Declaration[]>([]);
    const [isModalRetificationOpen, setIsModalRetificationOpen] = useState(false);
    const [filteredDeclarations, setFilteredDeclarations] = useState<any[]>([]);
    const [selectedDeclaration, setSelectedDeclaration] = useState<any>(null);
    const [filterYear, setFilterYear] = useState("");
    const [Year, setYear] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDeclarations();
    }, []);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        let filteredData = declarations;

        if (filterYear) {
            filteredData = filteredData.filter(dec => dec.ano === parseInt(filterYear));
        }

        if (filterDate) {
            filteredData = filteredData.filter(dec => {
                const createdDate = new Date(dec.criadoEm);
                const filterDateObj = new Date(filterDate);
                return createdDate.toISOString().split('T')[0] === filterDateObj.toISOString().split('T')[0];
            });
        }

        setFilteredDeclarations(filteredData);
    }, [filterYear, filterDate, declarations]);

    const fetchDeclarations = async () => {
        setLoading(true);
        try {
            const data = await getDeclarations(userId);
            setDeclarations(data.declaracoes ?? []);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            navigate("/error");
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir esta declaração?")) {
            await deleteDeclaration(userId, id);
            window.location.reload();
        }
    };

    function calculateIncomeTax(data: Declaration) {
        const taxBrackets = [
            { max: 2259.20, rate: 0.00, deduction: 0.00 },
            { max: 2826.65, rate: 0.075, deduction: 169.44 },
            { max: 3751.05, rate: 0.15, deduction: 381.44 },
            { max: 4664.68, rate: 0.225, deduction: 662.77 },
            { max: Infinity, rate: 0.275, deduction: 896.00 }
        ];
    
        const dependentDeduction = 189.59 * data.dados.numeroDependentes;
    
        const taxableIncome = data.dados.salarioBruto +
            data.dados.rendimentosOutrasFontes - 
            data.dados.rendimentosIsentos - 
            data.dados.deducoes - 
            data.dados.despesasMedicas - 
            data.dados.despesasEducacao - 
            data.dados.pensaoAlimenticia - 
            data.dados.previdenciaPrivada - 
            dependentDeduction;

        if (taxableIncome <= 0) return 0;

        const bracket = taxBrackets.find(b => taxableIncome <= b.max);
        if (!bracket) {
            return '-';
        }

        return (taxableIncome * bracket.rate) - bracket.deduction;
    }

    const handleView = (id: string) => {
        navigate(`/declaration/${id}`);
    };

    return (
        <div className="p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-semibold text-[#465EFF] mb-4 text-center">
                Histórico de Declarações
            </h1>

            {loading && (
                <div className="flex justify-center items-center">
                    <div className="spinner-border animate-spin border-t-2 border-b-2 border-[#465EFF] rounded-full w-12 h-12"></div>
                </div>
            )}

            {!loading && (
                <>
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <Input
                            type="number"
                            placeholder={windowWidth < 640 ? "Ano" : "Filtrar por Ano"}
                            value={filterYear}
                            onChange={(e) => setFilterYear(e.target.value)}
                            className="h-12 w-full sm:w-52"
                        />
                        <DatePicker
                            selected={filterDate ? new Date(filterDate) : null}
                            onChange={(date) => setFilterDate(date ? date.toISOString().split('T')[0] : '')}
                            placeholderText="Filtrar por Data"
                            dateFormat="dd/MM/yyyy"
                            className="w-full sm:w-52 h-12 border border-gray-300 rounded-md p-2"
                        />
                        <Button type="button" onClick={() => fetchDeclarations()} className="bg-[#465EFF] text-white">
                            Filtrar
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300 text-center">
                            <thead>
                                <tr className="bg-[#465EFF] text-white">
                                    <th className="py-2 px-4">Ano</th>
                                    <th className="py-2 px-4">Status</th>
                                    <th className="py-2 px-4">Cálculo Final</th>
                                    <th className="py-2 px-4">Enviada Em</th>
                                    <th className="py-2 px-4">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDeclarations.map((dec: any) => (
                                    <tr key={dec.id} className="border-t border-gray-300">
                                        <td className="py-2 px-4">{dec.ano}</td>
                                        <td className="py-2 px-4">{dec.status}</td>
                                        <td className="py-2 px-4">{dec.status === "Não Submetida" ? "-" : formatCurrency(calculateIncomeTax(dec))}</td>
                                        <td className="py-2 px-4">{format(new Date(dec.criadoEm), "dd/MM/yyyy")}</td>
                                        <td className="py-2 px-4 flex justify-center gap-2">
                                            {dec.status === "Submetida" && (
                                                <>
                                                    <button onClick={() => { setIsModalRetificationOpen(true); setSelectedDeclaration(dec); setYear(dec.ano) }}>
                                                        <ModeEditIcon className="text-[#FFC107]" />
                                                    </button>
                                                </>
                                            )}
                                            {dec.status === "Não Submetida" ?
                                                <>
                                                    <button onClick={() => handleView(dec.id)}>
                                                        <RemoveRedEyeIcon className="text-[#5A7BFF]" />
                                                    </button>
                                                    <button onClick={() => { navigate(`/create-declaration/${dec.id}`)}}>
                                                        <ModeEditIcon className="text-[#FFC107]" />
                                                    </button>
                                                    <button onClick={() => handleDelete(dec.id)}>
                                                        <DeleteIcon className="text-[#FF6B6B]" />
                                                    </button>
                                                </>
                                                : null}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {isModalRetificationOpen && (
                        <>
                            <ModalRetification
                                declarationData={declarations[0].dados}
                                userId={userId}
                                Year={Year}
                                declarationId={selectedDeclaration.id}
                                onClose={setIsModalRetificationOpen}
                            />
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Dashboard;
