import React from "react";
import {Controller, useFormContext} from "react-hook-form";
import {Slider} from "rsuite";
// import styles from "./customSlider.module.scss";

export const CustomSlider = (
  {
    name,
    defaultValue = 50,
    onChangeOutside,
    progress = true,
    min = 0,
    max = 100,
    step = 1,
    className
  }
) => {
  const {control} = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({field}) => (
        <Slider
          graduated
          progress
          {...field}
          // progress={progress}
          defaultValue={field.value}
          min={min}
          max={max}
          step={step}
          renderMark={mark => {
            return mark;
          }}
          onChange={value => {
            // Update the form field value
            field.onChange(value);
            // Call external onChange handler, if provided
            onChangeOutside && onChangeOutside(value);
          }}
          className={className}
        />
      )}
    />
  );
};

