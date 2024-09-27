import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { CustomCheckPicker } from "../../../components/rhfInputs/checkPicker/CheckPicker";
import { CustomSelectPicker } from "../../../components/rhfInputs/selectPicker/SelectPicker";
import styles from "./groupFIlters.module.scss";
import { selectIsLoadDependentFilters } from "../../../store/chartSlice/chart.selectors";

export const FilterItem = ({ filter, i, handleChangeFilter, methods }) => {
  const [open, setOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null); // Хранение индекса активного фильтра
  const filterLoading = useSelector(selectIsLoadDependentFilters);
  const divRef = useRef(null); // Ссылка на div

  // Эффект для фокусировки только на активном фильтре
  useEffect(() => {
    if (filterLoading && divRef.current && activeFilter === i) {
      divRef.current.focus(); // Фокусируем только на активный элемент
    }
  }, [filterLoading, activeFilter, i]);

  const handleClick = () => {
    setOpen(true);
    setActiveFilter(i); // Устанавливаем активный фильтр
  };

  return (
    <div
      ref={divRef} // Привязываем ссылку к div
      tabIndex={i}
      onClick={handleClick} // Обработчик клика
      onBlur={(e) => {
        if (!e.relatedTarget || e.relatedTarget.ariaExpanded === "false") {
          setOpen(false);
        }
      }}
    >
      <p style={{ marginBottom: 8, fontWeight: 500 }}>{filter.filter_name}</p>

      {filter.multi ? (
        <CustomCheckPicker
          conditionForButton={true}
          buttonFunction={() => {
            console.log("яхоууу");
          }}
          open={open}
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
          data={
            filter.original_values
              ? filter.original_values.map((item) => ({
                label: item,
                value: item,
              }))
              : []
          }
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
