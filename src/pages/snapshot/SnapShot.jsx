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
        const response = await fetch(item.link);
        const blob = await response.blob();
        const base64 = await blobToBase64(blob);

        const slide = pptx.addSlide();

        // Добавляем заголовок к слайду
        slide.addText(item.title, {
          x: 0.5,
          y: 0.3,
          fontSize: 24,
          bold: true,
          align: 'center',
          w: slideWidth - 1, // ширина текста, чтобы он занимал весь слайд
        });

        // Добавляем изображение к слайду
        slide.addImage({
          x: 0,
          y: 1, // отступ сверху, чтобы было место для заголовка
          data: base64, // используем данные изображения в формате base64
          w: 300, // устанавливаем ширину изображения по ширине слайда
          h: 400, // устанавливаем высоту изображения по высоте слайда, минус место для заголовка
          sizing: { type: 'contain', scale: true }, // сохраняем пропорции изображения
        });
      }

      // Сохраняем презентацию в файл
      pptx.writeFile('SnapshotPresentation.pptx');
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
          <img src={item.link} alt={item.title} />
        </div>
      ))}
    </div>
  );
};