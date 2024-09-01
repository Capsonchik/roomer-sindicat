import styles from './topFilters.module.scss'
import {useDispatch, useSelector} from "react-redux";
import {
  selectActiveClient, selectActiveGroupId, selectActiveReport, selectCharts,
  selectClients,
  selectGroupsReports, selectIsChartLoading,
  selectReportsClients
} from "../../../store/chartSlice/chart.selectors";
import React, {useEffect, useState} from "react";
import {
  fetchAllClients, fetchAllGroups,

  fetchAllReports
} from "../../../store/chartSlice/chart.actions";
import {CustomSelectPicker} from "../../../components/rhfInputs/selectPicker/SelectPicker";
import {FormProvider, useForm} from "react-hook-form";
import {GroupTabs} from "../groupTabs/GroupTabs";
import {setActiveClient, setActiveReport} from "../../../store/chartSlice/chart.slice";
import {Button, Uploader} from "rsuite";
import {downloadPpt} from "../downloadPptx";
import {convertDataCharts} from "./convertDataCharts";
import {axiosGraphRequest} from "../../../api/ApiConfig";
import {PresentationDrawer} from "../presentationDrawer/PresentationDrawer";

export const TopFilters = () => {
  const dispatch = useDispatch();
  const methods = useForm()
  const clients = useSelector(selectClients)
  const reportsClients = useSelector(selectReportsClients)
  const groupsReports = useSelector(selectGroupsReports)
  const activeClient = useSelector(selectActiveClient)
  const activeReport = useSelector(selectActiveReport)
  const activeGroupId = useSelector(selectActiveGroupId)
  const charts = useSelector(selectCharts)
  const isChartLoading = useSelector(selectIsChartLoading)
  const [activeGroup, setActiveGroup] = useState()
  const groups = useSelector(selectGroupsReports);

  const [fileList, setFileList] = React.useState([]);
  const uploader = React.useRef();
  const [openPresentationDrawer, setOpenPresentationDrawer] = useState(false)

  useEffect(() => {

    const foundGroup = groups.find((group) => group.group_id == activeGroupId)
    if (foundGroup) {
      setActiveGroup(foundGroup)
    } else if (groups.length) {
      setActiveGroup(groups[0])
    }
    setFileList([])

  }, [activeGroupId, groups])

  useEffect(() => {
    dispatch(fetchAllClients())
  }, []);


  // console.log(activeGroup,activeGroupId)
  const handleClientChange = (clientId) => {
    dispatch(fetchAllReports(clientId))

    if (clientId) {
      dispatch(setActiveClient(clientId))
    } else {
      dispatch(setActiveClient(null))
      dispatch(setActiveReport(null))
    }
  }
  const handleReportChange = (reportId) => {
    dispatch(fetchAllGroups(reportId))

    if (reportId) {
      dispatch(setActiveReport(reportId))
    } else {
      dispatch(setActiveReport(null))
    }
  }

  // const data = {
  //   title: JSON.stringify({
  //
  //     text: 'HML - анализ',
  //     fontSize: 14,
  //     h: 0.2,
  //     w: 8,
  //     yOffset: 0.2,
  //     xOffset: 0.2,
  //   }),
  //   description: JSON.stringify({
  //     text: 'Описание HML - анализ',
  //     fontSize: 14,
  //     h: 0.2,
  //     w: 8,
  //     yOffset: 0.2,
  //     xOffset: 0.2,
  //   }),
  //   charts: JSON.stringify([
  //     {
  //       title: 'Пиво Хеви',
  //       description: "Описание",
  //       formatting: {
  //         "type_chart": "bar",
  //         "column_width": 30,
  //         "column_gap": 0,
  //         "stack": false,
  //         "isXAxis": true,
  //         "visible": [],
  //         w: 3,
  //         h: 3,
  //         padding: 0.2,
  //         xOffset: 0.2,
  //         yOffset: 1
  //
  //       },
  //       xAxisData: ["хеви"],
  //       seriesData: {
  //         "2023-Q1": [1.5],
  //         "2024-Q1": [1.4]
  //       }
  //     },
  //   ])
  //
  // };
  const getDataCharts = ({charts, activeGroup}) => {
    return convertDataCharts({charts, activeGroup})
  }

  // const handleSuccess = async (response, file) => {
  //   try {
  //     // Преобразуем response в blob, если необходимо
  //     const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
  //     const url = window.URL.createObjectURL(blob);
  //     console.log(url)
  //
  //     // Создаем временную ссылку и программно нажимаем на неё для скачивания файла
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = 'updated-presentation.pptx'; // Название файла
  //     document.body.appendChild(a);
  //     a.click();
  //     a.remove();
  //
  //     // Очистка URL после загрузки файла
  //     window.URL.revokeObjectURL(url);
  //
  //     // Очистка списка файлов (если необходимо)
  //     setFileList([]);
  //   } catch (error) {
  //     console.error('Ошибка при загрузке файла:', error);
  //   }
  // };
  const handleFileUpload = async () => {
    if (fileList.length > 0) {
      const file = fileList[0];

      const { title_data, description, charts: chartForRequest } = getDataCharts({ charts, activeGroup });

      const formData = new FormData();
      formData.append('file', file.blobFile); // Binary file
      formData.append('title_data', title_data); // JSON string
      formData.append('description', description); // JSON string
      formData.append('charts', chartForRequest); // JSON string

      try {
        const response = await axiosGraphRequest.post('/api/v2/echart_graphs/form_data', formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Ensure this is set to handle form data
          },
          responseType: 'arraybuffer', // Expecting a binary response
        });

        // Handling the response to download the file
        const blob = new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'updated-presentation.pptx'; // Name of the downloaded file
        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);
        setFileList([]); // Clear the file list after upload
      } catch (error) {
        console.error('Ошибка при загрузке файла:', error);
      }
    }
  };

  return (
    <>
      <FormProvider {...methods}>
        <div className={styles.wrapper}>
          <div className={styles.filters}>
            <CustomSelectPicker
              className={styles.clients_select}
              name={'clients'}
              placeholder={'Выберите клиента'}
              data={clients.map(client => ({value: client.client_id, label: client.client_name}))}
              onChangeOutside={value => {
                handleClientChange(value)
              }}
            />
            <CustomSelectPicker
              className={styles.clients_select}
              name={'reports'}
              value={activeReport}
              placeholder={'Выберите отчет'}
              data={reportsClients.map(report => ({value: report.report_id, label: report.report_name}))}
              onChangeOutside={value => {
                handleReportChange(value)
              }}
            />
          </div>
          {!isChartLoading && activeReport && !!charts.length && (
            <Uploader
              // onSuccess={handleSuccess}
              // value={fileList[0]}
              ref={uploader}
              className={styles.uploader}
              autoUpload={false}
              onChange={setFileList}
              // data={activeGroup && charts.length && getDataCharts({charts, activeGroup})}
              // action="https://8fe3-212-45-6-6.ngrok-free.app/api/v2/echart_graphs/form_data"
            >
              <Button>Выбрать файл</Button>
            </Uploader>
          )}

          {!!fileList.length && !isChartLoading && activeReport && !!charts.length && (
            <Button
              disabled={!fileList.length}
              onClick={() => {
                handleFileUpload()
                // uploader.current.start();
                // const {title, description, charts: convertedCharts} = getDataCharts({charts, activeGroup})
                // const formData = new FormData()
                // formData.append('file', fileList[0])
                // formData.append('title', title)
                // formData.append('description', description)
                // formData.append('charts', convertedCharts)
                // axiosGraphRequest.post('/api/v2/echart_graphs/form_data',formData)
              }}
            >
              Добавить слайд к файлу
            </Button>
          )}
          {!isChartLoading && activeReport && !!charts.length && <Button
            onClick={() => downloadPpt(charts, activeGroup)} // Передаем весь массив charts
            className={styles.save_pptx}
          >
            Скачать редактируемый pptx
          </Button>}


        </div>
        {!!groupsReports.length && activeReport && (
          <GroupTabs groupsReports={groupsReports} activeGroup={activeGroup}/>
        )}


      </FormProvider>
      <PresentationDrawer
        open={openPresentationDrawer}
        onClose={setOpenPresentationDrawer}
      />
    </>
  )
}