export function calculateStepSize(minValue, maxValue, targetStepCount) {
  // 1. Определяем диапазон
  const range = maxValue - minValue;

  // 2. Вычисляем грубый шаг
  const roughStep = range / targetStepCount;

  // 3. Округляем грубый шаг до ближайшего "удобного" значения
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
  let stepSize = roughStep / magnitude;

  if (stepSize <= 1) {
    stepSize = 1;
  } else if (stepSize <= 2) {
    stepSize = 2;
  } else if (stepSize <= 5) {
    stepSize = 5;
  } else {
    stepSize = 10;
  }

  // 4. Умножаем на масштаб, чтобы получить окончательный шаг
  return stepSize * magnitude;
}