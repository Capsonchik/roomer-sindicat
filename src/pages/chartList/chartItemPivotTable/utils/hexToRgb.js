// Функция для конвертации hex в RGB
export function hexToRgb(hex) {
  // Удаляем символ `#` в начале, если он есть
  hex = hex.replace(/^#/, '');

  // Проверяем, является ли hex цвет коротким (3 символа) или длинным (6 символов)
  if (hex.length === 3) {
    // Преобразуем #rgb в #rrggbb
    hex = hex.split('').map(char => char + char).join('');
  }

  // Парсим hex-значения в RGB
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  return { r, g, b };
}
