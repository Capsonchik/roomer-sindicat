// Возвращаемый формат - 24 мая 2024
export const dateFormatter  = (currentValue) => {
  const date = new Date(currentValue);
  const options = { day: 'numeric', month: 'long', year: 'numeric', locale: 'ru-RU' };
  return date.toLocaleDateString('ru-RU', options);
}