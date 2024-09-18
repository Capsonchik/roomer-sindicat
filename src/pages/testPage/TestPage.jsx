import {Container, Message, useToaster} from "rsuite";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {fetchGetAllClients} from "../../store/reportSlice/reportSlice.actions";
import {TopNavigationBar} from "../../components/topNavigationBar/TopNavigationBar";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {selectCurrentUser} from "../../store/userSlice/user.selectors";
import {fetchGetUser} from "../../store/main.actions";
import {axiosLoginRequest} from "../../api/ApiConfig";

export const TestPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectCurrentUser)
  const toaster = useToaster();
  const placement = 'topEnd'

  useEffect(() => {
    const checkAuth = async () => {
      const res = await axiosLoginRequest.get(`/api/v1/users/me`)
      if(!res) {
        navigate('/')
      }
    }
    checkAuth()
  }, []);

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
    <Container>
      <TopNavigationBar/>
      <Outlet/>
    </Container>
  );
};

export default TestPage;