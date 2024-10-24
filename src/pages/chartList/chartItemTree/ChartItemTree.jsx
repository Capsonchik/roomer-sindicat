import React, { useState, useEffect, useRef } from "react";
import Tree from "react-d3-tree";

// Пример данных для дерева
const treeData = [
  {
    name: "Главная",
    children: [
      {
        name: "Дочерний 1",
        children: [{ name: "Внук 1" }, { name: "Внук 2" }]
      },
      {
        name: "Дочерний 2",
        children: [{ name: "Внук 3" }]
      }
    ]
  }
];

// Кастомный элемент узла с использованием HTML внутри SVG
const renderCustomNodeElement = ({ nodeDatum }) => (
  <foreignObject x="-100" y="-50" width="200" height="100">
    <div
      style={{
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "5px",
        padding: "10px",
        boxShadow: "0px 10px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center"
      }}
    >
      <strong>{nodeDatum.name}</strong>
      {nodeDatum.children && (
        <div style={{ marginTop: "5px", fontSize: "12px", color: "#888" }}>
          {nodeDatum.children.length} подузел(а)
        </div>
      )}
    </div>
  </foreignObject>
);

// Кастомная функция для соединений между узлами (прямая линия)
const straightPathFunc = (linkDatum, orientation) => {
  const { source, target } = linkDatum;
  return orientation === "horizontal"
    ? `M${source.y},${source.x}L${target.y},${target.x}`
    : `M${source.x},${source.y}L${target.x},${target.y}`;
};

export const ChartItemTree = () => {
  const [translate] = useState({ x: 200, y: 200 });
  const treeContainerRef = useRef(null);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    // Пример: дополнительное соединение между Внук 2 и Внук 3 (горизонтальная линия)
    const additionalLinks = [
      {
        source: { x: 300, y: 450 }, // Позиция Внук 2
        target: { x: 300, y: 600 }, // Позиция Внук 3
      }
    ];
    setLinks(additionalLinks);
  }, []);

  return (
    <div ref={treeContainerRef} style={{ width: "100%", height: "500px" }}>
      <Tree
        data={treeData}
        translate={translate}
        orientation="vertical"
        pathFunc={straightPathFunc} // Кастомная функция для линий
        renderCustomNodeElement={renderCustomNodeElement} // Кастомный рендер узлов
      />
      {/* Рендер дополнительных соединений между узлами */}
      <svg style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
        {links.map((link, index) => (
          <line
            key={index}
            x1={link.source.y}
            y1={link.source.x}
            x2={link.target.y}
            y2={link.target.x}
            stroke="blue"
            strokeWidth="2"
          />
        ))}
      </svg>
    </div>
  );
};
