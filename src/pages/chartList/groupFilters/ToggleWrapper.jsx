import React from "react";

export const ToggleWrapper = React.forwardRef((props, ref) => {
return (
  <div
    {...props}
    ref={ref}
    style={{
      background: '#f0f0f0',
      padding: 20,
      width: '100%',
      borderRadius: 4,
      marginBottom: 10,
      maxHeight: props.in ? '1000px' : '0px', // Управляем maxHeight
      overflow: 'hidden', // Скрываем лишний контент
      transition: 'max-height 0.3s ease, opacity 0.3s ease', // Плавные переходы
      // opacity: props.in ? 1 : 0, // Плавное исчезновение
    }}
  >
    <p>Фильтры</p>
    <p>Контент фильтров</p>
  </div>
)
})