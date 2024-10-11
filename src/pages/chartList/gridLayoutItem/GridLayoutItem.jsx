import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import { useEffect, useState } from "react";
import _ from "lodash";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import {ChartTypeView} from "../chartTypeView/ChartTypeView";
import {selectIsEditableMode} from "../../../store/chartSlice/chart.selectors";
import {useSelector} from "react-redux";
const ResponsiveReactGridLayout = WidthProvider(Responsive);


const ShowcaseLayout = ({ onLayoutChange, initialLayout, charts}) => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState("lg");
  const [compactType, setCompactType] = useState("vertical");
  const isEditableMode = useSelector(selectIsEditableMode);
  const [layouts, setLayouts] = useState({ lg: initialLayout });

  useEffect(() => {
    setLayouts({ lg: initialLayout });
  }, [initialLayout]);

  const generateDOM = () => {
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
          <span className="text" style={{height: '100%', display:'block',overflow:'auto'}}>
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
