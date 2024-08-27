import cl from "classnames";
import React, {useEffect, useRef} from "react";
import {useFormContext, Controller} from "react-hook-form";
import {Input, InputGroup} from "rsuite";

import styles from "./customInput.module.scss";


export const CustomInput = (
  {
    name,
    type = "text",
    placeholder,
    className,
    after,
    as = 'input'
  }
) => {
  // Используем контекст формы для доступа к управлению и ошибкам
  const {
    control,
    formState: {errors},
    clearErrors
  } = useFormContext();
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if(!inputRef.current.contains(e.target)) {
        clearErrors(name)
      }
      // console.log(e.target, inputRef.current)
    }

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    }
  }, []);

  // Приведение ошибки к строке
  const errorMessage = typeof errors[name]?.message === "string" ? errors[name]?.message : '';

  return (
    <div className={cl(styles.inputWrapper, className)} ref={inputRef}>
      <Controller
        name={name}
        control={control}
        render={({field}) => (
          <InputGroup className={cl(styles.inputGroup)}>
            <Input
              as={as}
              {...field}
              type={type} // Передаем тип инпута
              placeholder={placeholder}
              className={className}
              onChange={(value) => field.onChange(value)}
              // onBlur={() => {
              //   field.onBlur(); // Вызов onBlur для управления формой
              //   clearErrors(name); // Очищаем ошибку при потере фокуса
              // }}
            />
            {after && after()}
          </InputGroup>
        )}
      />
      {/* Отображаем ошибку, если она есть */}
      <div className={cl(styles.inputError, {
        [styles.hasError]: !!errorMessage
      })}>{errorMessage}</div>
    </div>
  );
};
