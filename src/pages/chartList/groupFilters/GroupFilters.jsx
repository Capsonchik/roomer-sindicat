import styles from './groupFIlters.module.scss'
import {FormProvider, useFieldArray, useForm} from "react-hook-form";
import {CustomCheckPicker} from "../../../components/rhfInputs/checkPicker/CheckPicker";
import React, {useEffect, useRef, useState} from "react";
import {setFilters} from "../../../store/chartSlice/chart.slice";
import {getFilters, postDependentFilters} from "../../../store/chartSlice/filter.actions";
import {setDependentFilters, setFilterLoading} from "../../../store/chartSlice/chart.slice";
import {fetchAllChartsByGroupId, fetchAllChartsFormatByGroupId} from "../../../store/chartSlice/chart.actions";
import {useDispatch, useSelector} from "react-redux";
import {
  selectActiveGroupId,
  selectActiveReport,
  selectFilterLoading,
  selectFilters
} from "../../../store/chartSlice/chart.selectors";
import {FilterItem} from "./FilterItem";

export const GroupFilters = () => {
  const activeGroupId = useSelector(selectActiveGroupId)
  const filters = useSelector(selectFilters)
  const dispatch = useDispatch();
  const filterLoading = useSelector(selectFilterLoading);
  const activeReport = useSelector(selectActiveReport)
  const [activeFilter, setActiveFilter] = useState(null);

  const methods = useForm({
    defaultValues: {
      filters: [],

    }
  });


  const {fields} = useFieldArray({
    control: methods.control,
    name: "filters"
  });

  useEffect(() => {
    if (!activeGroupId) return
    methods.reset({filters: []})
    dispatch(getFilters(activeGroupId)).then(() => {
      dispatch(setFilterLoading('none'))
    })

  }, [activeGroupId]);
  // Сброс формы и обновление filters через reset, когда filters не пустой

  const getValue = (filter) => {

    if (filter.multi) {
      if (!filter.isactive) {
        return []
      }
      if (filter?.value) {
        return filter.value
      } else {
        return filter.original_values?.[0] ? [filter.original_values[0]] : []
      }
    } else {
      if (!filter.isactive) {
        return ''
      }
      if (filter?.value) {
        return filter?.value[0] ? filter?.value[0] : []
      } else {
        return filter.original_values?.[0] ? filter.original_values?.[0] : ''
      }
    }

  }

  useEffect(() => {
    if (!activeGroupId) return
    if (filters.length > 0) {
      const filterValues = filters.map(filter => ({
        filter_name: filter.filter_name,
        filter_id: filter.filter_id,
        original_values: filter.original_values,
        multi: filter.multi,
        isactive: filter.isactive,
        islimited: filter.islimited,
        value: getValue(filter)
      }));

      // console.log(methods.getValues('activeFilter'))

      // dispatch(setFilters({data: filterValues || [], activeGroupId}))

      methods.reset({
        filters: filterValues,
        // activeFilter: methods.getValues('activeFilter')
        // activeFilter: null
      });

      const getCharts = () => {

        const filters = methods.getValues('filters')
        const request = filters.map(filter => {
          return {
            filter_id: filter.filter_id,
            filter_values: !filter.isactive ? [] : filter.multi
              ? filter.value ? filter.value : []
              : filter.value
                ? Array.isArray(filter.value) ? filter.value : [filter.value]
                : []
          }
        })
        // isFirstRender.current = false

        dispatch(fetchAllChartsByGroupId({groupId: activeGroupId, filter_data: {filter_data: request || []}}))
          .then(() => {
            dispatch(fetchAllChartsFormatByGroupId(activeGroupId));
          });

      }

      getCharts()
    } else {
      dispatch(fetchAllChartsByGroupId({groupId: activeGroupId, filter_data: {filter_data: []}}))
        .then(() => {
          dispatch(fetchAllChartsFormatByGroupId(activeGroupId));
        });
    }

    return () => {
      methods.reset({})
    }
  }, [filters]);


  const handleChangeFilter = (data) => {
    // console.log(data)
    const request = {
      to_recalculate: data.filters.slice(data.activeFilter + 1).map(filter => filter.filter_id).filter(Boolean),
      filter_data: data.filters.slice(0, data.activeFilter + 1).map(filter => {
        return {
          filter_id: filter.filter_id,
          filter_values: filter.multi
            ? filter.value ? filter.value : []
            : filter.value ? [filter.value] : [],
        }
      }),
    }
    // if (!request.to_recalculate.length) {
    const filters = data.filters.map(filter => {
      return {
        ...filter,
        filter_id: filter.filter_id,
        value: filter.multi
          ? filter.value ? filter.value : []
          : filter.value ? [filter.value] : [],
      }
    })
    // return
    // }
    if (request.to_recalculate.length) {
      dispatch(postDependentFilters({data: request, group_id: activeGroupId})).then(res => {
        // console.log(res.payload)
        if (res.meta.requestStatus === 'fulfilled') {
          dispatch(setDependentFilters({
            originFilters: filters,
            filters: res.payload,
            activeFilterIndex: data.activeFilter
          }))
        }

      })
      return
    } else {
      dispatch(setFilters(filters))

    }

  }

  return (
    <div>
      {activeReport && !!filters?.length && (
        <FormProvider {...methods}>
          {filterLoading !== 'load' && <div
            className={styles.filters}
            // style={{
            //
            // }}
          >
            {fields.map((filter, i) => (
              <FilterItem
                isSearch
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                key={filter.filter_id}
                filter={filter} i={i}
                handleChangeFilter={handleChangeFilter}
                methods={methods}
              />
            ))}
          </div>}
        </FormProvider>
      )}
    </div>
  )
}