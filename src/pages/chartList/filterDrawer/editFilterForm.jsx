import styles from "./filterDrawer.module.scss";
import {Button, Tag} from "rsuite";
import EditIcon from "@rsuite/icons/Edit";
import React, {useEffect, useState} from "react";
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
import {removeFilter, setFilters} from "../../../store/chartSlice/filter.slice";
import {axiosGraphRequest} from "../../../api/ApiConfig";
import {MainForm} from "./mainForm";
import {DefaultFilterFields} from "./DefaultFilterFields";
import {LimitedFilterFields} from "./LimitedFilterFields";


export const EditFilterForm = ({filter, availableFields}) => {
  const dispatch = useDispatch()
  const activeGroupId = useSelector(selectActiveGroupId)
  const [isEditFilter, setIsEditFilter] = useState(false)
  const [isDeleteFilter, setIsDeleteFilter] = useState(false)


  // console.log(filter, availableFields)
  let currentColorIndex = 0
  const db_colors = availableFields?.reduce((acc, item, index) => {
    const name = item.db_adress
    if (!acc[name]) {

      // console.log(acc[name],colors[index])
      acc[name] = colors[currentColorIndex]
      currentColorIndex++
    }

    return acc

  }, {})
  // console.log(db_colors)
  const [fieldsState, setFieldsState] = useState(filter?.filter_data?.map(field => {

    return `${field.db_name} ${field.column_name}`
  }))
  const [limitFieldsState, setLimitFieldsState] = useState(filter?.filter_data?.map(field => {

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
    // shouldFocusError: false,
    // defaultValues: {
    //
    // }
  })

  useEffect(() => {
    if (filter) {
      methods.reset({
        filter_name: filter.filter_name,
        multi: filter.multi,
        isactive: filter.isactive,
        islimited: filter.islimited,
        filter_data: filter.filter_data,
        column_limit: filter.column_limit,
        data_limiting: filter.data_limiting,
      })
    }

  }, [filter])
  const handleFields = (data) => {
    const newFields = data.map(field => {
      const [db_name, column_name] = field.split(' ')
      return `${db_name} ${column_name}`
    })
    setFieldsState(newFields)
  }
  const handleLimitFields = (data) => {
    const newFields = data.map(field => {
      const [db_name, column_name] = field.split(' ')
      return `${db_name} ${column_name}`
    })
    // console.log(newFields)
    setLimitFieldsState(newFields)
    if (methods.getValues('filter_data').length) {
      getValuesFromColumn()
    }
    // } else {
    //   setLimitedFields([])
    //   // setLimitedRequestFields([])
    // }
  }

  useEffect(() => {
    if (limitFieldsState.length) {
      getValuesFromColumn()
    }


  }, [limitFieldsState])


  const [limitedRequestFields, setLimitedRequestFields] = useState()


  const handleLimitedRequestFields = (data) => {
    // console.log(data)
    const newFields = data.map(field => {
      // const [value, column_name,db_name,] = field.split(';')
      // return `${value};${column_name};${db_name}`
      return field
    })
    setLimitedRequestFields(newFields)
  }
  // console.log(limitedRequestFields)

  const [limitedFields, setLimitedFields] = useState()

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

  const handleUpdateFilter = (data) => {

    // console.log(data)
    // if (!fieldsState?.length) return
    const request = {
      // filter_group_id: data.group_id,
      filter_name: data.filter_name,
      multi: Boolean(data.multi),
      isactive: Boolean(data.isactive),
      islimited: Boolean(data.islimited),
      column_limit: Boolean(data.column_limit),
      filter_data: limitFieldsState.map(field => {
        const [db_name, column_name] = field.split(' ')
        return {
          db_name,
          column_name
        }
      })
    }

    // if (data.column_limit) {
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

    request['data_limiting'] = Object.entries(limited_fields).map(([key, value]) => {
      const [column, db] = key.split(';')
      return {
        db_name: db,
        column_name: column,
        value: value
      }
    })

    // console.log('limitedFields',limitedFields)
    // request['filter_data'] = Object.entries(limited_fields).map(([key,value]) => {
    //   const [column, db] = key.split(';')
    //   return {
    //     db_name:db,
    //     column_name: column
    //   }
    // })
    // request['column_limit'] = true

    // console.log(request);
    // return;
    // }
    // console.log(request, filter.filter_id)
    const filter_id = filter.filter_id
    // console.log(request)
    dispatch(updateFilter({filter_data: request, filter_id}))
      .then(() => {
        dispatch(removeFilter({activeGroupId}))
        setTimeout(() => {
          dispatch(getFilters(activeGroupId)).then((res) => {
            // console.log(res.payload)
            // dispatch(setFilters({data: res.payload, activeGroupId}))

            // dispatch(fetchAllChartsByGroupId({groupId: activeGroupId, filter_data: {filter_data: request}})).then(() => {
            //   dispatch(fetchAllChartsFormatByGroupId(activeGroupId));
            // });
          })
        }, 500)

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

          <MainForm/>


          {/*{!methods.getValues('column_limit') &&*/}
          {/*  <DefaultFilterFields*/}
          {/*    availableFields={availableFields}*/}
          {/*    fieldsState={fieldsState}*/}
          {/*    setFieldsState={setFieldsState}*/}
          {/*    db_colors={db_colors}*/}
          {/*    handleFields={handleFields}*/}
          {/*  />}*/}

          {/*{methods.getValues('column_limit') &&*/}
          <LimitedFilterFields
            fieldsState={fieldsState}
            setFieldsState={setFieldsState}
            setLimitedFields={setLimitedFields}
            availableFields={availableFields}
            limitFieldsState={limitFieldsState}
            db_colors={db_colors}
            setLimitFieldsState={setLimitFieldsState}
            handleLimitFields={handleLimitFields}
            getValuesFromColumn={getValuesFromColumn}
            limitedFields={limitedFields}
            setLimitedRequestFields={setLimitedRequestFields}
            limitedRequestFields={limitedRequestFields}
            handleLimitedRequestFields={handleLimitedRequestFields}

          />
          {/*}*/}


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
              // disabled={!fieldsState?.length || !limitedRequestFields.length}
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
      <p>{`${filter.filter_name} ${filter.column_limit ? '(лимит)' : ''}`}</p>
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