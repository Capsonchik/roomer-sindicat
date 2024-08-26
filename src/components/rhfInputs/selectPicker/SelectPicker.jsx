import React from "react";
import {Controller, useFormContext} from "react-hook-form";
import {SelectPicker} from "rsuite";
import styles from "./selectPicker.module.scss";

export const CustomSelectPicker = (
  {
    name,
    data,
    value,
    placeholder = "Выберите тип графика",
    onChangeOutside,
    className,
    searchable = false,
    appearance = "default",
    container,
    preventOverflow
  }
) => {
  const {control} = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({field}) => (
        <SelectPicker
          {...field}
          data={data}
          value={value}
          onChange={(selectedValue) => {
            // Update the form field value
            field.onChange(selectedValue);
            // Call external onChange handler, if provided
            onChangeOutside && onChangeOutside(selectedValue);
          }}
          searchable={searchable}
          appearance={appearance}
          placement="bottomStart"
          placeholder={placeholder}
          className={className || styles.type}
          container={container}
          preventOverflow
        />
      )}
    />
  );
};
