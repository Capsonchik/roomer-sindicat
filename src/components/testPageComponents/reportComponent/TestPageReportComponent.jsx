import {TestPageFilterComponent} from "../filtersComponents/TestPageFilterComponent";
import {TestPageGraphComponent} from "../testPageGraphComponent/testPageGraphComponent";
import {selectGraphs} from "../../../store/reportSlice/reportSlice.selectors";
import {useSelector} from "react-redux";
import {Divider} from "rsuite";

export const TestPageReportComponent = () => {
  const graph = useSelector(selectGraphs)

  return (
    <div>
      <TestPageFilterComponent/>
      {graph
        ? <TestPageGraphComponent/>
        : (
          <div style={{width: '100%', minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{width: 500}}>
              <Divider>Необходимо выбрать группу отчетов</Divider>
            </div>
          </div>)
      }

    </div>
  );
};