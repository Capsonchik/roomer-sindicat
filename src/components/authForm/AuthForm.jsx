import {Button, ButtonToolbar, Form} from "rsuite";
import {useDispatch} from "react-redux";
import {useState} from "react";
import {setStartPage} from "../../store/main.slice";

export const AuthForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });

  const handleFormSubmit = () => {
    // dispatch(fetchLogIn(formData))
    console.log(formData);
  };

  const handleInputChange = (value, name) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleBack = () => {
    dispatch(setStartPage('logIn'))
  }

  return (
    <Form>
      <Form.Group controlId="username">
        <Form.ControlLabel>Логин</Form.ControlLabel>
        <Form.Control
          name="username"
          value={formData.username}
          onChange={(value) => handleInputChange(value, 'username')}
        />
        <Form.HelpText>Поле обязательно для заполнения</Form.HelpText>
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

      <Form.Group controlId="email">
        <Form.ControlLabel>Электронная почта</Form.ControlLabel>
        <Form.Control
          name="email"
          type="email"
          autoComplete="off"
          value={formData.email}
          onChange={(value) => handleInputChange(value, 'email')}
        />
      </Form.Group>

      <Form.Group>
        <ButtonToolbar>
          <Button appearance="primary" onClick={handleFormSubmit}>Регистрация</Button>
          <Button onClick={handleBack} appearance="default">Вернуться назад</Button>
        </ButtonToolbar>
      </Form.Group>
    </Form>
  );
};