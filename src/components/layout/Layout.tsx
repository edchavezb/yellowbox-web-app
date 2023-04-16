import SideBar from "./SideBar"
import Header from "./Header"
import styles from "./Layout.module.css";
import { ReactNode } from "react";
import { useAppSelector } from "core/hooks/useAppSelector";
import ResizablePane from "./ResizablePane/ResizablePane";

interface IProps {
  children: ReactNode
}

function Layout({ children }: IProps) {
  const user = useAppSelector(state => state.userData.authenticatedUser)
  const spotifyLogin = useAppSelector(state => state.spotifyLoginData.data)

  return (
    <div id={styles.layout}>
      <section id={styles.headerWrapper}>
        <Header />
      </section>
      <section id={styles.bodyWrapper}>
        <ResizablePane 
          leftContent={
            <section id={styles.sideBar}>
              <SideBar user={user} login={spotifyLogin} />
            </section>
          }
          rightContent={
            <section id={styles.mainView}>
              {children}
            </section>
          }
        />
      </section>
    </div>
  );
}

export default Layout;