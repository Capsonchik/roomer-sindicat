import styles from './label.module.scss'
import {CustomInput} from "../../../../components/rhfInputs/customInput/CustomInput";
import React from "react";
import {CustomSelectPicker} from "../../../../components/rhfInputs/selectPicker/SelectPicker";
import {SelectPicker} from "rsuite";
import {labelArray} from "../../label.config";
import cl from "classnames";
import {CustomSlider} from "../../../../components/rhfInputs/customSlider/CustomSlider";

export const Label = () => {
  return (
    <div className={styles.wrapper}>
      <h6 className={styles.title}>Label</h6>
      <div className={styles.row}>
        <div className={cl(styles.input_wrapper, {}, [styles.data_wrapper])}>
          <label className={styles.label_input}>Положение</label>
          <CustomSelectPicker
            name={'label_position'}
            data={labelArray.map((item) => ({label: item, value: item}))}
            searchable={false}
            placeholder="Положение label"
            className={styles.position}
          />
        </div>
        <div className={cl(styles.input_wrapper, {}, [styles.data_wrapper])}>
          <label className={styles.label_input}>Размер шрифта</label>
          <CustomSlider
            className={cl(styles.input, {}, [])}
            name={'label_size'}
            max={24}
            min={16}
            step={1}
          />
        </div>
      </div>
    </div>
  )
}