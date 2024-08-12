import React, { useEffect } from 'react';
import PptxGenJS from 'pptxgenjs';
import styles from './shapshot.module.scss';
import { Heading } from 'rsuite';

// Функция для конвертации Blob в Base64
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const SnapShot = ({ items, graphLength }) => {
  useEffect(() => {
    if (!items.length || graphLength !== items.length) return;

    // Функция для создания PowerPoint файла
    const createPowerPoint = async () => {
      const pptx = new PptxGenJS();

      // Стандартные размеры слайда PowerPoint
      const slideWidth = pptx.width; // ширина слайда в дюймах
      const slideHeight = pptx.height; // высота слайда в дюймах

      // Обрабатываем каждый элемент, чтобы добавить слайд с изображением и заголовком
      for (const item of items) {
        try {
          const response = await fetch(item.link);
          if (!response.ok) {
            console.error(`Failed to fetch image: ${response.statusText}`);
            continue;
          }

          const blob = await response.blob();
          let base64 = await blobToBase64(blob);

          // Проверяем, начинается ли строка base64 с префикса
          if (!base64.startsWith('data:image')) {
            console.warn('Base64 string does not contain image prefix. Adding prefix manually.');
            const imageType = blob.type || 'image/png'; // определяем тип изображения или используем PNG по умолчанию
            base64 = `data:${imageType};base64,` + base64.split(',')[1];
          }

          console.log(`Image base64: ${base64.substring(0, 50)}...`); // Выводим первые 50 символов base64 для проверки

          const slide = pptx.addSlide();

          // Добавляем заголовок к слайду
          slide.addText(item.title, {
            x: 0.5,
            y: 0.3,
            fontSize: 24,
            bold: true,
            align: 'center',
            // w: slideWidth - 1, // ширина текста, чтобы он занимал весь слайд
          });

          // Добавляем изображение к слайду
          slide.addImage({
            x: 1.5,
            y: 1, // отступ сверху, чтобы было место для заголовка
            data: base64, // используем данные изображения в формате base64
            w: 6, // устанавливаем ширину изображения по ширине слайда
            h: 4, // устанавливаем высоту изображения по высоте слайда, минус место для заголовка
            sizing: { type: 'contain', scale: true }, // сохраняем пропорции изображения
          });
        } catch (error) {
          console.error('Error processing image:', error);
        }
      }

      // Сохраняем презентацию в файл
      pptx.writeFile({ fileName: 'SnapshotPresentation.pptx' });
    };

    createPowerPoint(); // Вызываем функцию для создания PowerPoint файла
  }, [items, graphLength]); // Зависимость от items и graphLength

  return (
    <div
      className={styles.wrapper}
      style={{ position: 'absolute', top: '-9999px', left: '-9999px' }} // Скрываем элемент за пределами экрана
    >
      {items.map((item, index) => (
        <div key={index} className={styles.item}>
          <Heading level={4}>{item.title}</Heading>
          <img src={item.link} alt={item.title} onError={(e) => console.error('Image failed to load:', e)} />
        </div>
      ))}
    </div>
  );
};