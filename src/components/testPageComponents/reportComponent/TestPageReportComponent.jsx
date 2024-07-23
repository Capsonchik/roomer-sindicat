import {TestPageFilterComponent} from "../filtersComponents/TestPageFilterComponent";
import {TestPageGraphComponent} from "../testPageGraphComponent/testPageGraphComponent";

export const TestPageReportComponent = () => {
  return (
    <div>
      <TestPageFilterComponent/>
      <TestPageGraphComponent/>
    </div>
  );
};