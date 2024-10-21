import styles from './createChartDrawer.module.scss'
import {Button, Drawer, Message} from "rsuite";
import {FormProvider, useForm} from "react-hook-form";
import {CustomInput} from "../../../components/rhfInputs/customInput/CustomInput";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useDispatch, useSelector} from "react-redux";
import {
  selectActiveGraphsPosition,
  selectActiveGroupId, selectActiveReport, selectChartTypes, selectFilters, selectGraphsPosition,
  selectGroupsReports,
  selectReportsClients
} from "../../../store/chartSlice/chart.selectors";
import {PreventOverflowContainer} from "../chartFilters/main/MainForm";
import {CustomSelectPicker} from "../../../components/rhfInputs/selectPicker/SelectPicker";
import React, {useEffect, useState} from "react";
import CustomToggle from "../../../components/rhfInputs/customToggle/CustomToggle";
import {
  createChart,
  fetchAllChartsByGroupId,
  fetchAllChartsFormatByGroupId, getChartTypes, getGroupById, updateGraphsPosition
} from "../../../store/chartSlice/chart.actions";
import {
  setActiveGraphsPosition,
  setActiveGroup, setFilterLoading,
  setGraphsPosition,
  setScrollTabs
} from "../../../store/chartSlice/chart.slice";
import {fetchColumnDB} from "../../../store/chartSlice/filter.actions";
import {selectSelectedFilters} from "../../../store/chartSlice/filter.selectors";

