import styles from './styles.module.scss'
import {Button, Heading, Text} from "rsuite";
import {useSelector} from "react-redux";
import {selectGraphs, selectReportTitle} from "../../../store/reportSlice/reportSlice.selectors";
import {useRef} from "react";
import {saveToPpt} from "../../helpers/saveToPPT";

export const TestPageGraphComponent = () => {
  const graphRef = useRef(null);

  const graphs = useSelector(selectGraphs);
  const reportTitle = useSelector(selectReportTitle)

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

  return (
    <div ref={graphRef} className={styles.content}>
      {reportTitle ? <Heading level={4}>{reportTitle}</Heading> : null}
      <div className={styles.graphContent}>
        {graphs && graphs.map((graph) => {
          return (
            <div className={checkGraphsLength(graphs)}>
              <span className={styles.graphTitle}>{graph.title}</span>
                <iframe
                  title={graph.title}
                  width="100%"
                  height="500"
                  // seamless
                  frameBorder="0"
                  scrolling="no"
                  src={graph.link}
                >
                </iframe>
              <Text muted>{graph.description}</Text>
            </div>
          )
        })}
      </div>
      {/*<Button appearance={'primary'} onClick={() => saveToPpt(graphRef)}>test</Button>*/}
    </div>
  );
};