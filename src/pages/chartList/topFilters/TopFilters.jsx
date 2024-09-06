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
import {setActiveClient, setActiveReport, setTypeGroupDrawer} from "../../../store/chartSlice/chart.slice";
import {Button, Uploader} from "rsuite";
import {downloadPpt} from "../downloadPptx";
import {convertDataCharts} from "./convertDataCharts";
import {axiosGraphRequest} from "../../../api/ApiConfig";
import {PresentationDrawer} from "../presentationDrawer/PresentationDrawer";
import {GroupDrawer} from "../groupDrawer/GroupDrawer";
import {CreateChartDrawer} from "../createChartDrawer/CreateChartDrawer";
import EditIcon from "@rsuite/icons/Edit";
import {FilterDrawer} from "../filterDrawer/FilterDrawer";

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
  const [openChartDrawer, setOpenChartDrawer] = useState(false)
  const [activeGroup, setActiveGroup] = useState()
  // const groups = useSelector(selectGroupsReports);

  const [fileList, setFileList] = React.useState([]);
  const uploader = React.useRef();
  const [openPresentationDrawer, setOpenPresentationDrawer] = useState(false)
  const [openGroupDrawer, setOpenGroupDrawer] = useState(false)
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false)

  useEffect(() => {

  }, []);

  useEffect(() => {

    const foundGroup = groupsReports.find((group) => group.group_id == activeGroupId)
    if (foundGroup) {
      setActiveGroup(foundGroup)
    } else if (groupsReports.length) {
      setActiveGroup(groupsReports[0])
    }
    setFileList([])

  }, [activeGroupId, groupsReports])

  useEffect(() => {
    dispatch(fetchAllClients())
  }, []);


  // console.log(activeGroup,activeGroupId)
  const handleClientChange = (clientId) => {
    if (clientId) {
      dispatch(fetchAllReports(clientId))
    }

    if (clientId) {
      dispatch(setActiveClient(clientId))
    } else {
      dispatch(setActiveClient(null))
      dispatch(setActiveReport(null))
      methods.reset({
        clients: null,
        reports: null,
      })
    }
  }
  const handleReportChange = (reportId) => {
    if (reportId) {
      dispatch(fetchAllGroups(reportId))
    }

    if (reportId) {
      dispatch(setActiveReport(reportId))
    } else {
      dispatch(setActiveReport(null))
    }
  }

  const getDataCharts = ({charts, activeGroup}) => {
    return convertDataCharts({charts, activeGroup})
  }


  const handleFileUpload = async () => {
    if (fileList.length > 0) {
      const file = fileList[0];

      const {title_data, description, charts: chartForRequest} = getDataCharts({charts, activeGroup});

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
        // Очистка загрузчика после загрузки файла
        setFileList([]); // Очистка списка файлов

        // Если у вас есть ref на Uploader, можно также вызвать clearFiles
        uploader.current?.clearFiles();
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
          {activeReport && (
            <div className={styles.group_wrapper}>
              <Button onClick={() => {
                dispatch(setTypeGroupDrawer('edit'))
                setOpenGroupDrawer(true)
                // dispatch(setActiveChart(chart))
                // dispatch(setOpenDrawer(true))
              }}>
                Редактировать лист
              </Button>
              {/*<h6 className={styles.title_group}>{activeGroup?.description}</h6>*/}

            </div>
          )}

          {activeReport && <Button
            className={styles.create_pptx}
            onClick={() => {
              // setActiveGroup(null)
              dispatch(setTypeGroupDrawer('add'))
              setOpenGroupDrawer(true)
            }}
          >
            Создать лист
          </Button>}
          {activeReport && <Button
            disabled={isChartLoading}
            onClick={() => setOpenChartDrawer(true)} // Передаем весь массив charts
            className={styles.create_chart}
          >
            Создать график
          </Button>}
          {activeReport && <Button
            disabled={isChartLoading}
            onClick={() => setOpenFilterDrawer(true)} // Передаем весь массив charts
            className={styles.create_chart}
          >
            Фильтры листа
          </Button>}


        </div>
        {!!groupsReports.length && activeReport && (
          <GroupTabs groupsReports={groupsReports} activeGroup={activeGroup}/>
        )}


      </FormProvider>
      <PresentationDrawer
        open={openPresentationDrawer}
        onClose={() => setOpenPresentationDrawer(false)}
      />

      <GroupDrawer
        activeGroup={activeGroup}
        open={openGroupDrawer}
        onClose={() => setOpenGroupDrawer(false)}
      />
      <CreateChartDrawer
        open={openChartDrawer}
        onClose={() => setOpenChartDrawer(false)}
      />
      <FilterDrawer
        open={openFilterDrawer}
        onClose={() => setOpenFilterDrawer(false)}
      />
    </>
  )
}