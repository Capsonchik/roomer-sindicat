import CustomToggle from "../../../../components/rhfInputs/customToggle/CustomToggle";
import React from "react";
import styles from './bar.module.scss'

export const Bar = () => {
  return (
    <div className={styles.wrapper}>
      <CustomToggle
        name={'stack'}
        checkedChildren={'Stack'}
        unCheckedChildren={'Unstack'}
      />
    </div>
  )
}