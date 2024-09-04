import React, {useEffect, useRef} from "react";
import {Controller, useFormContext} from "react-hook-form";
import {SelectPicker} from "rsuite";
import styles from "./selectPicker.module.scss";
import cl from "classnames";

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
    defaultValue = null,
    preventOverflow
  }
) => {
  const {
    control,
    formState: {errors},
    clearErrors
  } = useFormContext();

  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Если клик произошел за пределами input и форма не отправляется
      if (!inputRef.current.contains(e.target)) {
        clearErrors(name);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Предоставляем метод focus, который будет фокусироваться на контейнере
/*  useImperativeHandle(ref, () => ({
    focus: () => {
      if (inputRef.current) {
        inputRef.current.focus(); // фокусируемся на обертке
      }
    }
  }));*/

  // Приведение ошибки к строке
  const errorMessage = typeof errors[name]?.message === "string" ? errors[name]?.message : '';


  return (
    <div className={cl(styles.inputWrapper, className)} ref={inputRef}>
      <Controller
        name={name}
        control={control}
        render={({field}) => (
          <SelectPicker
            defaultValue={defaultValue}
            {...field}
            data={data}
            // value={value}
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
      {/* Отображаем ошибку, если она есть */}
      <div className={cl(styles.inputError, {
        [styles.hasError]: !!errorMessage
      })}>{errorMessage}</div>
    </div>
  );
};
