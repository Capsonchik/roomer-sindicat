import React from "react";
import {Controller, useFormContext} from "react-hook-form";
import {InputNumber} from "rsuite";
import styles from "./customInputNumber.module.scss";

export const CustomInputNumber = (
  {
    name,
    placeholder,
    onChangeOutside,
    className,
    defaultValue,
    formatter = (value) => `${value} %`,
  }
) => {
  const {control} = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({field}) => (
        <InputNumber
          {...field}
          value={field.value || 0}
          formatter={formatter}
          onChange={(value) => {
            const numericValue = Number(value);
            field.onChange(numericValue);
            onChangeOutside && onChangeOutside(numericValue);
          }}
          className={className || styles.barWidth}
          placeholder={placeholder}
        />
      )}
    />
  );
};
