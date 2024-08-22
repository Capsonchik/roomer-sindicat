
export const getSumValues = ({stack,seriesData,seriesIndex,ispercent}) => {

  if(ispercent) {
    return 100
  }
  if(stack) {
    return Object.values(seriesData).reduce((acc, curr) => {
      acc += curr[seriesIndex];
      return acc
    },0)
  }
  else {
    return Math.max(...Object.values(seriesData).reduce((acc, curr) => {
      acc += curr.reduce((acc, curr) => acc + curr,0);
      return acc
    },[]))
  }
}