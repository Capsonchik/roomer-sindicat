import styles from './groupControlButtons.module.scss'
import {Button, Message, Tooltip, useToaster, Whisper} from "rsuite";
import {downloadPpt} from "../downloadPptx";
import React, {useEffect, useState} from "react";
import {axiosGraphRequest} from "../../../api/ApiConfig";
import {convertDataCharts} from "../topFilters/convertDataCharts";
import {PresentationDrawer} from "../presentationDrawer/PresentationDrawer";
import {useDispatch, useSelector} from "react-redux";
import {
  selectActiveGroupId,
  selectCharts, selectFilters,
  selectGroupsReports,
  selectIsChartLoading, selectIsEditableMode
} from "../../../store/chartSlice/chart.selectors";
import {CreateChartDrawer} from "../createChartDrawer/CreateChartDrawer";
import {PowerPointIcon} from "./powerPointIcon";
import {setEditableMode} from "../../../store/chartSlice/chart.slice";
import GridIcon from '@rsuite/icons/Grid';
import {saveFilters, updateSaveFilters} from "../../../store/chartSlice/chart.actions";
import {selectActiveSavedFilters} from "../../../store/chartSlice/filter.selectors";
import SettingHorizontalIcon from '@rsuite/icons/SettingHorizontal';

export const GroupControlButtons = ({layouts}) => {
  const [fileList, setFileList] = React.useState([]);
  const filters = useSelector(selectFilters)
  const activeSavedFilters = useSelector(selectActiveSavedFilters)
  const dispatch = useDispatch();
  const [activeGroup, setActiveGroup] = useState()
  const charts = useSelector(selectCharts)
  const groups = useSelector(selectGroupsReports);
  const isChartLoading = useSelector(selectIsChartLoading)
  const activeGroupId = useSelector(selectActiveGroupId)
  const isEditableMode = useSelector(selectIsEditableMode);
  const [openPresentationDrawer, setOpenPresentationDrawer] = useState(false)
  const [openChartDrawer, setOpenChartDrawer] = useState(false)
  const toaster = useToaster();
  const [placement, setPlacement] = React.useState('topCenter');
  const getDataCharts = ({charts, activeGroup}) => {
    return convertDataCharts({charts, activeGroup})
  }

  useEffect(() => {

    const foundGroup = groups.find((group) => group.group_id == activeGroupId)
    if (foundGroup) {
      setActiveGroup(foundGroup)
    } else if (groups.length) {
      setActiveGroup(groups[0])
    }
    setFileList([])

  }, [activeGroupId, groups])
  // console.log(isChartLoading)

  const message = (
    <Message showIcon type={'info'} closable>
      <strong>Сохранено</strong>
    </Message>
  );


  const onSaveFilter = () => {
    const request = filters.map(filter => {
      return {
        filter_id: filter.filter_id,
        filter_values: filter.multi ? filter.value : [filter.value]
      }
    })

    if(activeSavedFilters) {
      dispatch(updateSaveFilters({data: {filter_id: activeSavedFilters, filter_data: request}, activeGroupId}))

    }
    else {
      dispatch(saveFilters({data: {group_id: activeGroupId, filter_data: request}, activeGroupId}))
    }

    toaster.push(message, { placement, duration: 5000 })

  }

  return (
    <>
      <div className={styles.wrapper}>
        {/*<Button*/}
        {/*  disabled={isChartLoading}*/}
        {/*  className={styles.create_pptx}*/}
        {/*  onClick={() => setOpenPresentationDrawer(true)}*/}
        {/*>*/}
        {/*  Создать презентацию*/}
        {/*</Button>*/}

        <Whisper
          placement={'bottom'}
          speaker={<Tooltip>Сохранить фильтры</Tooltip>}>
          <Button
            // style={{
            //   background: isEditableMode ? '#ff8200' : '#f7f7fa',
            //   color: isEditableMode ? '#fff' : '#575757'
            // }}
            className={styles.btn}
            disabled={isChartLoading}
            onClick={onSaveFilter} // Передаем весь массив charts
            // className={styles.save_pptx}
          >
            <SettingHorizontalIcon />

          </Button>
        </Whisper>

        <Whisper
          placement={'bottom'}
          speaker={<Tooltip> {isEditableMode ? "Сохранить" : "Включить редактирование"}</Tooltip>}>
          <Button
            style={{
              background: isEditableMode ? '#ff8200' : '#f7f7fa',
              color: isEditableMode ? '#fff' : '#575757'
            }}
            className={styles.btn}
            disabled={isChartLoading}
            onClick={() => dispatch(setEditableMode(!isEditableMode))} // Передаем весь массив charts
            // className={styles.save_pptx}
          >
            <GridIcon />

          </Button>
        </Whisper>


        <Whisper
          placement={'bottom'}
          speaker={<Tooltip> Скачать слайд pptx</Tooltip>}>
          <Button
            className={styles.btn}
            disabled={isChartLoading}
            onClick={() => downloadPpt(charts, activeGroup,layouts)} // Передаем весь массив charts
            // className={styles.save_pptx}
          >
            <PowerPointIcon/>



          </Button>
        </Whisper>



      </div>
      <PresentationDrawer
        open={openPresentationDrawer}
        onClose={() => setOpenPresentationDrawer(false)}
      />

    </>
  )
}