// Функция для преобразования данных в формат PptxGenJS
export const prepareDataForPptx = ({ xAxisData, seriesData }) => {
    return Object.keys(seriesData).map(name => {
        return {
            name,
            labels: xAxisData,
            values: seriesData[name]

        }
    });
};