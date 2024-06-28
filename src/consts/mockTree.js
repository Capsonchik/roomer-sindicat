export const mockTreeData = [
  {
    label: "Работа",
    value: "job",
    children: [
      {
        label: "Область работы",
        value: "jobArea",
        children: [
          { label: "IT", value: "IT" },
          { label: "Маркетинг", value: "Маркетинг" },
          // Другие варианты для области работы
        ]
      }
    ]
  },
  {
    label: "Тип работы",
    value: "jobType",
    children: [
      { label: "Полная занятость", value: "fullTime" },
      { label: "Частичная занятость", value: "partTime" },
      // Другие варианты для типа работы
    ]
  },
  {
    label: "Имя",
    value: "firstName",
    children: [
      { label: "Иван", value: "Иван" },
      { label: "Анна", value: "Анна" },
      // Другие имена
    ]
  }
];