import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import { useHistory } from "react-router-dom";
import styles from "./Header.module.css";
import PopperMenu from "components/menus/popper/PopperMenu";
import AddButtonMenu from "components/menus/popper/AddButtonMenu/AddButtonMenu";
import { useAppSelector } from "core/hooks/useAppSelector";
import { spotifyLoginApi } from "core/api/spotify";
import HamburgerMenu from "components/menus/popper/HamburgerMenu/HamburgerMenu";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { setModalState } from "core/features/modal/modalSlice";

function Header() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(state => state.userData.isUserLoggedIn);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
  const history = useHistory();
  const createButtonRef = useRef(null);
  const hamburgerButtonRef = useRef(null);
  let searchTimeout: ReturnType<typeof setTimeout>;

  useEffect(() => {
    if (searchQuery) history.push(`/search/${searchQuery}`)
  }, [searchQuery, history])

  const debounceSearch = (input: string) => {
    clearTimeout(searchTimeout);
    const encodedQuery = encodeURIComponent(input.trim());
    searchTimeout = setTimeout(() => setSearchQuery(encodedQuery), 500);
  }

  const handleLogin = async () => {
    dispatch(setModalState({
      visible: true, type: "Log In", page: ""
    }))
  }

  const handleSpotifyLogin = async () => {
    const response = await spotifyLoginApi();
    if (response) {
      window.location.replace(response.url)
    }
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
                <input id={styles.searchInput} type="text" onChange={(e) => debounceSearch(e.target.value)}
                  onFocus={() => { if (searchQuery) history.push(`/search/${searchQuery}`) }} />
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