import styles from './groupControlButtons.module.scss'
import {Button, Tooltip, Whisper} from "rsuite";
import {downloadPpt} from "../downloadPptx";
import React, {useEffect, useState} from "react";
import {axiosGraphRequest} from "../../../api/ApiConfig";
import {convertDataCharts} from "../topFilters/convertDataCharts";
import {PresentationDrawer} from "../presentationDrawer/PresentationDrawer";
import {useDispatch, useSelector} from "react-redux";
import {
  selectActiveGroupId,
  selectCharts,
  selectGroupsReports,
  selectIsChartLoading, selectIsEditableMode
} from "../../../store/chartSlice/chart.selectors";
import {CreateChartDrawer} from "../createChartDrawer/CreateChartDrawer";
import {PowerPointIcon} from "./powerPointIcon";
import {setEditableMode} from "../../../store/chartSlice/chart.slice";
import GridIcon from '@rsuite/icons/Grid';

export const GroupControlButtons = () => {
  const [fileList, setFileList] = React.useState([]);
  const dispatch = useDispatch();
  const [activeGroup, setActiveGroup] = useState()
  const charts = useSelector(selectCharts)
  const groups = useSelector(selectGroupsReports);
  const isChartLoading = useSelector(selectIsChartLoading)
  const activeGroupId = useSelector(selectActiveGroupId)
  const isEditableMode = useSelector(selectIsEditableMode);
  const [openPresentationDrawer, setOpenPresentationDrawer] = useState(false)
  const [openChartDrawer, setOpenChartDrawer] = useState(false)
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
          speaker={<Tooltip> {isEditableMode ? "Сохранить" : "Включить редактирование"}</Tooltip>}>
          <Button
            className={styles.btn}
            disabled={isChartLoading}
            onClick={() => dispatch(setEditableMode(!isEditableMode))} // Передаем весь массив charts
            // className={styles.save_pptx}
          >
            <GridIcon/>

          </Button>
        </Whisper>


        <Whisper
          placement={'bottom'}
          speaker={<Tooltip> Скачать слайд pptx</Tooltip>}>
          <Button
            className={styles.btn}
            disabled={isChartLoading}
            onClick={() => downloadPpt(charts, activeGroup)} // Передаем весь массив charts
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