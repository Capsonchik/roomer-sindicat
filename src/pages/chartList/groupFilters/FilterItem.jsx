import {CustomCheckPicker} from "../../../components/rhfInputs/checkPicker/CheckPicker";
import styles from "./groupFIlters.module.scss";
import React, {useRef, useState} from "react";
import {useFormContext} from "react-hook-form";


export const FilterItem = ({filter, i, handleChangeFilter, methods}) => {
  // const {methods} = useFormContext()
  // console.log(methods.getValues('filters'))
  const [open, setOpen] = useState(false)
  // const selectRef = useRef(null);
  return (
    <div
      tabIndex={i}
      onClick={() => {
        setOpen(true)
      }}
      onBlur={(e) => {
        // console.log(e, e.relatedTarget)
        if (!e.relatedTarget || e.relatedTarget.ariaExpanded === 'false') {
          setOpen(false)
        }
      }}
      style={{

        // flexGrow: 1
        // flexGrow: filters.length >= 5 ? 1 : 0
      }}
    >
      <p style={{marginBottom: 8, fontWeight: 500}}>{filter.filter_name}</p>
      <CustomCheckPicker
        // selectRef={selectRef}
        open={open}
        value={filter.isactive ? methods.getValues(`filters.${i}.value`) : null} // Добавляем value
        // defaultValue={filter.original_values[0]}
        disabled={!methods.getValues(`filters.${i}.isactive`)}
        onChangeOutside={(value) => {
          // console.log(filter.original_values)
          if (!methods.getValues(`filters.${i}.isactive`)) {
            return
            // console.log(methods.getValues(`filters.${i}.isactive`))
          }
          methods.setValue('activeFilter', i)
          methods.handleSubmit(handleChangeFilter)()
        }}
        name={`filters.${i}.value`}
        data={filter.original_values.map(item => ({
          label: item,
          value: item
        }))}
        // disabledItemValues={['Центральный']}
        disabledItemValues={!methods.getValues(`filters.${i}.multi`) && methods.getValues(`filters.${i}.value`)?.length
          ? filter.original_values.filter(value => value !== methods.getValues(`filters.${i}.value`)[0])
          : []
        }
        searchable={false}
        placeholder={!methods.getValues(`filters.${i}.isactive`) ? 'Фильтр не активен' : filter.filter_name}
        className={styles.select}
        // placement={'bottomStart'}
        preventOverflow={true}
        container={''}
      />
    </div>
  )
}