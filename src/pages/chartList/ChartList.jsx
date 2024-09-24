import styles from './chartList.module.scss';
import {Chart} from "./chart/Chart";
import {Button, Divider, Loader, useMediaQuery} from "rsuite";
import React, {useEffect, useState} from "react";
import {downloadPpt} from "./downloadPptx";
// import {charts} from "./chartMocks";
import {TopFilters} from "./topFilters/TopFilters";
import {useDispatch, useSelector} from "react-redux";
import {
  fetchAllChartsByGroupId,
  fetchAllChartsFormatByGroupId,
  fetchAllClients
} from "../../store/chartSlice/chart.actions";
import {
  selectActiveClient, selectActiveGroupId, selectActiveReport,
  selectCharts,
  selectClients, selectErrorCharts, selectFilterLoading, selectFilters, selectGroupsReports,
  selectIsChartLoading, selectIsOpenDrawer,
  selectReportsClients
} from "../../store/chartSlice/chart.selectors";
import {ChartDrawer} from "./chartDrawer/ChartDrawer";
import {setActiveChart, setFilterLoading, setOpenDrawer, setTypeGroupDrawer} from "../../store/chartSlice/chart.slice";
import {ChartListItem} from "./chartListItem/ChartListItem";
import {GroupDrawer} from "./groupDrawer/GroupDrawer";
import EditIcon from "@rsuite/icons/Edit";
import cl from "classnames";
import {GroupControlButtons} from "./groupControlButtons/GroupControlButtons";
import {getFilters} from "../../store/chartSlice/filter.actions";
import {CustomSelectPicker} from "../../components/rhfInputs/selectPicker/SelectPicker";
import {FormProvider, useFieldArray, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {CustomCheckPicker} from "../../components/rhfInputs/checkPicker/CheckPicker";
import {selectCurrentUser} from "../../store/userSlice/user.selectors";
import {ChartTypeView} from "./chartTypeView/ChartTypeView";
import {selectActiveFilters, setFilters} from "../../store/chartSlice/filter.slice";
// import {charts} from "./chartMocks";

export const ChartList = (props) => {
  const dispatch = useDispatch();
  const charts = useSelector(selectCharts)
  const isChartLoading = useSelector(selectIsChartLoading)
  const activeClient = useSelector(selectActiveClient)
  const activeReport = useSelector(selectActiveReport)
  const isOpenDrawer = useSelector(selectIsOpenDrawer)
  const activeGroupId = useSelector(selectActiveGroupId)
  const errorCharts = useSelector(selectErrorCharts)
  const user = useSelector(selectCurrentUser)
  const filters = useSelector(selectFilters)
  const groups = useSelector(selectGroupsReports);
  const filterLoading = useSelector(selectFilterLoading);
  const activeFilters = useSelector(selectActiveFilters)
  const [filtersState, setFiltersState] = useState([filters])


  const [activeGroup, setActiveGroup] = useState()
  const [data, setData] = useState(charts)
  const [placeholderText, setPlaceholderText] = useState('')
  const [openGroupDrawer, setOpenGroupDrawer] = useState(false)
  const [resize, setResize] = useState(false)

  const [isTablet] = useMediaQuery('(max-width: 1200px)');

  const methods = useForm({
    defaultValues: {
      filters: []
    }
  });

  useEffect(() => {

  }, [activeFilters]);

  const {fields, append, remove, replace} = useFieldArray({
    control: methods.control,
    name: "filters"
  });
  // Сброс формы и обновление filters через reset, когда filters не пустой
  useEffect(() => {
    // if (!activeGroupId) return
    if (filters.length > 0) {
      const filtersList = activeFilters?.[activeGroupId] ? activeFilters?.[activeGroupId] : filters

      // console.log(activeFilters?.[activeGroupId]?.filters,filters)
      const filterValues = filtersList.map(filter => ({
        filter_name: filter.filter_name,
        filter_id: filter.filter_id,
        original_values: filter.original_values,
        multi: filter.multi,
        isactive: filter.isactive,
        value: filter.multi ? activeFilters?.[activeGroupId] ? filter.value : filter.original_values : [filter.original_values?.[0]]
      }));

      dispatch(setFilters({data: filterValues, activeGroupId}))
      methods.reset({filters: filterValues});
      replace(filterValues); // Обновляем данные в useFieldArray
    }
  }, [filters, methods, replace]);

  // console.log('fields',fields)

  useEffect(() => {
    if (!activeGroupId) return

    // console.log(222, methods.getValues('filters'))
    const request = methods.getValues('filters')
      .map(filter => {
        return {
          filter_id: filter.filter_id,
          filter_values: filter.multi ? activeFilters?.[activeGroupId] ? filter.value : filter.original_values : [filter.original_values?.[0]],
          isactive: filter.isactive,
        }
      })
      .filter(filter => filter.isactive && Array.isArray(filter.filter_values) && filter.filter_values.length > 0)

    // console.log(filters,activeGroupId,methods.getValues('filters'))
    // Отправляем запрос на получение графиков с фильтрами
    dispatch(fetchAllChartsByGroupId({groupId: activeGroupId, filter_data: {filter_data: request}}))
      .then(() => {
        dispatch(fetchAllChartsFormatByGroupId(activeGroupId));
      });

  }, [methods.getValues('filters')]);

  // console.log(filterLoading,filters)
  useEffect(() => {
    if (activeGroupId && filterLoading === 'idle' && !filters?.length) {
      // console.log(filterLoading,filters)
      dispatch(fetchAllChartsByGroupId({groupId: activeGroupId, filter_data: {filter_data: []}}))
        .then(() => {
          dispatch(fetchAllChartsFormatByGroupId(activeGroupId));
        });
    }

  }, [activeGroupId, filters, filterLoading]);

  // const {} = useFieldArray({
  //   control:methods.
  // })

  useEffect(() => {
    if (filterLoading !== 'idle') return
    const foundGroup = groups.find((group) => group.group_id == activeGroupId)
    if (foundGroup) {
      setActiveGroup(foundGroup)
    } else if (groups.length) {
      setActiveGroup(groups[0])
    }
    // setActiveGroup(foundGroup)

  }, [activeGroupId, groups, filterLoading])

  useEffect(() => {
    if (!activeClient) {
      setPlaceholderText('Выберите клиента')
    } else if (!activeReport) {
      setPlaceholderText('Выберите отчет')
    } else {
      setPlaceholderText('')
    }


  }, [activeClient, activeReport]);

  useEffect(() => {
    if (!activeGroupId) return
    dispatch(getFilters(activeGroupId)).then(() => {
      dispatch(setFilterLoading('none'))
    })

  }, [activeGroupId]);

  useEffect(() => {
    // console.log('create')
    setData(charts)
  }, [charts])
  // console.log(data)

  useEffect(() => {
    // console.log('444444444444444444')
    let resizeTimeout;

    const handleResize = () => {
      setResize(true)
      // setData([]); // Перерендеринг списка
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }

      resizeTimeout = setTimeout(() => {
        // console.log(11);
        setResize(false)
        setData([...charts]); // Перерендеринг списка
        // setResize(false)
        // setTimeout(() => {
        //   setResize(false)
        // }, 300);
      }, 300); // Задержка в 300 мс перед вызовом функции
    };

    // Добавляем слушатель события resize
    window.addEventListener('resize', handleResize);

    // Удаляем слушатель при размонтировании компонента
    return () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [charts]);

  // useEffect(() => {
  //   // setResize(true)
  //   setData([...charts])
  //   // setResize(false)
  // }, [charts.length]);// Зависимость от charts, чтобы следить за изменениями данных

  // console.log(placeholderText)
  // console.log(filters)

  const handleChangeFilter = (data) => {


    const request = data.filters
      .map(filter => {
        return {
          filter_id: filter.filter_id,
          filter_values: filter.value,
          isactive: filter.isactive,
        }
      })
      .filter(filter => filter.isactive && Array.isArray(filter.filter_values) && filter.filter_values.length > 0)
    // console.log(request)
    const req = data.filters.filter(filt => filt.filter_name)
    dispatch(setFilters({data: req, activeGroupId}))
    dispatch(fetchAllChartsByGroupId({groupId: activeGroupId, filter_data: {filter_data: request}})).then(() => {
      dispatch(fetchAllChartsFormatByGroupId(activeGroupId));
    });
  }
  return (

    <>
      <TopFilters/>
      {activeReport && !!filters?.length && (
        <FormProvider {...methods}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 16,
            paddingInline: 15
          }}>
            {fields.map((filter, i) => (
              <div key={filter.id}>
                <p style={{marginBottom: 8, fontWeight: 500}}>{filter.filter_name}</p>
                <CustomCheckPicker
                  value={filter.isactive ? methods.getValues(`filters.${i}.value`) : null} // Добавляем value
                  // defaultValue={filter.original_values[0]}
                  disabled={!methods.getValues(`filters.${i}.isactive`)}
                  onChangeOutside={(value) => {
                    // console.log(filter.original_values)
                    if (!methods.getValues(`filters.${i}.isactive`)) {
                      return
                      // console.log(methods.getValues(`filters.${i}.isactive`))
                    }
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
            ))}
          </div>
        </FormProvider>
      )}
      {/*{activeReport && <GroupControlButtons/>}*/}
      <div
        className={styles.list}>
        {(isChartLoading || resize) && (
          <div className={styles.loader_wrapper}>
            <Loader size={'lg'}/>
          </div>
        )}

        {activeReport && !isChartLoading && !resize && (
          <div className={styles.info}>
            <h4 className={styles.group_name}>{activeGroup?.group_name}</h4>
            <h6 className={styles.title_group}>{activeGroup?.description}</h6>
          </div>
        )}
        {activeReport && <div
          // className={`${styles.wrapper} ${data.length % 2 === 0 ? styles.col_2 : ''} ${data.length === 3 ? styles.col_3 : ''}`}
          className={cl(styles.wrapper, {
            [styles.col_2]: data.length % 2 === 0,
            [styles.col_3]: Boolean(data.length % 2) && data.length > 1,
            [styles.isTablet]: isTablet
          })}
        >

          {!isChartLoading && !resize && data[0]?.title && data.map((chart, index) => (

            <ChartTypeView key={index} chart={chart}/>
          ))}
        </div>}

        {activeReport && !isChartLoading && !data.length && (
          <div className={styles.placeholder}>
            <Divider>Нет графиков</Divider>

          </div>
        )}


        {placeholderText && <div className={styles.placeholder}>
          <Divider>{placeholderText}</Divider>
        </div>}

      </div>
      <div className={styles.btn_wrapper}>


        <ChartDrawer
          open={isOpenDrawer}
          onClose={() => dispatch(setOpenDrawer(false))}
        />
        {/*<GroupDrawer*/}
        {/*  activeGroup={activeGroup}*/}
        {/*  open={openGroupDrawer}*/}
        {/*  onClose={() => setOpenGroupDrawer(false)}*/}
        {/*/>*/}

      </div>


    </>

  );
};
