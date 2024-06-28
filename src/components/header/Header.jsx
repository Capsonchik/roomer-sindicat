import {Nav, Navbar} from "rsuite";
import {useNavigate} from "react-router-dom";
import styles from './styles.module.scss'

export const Header = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  }

  return (
    <header className={styles.header}>
      <Navbar>
        <Nav>
          <Nav.Item onClick={() => handleNavigate('/main')}>Главная</Nav.Item>
          <Nav.Menu title="Пользователь">
            <Nav.Item onClick={() => handleNavigate('/main/reportList')}>Мои отчеты</Nav.Item>
          </Nav.Menu>
          <Nav.Menu title="Сформировать отчет">
            <Nav.Item onClick={() => handleNavigate('/main/report')}>Вариант 1</Nav.Item>
            <Nav.Item onClick={() => handleNavigate('/main/report1')}>Вариант 2</Nav.Item>
          </Nav.Menu>
        </Nav>
      </Navbar>
    </header>
  );
};