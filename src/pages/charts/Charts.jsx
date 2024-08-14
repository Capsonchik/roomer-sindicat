import {Outlet} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {fetchAllCharts} from "../../store/chartSlice/chart.actions";

export const Charts = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllCharts())
  }, []);
  return (
    <div>
      <Outlet/>
    </div>
  )
}