import styles from './createChartDrawer.module.scss'
import {Button, Drawer} from "rsuite";
import {FormProvider, useForm} from "react-hook-form";
import {CustomInput} from "../../../components/rhfInputs/customInput/CustomInput";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useDispatch, useSelector} from "react-redux";
import {selectGroupsReports, selectReportsClients} from "../../../store/chartSlice/chart.selectors";
import {PreventOverflowContainer} from "../chartFilters/main/MainForm";
import {CustomSelectPicker} from "../../../components/rhfInputs/selectPicker/SelectPicker";
import React, {useEffect} from "react";
import CustomToggle from "../../../components/rhfInputs/customToggle/CustomToggle";
import {createChart} from "../../../store/chartSlice/chart.actions";
import {setActiveGroup, setScrollTabs} from "../../../store/chartSlice/chart.slice";

export const CreateChartDrawer = ({open, onClose}) => {
  const reportsClients = useSelector(selectReportsClients)
  const groupsReports = useSelector(selectGroupsReports)
  const dispatch = useDispatch();

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
    methods.reset({
      ispercent: false
    })
  }, []);


  const handleCreateChart = (data) => {
    const request = {
      ...data,
      author_id: 1,
      graph_format_id: 1
    }
    // console.log(request)
    dispatch(createChart(request))
    dispatch(setActiveGroup(+data.group_id))
    const index = groupsReports.findIndex(group => {
      return +group.group_id === +data.group_id
    })
    dispatch(setScrollTabs(index))
    onClose()

  }
  return (
    <Drawer open={open} onClose={onClose} style={{maxWidth: 700, width: '100%'}}>
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
                // height={34}
              >
                {getContainer => (
                  <CustomSelectPicker
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
              <h6 className={styles.label}>Адрес таблицы БД</h6>
              <CustomInput name={'db_adress'} className={styles.input}/>
            </div>
            <div className={styles.input_wrapper}>
              <h6 className={styles.label}>X значение</h6>
              <CustomInput name={'xvalue'} className={styles.input}/>
            </div>
            <div className={styles.input_wrapper}>
              <h6 className={styles.label}>Y значение</h6>
              <CustomInput name={'yvalue'} className={styles.input}/>
            </div>
            <div className={styles.input_wrapper}>
              <h6 className={styles.label}>Z значение</h6>
              <CustomInput name={'zvalue'} className={styles.input} />
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
            }}>Сохранить</Button>
          </FormProvider>
        </div>
      </Drawer.Body>
    </Drawer>
  )
}