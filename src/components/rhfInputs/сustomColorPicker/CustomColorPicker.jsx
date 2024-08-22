import React from "react";
import {Controller, useFormContext} from "react-hook-form";
// import styles from "./customColorPicker.module.scss";

export const CustomColorPicker = ({name, defaultValue = "#000000", onChangeOutside, className}) => {
  const {control} = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({field}) => (
        <input
          {...field}
          type="color"
          value={field.value || defaultValue}
          onChange={(e) => {
            const colorValue = e.target.value;
            field.onChange(colorValue);
            onChangeOutside && onChangeOutside(colorValue);
          }}
          // className={className || styles.colorPicker}
        />
      )}
    />
  );
};