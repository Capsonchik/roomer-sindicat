import {Button, Drawer} from "rsuite";
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
  selectActiveGroupId, selectActiveReport,
  selectGroupsReports,
  selectReportsClients
} from "../../../store/chartSlice/chart.selectors";
import ExpandOutlineIcon from '@rsuite/icons/ExpandOutline';
import MinusIcon from '@rsuite/icons/Minus';
import {CustomCheckPicker} from "../../../components/rhfInputs/checkPicker/CheckPicker";
import {fetchColumnDB} from "../../../store/chartSlice/filter.actions";
import * as yup from "yup";

export const FilterDrawer = ({open, onClose}) => {
  const loginSchema = yup.object().shape({
    address_db: yup.array().of(
      yup.object().shape({
        db_name: yup.string().required("Название обязательно"), // Валидация для каждого объекта в массиве
      })
    ),
  });
  const methods = useForm({
    resolver: yupResolver(loginSchema),
    shouldFocusError: false,
    // defaultValues: {
    //   title: '',
    //   description: '',
    //   report_id: null
    // }
  })

  const {fields, append, remove} = useFieldArray({
    control: methods.control, // control props comes from useForm (optional: if you are using FormContext)
    name: "address_db", // unique name for your Field Array
    defaultValues: {
      address_db: [{db_name: ''}]
    }
  });

  const dispatch = useDispatch()
  const activeGroupId = useSelector(selectActiveGroupId)
  const reportsClients = useSelector(selectReportsClients)
  const groupsReports = useSelector(selectGroupsReports)
  const activeReport = useSelector(selectActiveReport)
  const [isOpenDBInputs, setIsOpenDBInputs] = useState(false)
  const [availableFields, setAvailableFields] = useState([])

  useEffect(() => {
    methods.reset({
      report_id: activeReport,
      group_id: activeGroupId,
      address_db: [{db_name: ''}] // Ensure address_db has a default entry
    })
  }, [open]);
  const {errors} = methods.formState;

  const handleDBNames = (data) => {
    console.log(data,methods.formState)
    // dispatch(fetchColumnDB)
  }
  // console.log(get(errors, `address_db.${index}.db_name`))
  // fetchColumnDB
  return (
    <Drawer open={open} onClose={() => {
      onClose()
      // setIsDelete(false)
      // methods.reset({})
    }} style={{maxWidth: 700, width: '100%'}}>
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
              <p>Добавьте фильтры</p>
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
              <div className={styles.open_db_inputs} onClick={() => {
                setIsOpenDBInputs(false)
              }}>
                <MinusIcon style={{fontSize: 20}}/>
                <p>Скрыть</p>
              </div>
            )}
            {isOpenDBInputs && (
              <>
                <div className={styles.input_wrapper}>
                  <h6 className={styles.label}>Адрес таблицы БД</h6>
                  <div className={styles.fields}>
                    {fields.map((field, index) => (
                      <div className={cl(styles.input_wrapper, {
                        [styles.db_input]: !!index || fields.length > 1
                      })} key={field.id}>
                        <CustomInput className={styles.input_db_wrapper} name={`address_db.${index}.db_name`}
                                     placeholder={'Введите адрес бд'}/>
                        {/* Отображение ошибки для этого поля */}
                        {/*{console.log(get(errors, `address_db.${index}.db_name`))}*/}

                        <div className={cl(styles.error, {
                          [styles.hasError]: !!get(errors, `address_db.${index}.db_name`)
                        })}>{get(errors, `address_db.${index}.db_name`)?.message}</div>
                        {/*{get(errors, `address_db.${index}.db_name`) && (*/}
                        {/*  <p className={styles.error}>*/}
                        {/*    хоп*/}
                        {/*    /!*{get(errors, `address_db.${index}.db_name`).message}*!/*/}
                        {/*  </p>*/}
                        {/*)}*/}
                        <MinusIcon style={{
                          cursor: 'pointer',
                          fontSize: 20,
                          display: !!index || fields.length > 1 ? 'block' : 'none'
                        }} onClick={() => {
                          remove(index)
                        }}/>
                      </div>
                    ))}
                  </div>

                  <div className={styles.input_db_control}>
                  <Button onClick={(e) => {
                      e.stopPropagation()
                      // methods.trigger()
                      // methods.trigger('address_db');
                      get(errors, `address_db`)
                      methods.handleSubmit(handleDBNames)()
                    }} className={styles.patch_btn}>Применить</Button>

                    <div className={styles.open_db_inputs} onClick={() => {
                      append({db_name: ''})
                    }}>
                      <ExpandOutlineIcon style={{fontSize: 20}}/>
                      <p>Добавить таблицу</p>
                    </div>
                  </div>


                </div>


                {!availableFields.length && (
                  <div className={cl(styles.input_wrapper, {}, [styles.available_fields])}>
                    <h6 className={styles.label}>Доступные поля</h6>
                    <PreventOverflowContainer

                    >
                      {getContainer => (
                        <CustomCheckPicker
                          className={styles.visible_list}
                          // placement={'bottomStart'}
                          name={"seriesData"}
                          data={availableFields.map((item, index) => {
                            return {value: item, label: item, index}; // Передаем индекс в объекте
                          })}
                          // onChangeOutside={handleSeriesChange}
                          // value={Object.keys(visibleSeries).filter((name) => visibleSeries[name])}

                          style={{width: 224}}
                          container={getContainer}
                          preventOverflow
                        />
                      )}

                    </PreventOverflowContainer>
                  </div>
                )}


              </>
            )}


          </FormProvider>
        </div>
      </Drawer.Body>
    </Drawer>
  )
}
