import React, {useEffect, useRef, useState} from "react";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import {CheckPicker} from "rsuite";
import "rsuite/dist/rsuite.min.css"; // Подключаем стили для CheckPicker
import nodeHtmlLabel from "cytoscape-node-html-label";

// Подключаем плагины
cytoscape.use(dagre);
nodeHtmlLabel(cytoscape); // Подключаем nodeHtmlLabel плагин

const initialState = [
  {data: {id: "p", label: "Узел P",type: 'one', values: [{value: 2444, percent: '+20'},{value: 2444, percent: '+20'}, {value: 999, percent: '+20'}]}},
  {data: {id: "r", label: "Узел R",type: 'one', values: [{value: 2444, percent: '+20'}, {value: 999, percent: '+20'}]}},
  {data: {id: "a", label: "Узел A",type: 'one', values: [{value: 1333, percent: '+20'}, {value: 1663, percent: '+20'}]}},
  {data: {id: "q", label: "Узел Q",type: 'two', values: [{value: 2444, percent: '+20'}, {value: 999, percent: '+20'}]}},
  {data: {id: "b", label: "Узел B",type: 'one', values: [{value: 4545, percent: '+20'}, {value: 7878, percent: '-20'}]}},
  {data: {id: "c", label: "Узел C",type: 'two', values: [{value: 2323, percent: '+20'}, {value: 656, percent: '+20'}]}},
  {data: {id: "d", label: "Узел D",type: 'two', values: [{value: 454, percent: '-20'}, {value: 787, percent: '+20'}]}},
  {data: {id: "f", label: "Узел F",type: 'two', values: [{value: 2121, percent: '+20'}, {value: 6767, percent: '-20'}]}},
  {data: {id: "g", label: "Узел G",type: 'one', values: [{value: 232, percent: '-20'}, {value: 6767, percent: '+20'}]}},
  {data: {id: "h", label: "Узел GH  ",type: 'one', values: [{value: 232, percent: '-20'}, {value: 6767, percent: '+20'}]}},
  {data: {source: "a", target: "b"}},
  {data: {source: "a", target: "p"}},
  {data: {source: "p", target: "r"}},
  {data: {source: "p", target: "q"}},
  {data: {source: "b", target: "d"}},
  {data: {source: "b", target: "f"}},
  {data: {source: "b", target: "c"}},
  {data: {source: "c", target: "g"}},
  {data: {source: "c", target: "p"}},
  {data: {source: "f", target: "g"}},
];

