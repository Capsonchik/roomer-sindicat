export const charts = [
  {
    title: 'Пиво Хеви',
    description: "Описание",
    formatting: {
      "type_chart": "bar",
      "column_width": 30,
      "column_gap": 0,
      "stack": false,
      "isXAxis": true
    },
    axes: {
      xAxisData: ["хеви"],
      seriesData: {
        "2023-Q1": [1.5],
        "2024-Q1": [1.4]
      }
    },

  },
  {
    title: 'Пиво Медиум',
    description: "Описание",
    axes: {
      xAxisData: ["медиум"],
      seriesData: {
        "2023-Q1": [1.8],
        "2024-Q1": [1.3]
      }
    },
    formatting: {
      "type_chart": "bar",
      "column_width": 30,
      "column_gap": 0,
      "stack": false,
      "isXAxis": true
    }
  },
  {
    title: 'Пиво Лайт',
    description: "Описание",
    axes: {
      xAxisData: ["лайт"],
      seriesData: {
        "2023-Q1": [2.1],
        "2024-Q1": [1.6]
      }
    },
    formatting: {
      "type_chart": "bar",
      "column_width": 30,
      "column_gap": 0,
      "stack": false,
      "isXAxis": true
    }
  }
];