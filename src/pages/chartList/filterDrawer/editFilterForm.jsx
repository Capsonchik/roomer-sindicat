import styles from "./filterDrawer.module.scss";
import {Button} from "rsuite";
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


export const EditFilterForm = ({filter,availableFields}) => {
  const [isEditFilter, setIsEditFilter] = useState(false)
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
  // console.log(availableFields)
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
              // onChangeOutside={handleSeriesChange}
              value={filter.filter_data.map((item, index) => {
                return `${item.db_name} ${item.column_name}`
              })}

              // style={{width: 224}}
              // container={getContainer}
              preventOverflow
            />


          </div>


          <div className={styles.buttons}>
            <Button
              className={cl(styles.patch_btn, {}, [styles.create_filter_btn])}
              onClick={(e) => {
                e.stopPropagation()
                // methods.handleSubmit(handleCreateFilter)()
              }}
            >Сохранить
            </Button>
            <Button
              className={cl(styles.patch_btn, {}, [styles.create_filter_btn])}
              onClick={(e) => {
                e.stopPropagation()
                // methods.handleSubmit(handleCreateFilter)()
              }}
            >Удалить
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