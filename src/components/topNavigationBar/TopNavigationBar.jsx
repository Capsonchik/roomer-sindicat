import {Nav, Navbar} from "rsuite";
import CogIcon from "@rsuite/icons/legacy/Cog";
import {useNavigate} from "react-router-dom";

export const TopNavigationBar = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
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
      </Nav>
      <Nav pullRight>
        <Nav.Item icon={<CogIcon/>}>Settings</Nav.Item>
      </Nav>
    </Navbar>
  );
};