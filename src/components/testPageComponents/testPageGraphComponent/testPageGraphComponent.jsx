import styles from './styles.module.scss'
import {Button, Heading, Loader, Text} from "rsuite";
import {useSelector} from "react-redux";
import {
  selectGraphs,
  selectGraphsLoader,
  selectReportTitle, selectSearchString,
} from "../../../store/reportSlice/reportSlice.selectors";
import {useRef} from "react";
import {saveToPpt} from "../../helpers/saveToPPT";

export const TestPageGraphComponent = () => {
  const graphRef = useRef(null);

  const graphs = useSelector(selectGraphs);
  const reportTitle = useSelector(selectReportTitle)
  const graphsLoader = useSelector(selectGraphsLoader)
  const searchString = useSelector(selectSearchString)
  console.log(searchString)
  function checkGraphsLength(graphs) {
    switch (graphs.length) {
      case 1:
        return styles.graphBig;
      case 2:
        return styles.graphMedium;
      case 3:
        return styles.graphSmall;
      case 4:
        return styles.graph4;
      default:
        return styles.graphsBlock;
    }
  }

  if (!graphs) {
    return (
      <div className={styles.loaderWrapper}>
        <Loader size="md" content="Загрузка"/>
        <hr/>
      </div>
    )
  }

  return (
    <div ref={graphRef} className={styles.content}>
      {reportTitle ? <Heading level={4}>{reportTitle}</Heading> : null}
      <div className={styles.graphContent}>

        {graphsLoader
          ? (
            <div className={styles.loaderWrapper}>
              <Loader size="md" content="Загрузка"/>
              <hr/>
            </div>
          )
          : (
            graphs && graphs.map((graph) => {
              const insertIndex = graph.link.indexOf('#');
              const filter = `?searchString=${searchString}`;
              const filterLink = graph.link.slice(0,insertIndex) + filter + graph.link.slice(insertIndex);
              return (
                <div className={checkGraphsLength(graphs)} key={graph.id}>
                  <span className={styles.graphTitle}>{graph.title}</span>
                  <iframe
                    title={graph.title}
                    width="100%"
                    height="500"
                    // seamless
                    frameBorder="0"
                    scrolling="no"
                    src={filterLink}
                  >
                  </iframe>
                  <Text muted>{graph.description}</Text>
                </div>
              )
            })
          )
        }

      </div>
      {/*<Button appearance={'primary'} onClick={() => saveToPpt(graphRef)}>test</Button>*/}
    </div>
  );
};