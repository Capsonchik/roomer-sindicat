import {Container, Message, useToaster} from "rsuite";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {fetchGetAllClients} from "../../store/reportSlice/reportSlice.actions";
import {TopNavigationBar} from "../../components/topNavigationBar/TopNavigationBar";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {selectCurrentUser} from "../../store/userSlice/user.selectors";
import {fetchGetUser} from "../../store/main.actions";
import {axiosLoginRequest} from "../../api/ApiConfig";
import styles from './styles.module.scss'
import {GroupFilters} from "../chartList/groupFilters/GroupFilters";
import {GroupFiltersWrapper, GroupFIltersWrapper} from "../chartList/groupFilters/GroupFIltersWrapper";
import {ChartItemGraph} from "../chartList/chartItemTree/ChartItemGraph";
import {CytoscapeTree} from "../chartList/chartItemTree/CyptoTree";
import {ChartItemTree} from "../chartList/chartItemTree/ChartItemTree";
import {selectActiveGroupId, selectGroupsReports} from "../../store/chartSlice/chart.selectors";

export const TestPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectCurrentUser)
  const toaster = useToaster();
  const placement = 'topEnd'
  const [activeGroup, setActiveGroup] = useState()
  const groups = useSelector(selectGroupsReports);
  const activeGroupId = useSelector(selectActiveGroupId)

  useEffect(() => {

    const foundGroup = groups.find((group) => group.group_id == activeGroupId)
    if (foundGroup) {
      setActiveGroup(foundGroup)


    } else if (groups.length) {
      setActiveGroup(groups[0])


    }

  }, [activeGroupId, groups])



  useEffect(() => {
    if (location.pathname === "/main/report") {
      dispatch(fetchGetAllClients())
    }
  }, [dispatch]);

  const message = (
    <Message showIcon type={'success'} closable>
      <strong>`Привет ${user?.username}`</strong>
    </Message>
  );
  useEffect(() => {
    dispatch(fetchGetUser())
  }, []);

  // useEffect(() => {
  //   if (!user) return
  //
  //   toaster.push(message, {placement, duration: 3000})
  //
  // }, [user]);

  return (
    <Container className={styles.wrapper}>
      <TopNavigationBar/>
      {/*<CytoscapeTree/>*/}
      <Outlet/>
    </Container>
  );
};

export default TestPage;