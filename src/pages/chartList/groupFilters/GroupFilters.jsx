import styles from './groupFIlters.module.scss'
import {FormProvider, useFieldArray, useForm} from "react-hook-form";
import {CustomCheckPicker} from "../../../components/rhfInputs/checkPicker/CheckPicker";
import React, {useEffect, useRef, useState} from "react";
import {setFilters} from "../../../store/chartSlice/chart.slice";
import {getFilters, postDependentFilters} from "../../../store/chartSlice/filter.actions";
import {setDependentFilters, setFilterLoading} from "../../../store/chartSlice/chart.slice";
import {
  fetchAllChartsByGroupId,
  fetchAllChartsFormatByGroupId, saveFilters,
  updateSaveFilters
} from "../../../store/chartSlice/chart.actions";
import {useDispatch, useSelector} from "react-redux";
import {
  selectActiveGroupId,
  selectActiveReport,
  selectFilterLoading,
  selectFilters, selectGroupsReports
} from "../../../store/chartSlice/chart.selectors";
import {FilterItem} from "./FilterItem";
import {Button, Loader} from "rsuite";
import {selectCurrentUser} from "../../../store/userSlice/user.selectors";
import {setActiveSavedFilters, setSelectedFilters} from "../../../store/chartSlice/filter.slice";

export const GroupFilters = ({groups}) => {
  const user = useSelector(selectCurrentUser)
  const activeGroupId = useSelector(selectActiveGroupId)
  const filters = useSelector(selectFilters)
  const dispatch = useDispatch();
  const filterLoading = useSelector(selectFilterLoading);
  const activeReport = useSelector(selectActiveReport)
  // const groups = useSelector(selectGroupsReports)
  const [activeFilter, setActiveFilter] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    isFirstRender.current = true

  }, [activeGroupId]);

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
      // dispatch(setFilterLoading('none'))
    })

  }, [activeGroupId]);
  // Сброс формы и обновление filters через reset, когда filters не пустой

  const getValue = (filter, savedFilter) => {
    // console.log(savedFilter)

    if (filter.multi) {
      if (!filter.isactive) {
        return []
      }
      if (filter?.value && filter.value[0]) {
        return filter.value
      } else {
        return savedFilter ? savedFilter.filter_values : filter.original_values?.[0] ? [filter.original_values[0]] : []
      }
    } else {
      if (!filter.isactive) {
        return ''
      }
      if (filter?.value) {
        return filter?.value[0] ? filter?.value[0] : []
      } else {
        return savedFilter ? savedFilter.filter_values[0] : filter.original_values?.[0] ? filter.original_values?.[0] : ''
      }
    }

  }



  useEffect(() => {
    // console.log(filters)
    if (!activeGroupId) return
    if (filters.length > 0) {
        console.log(isFirstRender.current)
      const filterValues = filters.map(filter => {
        const activeGroup = groups.find(group => group.group_id === activeGroupId);
        // console.log(Object.keys(activeGroup.saved_filters).length)
        if (activeGroup.saved_filters) {
          dispatch(setActiveSavedFilters(activeGroup.saved_filters.id))

        } else {
          dispatch(setActiveSavedFilters(null))
        }
        const savedFilter = activeGroup.saved_filters
          ? activeGroup.saved_filters.filter_data?.find(innerFilter => innerFilter.filter_id === filter.filter_id)
          : null
        // console.log(activeGroup,filter.filter_id)
        return {
          filter_name: filter.filter_name,
          filter_id: filter.filter_id,
          original_values: filter.original_values,
          multi: filter.multi,
          column_limit:filter.column_limit,
          isactive: filter.isactive,
          islimited: filter.islimited,
          value: filter.column_limit ? []: (savedFilter && isFirstRender.current) ? getValue(filter, savedFilter) : getValue(filter, null),

        }
      });

      // console.log(methods.getValues('activeFilter'))

      // dispatch(setFilters({data: filterValues || [], activeGroupId}))

      const activeGroup = groups.find(group => group.group_id === activeGroupId);
      const savedFilterId = activeGroup.saved_filters ? activeGroup.saved_filters.filter_id : null
      methods.reset({
        filters: filterValues,
        savedFilterId: savedFilterId
        // activeFilter: methods.getValues('activeFilter')
        // activeFilter: null
      });

      const getCharts = () => {

        const filters = methods.getValues('filters')
        // console.log(filters)
        let request = filters.map(filter => {
          return {
            filter_id: filter.filter_id,
            filter_values: !filter.isactive ? [] : filter.multi
              ? filter.value ? filter.value : []
              : filter.value
                ? Array.isArray(filter.value) ? filter.value : [filter.value]
                : []
          }
        })
        // setFilters(filters.map(filter => ({filter_id:filter.filter_id, filter_values:filter.filter_values})))
        const selected = request.map(filter => ({filter_id: filter.filter_id, value: filter.filter_values}))
        dispatch(setSelectedFilters(selected))
        dispatch(fetchAllChartsByGroupId({groupId: activeGroupId, filter_data: {filter_data: request || []}}))
          .then(() => {
            isFirstRender.current = false
            dispatch(fetchAllChartsFormatByGroupId(activeGroupId));
          });

      }

      getCharts()
    } else {
      // if(filterLoading === 'load') {
      //
      //   dispatch(fetchAllChartsByGroupId({groupId: activeGroupId, filter_data: {filter_data: []}}))
      //     .then(() => {
      //       dispatch(fetchAllChartsFormatByGroupId(activeGroupId));
      //     });
      // }
    }

    return () => {
      methods.reset({})
    }
  }, [filters]);

  useEffect(() => {
    if(!activeGroupId) return
    if(filterLoading === 'none' && !filters.length) {

      dispatch(fetchAllChartsByGroupId({groupId: activeGroupId, filter_data: {filter_data: []}}))
        .then(() => {
          dispatch(fetchAllChartsFormatByGroupId(activeGroupId));
        });
    }

  }, [filterLoading,filters]);


  const handleChangeFilter = (data) => {
    // console.log(data)
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

    // console.log(filters)

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
      // dispatch(setFilters(filters))
      return
    } else {
      dispatch(setFilters(filters))
      dispatch(setSelectedFilters(filters))

    }

  }

  // console.log(methods.getValues('filters'))
  return (
    <div>
      {activeReport && !!filters?.filter(filter => !filter.column_limit).length && (
        <FormProvider {...methods}>
          {filterLoading === 'load' && <div style={{display:'flex',justifyContent:'center',marginTop:30}}><Loader size={'md'}/></div>}
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
            {/*{user.role !== 'viewer' && <Button style={{alignSelf:'flex-end'}} onClick={() => {*/}
            {/*  methods.handleSubmit(onSaveFilter)()*/}
            {/*}}>Сохранить</Button>}*/}
          </div>}

        </FormProvider>
      )}
    </div>
  )
}