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
import styles from './nav.module.scss'
import {selectCurrentClient} from "../../store/reportSlice/reportSlice.selectors";
import {useEffect, useState} from "react";
import {selectActiveClient, selectClients} from "../../store/chartSlice/chart.selectors";


export const TopNavigationBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser)
  const clients = useSelector(selectClients)
  const activeClient = useSelector(selectActiveClient)
  const [client, setClient] = useState()
  const [colors, setColors] = useState([])

  useEffect(() => {
    const client = clients.find(clnt => clnt.client_id === activeClient)
    setClient(client)
    if (client?.header_colors && client?.header_colors?.colors) {
      setColors(client.header_colors.colors)
      // setColors(['#FF8200', '#FF8200'])
    }
    else {
      setColors(['#FF8200', '#FF8200'])
    }
  }, [activeClient]);
  console.log(colors)
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

  const gradient = `linear-gradient(90deg, ${colors.join(', ')})`;
  // box-shadow: 5px 4px 18px -2px rgba(34, 60, 80, 0.2);
  return (
    <Navbar style={{
      background: colors.length > 1 ? gradient : colors[0],
      borderRadius: 8,
      margin: 15,
      color: 'white',
      boxShadow: '5px 4px 18px -2px rgba(34, 60, 80, 0.4)'
    }} appearance={'subtle'}>
      <Navbar.Brand
        style={{padding: '13px 20px'}}
        href="#" onClick={() => handleNavigate('/main')}>
        <img style={{height: 30, objectFit: 'contain'}} src={logoWhite} alt="logo"/>
      </Navbar.Brand>
      <Nav>
        <Nav.Item className={styles.nav_item} onClick={() => handleNavigate('/main')}>Главная</Nav.Item>
        <Nav.Item className={styles.nav_item} onClick={() => handleNavigate('/main/report')}>Отчет</Nav.Item>
        <Nav.Item className={styles.nav_item} onClick={() => handleNavigate('/main/reportList')}>Список
          отчетов</Nav.Item>
        {/*<Nav.Item onClick={() => handleNavigate('/main/map')}>Карта</Nav.Item>*/}
        {/*<Nav.Item onClick={() => handleNavigate('/main' + ROUTES_PATH.editorChart)}>Чарты</Nav.Item>*/}
      </Nav>
      <Nav pullRight>

        {user && <Nav.Item className={styles.nav_item} icon={<UserBadgeIcon/>}>{user.username}</Nav.Item>}
        <Nav.Item className={styles.nav_item} onClick={handleLogOut} icon={<ExitIcon/>}>Выйти из системы</Nav.Item>
      </Nav>
    </Navbar>
  );
};