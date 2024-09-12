import styles from "./filterDrawer.module.scss";
import {Button} from "rsuite";
import EditIcon from "@rsuite/icons/Edit";
import React, {useState} from "react";
import MinusIcon from "@rsuite/icons/Minus";
import {CustomInput} from "../../../components/rhfInputs/customInput/CustomInput";
import CustomToggle from "../../../components/rhfInputs/customToggle/CustomToggle";
import cl from "classnames";
import {CustomTagPicker} from "../../../components/rhfInputs/customTagPicker/CustomTagPicker";


export const EditFilterForm = ({filter}) => {
  const [isEditFilter, setIsEditFilter] = useState(false)

  if (isEditFilter) {
  // console.log(filter)
    return (
      <>
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


          {/*{!!availableFields.length && (*/}
          {/*  <div className={cl(styles.input_wrapper, {}, [styles.available_fields])}>*/}
          {/*    <h6 className={styles.label}>Доступные поля</h6>*/}
          {/*    <CustomTagPicker*/}
          {/*      CustomTagPicker={styles.visible_list}*/}
          {/*      name={'filter_data'}*/}
          {/*      data={availableFields.map((item, index) => {*/}

          {/*        return {*/}
          {/*          value: `${item.db_adress} ${item.column_name}`,*/}
          {/*          label: item.column_name,*/}
          {/*          index,*/}
          {/*          db: item.db_adress*/}
          {/*        }; // Передаем индекс в объекте*!/*/}
          {/*      })}*/}
          {/*      renderMenuItem={(label, item) => {*/}
          {/*        const colors = ['red', 'green', 'blue'];*/}
          {/*        return (*/}
          {/*          <div*/}
          {/*            key={`${label}.${item.db}${item.index}`}*/}
          {/*            // className={styles.available_field}*/}
          {/*            style={{*/}
          {/*              display: 'flex',*/}
          {/*              alignItems: 'center',*/}
          {/*              gap: 8*/}
          {/*            }}*/}

          {/*          >*/}
          {/*            <label>*/}
          {/*              {label}*/}
          {/*            </label>*/}
          {/*            <label>*/}
          {/*              {item.db}*/}
          {/*            </label>*/}
          {/*          </div>*/}


          {/*        )*/}
          {/*      }}*/}
          {/*      onChangeOutside={handleSeriesChange}*/}
          {/*      value={selectedFields.map((item, index) => {*/}
          {/*        // console.log(item)*/}
          {/*        return item*/}
          {/*      })}*/}

          {/*      // style={{width: 224}}*/}
          {/*      // container={getContainer}*/}
          {/*      preventOverflow*/}
          {/*    />*/}


          {/*  </div>*/}
          {/*)}*/}

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
      </>

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