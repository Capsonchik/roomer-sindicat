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

    // Инициализация рендера Sigma с использованием кастомных узлов (NodeSquareProgram)
    const renderer = new Sigma(graph, container, {
      nodeProgramClasses: {
        ...DEFAULT_NODE_PROGRAM_CLASSES,
        square: NodeSquareProgram,
      },
    });

    // Уничтожаем рендерер при размонтировании компонента
    return () => {
      renderer.kill();
    };
  }, []);

  return (
    <div
      id="sigma-container"
      style={{
        height: "100vh", // Высота на всю доступную область
        width: "100%",   // Ширина на всю доступную область
        overflow: "hidden", // Избегаем прокрутки
      }}
      onDragStart={(e) => e.preventDefault()} // Отключаем создание копий при перетаскивании
    ></div>
  );
};
