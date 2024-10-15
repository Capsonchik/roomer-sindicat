import {Button, Drawer, Message, Tag} from "rsuite";
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
import {colors} from "../chart/config";
import {MainForm} from "./mainForm";
import {LimitedFilterFields} from "./LimitedFilterFields";
import {DefaultFilterFields} from "./DefaultFilterFields";
import {axiosGraphRequest} from "../../../api/ApiConfig";

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


  const [limitFieldsState, setLimitFieldsState] = useState([])
  const [limitedRequestFields, setLimitedRequestFields] = useState([])
  const [limitedFields, setLimitedFields] = useState([])
  const [fieldsState, setFieldsState] = useState([])
  const handleFields = (data) => {
    const newFields = data.map(field => {
      const [db_name, column_name] = field.split(' ')
      return `${db_name} ${column_name}`
    })
    setFieldsState(newFields)
  }

  const handleLimitFields = (data) => {
    console.log(data)
    const newFields = data.map(field => {
      const [db_name, column_name] = field.split(' ')
      return `${db_name} ${column_name}`
    })
    setLimitFieldsState(newFields)
  }

  const handleLimitedRequestFields = (data) => {
    // console.log(data)
    const newFields = data.map(field => {
      // const [value, column_name,db_name,] = field.split(';')
      // return `${value};${column_name};${db_name}`
      return field
    })
    setLimitedRequestFields(newFields)
  }

  const getValuesFromColumn = async () => {
    // console.log(limitFieldsState)
    const response = await axiosGraphRequest.post(`/api/v3/filter/get_values_from_column`, {
      column_data: limitFieldsState.map(field => {
        const [db_name, column_name] = field.split(' ')
        return {
          db_adress: db_name,
          column_name: column_name,
        }
      })

    });
    const fields = response.data.reduce((acc, item) => {
      const options = item.values.map(value => {
        return `${value};${item.column_name};${item.db_adress}`
      })

      return [...acc, ...options]
    }, [])
    setLimitedFields(fields)
    // console.log(fields)

  }



  const db_colors = availableFields?.reduce((acc, item, index) => {
    const name = item.db_adress
    if (!acc[name]) {
      acc[name] = colors[index]
    }

    return acc

  }, {})


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

  const handleCreateFilter = (data) => {

    // if (!data.filter_data?.length) return
    const request = {
      filter_group_id: data.group_id,
      filter_name: data.filter_name,
      multi: Boolean(data.multi),
      isactive: Boolean(data.isactive),
      islimited: Boolean(data.islimited),
      column_limit: Boolean(data.column_limit),
      data_limiting:  [],
      filter_data: data.filter_data?.map((item) => {
        const [db_name, column_name] = item.split(' ')
        return {
          db_name,
          column_name
        }
      }),
    }
    if (data.column_limit) {
      const limited_fields = limitedRequestFields?.reduce((acc, item) => {
        if (typeof item === 'string') {
          const [value, column, db] = item.split(';');

          // Убедимся, что acc является объектом и можем присвоить значения
          if (!acc[`${column};${db}`]) {
            acc[`${column};${db}`] = [value];
          } else {
            acc[`${column};${db}`].push(value);
          }
        }

        return acc;
      }, {}); // Убедимся, что начальное значение acc - объект

      request['data_limiting'] = Object.entries(limited_fields).map(([key,value]) => {
        const [column,db] = key.split(';')
        return {
          db_name:db,
          column_name: column,
          value:value
        }
      })

      // console.log('limitedFields',limitedFields)
      request['filter_data'] = Object.entries(limited_fields).map(([key,value]) => {
        const [column, db] = key.split(';')
        return {
          db_name:db,
          column_name: column
        }
      })

      // console.log(request);
      // return;
    }


    // console.log(request)
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

  // console.log(filters)
  // const handleFields = (data) => {
  //   const newFields = data.map(field => {
  //     const [db_name, column_name] = field.split(' ')
  //     return `${db_name} ${column_name}`
  //   })
  //   setSelectedFields(newFields)
  // }
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
                    filters?.map((filter) => (
                      <EditFilterForm key={filter?.filter_name} filter={filter} availableFields={availableFields}/>
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

                  <MainForm/>

                  {methods.getValues('column_limit') && (
                    <LimitedFilterFields
                      availableFields={availableFields}
                      db_colors={db_colors}
                      limitedFields={limitedFields}
                      setLimitedFields={setLimitedFields}
                      limitedRequestFields={limitedRequestFields}
                      setLimitedRequestFields={setLimitedRequestFields}
                      limitFieldsState={limitFieldsState}
                      setLimitFieldsState={setLimitFieldsState}
                      handleLimitFields={handleLimitFields}
                      getValuesFromColumn={getValuesFromColumn}
                      handleLimitedRequestFields={handleLimitedRequestFields}
                      isCreate/>
                  )}
                  {!methods.getValues('column_limit') && (
                    <DefaultFilterFields
                      fieldsState={fieldsState}
                      setFieldsState={setFieldsState}
                      availableFields={availableFields}
                      db_colors={db_colors}
                      handleFields={handleFields}
                      isCreate
                    />
                  )}

                  {/*{!!availableFields.length && (*/}
                  {/*  <div className={cl(styles.input_wrapper, {}, [styles.available_fields])}>*/}
                  {/*    <h6 className={styles.label}>Доступные поля</h6>*/}
                  {/*    <PreventOverflowContainer>*/}
                  {/*      {getContainer => (*/}
                  {/*        <CustomTagPicker*/}
                  {/*          CustomTagPicker={styles.visible_list}*/}
                  {/*          name={'filter_data'}*/}
                  {/*          data={availableFields.map((item, index) => {*/}

                  {/*            return {*/}
                  {/*              value: `${item.db_adress} ${item.column_name}`,*/}
                  {/*              label: item.column_name,*/}
                  {/*              index,*/}
                  {/*              db: item.db_adress*/}
                  {/*            }; // Передаем индекс в объекте*!/*/}
                  {/*          })}*/}
                  {/*          disabledItemValues={availableFields*/}
                  {/*            .filter(availableField => {*/}
                  {/*              // console.log(availableFields,selectedField.split(' ')[0])*/}
                  {/*              return selectedFields?.some(field => {*/}
                  {/*                // console.log(fieldsState,field,fieldsState.includes(field))*/}
                  {/*                return availableField.db_adress === field.split(' ')[0] && availableField.column_name !== field.split(' ')[1];*/}
                  {/*              })*/}

                  {/*            })*/}
                  {/*            .map(item => {*/}
                  {/*              return `${item.db_adress} ${item.column_name}`;*/}
                  {/*            })*/}

                  {/*          }*/}
                  {/*          renderValue={(values) => {*/}
                  {/*            return values.map((value, index) => {*/}
                  {/*              // console.log(value)*/}
                  {/*              return (*/}
                  {/*                <Tag*/}
                  {/*                  key={index}*/}
                  {/*                  closable // Добавляем крестик для закрытия*/}
                  {/*                  onClose={(e) => {*/}
                  {/*                    e.stopPropagation()*/}
                  {/*                    setSelectedFields(prev => {*/}
                  {/*                      console.log(prev, value)*/}
                  {/*                      return prev.filter(item => item !== value)*/}
                  {/*                    })*/}
                  {/*                    // console.log(value)*/}
                  {/*                  }} // Обработчик удаления*/}
                  {/*                  style={{*/}

                  {/*                    backgroundColor: db_colors[value.split(' ')[0]] || 'gray', // Фон тега*/}
                  {/*                    color: 'white', // Цвет текста*/}
                  {/*                    borderRadius: '4px', // Скругление углов*/}
                  {/*                    padding: '4px 8px', // Внутренние отступы*/}
                  {/*                    paddingRight: '30px',*/}
                  {/*                    marginRight: '4px' // Отступы между тегами*/}
                  {/*                  }}*/}
                  {/*                >*/}
                  {/*                  {value.split(' ')[1]} /!* Показываем только вторую часть значения *!/*/}
                  {/*                </Tag>*/}
                  {/*              );*/}
                  {/*            });*/}
                  {/*          }}*/}
                  {/*          renderMenuItem={(label, item) => {*/}
                  {/*            const colors = ['red', 'green', 'blue'];*/}
                  {/*            return (*/}
                  {/*              <div*/}
                  {/*                key={`${label}.${item.db}${item.index}`}*/}
                  {/*                // className={styles.available_field}*/}
                  {/*                style={{*/}
                  {/*                  display: 'flex',*/}
                  {/*                  alignItems: 'center',*/}
                  {/*                  gap: 8*/}
                  {/*                }}*/}

                  {/*              >*/}
                  {/*                <label>*/}
                  {/*                  {label}*/}
                  {/*                </label>*/}
                  {/*                <label style={{*/}
                  {/*                  color: db_colors[item.db]*/}
                  {/*                }}>*/}
                  {/*                  {item.db}*/}
                  {/*                </label>*/}
                  {/*              </div>*/}


                  {/*            )*/}
                  {/*          }}*/}
                  {/*          onChangeOutside={handleFields}*/}
                  {/*          value={selectedFields.map((item, index) => {*/}
                  {/*            // console.log(item)*/}
                  {/*            return item*/}
                  {/*          })}*/}

                  {/*          // style={{width: 224}}*/}
                  {/*          container={getContainer}*/}
                  {/*          preventOverflow*/}
                  {/*        />*/}

                  {/*      )}*/}

                  {/*    </PreventOverflowContainer>*/}
                  {/*  </div>*/}
                  {/*)}*/}

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

