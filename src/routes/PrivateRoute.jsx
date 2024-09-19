import {Navigate, useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import {useDispatch, useSelector} from "react-redux";
import {setRole} from "../store/userSlice/userSlice";
import {selectCurrentUser, selectUserLoader} from "../store/userSlice/user.selectors";
import {useEffect} from "react";

export const PrivateRoute = ({children}) => {
  // const token = Cookies.get('syndicateAuthToken');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser)
  const userLoader = useSelector(selectUserLoader)

  // if (token === 'user') {
  //   dispatch(setRole('user'));
  // } else if (token === 'admin') {
  //   dispatch(setRole('admin'));
  // } else {
  //   navigate('/')
  // }
  //
  const token = localStorage.getItem('authToken')
  // useEffect(() => {
  //   if (token) {
  //     navigate('/');
  //   }
  //   // if (userLoader === 'idle' && !user) {
  //   //   console.log(4444)
  //   //   navigate('/');
  //   // }
  //
  // }, [user, userLoader])
  if (!token) {
    return <Navigate to="/"/>;
  }

  return children;
};