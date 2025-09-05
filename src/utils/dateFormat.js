// helpers/dateHelpers.js (o al inicio de tu componente)

/**
 * Formatea una cadena de fecha YYYY-MM-DD para su visualización
 * evitando el desfase de un día por la zona horaria local.
 * @param {string} dateString La fecha en formato 'YYYY-MM-DD'.
 * @returns {string} La fecha formateada, por ejemplo '31 de julio de 2025'.
 */
const formatDate = (dateString) => {
    if (!dateString) return '';

    // Crea la fecha forzando la zona horaria local para evitar el desfase
    const date = new Date(dateString + 'T00:00:00');
    
    // Opciones para el formato de la fecha
    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    return date.toLocaleDateString('es-ES', options);
};

export default formatDate;