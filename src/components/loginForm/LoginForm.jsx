import {Button, ButtonToolbar, Form, Loader} from "rsuite";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {selectIsAuth, selectLogInLoader} from "../../store/main.selectors";
import {useNavigate} from "react-router-dom";
import {fetchLogIn} from "../../store/main.actions";
import {setCurrentUser, setRole, setUserName} from "../../store/userSlice/userSlice";
import {selectRole, selectCurrentUser} from "../../store/userSlice/user.selectors";

export const LoginForm = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const logInLoader = useSelector(selectLogInLoader);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  useEffect(() => {
    isAuth ? navigate("/main") : navigate("/");
  }, [isAuth, navigate]);

  const handleFormSubmit = () => {
    if(formData.username === 'admin') {
      dispatch(setRole('admin'))
      dispatch(setCurrentUser(formData))
    } else {
      dispatch(setRole('user'))
      dispatch(setCurrentUser(formData))
    }
    // dispatch(fetchLogIn(formData))
    // console.log(formData);
    navigate("/main")
  };

  const handleInputChange = (value, name) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <Form>
      <Form.Group controlId="username">
        <Form.ControlLabel>Логин</Form.ControlLabel>
        <Form.Control
          name="username"
          value={formData.username}
          onChange={(value) => handleInputChange(value, 'username')}
        />
        <Form.HelpText>Поле обязательное для заполнения</Form.HelpText>
      </Form.Group>

      <Form.Group controlId="password">
        <Form.ControlLabel>Пароль</Form.ControlLabel>
        <Form.Control
          name="password"
          type="password"
          autoComplete="off"
          value={formData.password}
          onChange={(value) => handleInputChange(value, 'password')}
        />
      </Form.Group>

      <Form.Group>
        <ButtonToolbar>
          <Button loading={logInLoader} style={{width: '100%'}} appearance="primary" onClick={handleFormSubmit}>Войти</Button>
        </ButtonToolbar>
      </Form.Group>
    </Form>
  );
};