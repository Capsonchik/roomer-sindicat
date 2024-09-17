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
    renderMenuItem,
    container,
    preventOverflow = true,
    placement = 'topEnd',
    disabledItemValues = [],
    defaultValue
  }
) => {
  const {control} = useFormContext();

  return (
    <div className={styles.wrapper}>
      <Controller
        name={name}
        control={control}
        render={({field}) => (
          <CheckPicker
            defaultValue={defaultValue}
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
            disabledItemValues={disabledItemValues}
            // block={true}
            // sticky={false}
            // placement={placement} // Начальное направление открытия меню
            container={container}
            preventOverflow // Включение автоматического определения переполнения
          />
        )}
      />
    </div>
  );
};

