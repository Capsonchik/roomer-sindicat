import styles from './mainForm.module.scss'
import {CustomInput} from "../../../../../components/rhfInputs/customInput/CustomInput";
import {CustomSlider} from "../../../../../components/rhfInputs/customSlider/CustomSlider";
import cl from "classnames";
import React from "react";
import {useFormContext} from "react-hook-form";
import CustomToggle from "../../../../../components/rhfInputs/customToggle/CustomToggle";

export const MainForm = () => {
  const {handleSubmit} = useFormContext()
  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <div className={styles.input_wrapper}>
          <label>Название</label>
          <CustomInput name={'title'}/>
        </div>
        <div className={styles.input_wrapper}>
          <label>Rose type</label>
          <CustomToggle
            // className={cl(styles.input, {}, [])}
            name={'roseType'}
            checkedChildren={'area'}
            unCheckedChildren={'radius'}
          />
        </div>

      </div>

      <div className={styles.input_wrapper}>
        <label>Радиус</label>
        <CustomSlider
          // className={cl(styles.input, {}, [styles.slider])}
          name={'radius'}
          max={80}
          min={0}
          step={10}

        />
      </div>
      <div className={styles.input_wrapper}>
        <label>Gap</label>
        <CustomSlider
          // className={cl(styles.input, {}, [styles.slider])}
          name={'padAngle'}
          max={10}
          min={0}
          step={1}
        />
      </div>
      <div className={styles.input_wrapper}>
        <label>Border radius</label>
        <CustomSlider
          // className={cl(styles.input, {}, [styles.slider])}
          name={'borderRadius'}
          max={10}
          min={0}
          step={1}
        />
      </div>
    </div>
  )
}