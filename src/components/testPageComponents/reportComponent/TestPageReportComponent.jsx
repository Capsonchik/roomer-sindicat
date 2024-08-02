import {TestPageFilterComponent} from "../filtersComponents/TestPageFilterComponent";
import {TestPageGraphComponent} from "../testPageGraphComponent/testPageGraphComponent";
import {
  selectError,
  selectGraphs,
  selectGroups,
  selectGroupsLoader
} from "../../../store/reportSlice/reportSlice.selectors";
import {useSelector} from "react-redux";
import {Divider, Loader} from "rsuite";
import {ReportingTabs} from "../reportingTabs/ReportingTabs";
import styles from './testPageReport.module.scss'
import {ErrorMessage} from "../../errorMessage/ErrorMessage";

export const TestPageReportComponent = () => {
  const graph = useSelector(selectGraphs)
  const error = useSelector(selectError)
  const groups = useSelector(selectGroups);
  const groupsLoader = useSelector(selectGroupsLoader);
  // <TestPageGraphComponent/>

  const getGroupContent = () => {
    if (groupsLoader) {
      return (
        <div className={styles.loaderWrapper}>
          <Loader size="md" content="Загрузка"/>
          <hr/>
        </div>

      )
    } else {
      return <ReportingTabs/>
    }
  }



  return (
    <div>
      <TestPageFilterComponent/>
      {error && (
        <ErrorMessage errorMessage={'Что то пошло не так. Пожалуйста перезагрузите страницу'}/>
      )}
      {groups && !!groups.length || groupsLoader
        ? getGroupContent()
        : (
          <div
            style={{width: '100%', minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{width: 500}}>
              <Divider>
                {!Array.isArray(groups)
                  ? 'Необходимо выбрать отчет'
                  : 'Группы отчетов пока нет'
                }
              </Divider>
            </div>
          </div>)
      }

    </div>
  );
};