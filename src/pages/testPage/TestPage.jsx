import {Container, Message, useToaster} from "rsuite";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {fetchGetAllClients} from "../../store/reportSlice/reportSlice.actions";
import {TopNavigationBar} from "../../components/topNavigationBar/TopNavigationBar";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {selectCurrentUser} from "../../store/userSlice/user.selectors";
import {fetchGetUser} from "../../store/main.actions";
import {axiosLoginRequest} from "../../api/ApiConfig";
import styles from './styles.module.scss'
import {GroupFilters} from "../chartList/groupFilters/GroupFilters";
import {GroupFiltersWrapper, GroupFIltersWrapper} from "../chartList/groupFilters/GroupFIltersWrapper";

export const TestPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectCurrentUser)
  const toaster = useToaster();
  const placement = 'topEnd'

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const token = localStorage.getItem('authToken')
  //     const response = await fetch(
  //       'https://aca1-212-45-6-6.ngrok-free.app/api/v1/users/me', {
  //         headers: {
  //           "Authorization": `Bearer ${token}`,
  //           Accept: 'application/json',
  //           'Content-Type': 'application/x-www-form-urlencoded',
  //           'Accept-Language': 'ru',
  //           "ngrok-skip-browser-warning": 'true',
  //         }
  //
  //       }).catch(() => {
  //       navigate('/')
  //     });
  //     // if (!response) {
  //     //   navigate('/')
  //     // }
  //   }
  //   checkAuth()
  // }, []);

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
      <Outlet/>
    </Container>
  );
};

export default TestPage;