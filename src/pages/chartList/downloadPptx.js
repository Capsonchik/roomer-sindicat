// Чистая функция для скачивания презентации
import PptxGenJS from "pptxgenjs";
import {prepareDataForPptx} from "./prepareDataForPptx";
import {colors} from "./chart/config";

export const downloadPpt = (charts) => {
    const pptx = new PptxGenJS();
    const slide = pptx.addSlide();
    const yOffsetDefault = 2

    const chartWidth = 3; // Ширина графика
    const chartHeight = 2; // Высота графика
    const padding = 0.2; // Отступ между графиками
    let xOffset = 0.2; // Начальная позиция по горизонтали
    let yOffset = yOffsetDefault; // Начальная позиция по вертикали

    charts.forEach((chart, index) => {
        const {title, description, axes} = chart;

        // Добавляем заголовок графика
        slide.addText(title, {
            x: xOffset,
            y: yOffset,
            align: 'justify',
            fontSize: 14
        });

        yOffset += 0.3; // Увеличиваем отступ для описания
        slide.addText(description, {
            x: xOffset,
            y: yOffset,
            align: 'justify',
            fontSize: 12
        });
        yOffset += 0.3;

        // Подготовка данных для графика
        const dataForChart = prepareDataForPptx(axes);

        // Увеличиваем отступ для графика
        // yOffset += 0.5; // Увеличиваем отступ перед графиком
        slide.addChart('bar', dataForChart, {
            chartColors:colors,
            x: xOffset,
            y: yOffset,
            w: chartWidth,
            h: chartHeight,
        });

        yOffset = yOffsetDefault; // Увеличиваем отступ после графика
        xOffset += chartWidth + padding; // Переход к следующей колонке
    });

    // Сохранение презентации
    pptx.writeFile({fileName: 'ChartPresentation.pptx'});
};