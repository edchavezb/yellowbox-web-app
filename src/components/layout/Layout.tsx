import SideBar from "./SideBar"
import Header from "./Header"
import styles from "./Layout.module.css";

import { Album, Artist, ModalState, Playlist, Track, UserBox } from "../../interfaces";
import { Dispatch, ReactNode, SetStateAction } from "react";

interface IProps {
  children: ReactNode
  userBoxes: UserBox[]
  dispatch: any
  toggleModal: Dispatch<SetStateAction<ModalState>>
}

function Layout({userBoxes, toggleModal, dispatch, children}: IProps) {

  return (
    <div id={styles.layout}>
      <section id={styles.headerWrapper}>
        <Header boxes={userBoxes} toggleModal={toggleModal} dispatch={dispatch}/>
      </section>
      <section id={styles.sideBar}>
        <SideBar userName="Pablo Alboran" boxes={userBoxes} dispatch={dispatch}/>
      </section>
      <section id={styles.mainView}>
        {children}
      </section>
    </div>
  );
}

export default Layout;