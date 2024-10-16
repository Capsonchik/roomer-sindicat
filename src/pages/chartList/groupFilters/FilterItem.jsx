import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {CustomCheckPicker} from "../../../components/rhfInputs/checkPicker/CheckPicker";
import {CustomSelectPicker} from "../../../components/rhfInputs/selectPicker/SelectPicker";
import styles from "./groupFIlters.module.scss";
import {selectIsLoadDependentFilters} from "../../../store/chartSlice/chart.selectors";
import {getFilterOriginalValues} from "../../../store/chartSlice/filter.actions";
import {selectOriginValuesLoading} from "../../../store/chartSlice/filter.selectors";

export const FilterItem = ({filter, i, handleChangeFilter, methods, setActiveFilter, activeFilter, isSearch}) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  // const [activeFilter, setActiveFilter] = useState(null); // Хранение индекса активного фильтра
  const filterLoading = useSelector(selectIsLoadDependentFilters);
  const originValuesLoading = useSelector(selectOriginValuesLoading);

  const divRef = useRef(null); // Ссылка на div
  const [originValues, setOriginValues] = useState(filter.original_values
    ? filter.original_values.map((item) => ({
      label: item,
      value: item,
    }))
    : [])

  useEffect(() => {

    if (activeFilter === i) return
    setOriginValues(filter?.original_values?.map((item) => ({
      label: item,
      value: item,
    })))

  }, [filter.original_values]);

  // console.log(originValues,activeFilter,i)
  if(filter.column_limit) {
    return  null
  }

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
          searchable={isSearch}
          loading={originValuesLoading}
          conditionForButton={filter.islimited && originValues.length === 100}
          buttonFunction={() => {
            dispatch(getFilterOriginalValues(filter.filter_id)).then((res) => {
              // console.log(res.payload)
              // if(res.payload.length > 1000) {
              //   setOriginValues(res.payload.original_values.slice(0,1000).map(item => ({
              //     label: item,
              //     value: item,
              //   })))
              // }

              setOriginValues(res.payload.original_values.map(item => ({
                label: item,
                value: item,
              })))


              // methods.setValue(`filters.${i}.value`,res.payload.original_values);
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
            setActiveFilter(i)
            methods.handleSubmit(handleChangeFilter)();
          }}
          name={`filters.${i}.value`}
          data={originValues}
          disabledItemValues={filterLoading ? methods.getValues(`filters.${i}.original_values`) : []}
          placeholder={!methods.getValues(`filters.${i}.isactive`) ? "Фильтр не активен" : filter.filter_name}
          className={styles.select}
          preventOverflow={true}
          container={""}
        />
      ) : (
        <CustomSelectPicker
          loading={originValuesLoading}
          searchable={isSearch}
          conditionForButton={filter.islimited && originValues.length === 100}
          buttonFunction={() => {
            dispatch(getFilterOriginalValues(filter.filter_id)).then((res) => {
              setOriginValues(res.payload.original_values.map(item => ({
                label: item,
                value: item,
              })))
              // methods.setValue(`filters.${i}.value`,res.payload.original_values);
            })
          }}
          data={originValues}
          value={filter.isactive ? methods.getValues(`filters.${i}.value`) : null}
          name={`filters.${i}.value`}
          disabled={!methods.getValues(`filters.${i}.isactive`)}
          onChangeOutside={(value) => {
            if (!methods.getValues(`filters.${i}.isactive`)) {
              return;
            }
            methods.setValue("activeFilter", i);
            setActiveFilter(i)
            methods.handleSubmit(handleChangeFilter)();
          }}
          placeholder={!methods.getValues(`filters.${i}.isactive`) ? "Фильтр не активен" : filter.filter_name}
        />
      )}
    </div>
  );
};
