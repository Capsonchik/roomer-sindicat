import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {CustomCheckPicker} from "../../../components/rhfInputs/checkPicker/CheckPicker";
import {CustomSelectPicker} from "../../../components/rhfInputs/selectPicker/SelectPicker";
import styles from "./groupFIlters.module.scss";
import {selectIsLoadDependentFilters} from "../../../store/chartSlice/chart.selectors";
import {getFilterOriginalValues} from "../../../store/chartSlice/filter.actions";

export const FilterItem = ({filter, i, handleChangeFilter, methods}) => {
  const [open, setOpen] = useState(false);
  const  dispatch = useDispatch();
  const [activeFilter, setActiveFilter] = useState(null); // Хранение индекса активного фильтра
  const filterLoading = useSelector(selectIsLoadDependentFilters);
  const divRef = useRef(null); // Ссылка на div
  const [originValues, setOriginValues] = useState(filter.original_values
    ? filter.original_values.map((item) => ({
      label: item,
      value: item,
    }))
    : [])

  useEffect(() => {

    setOriginValues(filter.original_values.map((item) => ({
        label: item,
        value: item,
      })))

  }, [filter.original_values]);

  return (
    <div
      // ref={divRef} // Привязываем ссылку к div
      // tabIndex={i}
      // // onClick={handleClick} // Обработчик клика
      // onBlur={(e) => {
      //   if (!e.relatedTarget || e.relatedTarget.ariaExpanded === "false") {
      //     setOpen(false);
      //   }
      // }}
    >
      <p style={{marginBottom: 8, fontWeight: 500}}>{filter.filter_name}</p>

      {filter.multi ? (
        <CustomCheckPicker
          conditionForButton={filter.islimited}
          buttonFunction={() => {
            dispatch(getFilterOriginalValues(filter.filter_id)).then((res) => {
              setOriginValues(res.payload.original_values.map(item => ({
                label: item,
                value: item,
              })))
              // methods.setValue(`filters.${i}.value`,res.payload.original_values);
              console.log('res',res.payload.original_values)
            })
          }}
          // open={open}
          value={filter.isactive ? methods.getValues(`filters.${i}.value`) : null}
          disabled={!methods.getValues(`filters.${i}.isactive`)}
          onChangeOutside={(value) => {
            if (!methods.getValues(`filters.${i}.isactive`)) {
              return;
            }
            methods.setValue("activeFilter", i);
            methods.handleSubmit(handleChangeFilter)();
          }}
          name={`filters.${i}.value`}
          data={originValues}
          disabledItemValues={filterLoading ? methods.getValues(`filters.${i}.original_values`) : []}
          searchable={false}
          placeholder={!methods.getValues(`filters.${i}.isactive`) ? "Фильтр не активен" : filter.filter_name}
          className={styles.select}
          preventOverflow={true}
          container={""}
        />
      ) : (
        <CustomSelectPicker
          data={filter.original_values?.map((item) => ({
            label: item,
            value: item,
          }))}
          value={filter.isactive ? methods.getValues(`filters.${i}.value`) : null}
          name={`filters.${i}.value`}
          onChangeOutside={(value) => {
            if (!methods.getValues(`filters.${i}.isactive`)) {
              return;
            }
            methods.setValue("activeFilter", i);
            methods.handleSubmit(handleChangeFilter)();
          }}
        />
      )}
    </div>
  );
};
