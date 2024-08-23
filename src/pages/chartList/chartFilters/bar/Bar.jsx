import CustomToggle from "../../../../components/rhfInputs/customToggle/CustomToggle";
import React from "react";
import styles from './bar.module.scss'
import {CustomSlider} from "../../../../components/rhfInputs/customSlider/CustomSlider";

export const Bar = () => {
  return (
    <div className={styles.wrapper}>
      <CustomToggle
        name={'stack'}
        checkedChildren={'Stack'}
        unCheckedChildren={'Unstack'}
      />
      {/*<CustomSlider name={'column_width'}/>*/}
    </div>
  )
}