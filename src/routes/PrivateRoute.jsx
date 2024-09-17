import {Navigate, useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import {useDispatch} from "react-redux";
import {setRole} from "../store/userSlice/userSlice";

export const PrivateRoute = ({children}) => {
  const token = Cookies.get('syndicateAuthToken');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // if (token === 'user') {
  //   dispatch(setRole('user'));
  // } else if (token === 'admin') {
  //   dispatch(setRole('admin'));
  // } else {
  //   navigate('/')
  // }
  //
  // if (!token) {
  //   return <Navigate to="/"/>;
  // }

  return children;
};