import {Nav, Navbar} from "rsuite";
import UserBadgeIcon from '@rsuite/icons/UserBadge';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentUser} from "../../store/userSlice/user.selectors";
import {setActiveClient, setActiveReport} from "../../store/chartSlice/chart.slice";
import ExitIcon from '@rsuite/icons/Exit';
import logoWhite from './logo-white.png';
import styles from './nav.module.scss';
import {useEffect, useState} from "react";
import {selectActiveClient, selectClients} from "../../store/chartSlice/chart.selectors";

export const TopNavigationBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const clients = useSelector(selectClients);
  const activeClient = useSelector(selectActiveClient);
  const [client, setClient] = useState();
  const [colors, setColors] = useState([]);

  useEffect(() => {
    const client = clients.find(clnt => clnt.client_id === activeClient);
    setClient(client);
    if (client?.header_colors && client?.header_colors?.colors) {
      setColors(client.header_colors.colors);
    } else {
      setColors(['#FF8200', '#FF8200']);
    }
  }, [activeClient]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogOut = () => {
    localStorage.removeItem('authToken');
    dispatch(setActiveClient(null));
    dispatch(setActiveReport(null));
    navigate('/');
  };

  const gradient = `linear-gradient(90deg, ${colors.join(', ')})`;

  const darkenColor = (color, amount) => {
    let usePound = false;
    if (color[0] === "#") {
      color = color.slice(1);
      usePound = true;
    }
    const num = parseInt(color, 16);
    let r = (num >> 16) + amount;
    let g = ((num >> 8) & 0x00FF) + amount;
    let b = (num & 0x0000FF) + amount;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    return (usePound ? "#" : "") + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
  };

  const getHoverStyle = () => {
    const firstColor = colors[0];
    const darkenedColor = darkenColor(firstColor, -40); // Затемняем цвет

    return {
      background: `rgba(${parseInt(darkenedColor.slice(1, 3), 16)}, ${parseInt(darkenedColor.slice(3, 5), 16)}, ${parseInt(darkenedColor.slice(5, 7), 16)}, 0.5)`, // Прозрачность 0.5
      color: '#fff',
    };
  };

  return (

      <Navbar
        style={{
          background: colors.length > 1 ? gradient : colors[0],
          borderRadius: 8,
          margin: 15,
          color: 'white',
          boxShadow: '5px 4px 18px -2px rgba(34, 60, 80, 0.4)'
        }}
        appearance={'subtle'}
      >
        <Navbar.Brand style={{padding: '13px 20px'}} href="#" onClick={() => handleNavigate('/main')}>
          <img style={{height: 30, objectFit: 'contain'}} src={logoWhite} alt="logo"/>
        </Navbar.Brand>
        <Nav>
          <Nav.Item
            className={styles.nav_item}
            onClick={() => handleNavigate('/main')}
            style={{transition: 'all 0.3s'}}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, getHoverStyle())}
            onMouseLeave={(e) => e.currentTarget.removeAttribute('style')}
          >
            Главная
          </Nav.Item>
          <Nav.Item
            className={styles.nav_item}
            onClick={() => handleNavigate('/main/report')}
            style={{transition: 'all 0.3s'}}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, getHoverStyle())}
            onMouseLeave={(e) => e.currentTarget.removeAttribute('style')}
          >
            Отчет
          </Nav.Item>
          <Nav.Item
            className={styles.nav_item}
            onClick={() => handleNavigate('/main/reportList')}
            style={{transition: 'all 0.3s'}}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, getHoverStyle())}
            onMouseLeave={(e) => e.currentTarget.removeAttribute('style')}
          >
            Список отчетов
          </Nav.Item>
        </Nav>
        <Nav pullRight>
          {user && (
            <Nav.Item
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, getHoverStyle())}
              onMouseLeave={(e) => e.currentTarget.removeAttribute('style')}
              className={styles.nav_item} icon={<UserBadgeIcon/>} style={{transition: 'all 0.3s'}}>
              {user.username}
            </Nav.Item>
          )}
          <Nav.Item
            className={styles.nav_item}
            onClick={handleLogOut}
            icon={<ExitIcon/>}
            style={{transition: 'all 0.3s'}}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, getHoverStyle())}
            onMouseLeave={(e) => e.currentTarget.removeAttribute('style')}
          >
            Выйти из системы
          </Nav.Item>
        </Nav>
      </Navbar>

  );
};
