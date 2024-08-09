import html2canvas from "html2canvas";
import PptxGenJS from "pptxgenjs";

export const saveToPpt = async (ref) => {
  const canvas = await html2canvas(ref.current);
  const imgData = canvas.toDataURL('image/jpeg');
  console.log(imgData)

  // Создаем презентацию PowerPoint
  let pptx = new PptxGenJS();
  let slide = pptx.addSlide();
  slide.addImage({ data: imgData, x: 0, y: 0, w: 9, h: 4.5 });

  // Сохраняем презентацию
  // pptx.writeFile({ fileName: 'ScreenshotPresentation.pptx' });

  // Создаем элемент <a> для скачивания изображения
  const link = document.createElement('a');
  link.href = imgData;
  link.download = 'screenshot.jpg';

  // Симулируем клик для скачивания изображения
  link.click();
};

// export const saveToPpt = async (ref) => {
//   try {
//     const canvas = await html2canvas(ref.current);
//     const imgData = canvas.toDataURL('image/jpeg'); // Измените на 'image/png', если нужно
//     console.log(imgData);
//     let pptx = new PptxGenJS();
//     let slide = pptx.addSlide();
//
//     // Укажите размеры изображения в соответствии с вашими требованиями
//     slide.addImage({ data: imgData, x: 0, y: 0, w: 9, h: 4.5 });
//
//     // Сохранение файла
//     await pptx.writeFile({ fileName: 'ScreenshotPresentation.pptx' });
//   } catch (error) {
//     console.error("Ошибка при сохранении презентации:", error);
//   }
// };

// export const saveToPpt = async (ref) => {
//   try {
//     const canvas = await html2canvas(ref.current);
//     const imgData = canvas.toDataURL('image/jpeg'); // Или 'image/png'
//
//     // Создаем элемент <img> для предварительного просмотра
//     const imgElement = document.createElement('img');
//     imgElement.src = imgData;
//     imgElement.style.width = '100%'; // Устанавливаем ширину для отображения
//     imgElement.style.height = 'auto'; // Высота будет автоматически подстраиваться
//
//     // Добавляем элемент <img> в body или другой контейнер для предварительного просмотра
//     document.body.appendChild(imgElement);
//
//     // Выводим imgData в консоль для дальнейшего анализа
//     console.log(imgData);
//
//     // Создание PPTX файла
//     let pptx = new PptxGenJS();
//     let slide = pptx.addSlide();
//
//     slide.addImage({ data: imgData, x: 0, y: 0, w: 9, h: 4.5 });
//
//     // Сохранение файла
//     await pptx.writeFile({ fileName: 'ScreenshotPresentation.pptx' });
//   } catch (error) {
//     console.error("Ошибка при сохранении презентации:", error);
//   }
// };

// export const saveToPpt = async (ref) => {
//   try {
//     // Устанавливаем таймаут на 5 секунд
//     await new Promise(resolve => setTimeout(resolve, 10000)); // 5000 миллисекунд = 5 секунд
//
//     const canvas = await html2canvas(ref.current);
//     const imgData = canvas.toDataURL('image/jpeg'); // Или 'image/png'
//
//     let pptx = new PptxGenJS();
//     let slide = pptx.addSlide();
//     slide.addImage({ data: imgData, x: 0, y: 0, w: 9, h: 4.5 });
//
//     // Сохраняем файл после формирования слайда
//     await pptx.writeFile({ fileName: 'ScreenshotPresentation.pptx' });
//
//   } catch (error) {
//     console.error("Ошибка при сохранении презентации:", error);
//   }
// };