import {Container} from "rsuite";
import styles from "./styles.module.scss";
import {MainScreen} from "../../components/screens/MainScreen";

export const Main = () => {
  return (
    <Container className={styles.container}>
      <MainScreen/>
    </Container>
  );
};

export default Main;