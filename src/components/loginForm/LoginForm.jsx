import styles from './styles.module.scss';
import {Button, ButtonToolbar, Form, Message, useToaster} from "rsuite";
import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {selectUserLoader} from "../../store/userSlice/user.selectors";
import Cookies from "js-cookie";
import {setRole} from "../../store/userSlice/userSlice";
import * as yup from "yup";
import {FormProvider, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {CustomInput} from "../rhfInputs/customInput/CustomInput";

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


  const loginSchema = yup.object().shape({
    username: yup.string().required("Поле обязательно"),
    password: yup.string().required("Поле обязательно")
  });

  const methods = useForm({
    resolver: yupResolver(loginSchema),
  })

  const message = (
    <Message showIcon type={'error'} closable>
      <strong>Неверный логин или пароль</strong>
    </Message>
  );
  const handleFormSubmit = (data) => {
    setLoader(true);
    setTimeout(() => {
      if (data.username === 'user' && data.password === 'user') {
        Cookies.set('syndicateAuthToken', data.username, {expires: 3});
        dispatch(setRole('user'))
        setLoader(false);
        navigate('/main');
      } else if (data.username === 'admin' && data.password === 'admin') {
        Cookies.set('syndicateAuthToken', data.username, {expires: 3});
        dispatch(setRole('admin'))
        setLoader(false);
        navigate('/main');
      } else {
        toaster.push(message, {placement, duration: 3000});
        setLoader(false);
      }
    }, 2000)
  };

  // const handleInputChange = (value, name) => {
  //   setFormData({
  //     ...formData,
  //     [name]: value
  //   });
  // };

  return (
    <FormProvider {...methods}>
      <div className={styles.form}>
        <div className={styles.input_wrapper}>
          <label className={styles.label}>Логин</label>
          <CustomInput name={'username'}/>

        </div>
        <div className={styles.input_wrapper}>
          <label className={styles.label}>Пароль</label>
          <CustomInput name={'password'} type={'password'}/>

        </div>

        <Button
          className={styles.btn}
          loading={loader}
          style={{width: '100%'}}
          appearance="primary"
          onClick={(e) => {
            e.stopPropagation()
            methods.handleSubmit(handleFormSubmit)()
          }}
          onLoad={userLoader}
        >
          Войти
        </Button>

      </div>
    </FormProvider>

  );
};
