import styles from "./filterDrawer.module.scss";
import {Button, Tag} from "rsuite";
import EditIcon from "@rsuite/icons/Edit";
import React, {useState} from "react";
import MinusIcon from "@rsuite/icons/Minus";
import {CustomInput} from "../../../components/rhfInputs/customInput/CustomInput";
import CustomToggle from "../../../components/rhfInputs/customToggle/CustomToggle";
import cl from "classnames";
import {CustomTagPicker} from "../../../components/rhfInputs/customTagPicker/CustomTagPicker";
import {FormProvider, useForm} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {colors} from "../chart/config";
import {createFilter, deleteFilter, getFilters, updateFilter} from "../../../store/chartSlice/filter.actions";
import {useDispatch, useSelector} from "react-redux";
import {selectActiveGroupId} from "../../../store/chartSlice/chart.selectors";
import {PreventOverflowContainer} from "../chartFilters/main/MainForm";


export const EditFilterForm = ({filter, availableFields}) => {
  const dispatch = useDispatch()
  const activeGroupId = useSelector(selectActiveGroupId)
  const [isEditFilter, setIsEditFilter] = useState(false)
  const [isDeleteFilter, setIsDeleteFilter] = useState(false)
  const db_colors = availableFields.reduce((acc, item, index) => {
    const name = item.db_adress
    if (!acc[name]) {
      acc[name] = colors[index]
    }

    return acc

  }, {})
  // console.log(db_colors)
  const [fieldsState, setFieldsState] = useState(filter.filter_data.map(field => {

    return `${field.db_name} ${field.column_name}`
  }))
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
      filter_name: filter.filter_name,
      multi: filter.multi,
      isactive: filter.isactive,
      filter_data: filter.filter_data
    }
  })
  const handleFields = (data) => {
    const newFields = data.map(field => {
      const [db_name, column_name] = field.split(' ')
      return `${db_name} ${column_name}`
    })
    setFieldsState(newFields)
  }

  const handleUpdateFilter = (data) => {
    // console.log(data)
    if (!fieldsState?.length) return
    const request = {
      // filter_group_id: data.group_id,
      filter_name: data.filter_name,
      multi: Boolean(data.multi),
      isactive: Boolean(data.isactive),
      filter_data: fieldsState.map(field => {
        const [db_name, column_name] = field.split(' ')
        return {
          db_name,
          column_name
        }
      })
    }

    console.log(request, filter.filter_id)
    const filter_id = filter.filter_id
    console.log(request)
    dispatch(updateFilter({filter_data: request, filter_id}))
      .then(() => {
        dispatch(getFilters(activeGroupId))
        // onClose()
        setIsEditFilter(false)
      })
  }
  // console.log(fieldsState)
  if (isEditFilter) {
    // console.log(filter)
    return (
      <FormProvider {...methods}>
        <div className={styles.edit_top_btn} onClick={() => {
          setIsEditFilter(false)
        }}>
          <MinusIcon style={{fontSize: 20}}/>
          <p>Скрыть</p>
        </div>
        <h5 className={styles.create_filter_title}>Редактирование фильтра</h5>

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


          <div className={cl(styles.input_wrapper, {}, [styles.available_fields])}>
            <h6 className={styles.label}>Доступные поля</h6>
            <PreventOverflowContainer>
              {getContainer => (
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
                  disabledItemValues={availableFields
                    .filter(availableField => {
                      // console.log(availableFields,selectedField.split(' ')[0])
                      return fieldsState.some(field => {
                        // console.log(fieldsState,field,fieldsState.includes(field))
                        return availableField.db_adress === field.split(' ')[0] && availableField.column_name !== field.split(' ')[1];
                      })

                    })
                    .map(item => {
                      return `${item.db_adress} ${item.column_name}`;
                    })

                  }
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
                        <label style={{
                          color: db_colors[item.db]
                        }}>
                          {item.db}
                        </label>
                      </div>


                    )
                  }}
                  // tagProps={(tagValue) => ({
                  //   style: { backgroundColor: 'red' } // Динамическая функция для фона
                  // })}
                  renderValue={(values) => {
                    return fieldsState.map((value, index) => {
                      // console.log(value)
                      return (
                        <Tag
                          key={index}
                          closable // Добавляем крестик для закрытия
                          onClose={(e) => {
                            e.stopPropagation()
                            setFieldsState(prev => {
                              console.log(prev, value)
                              return prev.filter(item => item !== value)
                            })
                            // console.log(value)
                          }} // Обработчик удаления
                          style={{

                            backgroundColor: db_colors[value.split(' ')[0]] || 'gray', // Фон тега
                            color: 'white', // Цвет текста
                            borderRadius: '4px', // Скругление углов
                            padding: '4px 8px', // Внутренние отступы
                            paddingRight: '30px',
                            marginRight: '4px' // Отступы между тегами
                          }}
                        >
                          {value.split(' ')[1]} {/* Показываем только вторую часть значения */}
                        </Tag>
                      );
                    });
                  }}
                  onChangeOutside={handleFields}
                  value={fieldsState.map((item, index) => {
                    return item
                  })}

                  // style={{width: 224}}
                  // container={getContainer}
                  container={getContainer}
                  preventOverflow
                />
              )}

            </PreventOverflowContainer>


          </div>


          <div className={styles.buttons}>
            <Button
              className={cl(styles.delete_btn, {
                [styles.isDelete]: isDeleteFilter
              }, [])}
              onClick={(e) => {
                if (isDeleteFilter) {
                  e.stopPropagation()
                  dispatch(deleteFilter(filter.filter_id)).then(() => {
                    setIsEditFilter(false)
                    dispatch(getFilters(activeGroupId))
                  })
                } else {
                  setIsDeleteFilter(true)
                }
              }}
            >
              {isDeleteFilter ? 'Да, удалить' : 'Удалить'}
            </Button>
            <Button
              disabled={!fieldsState?.length}
              className={cl(styles.patch_btn, {}, [])}
              onClick={(e) => {

                e.stopPropagation()
                methods.handleSubmit(handleUpdateFilter)()

              }}
            >Сохранить


            </Button>
          </div>


        </div>
      </FormProvider>

    )
  }

  return (
    <div key={filter.filter_name} className={styles.filter_wrapper}>
      <p>{filter.filter_name}</p>
      <div className={styles.line}></div>
      <Button onClick={() => {
        setIsEditFilter(true)

        // dispatch(setActiveChart(chart))
        // dispatch(setOpenDrawer(true))
      }}>
        <EditIcon/>
      </Button>
    </div>
  )
}