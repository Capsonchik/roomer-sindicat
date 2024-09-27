import {CustomCheckPicker} from "../../../components/rhfInputs/checkPicker/CheckPicker";
import styles from "./groupFIlters.module.scss";
import React, {useRef, useState} from "react";
import {useFormContext} from "react-hook-form";
import {SelectPicker} from "rsuite";
import {CustomSelectPicker} from "../../../components/rhfInputs/selectPicker/SelectPicker";
import {useSelector} from "react-redux";
import {selectFilterLoading, selectIsLoadDependentFilters} from "../../../store/chartSlice/chart.selectors";
import {getFilterOriginalValues} from "../../../store/chartSlice/filter.actions";


export const FilterItem = ({filter, i, handleChangeFilter, methods}) => {
  // const {methods} = useFormContext()
  // console.log(methods.getValues('filters'))
  const [open, setOpen] = useState(false)
  const filterLoading = useSelector(selectIsLoadDependentFilters);
  // const selectRef = useRef(null);
  // console.log(filterLoading)
  // connst


  // getFilterOriginalValues
  return (
    <div

      // autoFocus={!filterLoading}
      tabIndex={i}
      onClick={() => {
        setOpen(true)
      }}
      onBlur={(e) => {
        console.log(e)
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

      {filter.multi
      ? (
          <CustomCheckPicker
            conditionForButton={true}
            buttonFunction={() => {
              console.log('яхоууу')
            }}
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
            data={filter.original_values ? filter.original_values?.map(item => ({
              label: item,
              value: item
            })) : []}
            disabledItemValues={filterLoading ? methods.getValues(`filters.${i}.original_values`) : []}
            // disabledItemValues={!methods.getValues(`filters.${i}.multi`) && methods.getValues(`filters.${i}.value`)?.length
            //   ? filter.original_values?.filter(value => value !== methods.getValues(`filters.${i}.value`)[0])
            //   : []
            // }
            searchable={false}
            placeholder={!methods.getValues(`filters.${i}.isactive`) ? 'Фильsтр не активен' : filter.filter_name}
            className={styles.select}
            // placement={'bottomStart'}
            preventOverflow={true}
            container={''}
          />
        )
        : (
          <CustomSelectPicker
            data={filter.original_values?.map(item => ({
              label: item,
              value: item
            }))}
            value={filter.isactive ? methods.getValues(`filters.${i}.value`) : null}
            name={`filters.${i}.value`}
            onChangeOutside={(value) => {
              // console.log(filter.original_values)
              if (!methods.getValues(`filters.${i}.isactive`)) {
                return
                // console.log(methods.getValues(`filters.${i}.isactive`))
              }
              methods.setValue('activeFilter', i)
              methods.handleSubmit(handleChangeFilter)()
            }}
          />
        )
      }

    </div>
  )
}