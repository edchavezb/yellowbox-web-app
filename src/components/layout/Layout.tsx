import Sidebar from "./Sidebar/Sidebar"
import Header from "./Header"
import styles from "./Layout.module.css";
import { ReactNode } from "react";
import { useAppSelector } from "core/hooks/useAppSelector";
import ResizablePane from "./ResizablePane/ResizablePane";

interface IProps {
  children: ReactNode
}

function Layout({ children }: IProps) {
  const isLoggedIn = useAppSelector(state => state.userData.isUserLoggedIn);
  const user = useAppSelector(state => state.userData.authenticatedUser)

  return (
    <div id={styles.layout}>
      <section id={styles.headerWrapper}>
        <Header />
      </section>
      <section id={styles.bodyWrapper}>
        {isLoggedIn !== null &&
          <ResizablePane
            leftContent={
              <section id={styles.sideBar}>
                <Sidebar user={user} />
              </section>
            }
            rightContent={
              <section id={styles.mainView}>
                {children}
              </section>
            }
          />
        }
      </section>
    </div>
  );
}

export default Layout;