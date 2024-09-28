import React from "react";
import {Controller, useFormContext} from "react-hook-form";
import {Button, CheckPicker} from "rsuite";
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
    defaultValue,
    open,
    conditionForButton = false,  // условие для отображения кнопки
    buttonFunction = () => {}
    // selectRef
    // onExit
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
            // ref={selectRef}
            // onExiting={onExit}
            open={open}
            style={{width:200}}
            // menuStyle={{
            //   maxWidth:150
            // }}
            defaultValue={defaultValue}
            {...field}
            className={className}
            data={data}
            value={value}
            disabled={disabled}
            onChange={(selectedValues) => {
              field.onChange(selectedValues);
              onChangeOutside && onChangeOutside(selectedValues);

            }}
            searchable={searchable}
            appearance={appearance}
            placeholder={placeholder}
            renderMenuItem={renderMenuItem}
            disabledItemValues={disabledItemValues}
            container={container}
            preventOverflow // Включение автоматического определения переполнения


            // Добавляем кнопку внутри dropdown
            renderExtraFooter={() =>
              conditionForButton && (
                <div className={styles.actionButtonWrapper}>
                  <Button onClick={buttonFunction} appearance="primary" className={styles.actionButton}>
                    Показать все
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

