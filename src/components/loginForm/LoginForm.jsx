import styles from './styles.module.scss';
import {Button, ButtonToolbar, Form, Message, useToaster} from "rsuite";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {selectUserLoader} from "../../store/userSlice/user.selectors";
import Cookies from "js-cookie";
import {setRole} from "../../store/userSlice/userSlice";
import * as yup from "yup";
import {FormProvider, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {CustomInput} from "../rhfInputs/customInput/CustomInput";
import {axiosLoginRequest} from "../../api/ApiConfig";
import {fetchGetUser} from "../../store/main.actions";

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

  // В компоненте
  useEffect(() => {
    if (methods.formState.isSubmitSuccessful) {
      navigate('/main');
    }
  }, [methods.formState.isSubmitSuccessful]);


  const handleFormSubmit = async (data) => {
    // if (!navigator.cookieEnabled) {
    //   return alert('включи куки!')
    //   // The browser does not support or is blocking cookies from being set.
    // }
    setLoader(true);
    const response = await axiosLoginRequest.post('/login', {
      username: data.username,
      password: data.password,
    }).catch(err => {
      console.log(1111111111111111)
      // console.log(err)
      toaster.push(message, {placement, duration: 3000});
      setLoader(false);
      return false
    });


    // if(response.status)

    if (response.status === 200) {
      console.log(response)
      // Получаем токен из localStorage
      localStorage.setItem('authToken', response.data.access_token);

      dispatch(fetchGetUser())
      // toaster.push(message, {placement, duration: 3000});
      setLoader(false);
      // Используем useEffect для навигации
      return true; // Возвращаем индикатор для навигации
    }

    setLoader(false);
    return false;
  };
  // const handleFormSubmit = async (data) => {
  //   setLoader(true);
  //   const response = await axiosLoginRequest.post('', {
  //     username: data.username,
  //     password: data.password,
  //   })
  //   if (response.status === 204) {
  //     console.log(2)
  //     navigate('/main');
  //   }
  //   setLoader(false);

  // console.log(res)

  // setTimeout(() => {
  //   if (data.username === 'user' && data.password === 'user') {
  //     Cookies.set('syndicateAuthToken', data.username, {expires: 3});
  //     dispatch(setRole('user'))
  //     setLoader(false);
  //     navigate('/main');
  //   } else if (data.username === 'admin' && data.password === 'admin') {
  //     Cookies.set('syndicateAuthToken', data.username, {expires: 3});
  //     dispatch(setRole('admin'))
  //     setLoader(false);
  //     navigate('/main');
  //   } else {
  //     toaster.push(message, {placement, duration: 3000});
  //     setLoader(false);
  //   }
  // }, 2000)
  // };

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
