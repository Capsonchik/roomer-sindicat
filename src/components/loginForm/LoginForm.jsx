import styles from './styles.module.scss';
import {Button, ButtonToolbar, Form, Message, useToaster} from "rsuite";
import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {selectUserLoader} from "../../store/userSlice/user.selectors";
import Cookies from "js-cookie";
import {setRole} from "../../store/userSlice/userSlice";

export const LoginForm = () => {
  const userLoader = useSelector(selectUserLoader);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const placement = 'topEnd';
  const toaster = useToaster();
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const message = (
    <Message showIcon type={'error'} closable>
      <strong>Неверный логин или пароль</strong>
    </Message>
  );
  const handleFormSubmit = () => {
    setLoader(true);
    setTimeout(() => {
      if(formData.username === 'user' && formData.password === 'user') {
        Cookies.set('syndicateAuthToken', formData.username, {expires: 3});
        dispatch(setRole('user'))
        setLoader(false);
        navigate('/main');
      } else if(formData.username === 'admin' && formData.password === 'admin') {
        Cookies.set('syndicateAuthToken', formData.username, {expires: 3});
        dispatch(setRole('admin'))
        setLoader(false);
        navigate('/main');
      } else {
        toaster.push(message, {placement, duration: 3000});
        setLoader(false);
      }
    }, 2000)
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
        <Form.ControlLabel className={styles.formLabel}>Логин</Form.ControlLabel>
        <Form.Control
          name="username"
          value={formData.username}
          onChange={(value) => handleInputChange(value, 'username')}
        />
        <Form.HelpText>Поле обязательное для заполнения</Form.HelpText>
      </Form.Group>

      <Form.Group controlId="password">
        <Form.ControlLabel className={styles.formLabel}>Пароль</Form.ControlLabel>
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
          <Button
            className={styles.btn}
            loading={loader}
            style={{width: '100%'}}
            appearance="primary"
            onClick={handleFormSubmit}
            onLoad={userLoader}
          >
            Войти
          </Button>
        </ButtonToolbar>
      </Form.Group>
    </Form>
  );
};