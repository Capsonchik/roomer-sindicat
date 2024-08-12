import React, {useEffect, useRef, useState} from 'react';
import html2canvas from 'html2canvas';
import styles from './styles.module.scss';
import {Button, Heading, Loader, Text} from 'rsuite';
import {useSelector} from 'react-redux';
import {
  selectGraphs,
  selectGraphsLoader,
  selectReportTitle,
  selectSearchString,
} from '../../../store/reportSlice/reportSlice.selectors';
import axios from "axios";
import {SnapShot} from "../../../pages/snapshot/SnapShot";

export const TestPageGraphComponent = () => {
  const graphRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const graphs = useSelector(selectGraphs);
  const reportTitle = useSelector(selectReportTitle);
  const graphsLoader = useSelector(selectGraphsLoader);
  const searchString = useSelector(selectSearchString);
  const [isLoadingImg, setIsLoadingImg] = useState(false);
  const [snapshot, setSnapshot] = useState([])

  // console.log(imageData)

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



  const downloadImageFromIframe = async () => {
    setIsLoadingImg(true)
    const array = []; // This will store the image data objects
//     const test = document.getElementById('graph')
//     console.log(test.outerHTML)
// return
    // Use Promise.all to handle multiple asynchronous requests
    const promises = graphs.map(async (graph) => {
      const encodedSearchString = searchString; // Avoid encoding issues by using the search string directly
      const insertIndex = graph.link.indexOf('#');
      const filter = `?searchStringAttribute=${encodedSearchString}`;
      const filterLink = graph.link.slice(0, insertIndex) + filter + graph.link.slice(insertIndex);

      try {
        // Split the URL into base and fragment
        const [baseUrl, fragment] = filterLink.split('#');

        // Create a new request URL
        const requestUrl = `http://localhost:3001/screenshot?url=${baseUrl}&fragment=${fragment || ''}`;

        // Make the request using axios and wait for the response
        const response = await axios.get(requestUrl, { responseType: 'blob' });

        const url = URL.createObjectURL(response.data);

        // Push the result into the array
        array.push({
          link: url,
          title: graph.title,
        });

      } catch (error) {
        console.error('Ошибка загрузки скриншота:', error);
      }
    });

    // Wait for all promises to resolve
    await Promise.all(promises);

    // Update the state once all the requests are complete
    setSnapshot([...array]);
    setIsLoadingImg(false)
  };
  useEffect(()   => {
    setLoading(false);
  }, [graphsLoader]);
  // console.log(snapshot)
  return (
    <div ref={graphRef} className={styles.content}>
      {reportTitle ? <Heading level={4}>{reportTitle}</Heading> : null}
      <div className={styles.graphContent}>
        {graphsLoader || loading ? (
          <div className={styles.loaderWrapper}>
            <Loader size="md" content="Загрузка"/>
            <hr/>
          </div>
        ) : (
          graphs &&
          graphs.map((graph, index) => {
            const encodedSearchString = encodeURIComponent(searchString);
            const insertIndex = graph.link.indexOf('#');
            const filter = `?searchStringAttribute=${encodedSearchString}`;
            const filterLink = graph.link.slice(0, insertIndex) + filter + graph.link.slice(insertIndex);

            return (
              <div className={checkGraphsLength(graphs)} key={graph.id}>
                <span className={styles.graphTitle}>{graph.title}</span>
                <div className={styles.iframeWrapper}>
                  <iframe
                    id={'graph'}
                    className={styles.iframeContent}
                    title={graph.title}
                    width="100%"
                    height="500"
                    frameBorder="0"
                    scrolling="no"
                    src={filterLink}
                  />
                </div>
                <Text muted>{graph.description}</Text>
              </div>
            );
          })
        )}
      </div>
      {/*<Button appearance={'primary'} onClick={downloadImageFromIframe} disabled={loading} loading={isLoadingImg}>*/}
      {/*  Сохранить как изображение*/}
      {/*</Button>*/}

      {/*<SnapShot items={snapshot} graphLength={graphs?.length}/>*/}
    </div>
  );
};