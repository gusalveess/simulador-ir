export const formatCurrency = (value: number | string) => {
    if (typeof value === "string") return "-";
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(value);
};

export const formatPlaca = (value: string) => {
    const alphanumericValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    let formattedPlaca = alphanumericValue;
    if (/^[A-Z]{3}\d{4}$/.test(alphanumericValue)) {
        formattedPlaca = alphanumericValue.replace(/^([A-Z]{3})(\d{4})$/, '$1-$2');
    }
    else if (/^[A-Z]{3}\d[A-Z]\d{2}$/.test(alphanumericValue)) {
        formattedPlaca = alphanumericValue;
    }

    return formattedPlaca
}

export const formatCEP = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    const formattedCep = numericValue.replace(/(\d{5})(\d{3})/, '$1-$2');
    
    return formattedCep;
}