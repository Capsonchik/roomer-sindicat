export const convertValuesByPercent = (
  {
    visibleListString,
    chart,
    filteredSeriesData,
    format_value
  }
) => {
  let newTotalSum = 0
  let filteredSeries = filteredSeriesData
  if (Object.keys(visibleListString).length !== Object.keys(chart.seriesData).length) {
    console.log(1111)
    const visibleColumn = Object.fromEntries(Object.entries(chart.seriesData).filter(([name, value]) => {
      return visibleListString.includes(name);
    }))
    newTotalSum = Object.values(visibleColumn)
      .reduce((acc, value, index) => {
        value.forEach((_, indexInner) => {
          acc[indexInner] += +value[indexInner] ? +value[indexInner] : 0;
        })
        return acc
      }, [0, 0])

    filteredSeries = Object.fromEntries(
      Object.entries(chart.seriesData)
        .filter(([series, value]) => {
          return visibleListString.includes(series);
        })
        .map(([series, value]) => {
          const newValue = value.map((val,index) => {
            return ((+val / newTotalSum[index]) * 100).toFixed(format_value)
          })
          return [series, newValue]
        })
    )
  } else {
    // console.log(2222)
    filteredSeries = Object.fromEntries(
      Object.entries(chart.seriesData)
        .filter(([series, value]) => {
          return visibleListString.includes(series);
        })
    )
  }
  return filteredSeries
}