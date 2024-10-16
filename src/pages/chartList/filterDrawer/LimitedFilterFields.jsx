import cl from "classnames";
import styles from "./filterDrawer.module.scss";
import {PreventOverflowContainer} from "../chartFilters/main/MainForm";
import {CustomTagPicker} from "../../../components/rhfInputs/customTagPicker/CustomTagPicker";
import {Button, Tag} from "rsuite";
import React, {useEffect} from "react";
import {useFormContext} from "react-hook-form";


export const LimitedFilterFields = (
  {
    fieldsState,
    availableFields,
    limitFieldsState,
    db_colors,
    setLimitFieldsState,
    handleLimitFields,
    getValuesFromColumn,
    limitedFields,
    setLimitedRequestFields,
    limitedRequestFields,
    handleLimitedRequestFields,
    setLimitedFields,
    isCreate = false
  }) => {
  const {getValues, setValue,trigger} = useFormContext()

  useEffect(() => {
    if(!limitFieldsState.length) {
      setLimitedFields([])
    }

  }, [limitFieldsState]);
  // console.log(limitFieldsState)
  useEffect(() => {
    console.log(1111)
    if(isCreate) return
    console.log(2222)
    if (getValues('data_limiting')?.length) {
      const dataForStateLimitedRequest = getValues('data_limiting').reduce((acc, item) => {
        const items = item.value.map((value) => {
          return `${value};${item.column_name};${item.db_name}`
        })
        acc = [...acc, ...items];

        return acc
      }, [])
      setValue('limited_fields', dataForStateLimitedRequest)
      getValuesFromColumn().then(() => {
        setLimitedRequestFields(dataForStateLimitedRequest)
      })
    }
  }, [getValues('data_limiting')]);
  return (
    <div className={cl(styles.input_wrapper, {}, [styles.available_fields])}>
      <h6 className={styles.label}>Выберите доступные таблицы</h6>
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
                return limitFieldsState?.some(field => {
                  // console.log(fieldsState,field,fieldsState.includes(field))
                  return availableField.db_adress === field.split(' ')[0] && availableField.column_name !== field.split(' ')[1];
                })

              })
              .map(item => {
                return `${item.db_adress} ${item.column_name}`;
              })

            }

            renderMenuItem={(label, item) => {
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
              return limitFieldsState.map((value, index) => {
                // console.log(db_colors[value.split(' ')[0]])
                return (
                  <Tag
                    key={index}
                    closable // Добавляем крестик для закрытия
                    onClose={(e) => {
                      e.stopPropagation()
                      setLimitFieldsState(prev => {
                        // console.log(prev, value)
                        return prev.filter(item => item !== value)
                      })
                      trigger()
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
            onChangeOutside={handleLimitFields}
            value={limitFieldsState?.map((item, index) => {
              return item
            })}

            // style={{width: 224}}
            // container={getContainer}
            container={getContainer}
            preventOverflow
          />
        )}

      </PreventOverflowContainer>

      {/*<Button onClick={getValuesFromColumn} style={{marginTop: 24, marginBottom: 24}}>Получить значения*/}
      {/*  таблиц</Button>*/}

      {!!limitedFields?.length && <div className={cl(styles.input_wrapper, {}, [styles.available_fields])}>
        <h6 className={styles.label}>Выберите лимитированные поля</h6>
        <PreventOverflowContainer>
          {getContainer => (
            <CustomTagPicker
              searchable
              CustomTagPicker={styles.visible_list}
              name={'limited_fields'}
              data={limitedFields.map((item, index) => {
                // console.log(item)
                const [value, column, db_name] = item.split(';')
                return {
                  value: item,
                  label: `${value}`,
                  index,
                  column,
                  db: db_name
                }; // Передаем индекс в объекте*/}
              })}

              renderMenuItem={(label, item) => {
                // console.log(`${label}.${item.db}${item.index}`)
                // console.log(label,item)
                return (
                  <div
                    key={`${item.value}`}
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
                    <label>
                      {item.column}
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
                return limitedRequestFields?.map((value, index) => {
                  // console.log(value)
                  return (
                    <Tag
                      key={index}
                      closable // Добавляем крестик для закрытия
                      onClose={(e) => {
                        e.stopPropagation()
                        setLimitedRequestFields(() => {
                          // console.log(prev, value)
                          return limitedRequestFields.filter(item => item !== value)
                        })
                        // console.log(value)
                      }} // Обработчик удаления
                      style={{

                        backgroundColor: db_colors[value.split(';')[value.split(';').length - 1]] || 'gray', // Фон тега
                        color: 'white', // Цвет текста
                        borderRadius: '4px', // Скругление углов
                        padding: '4px 8px', // Внутренние отступы
                        paddingRight: '30px',
                        marginRight: '4px' // Отступы между тегами
                      }}
                    >
                      {value.split(';')[0]} {/* Показываем только вторую часть значения */}
                    </Tag>
                  );
                });
              }}
              onChangeOutside={handleLimitedRequestFields}
              value={limitedRequestFields?.map((item, index) => {
                return item
              })}

              // style={{width: 224}}
              // container={getContainer}
              container={getContainer}
              preventOverflow
            />
          )}

        </PreventOverflowContainer>


      </div>}

    </div>
  )
}