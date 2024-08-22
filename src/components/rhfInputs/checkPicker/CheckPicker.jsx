import React from "react";
import {Controller, useFormContext} from "react-hook-form";
import {CheckPicker} from "rsuite";
import styles from "./checkPicker.module.scss";

export const CustomCheckPicker = (
  {
    name,
    data,
    value,
    onChangeOutside,
    lineColors,
    setVisibleSeries,
    placeholder = "Select series to display",
    className,
    searchable = false,
    appearance = "default",
    disabled,
    renderMenuItem
  }
) => {
  const {control} = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({field}) => (
        <CheckPicker
          {...field}
          className={className}
          data={data}
          value={value}
          disabled={disabled}
          onChange={(selectedValues) => {
            // Update the form field value
            field.onChange(selectedValues);
            // Call external onChange handler, if provided
            onChangeOutside && onChangeOutside(selectedValues);

            // Update visible series
            // const newVisibleSeries = Object.fromEntries(
            //   Object.keys(data).map((name) => [name, selectedValues.includes(name)])
            // );
            // setVisibleSeries(newVisibleSeries);
          }}
          searchable={searchable}
          appearance={appearance}
          placeholder={placeholder}
          // className={styles.select}
          renderMenuItem={renderMenuItem}
          placement="bottomStart" // Начальное направление открытия меню
          // preventOverflow={true} // Включение автоматического определения переполнения
        />
      )}
    />
  );
};
