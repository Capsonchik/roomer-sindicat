import {TestPageFilterComponent} from "../filtersComponents/TestPageFilterComponent";
import {TestPageGraphComponent} from "../testPageGraphComponent/testPageGraphComponent";
import {selectGraphs, selectGroups} from "../../../store/reportSlice/reportSlice.selectors";
import {useSelector} from "react-redux";
import {Divider} from "rsuite";
import {ReportingTabs} from "../reportingTabs/ReportingTabs";

export const TestPageReportComponent = () => {
  const graph = useSelector(selectGraphs)
  const groups = useSelector(selectGroups);
    console.log(graph)
    // <TestPageGraphComponent/>
  return (
    <div>
      <TestPageFilterComponent/>
      {groups && !!groups.length
        ? <ReportingTabs/>
        : (
          <div style={{width: '100%', minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{width: 500}}>
              <Divider>Необходимо выбрать отчет</Divider>
            </div>
          </div>)
      }

    </div>
  );
};