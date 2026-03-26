/* Converte data de YYYY-MM-DD para DD/MM/YYYY */
export const formatDate = (dateString: string): string => {
    if (!dateString || typeof dateString !== 'string') return "Não informado";
    
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString; 
    
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
};