import React, {useEffect, useRef, useState} from "react";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import {Button, CheckPicker} from "rsuite";
import "rsuite/dist/rsuite.min.css"; // Подключаем стили для CheckPicker
import nodeHtmlLabel from "cytoscape-node-html-label";
import styles from './cyptoTree.module.scss'
import cl from "classnames";
import {pieMocks} from "../chartEditor/chartPie/pie-mocks";
import {setActiveChart, setOpenDrawer} from "../../../store/chartSlice/chart.slice";
import EditIcon from "@rsuite/icons/Edit";

// Подключаем плагины
cytoscape.use(dagre);
nodeHtmlLabel(cytoscape); // Подключаем nodeHtmlLabel плагин

const initialState = [
  {data: {id: "1", label: "Объем, тыс.p",type: 'one', values: [{value: 460409750, percent: '+41971767'},{value: 502381517, percent: '+9,1%'}]},position: { x: 100, y: 100 }},
  {data: {id: "2", label: "Объем, тыс.л.",type: 'one', values: [{value: 3933628, percent: '+79325'}, {value: 4012953, percent: '+2,0%'}]},position: { x: -300, y: 250 }},
  {data: {id: "3", label: "Цена за литр",type: 'two', values: [{value: 117, percent: '+8,1р'}, {value: 125, percent: '+7,0%'}]},position: { x: -550, y: 350 }},

  {data: {id: "4", label: "Объем, тыс.шт",type: 'one', values: [{value: 6358247, percent: '+343916'}, {value: 6702163, percent: '+5,4%'}]},position: { x: 550, y: 250 }},
  {data: {id: "5", label: "Цена за шт",type: 'two', values: [{value: 72, percent: '+2,5р'}, {value: 75, percent: '+3,5%'}]},position: { x: 700, y: 350 }},

  {data: {id: "6", label: "Трафик",type: 'two', values: [{value: 2702844441, percent: '+122447150'}, {value: 2825291591, percent: '+4,5%'}]},position: { x: -100, y: 400 }},
  {data: {id: "7", label: "Средний чек",type: 'one', values: [{value: 170, percent: '+7,5р'},{value: 178, percent: '+4,4%'}]},position: { x: 200, y: 350 }},


  {data: {id: "8", label: "Объем покупки,л",type: 'two', values: [{value: 1.46, percent: '-0,03'},{value: 1.42, percent: '-2,4%'}]},position: { x: -400, y: 650 }},
  {data: {id: "9", label: "Покупатели",type: 'two', values: [{value: 59619489, percent: '+3116953'}, {value: 62736442, percent: '+5,2%'}]},position: { x: -100, y: 520 }},
  {data: {id: "10", label: "Популяция",type: 'two', values: [{value: 104581474, percent: '+1'}, {value: 104581474, percent: '+0,0%'}]},position: { x: -220, y: 650 }},
  {data: {id: "11", label: "Пенетрация",type: 'one', values: [{value: '57,0%', percent: '+3,0п.п'}, {value: '60,0%', percent: '+5,2%'}]},position: { x: 0, y: 650 }},
  {data: {id: "12", label: "Пенетрация 18+",type: 'one', values: [{value: '27,0%', percent: '+3,0п.п'}, {value: '30,0%', percent: '+5,2%'}]},position: { x: 200, y: 650 }},
  {data: {id: "13", label: "Частота покупки",type: 'one', values: [{value: 45.3, percent: '-0,3'}, {value: '45.0', percent: '-0,7'}]},position: { x: 400, y: 650 }},
  {data: {id: "14", label: "Объем покупки,шт",type: 'two', values: [{value: 2.4, percent: '+0,02'}, {value: 3.4, percent: '+0,8'}]},position: { x: 600, y: 650 }},



  {data: {source: "1", target: "2"}},
  {data: {source: "1", target: "3"}},
  {data: {source: "1", target: "4"}},
  {data: {source: "1", target: "5"}},
  {data: {source: "1", target: "6"}},
  {data: {source: "1", target: "7"}},
  {data: {source: "2", target: "8"}},
  {data: {source: "6", target: "8"}},
  {data: {source: "6", target: "9"}},
  {data: {source: "9", target: "10"}},
  {data: {source: "9", target: "11"}},

  {data: {source: "6", target: "13"}},
  {data: {source: "4", target: "14"}},
  {data: {source: "6", target: "14"}},
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

        // Привязываем граф к верхнему левому краю
        name: "preset" // Используем preset для позиционирования по координатам из position
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

    cy.viewport({
      zoom: 0.7,
      pan: { x: 700, y: 0 }
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
            `<div style="color: red; border-radius: 5px; min-width: 150px; height: 65px; border: 1px solid #ccc; z-index: 1000; background: white">
      <div style="background: ${data.type === 'one' ? '#88b6e8' :'#c2cfdf'}; color: #fff; text-align: center">
        <strong>${data.label}</strong>
      </div>
      <div style="display: flex; height: 43px">
        ${data.values.map((item, index) => {
              return (
                `<div style="flex-grow: 1; text-align: center; ${index < data.values.length - 1 ? 'border-right: 1px solid #ccc;' : ''}">
              <div style="color:#050c26; padding-inline: 5px">${item.value}</div>
              <div  style="color: ${item.percent.startsWith('+') ? 'green': 'red'};border-top: 1px solid #ccc;padding-inline: 5px">${item.percent}</div>
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
        align: "UL",
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


      <div className={cl(styles.wrapper, {

      })}>
        <div className={styles.title_wrapper}>
          <h5>Деревья KPI</h5>
          {/*<Button className={styles.btn} onClick={() => {*/}

          {/*  // dispatch(setActiveChart(chart))*/}
          {/*  // dispatch(setOpenDrawer(true))*/}
          {/*}}>*/}
          {/*  <EditIcon/>*/}
          {/*</Button>*/}
        </div>
        <div
          className={styles.wrapper}
          id="cy"
          ref={cyRef}
          style={{width: "100%", margin: '0 auto', height: "500px", border: "1px solid #ccc"}}
        />

      </div>
      {/*<div>*/}
        {/*<div style={{display: 'flex', marginTop: "10px", height: '100%'}}>*/}

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
      {/*</div>*/}
    </>
  );
};
