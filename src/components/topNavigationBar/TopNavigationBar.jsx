import {Nav, Navbar} from "rsuite";
import CogIcon from "@rsuite/icons/legacy/Cog";
import UserBadgeIcon from '@rsuite/icons/UserBadge';
import {useNavigate} from "react-router-dom";
import {ROUTES_PATH} from "../../routes/RoutesPath";
import Cookies from "js-cookie";
import {fetchPostLogOut} from "../../store/main.actions";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentUser} from "../../store/userSlice/user.selectors";
import {setActiveClient, setActiveReport} from "../../store/chartSlice/chart.slice";
import ExitIcon from '@rsuite/icons/Exit';
import logoWhite from './logo-white.png'


export const TopNavigationBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser)

  const handleNavigate = (path) => {
    navigate(path);
  }

  const handleLogOut = () => {
    // fetchPostLogOut
    localStorage.removeItem('authToken');
    dispatch(setActiveClient(null))
    dispatch(setActiveReport(null))
    // dispatch(fetchPostLogOut())
    navigate('/')
  }
  // box-shadow: 5px 4px 18px -2px rgba(34, 60, 80, 0.2);
  return (
    <Navbar style={{background:'linear-gradient(45deg,#FF8200, #FF8200)',borderRadius:8,margin:15,color:'white',boxShadow:'5px 4px 18px -2px rgba(34, 60, 80, 0.4)'}} appearance={'subtle'}>
      <Navbar.Brand
        style={{padding: '13px 20px'}}
        href="#" onClick={() => handleNavigate('/main')}>
        <img style={{ height: 30,objectFit:'contain'}} src={logoWhite} alt="logo"/>
      </Navbar.Brand>
      <Nav>
        <Nav.Item onClick={() => handleNavigate('/main')}>Главная</Nav.Item>
        <Nav.Item onClick={() => handleNavigate('/main/report')}>Отчет</Nav.Item>
        <Nav.Item onClick={() => handleNavigate('/main/reportList')}>Список отчетов</Nav.Item>
        {/*<Nav.Item onClick={() => handleNavigate('/main/map')}>Карта</Nav.Item>*/}
        {/*<Nav.Item onClick={() => handleNavigate('/main' + ROUTES_PATH.editorChart)}>Чарты</Nav.Item>*/}
      </Nav>
      <Nav pullRight>

        {user && <Nav.Item icon={<UserBadgeIcon/>}>{user.username}</Nav.Item>}
        <Nav.Item onClick={handleLogOut} icon={<ExitIcon/>}>Выйти из системы</Nav.Item>
      </Nav>
    </Navbar>
  );
};