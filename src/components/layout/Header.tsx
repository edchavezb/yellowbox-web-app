import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import styles from "./Header.module.css";
import { setModalState } from "core/features/modal/modalSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";

function Header() {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const history = useHistory();
  let searchTimeout:  ReturnType<typeof setTimeout>;

  useEffect(() => {
    if (searchQuery) history.push(`/search/${searchQuery}`)
  }, [searchQuery])

  const debounceSearch = (input: string) => {
    clearTimeout(searchTimeout);
    const encodedQuery = encodeURIComponent(input.trim());
    searchTimeout = setTimeout(() => setSearchQuery(encodedQuery), 500);
  }

  return (
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
          <div id={styles.searchBox}>
            <div id={styles.inputWrapper}>
              <input id={styles.searchInput} type="text" onChange={(e) => debounceSearch(e.target.value)} 
                onFocus={() => {if(searchQuery) history.push(`/search/${searchQuery}`)}}/>
            </div>
            <img id={styles.searchIcon} src="/icons/search.svg" alt="search"></img>
          </div>
          <div id={styles.newButton} onClick={() => dispatch(setModalState({visible: true, type:"New Box", boxId:"", page: "", itemData: undefined}))}>
            <img id={styles.plusIcon} src="/icons/plus.svg" alt="new box"></img>
          </div>
        </div>
    </div>
  );
}

export default Header;