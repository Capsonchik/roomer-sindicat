import styles from './styles.module.scss';
import {Container} from "rsuite";
import {PresentationTabs} from "./presentationTabs/PresentationTabs";

export const Presentation = () => {
  return (
    <Container className={styles.container}>
      <PresentationTabs/>
    </Container>
  );
};