export function debounce(func, delay) {
  let timeoutId;

  return function (...args) {
    // Сохраняем контекст вызова
    const context = this;

    // Очищаем предыдущий тайм-аут, если он существует
    clearTimeout(timeoutId);

    // Устанавливаем новый тайм-аут
    timeoutId = setTimeout(() => {
      // Вызываем функцию с сохраненными аргументами и контекстом
      func.apply(context, args);
    }, delay);
  };
}