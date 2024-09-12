import {Button, Drawer, Message} from "rsuite";
import styles from "./filterDrawer.module.scss";
import {FormProvider, get, useFieldArray, useForm} from "react-hook-form";
import {CustomInput} from "../../../components/rhfInputs/customInput/CustomInput";
import {PreventOverflowContainer} from "../chartFilters/main/MainForm";
import {CustomSelectPicker} from "../../../components/rhfInputs/selectPicker/SelectPicker";
import cl from "classnames";
import React, {useEffect, useState} from "react";
import {yupResolver} from "@hookform/resolvers/yup";
import {useDispatch, useSelector} from "react-redux";
import {
  selectActiveGroupId, selectActiveReport, selectFilters,
  selectGroupsReports,
  selectReportsClients
} from "../../../store/chartSlice/chart.selectors";
import ExpandOutlineIcon from '@rsuite/icons/ExpandOutline';
import MinusIcon from '@rsuite/icons/Minus';
import {CustomCheckPicker} from "../../../components/rhfInputs/checkPicker/CheckPicker";
import {
  createFilter,
  fetchColumnDB,
  fetchColumnDBFromGroup,
  getFilters
} from "../../../store/chartSlice/filter.actions";
import * as yup from "yup";
import {CustomTagPicker} from "../../../components/rhfInputs/customTagPicker/CustomTagPicker";
import CustomToggle from "../../../components/rhfInputs/customToggle/CustomToggle";
import {labelArray} from "../label.config";
import {setActiveChart, setOpenDrawer} from "../../../store/chartSlice/chart.slice";
import EditIcon from "@rsuite/icons/Edit";
import {EditFilterForm} from "./editFilterForm";

