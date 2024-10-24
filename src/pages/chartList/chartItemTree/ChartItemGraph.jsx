import React, { useEffect } from "react";
import Graph from "graphology";
import Sigma from "sigma";
import { NodeSquareProgram } from "@sigma/node-square";
import { DEFAULT_NODE_PROGRAM_CLASSES } from "sigma/settings";

export const ChartItemGraph = () => {
  useEffect(() => {
    const container = document.getElementById("sigma-container");

    // Инициализация графа
    const graph = new Graph();

    // Добавляем узлы с координатами для дерева
    graph.addNode("a", {
      x: 0,
      y: 0, // Корневой узел (верхний)
      size: 20,
      label: "A",
    });
    graph.addNode("b", {
      x: -1,
      y: -3, // Левый подузел
      size: 40,
      label: "B",
      type: "square",
    });
    graph.addNode("c", {
      x: 1,
      y: -3, // Правый подузел
      size: 20,
      label: "C",
      type: "square",
    });
    graph.addNode("d", {
      x: -1.5,
      y: -6, // Левый потомок узла B
      size: 20,
      label: "D",
    });
    graph.addNode("e", {
      x: 1.5,
      y: -6, // Правый потомок узла C
      size: 40,
      label: "E",
      type: "square",
    });
    graph.addNode("f", {
      x: 0,
      y: -9, // Нижний узел (на третьем уровне)
      size: 20,
      label: "F",
    });

    // Добавляем связи между узлами для дерева
    graph.addEdge("a", "b", { size: 10 });
    graph.addEdge("a", "c", { size: 10 });
    graph.addEdge("b", "d", { size: 10 });
    graph.addEdge("c", "e", { size: 10 });
    graph.addEdge("d", "f", { size: 10 });
    graph.addEdge("e", "f", { size: 10 });

    // Создание пользовательской логики рендеринга ребер
    const renderer = new Sigma(graph, container, {
      nodeProgramClasses: {
        ...DEFAULT_NODE_PROGRAM_CLASSES,
        square: NodeSquareProgram,
      },
      renderEdge: (context, data, settings) => {
        const source = graph.getNodeAttributes(data.source);
        const target = graph.getNodeAttributes(data.target);

        // Координаты узлов
        const x1 = source.x;
        const y1 = source.y;
        const x2 = target.x;
        const y2 = target.y;

        // Логика рисования прямоугольных углов (сначала по x, затем по y)
        const middleX = (x1 + x2) / 2;

        // Установка стилей линии
        context.beginPath();
        context.moveTo(x1, y1);  // Начальная точка
        context.lineTo(middleX, y1);  // Линия по горизонтали
        context.lineTo(middleX, y2);  // Линия по вертикали
        context.lineTo(x2, y2);  // Линия до конечной точки
        context.strokeStyle = "black";
        context.lineWidth = 2;
        context.stroke();
      }
    });

    // Отключение drag событий по всему документу
    const preventDefaultDrag = (e) => e.preventDefault();
    document.addEventListener("dragstart", preventDefaultDrag);

    // Уничтожаем рендерер и удаляем слушатели событий при размонтировании компонента
    return () => {
      renderer.kill();
      document.removeEventListener("dragstart", preventDefaultDrag);
    };
  }, []);

  return (
    <div
      id="sigma-container"
      style={{
        height: "500px", // Высота на всю доступную область
        width: "100%",   // Ширина на всю доступную область
        overflow: "hidden", // Избегаем прокрутки
      }}
      onDragStart={(e) => e.preventDefault()} // Отключаем создание копий при перетаскивании
      onDrop={(e) => e.preventDefault()} // Отключаем события drop
    ></div>
  );
};
