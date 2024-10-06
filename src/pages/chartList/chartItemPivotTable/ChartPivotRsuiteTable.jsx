import "./styles.css";
import * as React from "react";
import { PivotViewComponent } from "@syncfusion/ej2-react-pivotview";
import { pivotTableParams } from "./config";



export const  ChartPivotRsuiteTable =() => {
  return (
    <div className="control-pane">
      <div className="control-section" style={{ overflow: "auto" }}>
        <PivotViewComponent
          id="PivotView"
          {...pivotTableParams}
        ></PivotViewComponent>
      </div>
    </div>
  );
}
