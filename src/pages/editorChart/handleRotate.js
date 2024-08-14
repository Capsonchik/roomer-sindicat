export const handleRotate = (isXAxis,isStacked,setRotate) => {
  if(isXAxis && !isStacked) {
    setRotate(0)
  }
  else if(!isXAxis && !isStacked) {
    setRotate(90)
  }
  else if(isXAxis && isStacked) {
    setRotate(90)
  }
  else if(!isXAxis && isStacked) {
    setRotate(0)
  }
}