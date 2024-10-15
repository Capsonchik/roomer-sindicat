import cl from "classnames";
import styles from "./filterDrawer.module.scss";
import {PreventOverflowContainer} from "../chartFilters/main/MainForm";
import {CustomTagPicker} from "../../../components/rhfInputs/customTagPicker/CustomTagPicker";
import {Tag} from "rsuite";
import React from "react";


export const DefaultFilterFields = ({availableFields,fieldsState,setFieldsState,db_colors,handleFields}) => {
  return (
    <div className={cl(styles.input_wrapper, {}, [styles.available_fields])}>
      <h6 className={styles.label}>Доступные поля</h6>
      <PreventOverflowContainer>
        {getContainer => (
          <CustomTagPicker
            CustomTagPicker={styles.visible_list}
            name={'filter_data'}
            data={availableFields.map((item, index) => {

              return {
                value: `${item.db_adress} ${item.column_name}`,
                label: item.column_name,
                index,
                db: item.db_adress
              }; // Передаем индекс в объекте*/}
            })}
            disabledItemValues={availableFields
              .filter(availableField => {
                // console.log(availableFields,selectedField.split(' ')[0])
                return fieldsState?.some(field => {
                  // console.log(fieldsState,field,fieldsState.includes(field))
                  return availableField.db_adress === field.split(' ')[0] && availableField.column_name !== field.split(' ')[1];
                })

              })
              .map(item => {
                return `${item.db_adress} ${item.column_name}`;
              })

            }
            renderMenuItem={(label, item) => {
              const colors = ['red', 'green', 'blue'];
              return (
                <div
                  key={`${label}.${item.db}${item.index}`}
                  // className={styles.available_field}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}

                >
                  <label>
                    {label}
                  </label>
                  <label style={{
                    color: db_colors[item.db]
                  }}>
                    {item.db}
                  </label>
                </div>


              )
            }}
            // tagProps={(tagValue) => ({
            //   style: { backgroundColor: 'red' } // Динамическая функция для фона
            // })}
            renderValue={(values) => {
              return fieldsState.map((value, index) => {
                // console.log(value)
                return (
                  <Tag
                    key={index}
                    closable // Добавляем крестик для закрытия
                    onClose={(e) => {
                      e.stopPropagation()
                      setFieldsState(prev => {
                        console.log(prev, value)
                        return prev.filter(item => item !== value)
                      })
                      // console.log(value)
                    }} // Обработчик удаления
                    style={{

                      backgroundColor: db_colors[value.split(' ')[0]] || 'gray', // Фон тега
                      color: 'white', // Цвет текста
                      borderRadius: '4px', // Скругление углов
                      padding: '4px 8px', // Внутренние отступы
                      paddingRight: '30px',
                      marginRight: '4px' // Отступы между тегами
                    }}
                  >
                    {value.split(' ')[1]} {/* Показываем только вторую часть значения */}
                  </Tag>
                );
              });
            }}
            onChangeOutside={handleFields}
            value={fieldsState?.map((item, index) => {
              return item
            })}

            // style={{width: 224}}
            // container={getContainer}
            container={getContainer}
            preventOverflow
          />
        )}

      </PreventOverflowContainer>


    </div>
  )
}