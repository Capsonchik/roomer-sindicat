import './App.css';
import 'rsuite/dist/rsuite.min.css';
import {Container, CustomProvider} from "rsuite";
import {LoginForm} from "./components/loginForm/LoginForm";
import {useDispatch, useSelector} from "react-redux";
import {selectStartPage} from "./store/main.selectors";
import {AuthForm} from "./components/authForm/AuthForm";
import {setStartPage} from "./store/main.slice";
import {PreviewDrawer} from "./components/drawers/PreviewDrower/PreviewDrawer";
import {useEffect} from "react";
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

function App() {
  const startPage = useSelector(selectStartPage);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSetAuthRoute = () => {
    dispatch(setStartPage('auth'));
  }

  useEffect(() => {
    const token = Cookies.get('syndicateAuthToken')
    if(token) {
      navigate('/main')
    }
  }, [dispatch]);


  return (
    <CustomProvider locale={'ru_RU'}>
      <Container className="App">
        <div className={'appContainer'}>
          <img className={'image'} src="/roomir-logo.png" alt="logo"/>
          <h4 className={'title'}>Войдите в систему</h4>
          {startPage === 'logIn' ? <LoginForm/> : <AuthForm/>}
        </div>
      </Container>
      <PreviewDrawer/>
    </CustomProvider>

  );
}

export default App;
