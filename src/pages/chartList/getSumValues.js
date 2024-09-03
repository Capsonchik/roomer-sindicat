
export const getSumValues = ({stack,seriesData,ispercent}) => {
  // console.log(stack,seriesData,ispercent)
  // console.log(stack,seriesData,seriesIndex,ispercent)
  if(ispercent) {
    return 100
  }
  if(stack) {
    // console.log(Object.values(seriesData).reduce((acc, curr) => {
    // console.log(acc,curr)
    //   acc += +curr;
    //   return acc
    // },0))

    return Object.values(seriesData).reduce((acc, curr) => {
      acc += Math.max(...curr);
      return acc
    },0)
  }
  else {
    // console.log(Math.max(...Object.values(seriesData).reduce((acc, curr) => {
    //   acc.push(curr.reduce((accInner, currInner) => +accInner + +currInner,0))
    //   console.log(acc,curr)
    //   // acc[seriesData] =  curr.reduce((acc, curr) => +acc + +curr,0);
    //   return acc
    // },[])))
    return Math.max(...Object.values(seriesData).reduce((acc, curr) => {
      // console.log(acc,curr)
      acc.push(Math.max(...curr.map(Number)))
      // acc.push(curr.reduce((accInner, currInner) => +accInner + +currInner,0))
      // console.log(acc,curr)
      // acc[seriesData] =  curr.reduce((acc, curr) => +acc + +curr,0);
      return acc
    },[]))
  }
}