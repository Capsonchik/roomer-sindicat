import styles from './groupControlButtons.module.scss'
import {Button} from "rsuite";
import {downloadPpt} from "../downloadPptx";
import React, {useEffect, useState} from "react";
import {axiosGraphRequest} from "../../../api/ApiConfig";
import {convertDataCharts} from "../topFilters/convertDataCharts";
import {PresentationDrawer} from "../presentationDrawer/PresentationDrawer";
import {useSelector} from "react-redux";
import {
  selectActiveGroupId,
  selectCharts,
  selectGroupsReports,
  selectIsChartLoading
} from "../../../store/chartSlice/chart.selectors";
import {CreateChartDrawer} from "../createChartDrawer/CreateChartDrawer";

export const GroupControlButtons = () => {
  const [fileList, setFileList] = React.useState([]);
  const [activeGroup, setActiveGroup] = useState()
  const charts = useSelector(selectCharts)
  const groups = useSelector(selectGroupsReports);
  const isChartLoading = useSelector(selectIsChartLoading)
  const activeGroupId = useSelector(selectActiveGroupId)
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
        <Button
          disabled={isChartLoading}
          className={styles.create_pptx}
          onClick={() => setOpenPresentationDrawer(true)}
        >
          Создать презентацию
        </Button>



        <Button
          disabled={isChartLoading}
          onClick={() => downloadPpt(charts, activeGroup)} // Передаем весь массив charts
          className={styles.save_pptx}
        >
          Скачать слайд pptx
        </Button>

      </div>
      <PresentationDrawer
        open={openPresentationDrawer}
        onClose={() => setOpenPresentationDrawer(false)}
      />

    </>
  )
}