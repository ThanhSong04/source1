import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import NavigationBar from '../NavigationBar/NavigationBar';
import styles from "./Layout.module.scss";

const Layout = () => {
  return (
    <div className={styles["root"]}>
      <NavigationBar />
      <Header />
      <div className={styles["content-container"]}>
        {/* <Sidebar /> */}
        <div className={styles["content"]}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;