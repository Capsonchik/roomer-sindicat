import {Button, Drawer, Uploader} from "rsuite";
import styles from "./presentationDrawer.module.scss";
import {ChartEditor} from "../chartEditor/ChartEditor";
import {FormProvider, useForm} from "react-hook-form";
import {CustomInput} from "../../../components/rhfInputs/customInput/CustomInput";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchAllGroups, patchGroupById} from "../../../store/chartSlice/chart.actions";
import {
  selectActiveGroupId,
  selectActiveReport,
  selectCharts,
  selectGroupsReports, selectIsChartLoading
} from "../../../store/chartSlice/chart.selectors";

import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {axiosGraphRequest} from "../../../api/ApiConfig";
import {convertDataCharts} from "../topFilters/convertDataCharts";

export const PresentationDrawer = ({open, onClose}) => {


  // const loginSchema = yup.object().shape({
  //   title: yup.string().required("Название обязательно"),
  //   description: yup.string().required("Описание обязательно").max(200, 'Маскимальное количетсво символов 200'), // Add the password field
  // });

  const methods = useForm({
    // resolver: yupResolver(loginSchema),
  })
  const dispatch = useDispatch();
  const activeReport = useSelector(selectActiveReport)
  const activeGroupId = useSelector(selectActiveGroupId)
  const groups = useSelector(selectGroupsReports);
  const [fileList, setFileList] = React.useState([]);
  const [activeGroup, setActiveGroup] = useState()
  const uploader = React.useRef();
  const charts = useSelector(selectCharts)


  useEffect(() => {

    const foundGroup = groups.find((group) => group.group_id == activeGroupId)
    if (foundGroup) {
      setActiveGroup(foundGroup)
    } else if (groups.length) {
      setActiveGroup(groups[0])
    }
    setFileList([])

  }, [activeGroupId, groups])
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
        // uploader.current?.clearFiles();
      } catch (error) {
        console.error('Ошибка при загрузке файла:', error);
      }
    }
  };


  return (
    <Drawer open={open} onClose={onClose} style={{maxWidth: 700, width: '100%'}}>
      <Drawer.Body style={{maxHeight: '100% !important'}}>
        <div className={styles.wrapper}>


          <FormProvider {...methods}>
            <div className={styles.input_wrapper}>
              <h6 className={styles.label}>Пересите сюда или выберите файл</h6>
              <Uploader
                draggable
                fileList={fileList}
                ref={uploader}
                className={styles.uploader}
                autoUpload={false}
                onChange={setFileList}
              >
                <Button className={styles.upload_btn}>Выбрать файл</Button>
              </Uploader>

            </div>


            <Button
              disabled={!fileList.length}
              onClick={() => {
                handleFileUpload()
              }}
            >
              Добавить слайд к файлу и скачать
            </Button>

            {/*<div className={styles.input_wrapper}>*/}
            {/*  <h6 className={styles.label}>Описание</h6>*/}
            {/*  <CustomInput name={'description'} as={'textarea'} className={styles.description}/>*/}

            {/*</div>*/}

            {/*<Button className={styles.patch_btn} onClick={(e) => {*/}
            {/*  e.stopPropagation()*/}
            {/*  methods.handleSubmit(handlePatch)()*/}
            {/*}}>Сохранить</Button>*/}
          </FormProvider>
        </div>
      </Drawer.Body>
    </Drawer>
  )

}