export const CreateChartDrawer = ({open, onClose}) => {
  const reportsClients = useSelector(selectReportsClients)
  const groupsReports = useSelector(selectGroupsReports)
  const activeGroupId = useSelector(selectActiveGroupId)
  const activeReport = useSelector(selectActiveReport)
  const chartTypes = useSelector(selectChartTypes)
  const [errorDB, setErrorDB] = useState('')
  const [availableFields, setAvailableFields] = useState([])
  const dispatch = useDispatch();
  const activeGraphsPosition = useSelector(selectActiveGraphsPosition);
  const [activeGroupObj, setActiveGroupObj] = useState()
  const graphsPosition = useSelector(selectGraphsPosition);
  const filters = useSelector(selectFilters)
  const selectedFilters = useSelector(selectSelectedFilters)


  const loginSchema = yup.object().shape({
    title: yup.string().required("Название обязательно"),
    description: yup.string().required("Описание обязательно").max(200, 'Маскимальное количетсво символов 200'), // Add the password field
    db_adress: yup.string().required("Название обязательно"),
    xvalue: yup.string().required("Название обязательно"),
    yvalue: yup.string().required("Название обязательно"),
    group_id: yup.string().required("Название обязательно"),
    report_id: yup.string().required("Название обязательно"),
  });

  const methods = useForm({
    resolver: yupResolver(loginSchema),
    shouldFocusError: false,
  })

  useEffect(() => {

    const foundGroup = groupsReports.find((group) => group.group_id == activeGroupId)
    if (foundGroup) {
      setActiveGroupObj(foundGroup)
    } else if (groupsReports.length) {
      setActiveGroupObj(groupsReports[0])
    }
    // setFileList([])

  }, [activeGroupId, groupsReports])

  useEffect(() => {
    dispatch(getChartTypes())
  }, [])

  useEffect(() => {
    methods.reset({
      ispercent: false,
      group_id: activeGroupId,
      report_id: activeReport,
    })
  }, [activeGroupId]);


  const fetchCharts = async (id) => {
    console.log(selectedFilters)
    const filterData = {
      filter_data: activeGroupObj?.saved_filters?.filter_data?.filter(saveFilter => {
        console.log(saveFilter, filters)
        return !filters.some(filter => filter.filter_id === saveFilter.filter_id && !filter.isactive)
      }) || selectedFilters.map(filter => ({filter_id: filter.filter_id, filter_values: filter.value})) || []
    }
    dispatch(fetchAllChartsByGroupId({groupId: id, filter_data: filterData}))
      .then(() => {
        dispatch(fetchAllChartsFormatByGroupId(id));
      }).then(() => {

    })
  }

  const handleCreateChart = (data) => {
    console.log(graphsPosition)
    const positions = graphsPosition.lg.slice()
    const maxHeight = positions.reduce((acc, item) => {

      if (!acc['y']) {
        acc['y'] = item.y
        acc['h'] = item.h
      }

      if (acc['y'] < item.y) {
        acc['y'] = item.y
        acc['h'] = item.h
      }
      // acc[y] = acc < item.y ? item.y : acc;

      return acc

    }, {h: 0, y: 0})
    const newPosition = {
      i: positions.length.toString(), // первый элемент должен сохранять свой индекс
      x: 0,
      y: maxHeight.y + maxHeight.h,
      w: 12, // ширина элемента
      h: 3, // высота элемента
      minW: 3,
      minH: 2,
      maxW: 12,
      static: false, // элемент также должен перемещаться
    }
    positions.push(newPosition)
    // console.log(maxHeight)
    // // return
    // if (activeGraphsPosition) {
    //   dispatch(updateGraphsPosition({
    //     id: activeGraphsPosition,
    //     graphs_position: positions,
    //     groupId: activeGroupId
    //   }))
    //
    // }
    dispatch(setGraphsPosition(positions))
    const request = {
      ...data,
      author_id: 1,
      graph_format_id: data.type_chart
    }
    console.log(activeGraphsPosition)
    dispatch(createChart(request)).then(async (res) => {
      const update = async () => {
        if (activeGraphsPosition) {
          dispatch(updateGraphsPosition({
            id: activeGraphsPosition,
            graphs_position: positions,
            groupId: activeGroupId
          }))
        }
      }
      await update()


      fetchCharts(+data.group_id).then(() => {
        dispatch(getGroupById(activeGroupId)).then((res) => {
          console.log(res.payload.id)

        }).then(() => {
          dispatch(setFilterLoading('idle'))
        })
      })
      // if (activeGraphsPosition) {
      //   dispatch(updateGraphsPosition({
      //     id: activeGraphsPosition,
      //     graphs_position: positions,
      //     groupId: activeGroupId
      //   })).then(() => {
      //     // console.log(f)
      //
      //
      //   })
      // }
    })
    dispatch(setActiveGroup(+data.group_id))
    const index = groupsReports.findIndex(group => {
      return +group.group_id === +data.group_id
    })
    dispatch(setScrollTabs(index))

    // // задержка чтобы успело создаться в базе
    // setTimeout(() => {
    //   console.log(filters)
    //   fetchCharts(+data.group_id)
    // }, 500)
    methods.reset({})
    onClose()

  }

  const handleGetColumnDB = () => {
    dispatch(fetchColumnDB({db_adress: [methods.getValues('db_adress')]})).then((res) => {
      if (res.error) {
        const extractedMessage = res.error.message.match(/Таблица.*'syndicate'/)[0];
        setErrorDB(extractedMessage)
      } else {
        setErrorDB('')
        const columns = res.payload.map(column => column.column_name)
        setAvailableFields(Object.values(columns))
        console.log(Object.values(columns))
      }
      // console.log(extractedMessage)
    })
  }

  const message = (
    <Message style={{marginTop: 16}} showIcon type={'error'} closable onClose={() => setErrorDB('')}>
      <strong>{errorDB}</strong>
    </Message>
  );
  return (
    <Drawer open={open} onClose={() => {
      onClose()
      setAvailableFields([])
    }} style={{maxWidth: 700, width: '100%'}}>
      <Drawer.Body style={{maxHeight: '100% !important'}}>
        <div className={styles.wrapper}>


          <FormProvider {...methods}>
            <div className={styles.input_wrapper}>
              <h6 className={styles.label}>Отчет</h6>
              <PreventOverflowContainer
                // height={34}
              >
                {getContainer => (

                  <CustomSelectPicker
                    disabled={true}
                    name={'report_id'}
                    // defaultValue={activeReport}
                    data={reportsClients.map((report) => ({label: report.report_name, value: report.report_id}))}
                    searchable={false}
                    placeholder="Выберите отчет"
                    className={styles.select}
                    container={getContainer}
                    preventOverflow

                  />
                )}

              </PreventOverflowContainer>
            </div>
            <div className={styles.input_wrapper}>
              <h6 className={styles.label}>Группа</h6>
              <PreventOverflowContainer

              >
                {getContainer => (
                  <CustomSelectPicker
                    disabled={true}
                    name={'group_id'}
                    // defaultValue={activeReport}
                    data={groupsReports.map((group) => ({label: group.group_name, value: group.group_id}))}
                    searchable={false}
                    placeholder="Выберите группу"
                    className={styles.select}
                    container={getContainer}
                    // preventOverflow

                  />
                )}

              </PreventOverflowContainer>
            </div>
            <div className={styles.input_wrapper}>
              <h6 className={styles.label}>Заголовок</h6>
              <CustomInput name={'title'} className={styles.input}/>
            </div>
            <div className={styles.input_wrapper}>
              <h6 className={styles.label}>Описание</h6>
              <CustomInput name={'description'} as={'textarea'} className={styles.description}/>
            </div>
            <div className={styles.input_wrapper}>
              <h6 className={styles.label}>Тип графика</h6>
              <CustomSelectPicker
                data={chartTypes?.map(type => ({label: type.graph_format_name, value: type.graph_format_id}))}
                name={'type_chart'}
                className={styles.type_chart}
              />
            </div>

            <div className={styles.input_wrapper}>
              <h6 className={styles.label}>Адрес таблицы БД</h6>
              <CustomInput name={'db_adress'} className={styles.input}/>
            </div>
            <Button onClick={handleGetColumnDB} className={styles.available_btn}
              // disabled={!methods.getValues('db_adress')?.length}
            >Запросить доступные
              поля</Button>
            {!!errorDB && message}

            {!!availableFields.length && (
              <div className={styles.available_wrapper}>
                <div className={styles.input_wrapper}>
                  <h6 className={styles.label}>X значение</h6>
                  <PreventOverflowContainer

                  >
                    {getContainer => (
                      <CustomSelectPicker
                        name={'xvalue'}
                        placeholder={'Выберите x значение'}
                        className={styles.select}
                        data={availableFields.map((x) => ({label: x, value: x}))}
                        container={getContainer}
                      />
                    )}

                  </PreventOverflowContainer>
                </div>
                <div className={styles.input_wrapper}>
                  <h6 className={styles.label}>Y значение</h6>
                  <PreventOverflowContainer

                  >
                    {getContainer => (
                      <CustomSelectPicker
                        name={'yvalue'}
                        placeholder={'Выберите y значение'}
                        className={styles.select}
                        data={availableFields.map((x) => ({label: x, value: x}))}
                        container={getContainer}
                      />
                    )}

                  </PreventOverflowContainer>
                </div>
                <div className={styles.input_wrapper}>
                  <h6 className={styles.label}>Z значение</h6>
                  <PreventOverflowContainer

                  >
                    {getContainer => (
                      <CustomSelectPicker
                        name={'zvalue'}
                        placeholder={'Выберите z значение'}
                        className={styles.select}
                        data={availableFields.map((x) => ({label: x, value: x}))}
                        container={getContainer}
                      />
                    )}

                  </PreventOverflowContainer>
                </div>
                <div className={styles.input_wrapper}>
                  <h6 className={styles.label}>Использовать проценты</h6>
                  <CustomToggle
                    defaultValue={false}
                    checkedChildren={'Проценты'}
                    unCheckedChildren={'Без процентов'}
                    name={'ispercent'}/>
                  {/*<CustomInput name={'zvalue'} className={styles.input} required={false}/>*/}
                </div>


                <Button className={styles.patch_btn} onClick={(e) => {
                  e.stopPropagation()
                  methods.handleSubmit(handleCreateChart)()
                }}>Создать</Button>
              </div>
            )}

            <br/>
          </FormProvider>
        </div>
      </Drawer.Body>
    </Drawer>
  )
}