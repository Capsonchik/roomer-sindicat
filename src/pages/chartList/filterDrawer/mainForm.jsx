import styles from "./filterDrawer.module.scss";
import {CustomInput} from "../../../components/rhfInputs/customInput/CustomInput";
import CustomToggle from "../../../components/rhfInputs/customToggle/CustomToggle";
import cl from "classnames";
import React from "react";


export const MainForm = () => {
  return (
    <div>
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
          <h6 className={styles.label}>Лимит</h6>
          <CustomToggle
            className={cl(styles.input_wrapper, {}, [styles.input_toggle])}
            name={'islimited'}
            checkedChildren={'Вкл'}
            unCheckedChildren={'Выкл'}
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
        <div className={styles.input_wrapper}>
          <h6 className={styles.label}>Data limiting</h6>
          <CustomToggle
            className={cl(styles.input_wrapper, {}, [styles.input_toggle])}
            name={'column_limit'}
            checkedChildren={'Вкл'}
            unCheckedChildren={'Выкл'}
          />
        </div>
      </div>
    </div>
  )
}