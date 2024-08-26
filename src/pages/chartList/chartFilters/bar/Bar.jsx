import CustomToggle from "../../../../components/rhfInputs/customToggle/CustomToggle";
import React from "react";
import styles from './bar.module.scss'
import {CustomSlider} from "../../../../components/rhfInputs/customSlider/CustomSlider";
import {useFormContext} from "react-hook-form";

export const Bar = () => {
  const {getValues} = useFormContext()
  // const stack = getValues('stack')
  // const isXAxis = getValues('isXAxis')
  // console.log(isXAxis)
  return (
    <div className={styles.wrapper}>
      <h6 className={styles.title}>Бар</h6>
      <div className={styles.row}>
        <CustomToggle
          name={'stack'}
          checkedChildren={'Stack'}
          unCheckedChildren={'Unstack'}
        />
        <div className={styles.width_bar}>
          <label>Ширина бара</label>
          <CustomSlider
            className={styles.slider}
            name={'column_width'}
            max={100}
            step={10}
          />
        </div>

      </div>

    </div>
  )
}