import {Outlet} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {fetchAllCharts} from "../../store/chartSlice/chart.actions";
import {useToaster} from "rsuite";
import {selectCurrentUser} from "../../store/userSlice/user.selectors";

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