import {hexToHSL} from "./hexToHSL";
import {hslToHex} from "./HSLToHex";

export const generateColors = (baseColors, totalCount) => {
  const colors = [];
  const totalBaseColors = baseColors.length;

  // Если один цвет, создаем оттенки этого цвета
  if (totalBaseColors === 1) {
    const [h, s, l] = hexToHSL(baseColors[0]);
    const minLightness = 20; // Минимальная яркость
    const maxLightness = 90; // Максимальная яркость
    const lightnessRange = maxLightness - minLightness;

    // Корректируем шаг, чтобы равномерно распределить оттенки
    const step = Math.max(1, Math.floor(lightnessRange / totalCount));

    for (let i = 0; i < totalCount; i++) {
      const adjustedL = minLightness + step * i;
      const newColor = hslToHex(h, s, Math.min(maxLightness, adjustedL));

      // Проверка, чтобы не добавлять дубликаты
      if (!colors.includes(newColor)) {
        colors.push(newColor);
      }
    }

    return colors;
  }

  // Если количество базовых цветов равно количеству нужных элементов, просто вернем их
  if (totalBaseColors >= totalCount) {
    return baseColors.slice(0, totalCount);
  }

  const steps = totalCount - 1; // Количество шагов для интерполяции
  const segmentSize = Math.floor(steps / (totalBaseColors - 1));
  let remainder = steps % (totalBaseColors - 1); // Оставшиеся шаги

  // Интерполяция между каждыми двумя базовыми цветами
  for (let i = 0; i < totalBaseColors - 1; i++) {
    const startColor = baseColors[i];
    const endColor = baseColors[i + 1];
    const localSteps = segmentSize + (remainder > 0 ? 1 : 0);
    remainder--;

    for (let j = 0; j <= localSteps; j++) {
      const ratio = j / localSteps;
      const [h1, s1, l1] = hexToHSL(startColor);
      const [h2, s2, l2] = hexToHSL(endColor);
      const h = Math.round(h1 + ratio * (h2 - h1));
      const s = Math.round(s1 + ratio * (s2 - s1));
      const l = Math.round(l1 + ratio * (l2 - l1));
      const newColor = hslToHex(h, s, l);

      // Проверяем и добавляем цвет, если он уникален
      if (!colors.includes(newColor)) {
        colors.push(newColor);
      }
    }
  }

  return colors.slice(0, totalCount); // Урезаем до нужного количества
};
