import React from "react";
import {Controller, useFormContext} from "react-hook-form";
import {Toggle} from "rsuite";
import styles from "./customToggle.module.scss";

const CustomToggle = (
  {
    name,
    checked,
    onChangeOutside,
    checkedChildren = "X Axis",
    unCheckedChildren = "Y Axis",
    className,
    size = "lg"
  }
) => {
  const {control} = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({field}) => (
        <Toggle
          {...field}
          size={size}
          checkedChildren={checkedChildren}
          unCheckedChildren={unCheckedChildren}
          checked={field.value}
          onChange={() => {
            // Update the form field value
            field.onChange(!field.value);
            // Call external onChange handler, if provided
            onChangeOutside && onChangeOutside(!field.value);
          }}
          className={className || styles.axisToggle}
        />
      )}
    />
  );
};

export default CustomToggle;