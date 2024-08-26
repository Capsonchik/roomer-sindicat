import cl from "classnames";
import React from "react";
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
  }
) => {
  // Используем контекст формы для доступа к управлению и ошибкам
  const {
    control,
    formState: {errors},
  } = useFormContext();

  // Приведение ошибки к строке
  const errorMessage = typeof errors[name]?.message === "string" ? errors[name]?.message : '';

  return (
    <div className={cl(styles.inputWrapper, className)}>
      <Controller
        name={name}
        control={control}
        render={({field}) => (
          <InputGroup className={cl(styles.inputGroup)}>
            <Input
              {...field}
              type={type} // Передаем тип инпута
              placeholder={placeholder}
              className={cl(styles.input)}
              onChange={(value) => field.onChange(value)}
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
