import React from "react";
import {Controller, useFormContext} from "react-hook-form";
import {TagPicker} from "rsuite";
import styles from "./customTagPicker.module.scss";

export const CustomTagPicker = (
  {
    name,
    data,
    value,
    onChangeOutside,
    placeholder = "Select tags",
    className,
    searchable = false,
    appearance = "default",
    disabled,
    renderMenuItem,
    container,
    preventOverflow,
    renderValue
  }
) => {
  const {control} = useFormContext();

  return (
    <div className={styles.wrapper}>
      <Controller
        name={name}
        control={control}
        render={({field}) => (
          <TagPicker
            {...field}
            className={className}
            renderValue={renderValue}
            data={data}
            value={value}
            disabled={disabled}
            onChange={(selectedValues) => {
              // Update the form field value
              field.onChange(selectedValues);

              // Call external onChange handler, if provided
              onChangeOutside && onChangeOutside(selectedValues);
            }}
            searchable={searchable}
            appearance={appearance}
            placeholder={placeholder}
            renderMenuItem={renderMenuItem}
            container={container}
            preventOverflow={preventOverflow} // Включение автоматического определения переполнения
            // style={{width: 300}} // Задайте ширину компонента, если необходимо
          />
        )}
      />
    </div>
  );
};
