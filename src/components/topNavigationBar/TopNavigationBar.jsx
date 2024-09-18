import {Nav, Navbar} from "rsuite";
import CogIcon from "@rsuite/icons/legacy/Cog";
import UserBadgeIcon from '@rsuite/icons/UserBadge';
import {useNavigate} from "react-router-dom";
import {ROUTES_PATH} from "../../routes/RoutesPath";
import Cookies from "js-cookie";
import {fetchPostLogOut} from "../../store/main.actions";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentUser} from "../../store/userSlice/user.selectors";

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
    // dispatch(fetchPostLogOut())
    navigate('/')
  }

  return (
    <Navbar style={{marginBottom: 16}} appearance={'subtle'}>
      <Navbar.Brand href="#" onClick={() => handleNavigate('/main')}>
        <img style={{width: 100, height: 30}} src="/roomir-logo.png" alt="logo"/>
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
        <Nav.Item onClick={handleLogOut} icon={<CogIcon/>}>Выйти из системы</Nav.Item>
      </Nav>
    </Navbar>
  );
};