import {useSelector} from "react-redux";
import {selectRole} from "../../store/userSlice/user.selectors";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export const AddNewReport = () => {
  const userRole = useSelector(selectRole);
  const navigate = useNavigate();

  useEffect(() => {
    if(userRole !== 'admin') {
      navigate("/");
    }
  }, [userRole]);


  return (
    <div>
      test
    </div>
  );
};