

// Чистая функция для создания слайда с изображением графика
import PptxGenJS from "pptxgenjs";

export const downloadSnapshotPptx = ({ chartInstance}) => {
  if (!chartInstance) {
    console.error('Chart instance is required');
    return;
  }

  // Захватываем график как изображение
  const dataUrl = chartInstance.getDataURL({ type: 'png' });
  console.log('1111',dataUrl)

  // Проверяем, что dataUrl валиден
  if (!dataUrl) {
    console.error('Failed to capture chart image');
    return;
  }

  const pptx = new PptxGenJS();
  const slide = pptx.addSlide();

  // Добавляем изображение графика на слайд
  slide.addImage({
    data: dataUrl,
    x: 1,
    y: 1,
    w: 8,
    h: 3,
    sizing: { type: 'contain', scale: true }
  });

  // Сохранение презентации
  pptx.writeFile({ fileName: 'ChartPresentationWithSnapshot.pptx' });
};