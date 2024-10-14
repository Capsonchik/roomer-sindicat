import {CustomPivot} from "../../chartItemPivotTable/CustomPivot";
import styles from './customPivotWrapper.module.scss'
import React, {useRef, useState} from "react";
import {
  fetchAllChartsByGroupId,
  fetchAllChartsFormatByGroupId,
  patchChartFormatting
} from "../../../../store/chartSlice/chart.actions";
import {setOpenDrawer} from "../../../../store/chartSlice/chart.slice";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentUser} from "../../../../store/userSlice/user.selectors";
import {selectActiveGroupId, selectFilters, selectGroupsReports} from "../../../../store/chartSlice/chart.selectors";
import {Button} from "rsuite";
import {CustomSelectPicker} from "../../../../components/rhfInputs/selectPicker/SelectPicker";
import {FormProvider, useForm} from "react-hook-form";
import {PreventOverflowContainer} from "../../chartFilters/main/MainForm";
import {CustomInput} from "../../../../components/rhfInputs/customInput/CustomInput";


export const CustomPivotWrapper = ({chart}) => {
  // console.log(chart)
  const dispatch = useDispatch();
  const rowData = chart['0'].table_data
  const [rowKey, setRowKey] = useState(chart.formatting?.rowKey || 'Region');
  const [subRowKey, setSubRowKey] = useState(chart.formatting?.subRowKey || 'Segment2'); // Вторая группа строк
  const [colKey, setColKey] = useState(chart.formatting?.colKey || 'Segment1');
  const [subColKey, setSubColKey] = useState(chart.formatting?.subColKey || 'Product'); // Вторая группа колонок
  const [aggregator, setAggregator] = useState(chart.formatting?.aggregator || 'Total_value');
  const [format, setFormat] = useState(chart.formatting?.format || 'm');
  const [digitsAfterDot, setDigitsAfterDot] = useState(chart.formatting?.digitsAfterDot || null);
  const activeGroupId = useSelector(selectActiveGroupId)
  const groupsReports = useSelector(selectGroupsReports)
  const filters = useSelector(selectFilters)
  const methods = useForm({
    defaultValues: {
      rowKey,
      subRowKey,
      colKey,
      subColKey,
      aggregator,
      digitsAfterDot,
      format
    }
  })


  const handlePatch = () => {

    const {graph_id, xAxisData, seriesData, ...rest} = chart
    const {isVisibleSeriesChange, ...restFormatting} = rest.formatting
    const request = {
      ...rest, formatting: {
        ...restFormatting,
        rowKey,
        subRowKey,
        colKey,
        subColKey,
        aggregator,
        digitsAfterDot,
        format
      }
    }
    dispatch(patchChartFormatting(request)).then(() => {
      const id = activeGroupId || groupsReports[0].group_id
      const activeFiltersRequest = filters
      // console.log('activeFilters[activeGroupId]',activeFilters[activeGroupId])
      const request = activeFiltersRequest
        .map(filter => {
          return {
            filter_id: filter.filter_id,
            filter_values: filter.value,
            isactive: filter.isactive,
          }
        })
        .filter(filter => filter.isactive && Array.isArray(filter.filter_values) && filter.filter_values.length > 0)
      dispatch(fetchAllChartsByGroupId({groupId: id, filter_data: {filter_data: request}})).then(() => {
        dispatch(fetchAllChartsFormatByGroupId(id))
      })

    })

    dispatch(setOpenDrawer(false))

  }

  const rowRef = useRef()
  const subRowRef = useRef()
  const  colRef = useRef()
  const  subColRef = useRef()
  const  aggregationRef = useRef()
  const  formatRef = useRef()

  return (

    <FormProvider {...methods}>
      <div className={styles.wrapper}>
          <CustomPivot rowData={rowData} chart={chart} isDrawer rowColData={{
            rowKey,
            subRowKey,
            colKey,
            subColKey,
            aggregator,
            format,
            digitsAfterDot
          }}/>
      </div>

      <div className={styles.selects}>
        <div className={styles.selects_items}>
          <h6>Строки</h6>
          <div className={styles.selects_items}>
            <div>
              <p>row</p>
              <div ref={rowRef} style={{position: 'relative'}}>
                <CustomSelectPicker
                  container={() => rowRef.current}
                  // value={rowKey}
                  data={
                    Object.entries(rowData[0])
                      .filter(([field, value]) => typeof value === 'string')
                      .map(([field, value]) => ({value: field, label: field}))
                  }
                  name={'rowKey'}
                  onChangeOutside={(val) => setRowKey(val)}
                />
              </div>
            </div>

            <div>
              <p>subRow</p>
              <div  ref={subRowRef} style={{position: 'relative'}}>
                <CustomSelectPicker
                  container={() => subRowRef.current}
                  data={
                    Object.entries(rowData[0])
                      .filter(([field, value]) => typeof value === 'string')
                      .map(([field, value]) => ({value: field, label: field}))
                  }
                  name={'subRowKey'}
                  onChangeOutside={(val) => setSubRowKey(val)}
                />
              </div>
            </div>

          </div>
        </div>

        <div className={styles.selects_items}>
          <h6>Колонки</h6>
          <div className={styles.selects_items}>
            <div>
              <p>col</p>
              <div ref={colRef} style={{position: 'relative'}}>
                <CustomSelectPicker
                  container={() => colRef.current}
                  // value={rowKey}
                  data={
                    Object.entries(rowData[0])
                      .filter(([field, value]) => typeof value === 'string')
                      .map(([field, value]) => ({value: field, label: field}))
                  }
                  name={'colKey'}
                  onChangeOutside={(val) => setColKey(val)}
                />
              </div>

            </div>

            <div>
              <p>subCol</p>
              <div ref={subColRef} style={{position: 'relative'}}>
                <CustomSelectPicker
                  container={() => subColRef.current}
                  data={
                    Object.entries(rowData[0])
                      .filter(([field, value]) => typeof value === 'string')
                      .map(([field, value]) => ({value: field, label: field}))
                  }
                  name={'subColKey'}
                  onChangeOutside={(val) => setSubColKey(val)}
                />
              </div>
            </div>


          </div>
        </div>

        <div className={styles.selects_items}>
          <h6>Значения</h6>
          <div>
            <p>aggregator</p>
            <div ref={aggregationRef} style={{position: 'relative'}}>
              <CustomSelectPicker
                container={() => aggregationRef.current}
                data={
                  Object.entries(rowData[0])
                    .filter(([field, value]) => typeof value !== 'string')
                    .map(([field, value]) => ({value: field, label: field}))
                }
                name={'aggregator'}
                onChangeOutside={(val) => setAggregator(val)}
              />
            </div>

          </div>

        </div>

        <div className={styles.selects_items}>
          <h6>Формат</h6>
          <div className={styles.selects_items}>
            <div>
              <p>формат числа</p>
              <div ref={formatRef} style={{position: 'relative'}}>
                <CustomSelectPicker
                  container={() => formatRef.current}
                  data={['k', 'm', 'без форматирования']
                    .map((field) => ({value: field, label: field}))
                  }
                  name={'format'}
                  onChangeOutside={(val) => setFormat(val)}
                />
              </div>

            </div>
            <div>
              <p>Кол-во цифр после запятой</p>
              <div >
                <CustomInput

                  className={styles.digitsAfterDot}
                  type={'number'}
                  name={'digitsAfterDot'}
                  onChangeOutside={(val) => {
                    +val >= 0 && setDigitsAfterDot(val)
                  }}
                />
              </div>

            </div>
          </div>

        </div>
      </div>
      <Button onClick={handlePatch} style={{
        marginTop: 50
      }}>Сохранить</Button>

    </FormProvider>
  )
}