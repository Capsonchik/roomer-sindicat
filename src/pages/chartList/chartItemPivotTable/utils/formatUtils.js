// utils/formatUtils.js
export const formatValue = (value, formatType, digitsAfterDot = null) => {
  const numericValue = Number(value);
  if (typeof value !== 'number') {
    return null;
  }
  if (isNaN(numericValue)) {
    return value;
  }

  if (formatType === 'k') {
    return numericValue >= 1000
      ? `${(numericValue / 1000).toFixed(digitsAfterDot !== null ? digitsAfterDot : 0)}k`
      : numericValue;
  } else if (formatType === 'm') {
    if (numericValue >= 1000000) {
      return `${(numericValue / 1000000).toFixed(digitsAfterDot !== null ? digitsAfterDot : 0)}m`;
    } else if (numericValue >= 1000) {
      return `${(numericValue / 1000).toFixed(digitsAfterDot !== null ? digitsAfterDot : 0)}k`;
    }
  }

  return digitsAfterDot !== null ? numericValue.toFixed(digitsAfterDot) : numericValue;
};
