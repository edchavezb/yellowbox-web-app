import SideBar from "./SideBar"
import Header from "./Header"
import styles from "./Layout.module.css";

import { Album, Artist, ModalState, Playlist, Track, SpotifyLoginData, UserBox, YellowboxUser } from "../../core/types/interfaces";
import { Dispatch, ReactNode, SetStateAction } from "react";

interface IProps {
  children: ReactNode
  user: YellowboxUser
  login: SpotifyLoginData
  toggleModal: Dispatch<SetStateAction<ModalState>>
}

function Layout({user, login, toggleModal, children}: IProps) {

  return (
    <div id={styles.layout}>
      <section id={styles.headerWrapper}>
        <Header toggleModal={toggleModal}/>
      </section>
      <section id={styles.sideBar}>
        <SideBar user={user} login={login}/>
      </section>
      <section id={styles.mainView}>
        {children}
      </section>
    </div>
  );
}

export default Layout;