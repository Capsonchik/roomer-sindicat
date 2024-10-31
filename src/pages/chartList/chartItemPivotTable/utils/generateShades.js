import {hexToRgb} from "./hexToRgb";
import {adjustBrightness} from "./adjustBrightness";

export function generateShades(hexColor) {
  // Преобразуем hex в RGB
  const rgbColor = hexToRgb(hexColor);

  // Создаем светлый оттенок (увеличиваем яркость, например, на 1.2)
  const lightShade = adjustBrightness(rgbColor, 4.2);

  // Создаем темный оттенок (уменьшаем яркость, например, на 0.8)
  const darkShade = adjustBrightness(rgbColor, 1.5);

  return {
    lightShade: [lightShade.r, lightShade.g, lightShade.b],
    darkShade: [darkShade.r, darkShade.g, darkShade.b],
  };
}