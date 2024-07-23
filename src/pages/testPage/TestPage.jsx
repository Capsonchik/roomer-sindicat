import {Container} from "rsuite";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {fetchGetAllClients} from "../../store/reportSlice/reportSlice.actions";
import {TopNavigationBar} from "../../components/topNavigationBar/TopNavigationBar";
import {Outlet} from "react-router-dom";

export const TestPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGetAllClients())
  }, [dispatch]);

  return (
    <Container>
      <TopNavigationBar/>
      <Outlet/>
    </Container>
  );
};

export default TestPage;