export const FilterDrawer = ({open, onClose}) => {
  const loginSchema = yup.object().shape({
    // address_db: yup.array().of(
    //   yup.object().shape({
    //     db_name: yup.string().required("ОПА"), // Валидация для каждого объекта в массиве
    //   })
    // ),
    filter_name: yup.string().required("Название обязательно"),
    filter_data: yup.array().min(1, "Название обязательно"),
  });
  const methods = useForm({
    resolver: yupResolver(loginSchema),
    shouldFocusError: false,
    defaultValues: {
      title: '',
      description: '',
      report_id: null
    }
  })

  const {fields, append, remove} = useFieldArray({
    control: methods.control, // control props comes from useForm (optional: if you are using FormContext)
    name: "address_db", // unique name for your Field Array
    defaultValues: {
      // address_db: [{db_name: ''}]
    }
  });

  const dispatch = useDispatch()
  const activeGroupId = useSelector(selectActiveGroupId)
  const reportsClients = useSelector(selectReportsClients)
  const groupsReports = useSelector(selectGroupsReports)
  const activeReport = useSelector(selectActiveReport)
  const filters = useSelector(selectFilters)
  const [isOpenDBInputs, setIsOpenDBInputs] = useState(false)
  const [availableFields, setAvailableFields] = useState([])
  const [errorDBRequest, setErrorDBRequest] = useState('')
  const [selectedFields, setSelectedFields] = useState([])


  useEffect(() => {
    if (!activeGroupId) return
    methods.reset({
      report_id: activeReport,
      group_id: activeGroupId,
      // address_db: [{db_name: ''}] // Ensure address_db has a default entry
    })

    dispatch(fetchColumnDBFromGroup(activeGroupId)).then((res) => {
      setAvailableFields(res.payload)
    })
  }, [open, activeGroupId]);
  const {errors} = methods.formState;

  // const handleDBNames = (data) => {
  //   const db_names = data.address_db.map((d) => d.db_name)
  //   // console.log((data.address_db))
  //   dispatch(fetchColumnDB({db_adress: db_names}))
  //     .then((res) => {
  //
  //       if (res?.error) {
  //         // Регулярное выражение для поиска фразы с "Таблица ... не найдена в базе ..."
  //         const regex = /Таблица\s[\w]+\sне\sнайдена\sв\sбазе\s'[\w]+'/;
  //
  //         const match = res.error.message.match(regex);
  //         console.log(match)
  //         // const message = JSON.parse(res.error.message);
  //         setErrorDBRequest(match?.[0] || '')
  //       } else {
  //         // console.log(res)
  //         setAvailableFields(res.payload)
  //       }
  //
  //       // console.log(res)
  //     })
  //
  // }

  const handleCreateFilter = (data) => {

    const request = {
      filter_group_id: data.group_id,
      filter_name: data.filter_name,
      multi: Boolean(data.multi),
      isactive: Boolean(data.isactive),
      filter_data: data.filter_data?.map((item) => {
        const [db_name, column_name] = item.split(' ')
        return {
          db_name,
          column_name
        }
      }),
    }
    console.log(request)
    // console.log(request)
    dispatch(createFilter(request)).then(() => {
      dispatch(getFilters(activeGroupId))
      onClose()
    })
  }
  // console.log(availableFields)
  const message = (
    <Message style={{marginTop: 16}} showIcon type={'error'} closable onClose={() => setErrorDBRequest('')}>
      <strong>{errorDBRequest}</strong>
    </Message>
  );


  const handleSeriesChange = (data) => {
    console.log(data)
    // const selectedFields = data.map(item => {
    //   return JSON.parse(item)
    // })
    setSelectedFields(data)
  }
  // console.log(selectedFields)
  // fetchColumnDB
  return (
    <Drawer open={open} onClose={() => {
      onClose()
      setAvailableFields([])
      // setIsDelete(false)
      // methods.reset({})
      // {maxWidth: 700, width: '100%'}
    }} style={{}}>
      <Drawer.Body style={{maxHeight: '100% !important'}}>
        <div className={styles.wrapper}>


          <FormProvider {...methods}>
            <div className={styles.input_wrapper}>
              <h6 className={styles.label}>Отчет</h6>

              <CustomSelectPicker
                disabled={true}
                name={'report_id'}
                // defaultValue={activeReport}
                data={reportsClients.map((report) => ({label: report.report_name, value: report.report_id}))}
                searchable={false}
                placeholder="Выберите отчет"
                className={styles.select}
                // container={getContainer}
                preventOverflow

              />

            </div>
            <div className={styles.input_wrapper}>
              <h6 className={styles.label}>Группа</h6>

              <CustomSelectPicker
                disabled={true}
                name={'group_id'}
                // defaultValue={activeReport}
                data={groupsReports.map((group) => ({label: group.group_name, value: group.group_id}))}
                searchable={false}
                placeholder="Выберите группу"
                className={styles.select}
                // preventOverflow

              />
            </div>
            <div className={styles.input_wrapper}>
              <h6 className={styles.label}>Фильтры</h6>
              <div className={styles.filters}>
                {!!filters?.length
                  ? (
                    filters.map((filter) => (
                      <EditFilterForm key={filter.filter_name} filter={filter} />
                      // <div key={filter.filter_name} className={styles.filter_wrapper}>
                      //   <p>{filter.filter_name}</p>
                      //   <div className={styles.line}></div>
                      //   <Button onClick={() => {
                      //
                      //     // dispatch(setActiveChart(chart))
                      //     // dispatch(setOpenDrawer(true))
                      //   }}>
                      //     <EditIcon/>
                      //   </Button>
                      // </div>
                    ))
                  ) : <p>Добавьте фильтры</p>}
              </div>

            </div>
            {!isOpenDBInputs && (
              <div className={styles.open_db_inputs} onClick={() => {
                setIsOpenDBInputs(true)
              }}>
                <ExpandOutlineIcon style={{fontSize: 20}}/>
                <p>Добавить фильтр</p>
              </div>
            )}
            {isOpenDBInputs && (
              <>
                <div className={styles.open_db_inputs} onClick={() => {
                  setIsOpenDBInputs(false)
                }}>
                  <MinusIcon style={{fontSize: 20}}/>
                  <p>Скрыть</p>
                </div>
                <h5 className={styles.create_filter_title}>Создание фильтра</h5>

                <div className={styles.create_form}>


                  <div className={styles.input_wrapper}>
                    <h6 className={styles.label}>Название фильтра</h6>
                    <CustomInput className={styles.input_db_wrapper} name={`filter_name`}
                                 placeholder={'Введите название фильтра'}/>
                  </div>


                  <div className={styles.row}>
                    <div className={styles.input_wrapper}>
                      <h6 className={styles.label}>Мультивыбор</h6>
                      <CustomToggle
                        // checked={}
                        className={cl(styles.input_wrapper, {}, [styles.input_toggle])}
                        name={'multi'}
                        checkedChildren={'Multi'}
                        unCheckedChildren={'Unmulti'}
                      />
                    </div>
                    <div className={styles.input_wrapper}>
                      <h6 className={styles.label}>Вкл/Выкл</h6>
                      <CustomToggle
                        className={cl(styles.input_wrapper, {}, [styles.input_toggle])}
                        name={'isactive'}
                        checkedChildren={'Вкл'}
                        unCheckedChildren={'Выкл'}
                      />
                    </div>
                  </div>


                  {!!availableFields.length && (
                    <div className={cl(styles.input_wrapper, {}, [styles.available_fields])}>
                      <h6 className={styles.label}>Доступные поля</h6>
                      <CustomTagPicker
                        CustomTagPicker={styles.visible_list}
                        name={'filter_data'}
                        data={availableFields.map((item, index) => {

                          return {
                            value: `${item.db_adress} ${item.column_name}`,
                            label: item.column_name,
                            index,
                            db: item.db_adress
                          }; // Передаем индекс в объекте*/}
                        })}
                        renderMenuItem={(label, item) => {
                          const colors = ['red', 'green', 'blue'];
                          return (
                            <div
                              key={`${label}.${item.db}${item.index}`}
                              // className={styles.available_field}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8
                              }}

                            >
                              <label>
                                {label}
                              </label>
                              <label>
                                {item.db}
                              </label>
                            </div>


                          )
                        }}
                        onChangeOutside={handleSeriesChange}
                        value={selectedFields.map((item, index) => {
                          // console.log(item)
                          return item
                        })}

                        // style={{width: 224}}
                        // container={getContainer}
                        preventOverflow
                      />


                    </div>
                  )}

                  <Button
                    className={cl(styles.patch_btn, {}, [styles.create_filter_btn])}
                    onClick={(e) => {
                      e.stopPropagation()
                      methods.handleSubmit(handleCreateFilter)()
                    }}
                  >Создать фильтр
                  </Button>
                </div>
              </>
            )}


          </FormProvider>
        </div>
      </Drawer.Body>
    </Drawer>
  )
}

