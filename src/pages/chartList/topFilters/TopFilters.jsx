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
import {
  setActiveClient, setActiveGroup,
  setActiveReport, setCharts,
  setFilters,
  setGroups,
  setTypeGroupDrawer
} from "../../../store/chartSlice/chart.slice";
import {Button, Dropdown, Uploader} from "rsuite";
import {downloadPpt} from "../downloadPptx";
import {convertDataCharts} from "./convertDataCharts";
import {axiosGraphRequest} from "../../../api/ApiConfig";
import {PresentationDrawer} from "../presentationDrawer/PresentationDrawer";
import {GroupDrawer} from "../groupDrawer/GroupDrawer";
import {CreateChartDrawer} from "../createChartDrawer/CreateChartDrawer";
import EditIcon from "@rsuite/icons/Edit";
import {FilterDrawer} from "../filterDrawer/FilterDrawer";
import {GroupControlButtons} from "../groupControlButtons/GroupControlButtons";
import {selectCurrentUser} from "../../../store/userSlice/user.selectors";
import editListIcon from './assets/edit-list.svg'
import createListIcon from './assets/create-list.svg'
import createChartIcon from './assets/create-chart.svg'
import filtersIcon from './assets/filters.svg'
import createPresentationIcon from './assets/create-presentation.svg'
import SettingHorizontalIcon from '@rsuite/icons/SettingHorizontal';
import {ImageDrawer} from "../imageDrawer/ImageDrawer";
import ImageIcon from '@rsuite/icons/Image';

export const TopFilters = ({layouts}) => {
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
  const user = useSelector(selectCurrentUser)
  const [openChartDrawer, setOpenChartDrawer] = useState(false)
  const [activeGroupState, setActiveGroupState] = useState()
  // const groups = useSelector(selectGroupsReports);

  const [fileList, setFileList] = React.useState([]);
  const uploader = React.useRef();
  const [openPresentationDrawer, setOpenPresentationDrawer] = useState(false)
  const [openGroupDrawer, setOpenGroupDrawer] = useState(false)
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false)
  const [openImageDrawer, setOpenImageDrawer] = useState(false)

  useEffect(() => {
    if (user && user.role !== 'admin') {
      dispatch(fetchAllReports(user.client_id))
      dispatch(setActiveClient(user.client_id))
    }

  }, [user]);

  useEffect(() => {

    const foundGroup = groupsReports.find((group) => group.group_id == activeGroupId)
    if (foundGroup) {
      setActiveGroupState(foundGroup)
    } else if (groupsReports.length) {
      setActiveGroupState(groupsReports[0])
    }
    setFileList([])

  }, [activeGroupId, groupsReports])

  useEffect(() => {
    dispatch(fetchAllClients())
  }, []);


  // console.log(activeGroup,activeGroupId)
  const handleClientChange = (clientId) => {
    if (clientId) {
      // const activeClient
      dispatch(setActiveClient(clientId))
      if (clientId !== activeClient) {
        dispatch(fetchAllReports(clientId))
        dispatch(setActiveReport(null))
        dispatch(setFilters([]))
        dispatch(setGroups([]))
        dispatch(setCharts([]))
        dispatch(setActiveGroup(null))


      } else {
        // dispatch(setActiveClient(null))
        // dispatch(setActiveClient(clientId))
        // dispatch(setActiveReport(null))
      }
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

      const {title_data, description, charts: chartForRequest} = getDataCharts({charts, activeGroupState});

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
            {user?.role === 'admin' && <CustomSelectPicker
              className={styles.clients_select}
              name={'clients'}
              placeholder={'Выберите клиента'}
              data={clients.map(client => ({value: client.client_id, label: client.client_name}))}
              onChangeOutside={value => {
                handleClientChange(value)
              }}
            />}
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
          {/*user && user.role !== 'viewer' &&*/}
          {activeReport && <GroupControlButtons layouts={layouts}/>}
          {activeReport && <Dropdown
            className={styles.btn}
            icon={<SettingHorizontalIcon style={{width: 16, height: 16}}/>}
            placement={'bottomEnd'}
            title="Настройки">

            {user && user.role !== 'viewer'
              ? (
                <>
                  <Dropdown.Item
                    className={styles.dropdown_item}
                    onClick={() => {
                      setOpenChartDrawer(true) // Передаем весь массив charts
                    }}
                  >
                    <img src={createChartIcon}/>
                    Создать график
                  </Dropdown.Item>

                  <Dropdown.Item
                    className={styles.dropdown_item}
                    onClick={() => {
                      setOpenFilterDrawer(true)
                    }}
                  >
                    <img src={filtersIcon}/>
                    Фильтры листа
                  </Dropdown.Item>
                  <Dropdown.Item
                    className={styles.dropdown_item}
                    onClick={() => {
                      setOpenImageDrawer(true)
                    }}
                  >
                    <ImageIcon/>
                    {/*<img src={filtersIcon}/>*/}
                    Картинки листа
                  </Dropdown.Item>

                  <Dropdown.Separator/>
                  <Dropdown.Item
                    className={styles.dropdown_item}
                    onClick={() => {
                      dispatch(setTypeGroupDrawer('add'))
                      setOpenGroupDrawer(true)
                    }}
                  >
                    <img src={createListIcon}/>
                    Создать лист
                  </Dropdown.Item>
                  <Dropdown.Item
                    className={styles.dropdown_item}
                    onClick={() => {
                      dispatch(setTypeGroupDrawer('edit'))
                      setOpenGroupDrawer(true)
                    }}
                  >
                    <img src={editListIcon}/>
                    Редактировать лист
                  </Dropdown.Item>


                  <Dropdown.Separator/>
                  <Dropdown.Item
                    className={styles.dropdown_item}
                    onClick={() => {
                      setOpenPresentationDrawer(true)
                    }}
                  >
                    <img src={createPresentationIcon}/>
                    Создать презентацию
                  </Dropdown.Item></>
              )
              : (
                <Dropdown.Item
                  className={styles.dropdown_item}
                  onClick={() => {
                    setOpenPresentationDrawer(true)
                  }}
                >
                  <img src={createPresentationIcon}/>
                  Создать презентацию
                </Dropdown.Item>
              )
            }


          </Dropdown>}


        </div>
        {!!groupsReports.length && activeReport && (
          <GroupTabs groupsReports={groupsReports} activeGroup={activeGroupState}/>
        )}


      </FormProvider>
      <PresentationDrawer
        open={openPresentationDrawer}
        onClose={() => setOpenPresentationDrawer(false)}
      />

      <GroupDrawer
        activeGroup={activeGroupState}
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
      <ImageDrawer
        open={openImageDrawer}
        onClose={() => setOpenImageDrawer(false)}
      />
    </>
  )
}