import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import { useEffect, useState } from "react";
import _ from "lodash";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import {ChartTypeView} from "../chartTypeView/ChartTypeView";
import {
  selectActiveGraphsPosition,
  selectGraphsPosition,
  selectIsEditableMode
} from "../../../store/chartSlice/chart.selectors";
import {useSelector} from "react-redux";
import {Loader} from "rsuite";
import {setActiveGraphsPosition} from "../../../store/chartSlice/chart.slice";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

const generateInitial = (data) => {
  const layout = data.map((item, index) => ({
    i: String(index), // уникальный идентификатор, оставляем индекс без изменений
    x: (index % 2) * 6, // два элемента в строке, по 6 единиц ширины каждый
    y: Math.floor(index / 2) * 2, // каждые два элемента на новой строке
    w: 6, // ширина элемента (половина ширины контейнера)
    h: 2, // высота элемента
    minW: 3, // минимальная ширина
    minH: 2, // минимальная высота
    maxW: 12, // максимальная ширина
    static: false, // чтобы элемент можно было перемещать
  }));

  // Специально обновляем первый элемент, делаем его таким же по ширине, как и остальные
  if (layout.length > 0) {
    layout[0] = {
      i: "0", // первый элемент должен сохранять свой индекс
      x: 0,
      y: 0,
      w: 6, // ширина элемента
      h: 2, // высота элемента
      minW: 3,
      minH: 2,
      maxW: 12,
      static: false, // элемент также должен перемещаться
    };

    if (layout.length === 1) {
      layout[0] = {
        i: "0", // первый элемент должен сохранять свой индекс
        x: 0,
        y: 0,
        w: 12, // ширина элемента
        h: 3, // высота элемента
        minW: 3,
        minH: 2,
        maxW: 12,
        static: false, // элемент также должен перемещаться
      };
    }
  }
  // console.log(activeGroup)
  // let positions = []
  // // console.log(activeGroup)
  // if (activeGroup?.graphs_position) {
  //   dispatch(setActiveGraphsPosition(activeGroup.graphs_position.id))
  //   positions = activeGroup.graphs_position.positions
  // } else {
  //   dispatch(setActiveGraphsPosition(null))
  // }

  return {lg:  layout};
};


const ShowcaseLayout = ({ onLayoutChange, initialLayout, charts}) => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState("lg");
  const [compactType, setCompactType] = useState("vertical");
  const isEditableMode = useSelector(selectIsEditableMode);
  const graphsPosition = useSelector(selectGraphsPosition);

  const [layouts, setLayouts] = useState({ lg: initialLayout });
  console.log(initialLayout,charts)
  useEffect(() => {
    // if(initialLayout.length !== charts.length) return
    setLayouts({ lg: initialLayout });
  }, [initialLayout.length,charts.length,graphsPosition]);

  const generateDOM = () => {
    if(layouts.lg.length !== charts.length) {
      setLayouts(generateInitial(charts));
      return
    }
    console.log(layouts.lg,charts)
    return _.map(layouts.lg, (l, i) => (
      <div key={i} className={l.static ? "static" : ""}
           style={{
             border: isEditableMode ? "1px solid lightgray": 'none',
             boxSizing: "border-box",
             // padding: "10px"
           }}
      >
        {l.static ? (
          <span
            className="text"
            title="This item is static and cannot be removed or resized."
          >
            Static - {i}
          </span>
        ) : (
          <span className="text" style={{height: '100%', display:'block'}}>
            <ChartTypeView key={i} chart={charts[i]}/>
          </span>
        )}

      </div>
    ));
  };

  const onBreakpointChange = (breakpoint) => {
    setCurrentBreakpoint(breakpoint);
  };

  const onCompactTypeChange = () => {
    setCompactType(prevCompactType =>
      prevCompactType === "horizontal"
        ? "vertical"
        : prevCompactType === "vertical"
          ? null
          : "horizontal"
    );
  };

  const handleLayoutChange = (layout, layouts) => {
    setLayouts(layouts);
    onLayoutChange(layout, layouts);
  };
  if(initialLayout.length !== charts.length) {
    return <Loader/>
  }

  return (
    <div>
      <ResponsiveReactGridLayout
        style={{
          border: isEditableMode ? "1px solid lightgray" : '',
        }}
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={200}
        isResizable={isEditableMode}  // Меняем значение на основе состояния
        isDraggable={isEditableMode}  // Меняем значение на основе состояния
        resizeHandles={['se', 'e', 'w']}
        compactType={compactType}
        preventCollision={false}
        onBreakpointChange={onBreakpointChange}
        onLayoutChange={handleLayoutChange}
      >
        {generateDOM()}
      </ResponsiveReactGridLayout>
    </div>
  );
};

ShowcaseLayout.defaultProps = {
  initialLayout: generateLayout(),
};

function generateLayout() {
  return _.map(_.range(0, 25), (item, i) => {
    const y = Math.ceil(Math.random() * 4) + 1;
    return {
      x: (_.random(0, 5) * 2) % 12,
      y: Math.floor(i / 6) * y,
      w: 2,
      h: y,
      i: i.toString(),
      static: Math.random() < 0.05
    };
  });
}

export default ShowcaseLayout;
