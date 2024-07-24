import './App.css';
import 'rsuite/dist/rsuite.min.css';
import {Container} from "rsuite";
import {LoginForm} from "./components/loginForm/LoginForm";
import {useDispatch, useSelector} from "react-redux";
import {selectStartPage} from "./store/main.selectors";
import {AuthForm} from "./components/authForm/AuthForm";
import {setStartPage} from "./store/main.slice";

function App() {
  const startPage = useSelector(selectStartPage);
  const dispatch = useDispatch();

  const handleSetAuthRoute = () => {
    dispatch(setStartPage('auth'));
  }

  return (
    <Container className="App">
      <div className={'appContainer'}>
        <img className={'image'} src="/roomir-logo.png" alt="logo"/>
        <h4 className={'title'}>Войдите в систему</h4>
        {startPage === 'logIn' ? <LoginForm/> : <AuthForm/>}
      </div>
    </Container>
  );
}

export default App;
