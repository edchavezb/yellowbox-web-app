import { Link } from "react-router-dom";
import { useState, useRef } from 'react';
import { useHistory } from "react-router-dom";
import styles from "./Header.module.css";
import PopperMenu from "components/menus/popper/PopperMenu";
import AddButtonMenu from "components/menus/popper/AddButtonMenu/AddButtonMenu";
import { useAppSelector } from "core/hooks/useAppSelector";
import HamburgerMenu from "components/menus/popper/HamburgerMenu/HamburgerMenu";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { setModalState } from "core/features/modal/modalSlice";
import useDebounce from "core/hooks/useDebounce";

function Header() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(state => state.userData.isUserLoggedIn);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
  const history = useHistory();
  const createButtonRef = useRef(null);
  const hamburgerButtonRef = useRef(null);
  const debouncedSearch = useDebounce(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const searchQuery = e.target.value;
      handleNavigate(searchQuery);
    }, 500
  );

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    handleNavigate(searchQuery);
  }
  
  const handleNavigate = (searchQuery: string) => {
    if (searchQuery) {
      const encodedQuery = encodeURIComponent(searchQuery.trim());
      history.push(`/search/${encodedQuery}`);
    }
  }

  const handleLogin = async () => {
    dispatch(setModalState({
      visible: true, type: "Log In", page: ""
    }))
  }

  return (
    <>
      <div id={styles.header}>
        <div id={styles.logoSide}>
          <Link to="/">
            <div id={styles.logoContainer}>
              <img id={styles.ideogram} src="/ideogram.png" alt="ideogram"></img>
              <span id={styles.logo}> yellowbox </span>
            </div>
          </Link>
        </div>
        <div id={styles.headerTools}>
          {
            isLoggedIn &&
            <div id={styles.searchBox}>
              <div id={styles.inputWrapper}>
                <input
                  id={styles.searchInput}
                  type="text"
                  onChange={debouncedSearch}
                  onFocus={handleFocus}
                />
              </div>
              <img id={styles.searchIcon} src="/icons/search.svg" alt="search"></img>
            </div>
          }
          {
            isLoggedIn &&
            <div id={styles.newButton} ref={createButtonRef} onClick={() => setIsCreateMenuOpen(true)}>
              <img id={styles.plusIcon} src="/icons/plus.svg" alt="new box"></img>
            </div>
          }
          {
            isLoggedIn &&
            <div id={styles.hamburgerButton} ref={hamburgerButtonRef} onClick={() => setIsHamburgerMenuOpen(true)}>
              <img id={styles.hamburgerIcon} src="/icons/reorder.svg" alt="menu"></img>
            </div>
          }
          {
            isLoggedIn === false &&
            <div id={styles.loginButton} onClick={handleLogin}>
              Log in / Sign up
            </div>
          }
        </div>
      </div>
      <PopperMenu referenceRef={createButtonRef} placement={'right-start'} isOpen={isCreateMenuOpen} setIsOpen={setIsCreateMenuOpen}>
        <AddButtonMenu setIsOpen={setIsCreateMenuOpen} />
      </PopperMenu>
      <PopperMenu referenceRef={hamburgerButtonRef} placement={'right-start'} isOpen={isHamburgerMenuOpen} setIsOpen={setIsHamburgerMenuOpen}>
        <HamburgerMenu setIsOpen={setIsHamburgerMenuOpen} />
      </PopperMenu>
    </>
  );
}

export default Header;