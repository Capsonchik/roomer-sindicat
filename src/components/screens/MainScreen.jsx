import {SideNavigation} from "../sideNav/SideNavigation";
import {Outlet} from "react-router-dom";
import styles from './styles.module.scss'
import {Header} from "../header/Header";

export const MainScreen = () => {
  return (
    <div className={styles.mainContainer}>
      <Header/>
      <div className={styles.contentContainer}>
        <SideNavigation/>
        <Outlet/>
      </div>
    </div>
  );
};