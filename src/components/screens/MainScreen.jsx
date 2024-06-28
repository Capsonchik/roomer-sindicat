import {SideNavigation} from "../sideNav/SideNavigation";
import {MainComponent} from "../mainComponent/MainComponent";
import {Outlet} from "react-router-dom";

export const MainScreen = () => {
  return (
    <div style={{width:'100%',height:'100%', overflow:'auto'}}>
      <div style={{height: '99vh', display: 'flex'}}>
        <SideNavigation/>
        {/*<MainComponent/>*/}
        <Outlet/>
      </div>
    </div>
  );
};