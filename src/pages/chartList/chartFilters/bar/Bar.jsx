import CustomToggle from "../../../../components/rhfInputs/customToggle/CustomToggle";
import React from "react";
import styles from './bar.module.scss'
import {CustomSlider} from "../../../../components/rhfInputs/customSlider/CustomSlider";
import {useFormContext} from "react-hook-form";
import cl from "classnames";

export const Bar = () => {
  const {getValues} = useFormContext()
  const stack = getValues('stack')
  // const isXAxis = getValues('isXAxis')
  // console.log(isXAxis)
  return (
    <div className={styles.wrapper}>
      <h6 className={styles.title}>Бар</h6>
      <div className={styles.row}>
        <div className={cl(styles.input_wrapper, {}, [styles.data_wrapper])}>
          <label>Стек</label>
          <CustomToggle
            className={cl(styles.input, {}, [])}
            name={'stack'}
            checkedChildren={'Stack'}
            unCheckedChildren={'Unstack'}
          />

        </div>
        <div className={cl(styles.input_wrapper, {}, [styles.data_wrapper])}>
          <label>Ширина бара</label>
          <CustomSlider
            className={cl(styles.input, {}, [styles.slider])}
            name={'column_width'}
            max={50}
            step={10}
          />


        </div>
      </div>
      <div className={styles.row}>
        {!stack && <div className={cl(styles.input_wrapper, {}, [styles.data_wrapper])}>
          <label>Растояние между колонками</label>
          <CustomSlider
            className={cl(styles.input, {}, [styles.slider])}
            name={'column_gap'}
            min={-10}
            max={50}
            step={10}
          />


        </div>}

      </div>


    </div>
  )
}