import styles from './label.module.scss'
import {CustomInput} from "../../../../components/rhfInputs/customInput/CustomInput";
import React from "react";
import {CustomSelectPicker} from "../../../../components/rhfInputs/selectPicker/SelectPicker";
import {SelectPicker} from "rsuite";
import {labelArray} from "../../label.config";
import cl from "classnames";
import {CustomSlider} from "../../../../components/rhfInputs/customSlider/CustomSlider";
import {PreventOverflowContainer} from "../main/MainForm";
import {CustomInputNumber} from "../../../../components/rhfInputs/customInputNumber/CustomInputNumber";

export const Label = () => {
  return (
    <div className={styles.wrapper}>
      <h6 className={styles.title}>Label</h6>
      <div className={styles.row}>
        <div className={cl(styles.input_wrapper, {}, [styles.data_wrapper])}>
          <label className={styles.label_input}>Положение</label>
          <PreventOverflowContainer
          height={40}>
            {getContainer => (
              <CustomSelectPicker
                name={'label_position'}
                data={labelArray.map((item) => ({label: item, value: item}))}
                searchable={false}
                placeholder="Положение label"
                className={styles.position}
                container={getContainer}
                preventOverflow
              />
            )}

          </PreventOverflowContainer>
        </div>
        <div className={cl(styles.input_wrapper, {}, [styles.data_wrapper])}>
          <label className={styles.label_input}>Количество чисел после запятой</label>
          <CustomInputNumber name={'format_value'} min={0}/>
          {/*<CustomSlider*/}
          {/*  className={cl(styles.input, {}, [])}*/}
          {/*  name={'label_size'}*/}
          {/*  max={24}*/}
          {/*  min={16}*/}
          {/*  step={1}*/}
          {/*/>*/}
        </div>
      </div>
    </div>
  )
}