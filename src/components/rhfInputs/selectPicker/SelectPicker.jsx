import React, {useEffect, useRef, useState} from "react";
import {Controller, useFormContext} from "react-hook-form";
import {Button, SelectPicker} from "rsuite";
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
    preventOverflow,
    disabled = false,
    conditionForButton = false,  // условие для отображения кнопки
    buttonFunction = () => {},
    loading
  }
) => {
  const {
    control,
    formState: {errors},
    clearErrors
  } = useFormContext();

  const inputRef = useRef(null);
  const [placement, setPlacement] = useState("bottomStart");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!inputRef.current.contains(e.target)) {
        clearErrors(name);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Проверяем позицию элемента и меняем placement
  useEffect(() => {
    const handleResize = () => {
      if (inputRef.current) {
        const rect = inputRef.current.getBoundingClientRect();
        const distanceToBottom = window.innerHeight - rect.bottom;

        if (distanceToBottom < 320) {
          setPlacement("topStart");
        } else {
          setPlacement("bottomStart");
        }
      }
    };

    // Вызываем при монтировании и при изменении размера окна
    window.addEventListener("resize", handleResize);
    handleResize(); // первичная проверка

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const errorMessage = typeof errors[name]?.message === "string" ? errors[name]?.message : '';

  return (
    <div className={cl(styles.inputWrapper, className)} ref={inputRef}>
      <Controller
        name={name}
        control={control}
        render={({field}) => (
          <SelectPicker
            menuStyle={{ maxWidth: 200 }}
            disabled={disabled}
            defaultValue={defaultValue}
            {...field}
            data={data}
            onChange={(selectedValue) => {
              field.onChange(selectedValue);
              onChangeOutside && onChangeOutside(selectedValue);
            }}
            searchable={searchable}
            appearance={appearance}
            placement={placement}
            placeholder={placeholder}
            className={className || styles.type}
            container={container}
            loading={loading}
            renderExtraFooter={() =>
              conditionForButton && (
                <div className={styles.actionButtonWrapper}>
                  <Button onClick={buttonFunction} appearance="primary" className={styles.actionButton}>
                    Загрузить еще
                  </Button>
                </div>
              )
            }
          />
        )}
      />
    </div>
  );
};
