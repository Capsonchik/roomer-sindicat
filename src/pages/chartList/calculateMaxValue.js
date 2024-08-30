export function calculateMaxValue(minValue, maxValue, targetStepCount) {
  // 1. Определение диапазона
  const range = maxValue - minValue;

  // 2. Вычисление грубого шага
  const roughStep = range / targetStepCount;

  // 3. Корректировка шага до ближайшего "удобного" значения
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

  const finalStep = stepSize * magnitude;

  // 4. Вычисление окончательного максимального значения
  const finalMaxValue = Math.ceil(maxValue / finalStep) * finalStep;

  return finalMaxValue;
}