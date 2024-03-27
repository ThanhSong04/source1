import React from 'react';
import styles from "./NavigationBar.module.scss";
import { useRecoilValue } from 'recoil';
import { activeLinkState } from '@/recoil/listState';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import Logo from '@/assets/namada-icon.svg';

const NavigationBar = () => {

  const navigationList = [
    {
      text: "Block",
      link: "/blocks",
    },
    {
      text: "Validator",
      link: "/validators",
    },
    {
      text: "Transaction",
      link: "/transactions",
    },
  ];


  const activeItem = useRecoilValue(activeLinkState);


  return (
    <div className={styles["root"]}>
      <div className={styles["container"]}>
      <div className={styles["logo"]}><img src={Logo} alt="logo" /></div>
        {
          navigationList.map((item, index) => <Link key={`item-${index}`}  className={classNames(styles["sidebar-item"], activeItem === item.link ? styles["sidebar-item--active"] : "")} to={item.link}>
            {item.text}
          </Link>
        )}
      </div>
    </div>
  );
};

export default NavigationBar;