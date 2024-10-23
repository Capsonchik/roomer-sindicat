// Функция преобразования HSL в HEX
export const hslToHex = (h, s, l) => {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(Math.min(k(n) - 3, 9 - k(n), 1), -1);
  const rgb = [f(0), f(8), f(4)].map(x => Math.round(x * 255).toString(16).padStart(2, '0'));
  return `#${rgb.join('')}`;
};