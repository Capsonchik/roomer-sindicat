// Функция для создания темного и светлого оттенка
export function adjustBrightness({ r, g, b }, factor) {
  return {
    r: Math.min(255, Math.max(0, Math.floor(r * factor))),
    g: Math.min(255, Math.max(0, Math.floor(g * factor))),
    b: Math.min(255, Math.max(0, Math.floor(b * factor)))
  };
}