export interface DeclarationData {
    estadoCivil: string;
    numeroDependentes: number;
    rendimentos: number;
    salarioBruto: number;
    rendimentosOutrasFontes: number;
    rendimentosIsentos: number;
    deducoes: number;
    despesasMedicas: number;
    despesasEducacao: number;
    pensaoAlimenticia: number;
    previdenciaPrivada: number;
    bensEDireitos: number;
    imoveis: Imoveis[];
    veiculos: Veiculos[];

    [key: string]: string | number | Imoveis[] | Veiculos[];
}

export interface Imoveis {
    cep: string,
    logradouro: string,
    bairro: string,
    cidade: string,
    uf: string,
    tipoImovel: string,
    valorAquisicao: number,
    anoAquisicao: number
}

export interface Veiculos {
    marca: string,
    modelo: string,
    placa: string,
    anoVeiculo: number,
    valorAquisicao: number
}

export interface Declaration {
    id: number
    ano: number,
    status: string,
    dados: DeclarationData
    criadoEm: string
}

export interface DeclarationSpecific {
    userId: string;
    declaracao: {
        id: number;
        ano: number;
        dados: DeclarationData;
        status: string;
        criadoEm: string;
    };
}