export const CytoscapeTree = () => {
  const cyRef = useRef(null);
  const [cyInstance, setCyInstance] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState(initialState.filter(el => el.data.source)); // Храним только рёбра

  useEffect(() => {
    const cy = cytoscape({
      container: cyRef.current,
      elements: initialState,
      layout: {
        name: "dagre",
        rankDir: "TB",
        nodeSep: 150,
        edgeSep: 10,
        rankSep: 100,
      },
      style: [
        {
          selector: "node",
          style: {
            shape: "rectangle",
            "background-color": "#0074D9",
            "text-valign": "center",
            width: 10,
            height: 10,
            "text-halign": "center",
            color: "#fff",
            "background-opacity": 0.9,
          },
        },
        {
          selector: "edge",
          style: {
            width: 1,
            "line-color": "#ccc",
            "target-arrow-color": "#FF4136",
            "target-arrow-shape": "triangle",
            "curve-style": "taxi", // Устанавливаем тип ребра taxi
            "taxi-turn": "20px",
            "taxi-turn-min-distance": "20px",
            "taxi-direction": "vertical",
          },
        },
      ],
      minZoom: 0.5,  // Минимальный уровень зума
      maxZoom: 2,    // Максимальный уровень зума
      wheelSensitivity: 0.1,  // Чувствительность зума (меньшее значение = более плавный зум
    });

    setCyInstance(cy);

    // Настройка сложного содержимого узлов
    cy.nodeHtmlLabel([
      {
        query: 'node',
        halign: 'center',
        valign: 'top',
        valignBox: 'top',
        halignBox: 'center',
        tpl: (data) => {
          return (
            `<div style="color: red; border-radius: 5px; width: 150px; height: 60px; border: 1px solid #ccc; z-index: 1000; background: white">
      <div style="background: ${data.type === 'one' ? '#88b6e8' :'#c2cfdf'}; color: #fff; text-align: center">
        <strong>${data.label}</strong>
      </div>
      <div style="display: flex; height: 40px">
        ${data.values.map((item, index) => {
              return (
                `<div style="flex-grow: 1; text-align: center; ${index < data.values.length - 1 ? 'border-right: 1px solid #ccc;' : ''}">
              <div style="color:#050c26">${item.value}</div>
              <div  style="color: ${item.percent.startsWith('+') ? 'green': 'red'};border-top: 1px solid #ccc">${item.percent}</div>
            </div>`
              );
            }).join('')}
      </div>
    </div>`
          );
        }
      },
    ]);

    const allNodes = cy.nodes().map(node => ({label: node.data('label'), value: node.id()}));
    setNodes(allNodes);

    return () => {
      cy.destroy();
    };
  }, []);

  const handleChangeEdges = (sourceId, selectedTargets) => {
    const newEdges = selectedTargets.map(targetId => ({
      data: {source: sourceId, target: targetId},
    }));
    const updatedEdges = edges.filter(edge => edge.data.source !== sourceId).concat(newEdges);
    setEdges(updatedEdges);

    if (cyInstance) {
      const existingEdges = cyInstance.edges().filter(edge => edge.source().id() === sourceId);
      existingEdges.remove();

      cyInstance.add(newEdges);
      cyInstance.layout({
        name: "dagre",
        rankDir: "TB",
        nodeSep: 150,
        edgeSep: 10,
        rankSep: 100,
        animate: true,
      }).run();
    }
  };

  const edgesMap = edges.reduce((acc, edge) => {
    const source = edge.data.source;
    const target = edge.data.target;

    if (!acc[source]) {
      acc[source] = [];
    }
    if (!acc[source].includes(target)) {
      acc[source].push(target);
    }
    return acc;
  }, {});

  return (
    <>
      {/*<button onClick={() => {*/}
      {/*  setEdges(initialState.filter(el => el.data.source));*/}
      {/*  if (cyInstance) {*/}
      {/*    cyInstance.elements().remove();*/}
      {/*    cyInstance.add(initialState);*/}
      {/*    cyInstance.layout({*/}
      {/*      name: "dagre",*/}
      {/*      rankDir: "TB",*/}
      {/*      nodeSep: 150,*/}
      {/*      edgeSep: 10,*/}
      {/*      rankSep: 100,*/}
      {/*      animate: true,*/}
      {/*    }).run();*/}
      {/*  }*/}
      {/*}}>Сброс*/}
      {/*</button>*/}
      <div >
      {/*<div style={{display: 'flex', marginTop: "10px", height: '100%'}}>*/}
        <div
          id="cy"
          ref={cyRef}
          style={{width: "100%",margin:'0 auto', height: "500px", border: "1px solid #ccc"}}
        />
        {/*<div style={{marginLeft: "20px", display: 'flex', flexDirection: 'column'}}>*/}
        {/*  <h3>Управление узлами и связями</h3>*/}
        {/*  <div >*/}
        {/*    {nodes.map(node => (*/}
        {/*      <div key={node.value} style={{marginBottom: "10px"}}>*/}
        {/*        <strong>{node.label}</strong>*/}
        {/*        <CheckPicker*/}
        {/*          data={nodes.filter(n => n.value !== node.value)}*/}
        {/*          value={edgesMap[node.value] || []}*/}
        {/*          onChange={(values) => handleChangeEdges(node.value, values)}*/}
        {/*          style={{width: 200, marginLeft: 10}}*/}
        {/*          block*/}
        {/*          placeholder="Выберите цели"*/}
        {/*          searchable*/}
        {/*        />*/}
        {/*      </div>*/}
        {/*    ))}*/}
        {/*  </div>*/}

        {/*</div>*/}
      </div>
    </>
  );
};
