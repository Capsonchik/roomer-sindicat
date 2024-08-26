export const labelArray = [
  'insideBottom',
  'insideTop',
  'inside',    // В центре
  'top',       // Сверху

];

// Преобразуем позицию меток в формат, понятный PptxGenJS
export const dataLabelPosMap = {
  insideBottom: 'inBase',         // Внизу
  insideTop: 'inEnd',           // Сверху
  inside: 'ctr',       // В центре
  top: 'outEnd',// Снаружи, у вершины

};