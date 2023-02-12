import { setModalState } from 'core/features/modal/modalSlice';
import { updateBoxSorting, updateBoxSortingThunk } from 'core/features/currentBoxDetail/currentBoxDetailSlice';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { useState, useEffect } from 'react';
import { SectionSorting, Sorting, UserBox } from 'core/types/interfaces';
//import { useHistory } from "react-router-dom";

import styles from "./SortingMenu.module.css";

type BoxSections = Pick<UserBox, "albums" | "artists" | "tracks" | "playlists">

function SortingMenu() {
  const dispatch = useAppDispatch();
  const targetBox = useAppSelector(state => state.currentBoxDetailData.box);
  const userBoxes = useAppSelector(state => state.userBoxesData.boxes);
  const isOwner = !!userBoxes.find(box => box._id === targetBox?._id);
  const boxSections: BoxSections = { artists: targetBox!.artists, albums: targetBox!.albums, tracks: targetBox!.tracks, playlists: targetBox!.playlists }
  const nonEmptySections = Object.keys(boxSections).filter((section) => boxSections[section as keyof BoxSections].length > 0)
  const [sorting, setSorting] = useState<SectionSorting>(targetBox?.sectionSorting!)

  const handleUpdateSorting = () => {
    // API only called if current user is box owner, otherwise updates are local
    if (isOwner) {
      dispatch(updateBoxSortingThunk(targetBox._id, sorting))
    } else {
      dispatch(updateBoxSorting(sorting))
    }
    dispatch(setModalState({ visible: false, type: "", boxId: "", page: "", itemData: undefined }))
  }

  return (
    <div id={styles.modalBody}>
      <form id={styles.sortingForm}>
        {nonEmptySections.map(section => {
          return (
            <div className={styles.section} key={section}>
              <div className={styles.rowName}> {section.charAt(0).toUpperCase() + section.slice(1)} </div>

              <div className={styles.sortingRow}>
                <div className={styles.formInput}>
                  <label htmlFor="view"> View as </label>
                  <select name="view" value={sorting[section as keyof SectionSorting].view}
                    onChange={e => {
                      let sectionCopy = JSON.parse(JSON.stringify(sorting[section as keyof SectionSorting]))
                      let updatedSection = { ...sectionCopy, view: e.target.value }
                      let newSortingObject: Partial<SectionSorting> = {};
                      newSortingObject[section as keyof SectionSorting] = updatedSection
                      setSorting((state: SectionSorting) => ({ ...state, ...newSortingObject }))
                    }}>
                    <option value="grid"> Grid </option>
                    {section !== "artists" ? <option value="list"> List </option> : ""}
                    <option value="details"> Details </option>
                  </select>
                </div>

                <div className={styles.formInput}>
                  <label htmlFor="sorting"> Sort by </label>
                  <select name="sorting" value={sorting[section as keyof SectionSorting].primarySorting}
                    onChange={e => {
                      let sectionCopy = JSON.parse(JSON.stringify(sorting[section as keyof SectionSorting]))
                      let updatedSection = { ...sectionCopy, primarySorting: e.target.value }
                      let newSortingObject: Partial<SectionSorting> = {};
                      newSortingObject[section as keyof SectionSorting] = updatedSection
                      setSorting(state => ({ ...state, ...newSortingObject }))
                      if (section !== "artists") ((e.target as Element).closest("div")!.nextElementSibling!.querySelector(".sec-sorting")! as HTMLSelectElement).selectedIndex = 0
                    }}>
                    <option value="custom"> Custom </option>
                    {section === "artists" ? <option value="name"> Name </option> : ""}
                    {section !== "artists" ? <option value="name"> Title </option> : ""}
                    {section !== "artists" ? <option value="release_year"> Release Year </option> : ""}
                    {section !== "artists" ? <option value="artist"> Artist </option> : ""}
                    {section === "tracks" ? <option value="album"> Album </option> : ""}
                    {section === "tracks" ? <option value="duration"> Duration </option> : ""}
                    {section === "tracks" ? <option value="track_number"> Track Number </option> : ""}
                  </select>
                </div>

                <div className={styles.formInput}>
                  <label htmlFor="sec-sorting"> then by </label>
                  <select className="sec-sorting" name="sec-sorting"
                    disabled={sorting[section as keyof SectionSorting].primarySorting === "custom"}
                    value={sorting[section as keyof SectionSorting].secondarySorting}
                    onChange={e => {
                      let sectionCopy = JSON.parse(JSON.stringify(sorting[section as keyof SectionSorting]))
                      let updatedSection = { ...sectionCopy, secondarySorting: e.target.value }
                      let newSortingObject: Partial<SectionSorting> = {};
                      newSortingObject[section as keyof SectionSorting] = updatedSection
                      setSorting(state => ({ ...state, ...newSortingObject }))
                    }}
                  >
                    <option value="none" disabled hidden> Select... </option>
                    {section === "artists" ? <option value="name" hidden={sorting[section as keyof SectionSorting].primarySorting === "name"}> Name </option> : ""}
                    {section !== "artists" ? <option value="name" hidden={sorting[section as keyof SectionSorting].primarySorting === "name"}> Title </option> : ""}
                    {section !== "artists" ? <option value="release_year" hidden={sorting[section as keyof SectionSorting].primarySorting === "release_year"}> Release Year </option> : ""}
                    {section !== "artists" ? <option value="release_date" hidden={sorting[section as keyof SectionSorting].primarySorting === "release_date"}> Release Date </option> : ""}
                    {section !== "artists" ? <option value="artist" hidden={sorting[section as keyof SectionSorting].primarySorting === "artist"}> Artist </option> : ""}
                    {section !== "albums" ? <option value="popularity" hidden={sorting[section as keyof SectionSorting].primarySorting === "popularity"}> Popularity </option> : ""}
                    {section === "tracks" ? <option value="album" hidden={sorting[section as keyof SectionSorting].primarySorting === "album"}> Album </option> : ""}
                    {section === "tracks" ? <option value="duration" hidden={sorting[section as keyof SectionSorting].primarySorting === "duration"}> Duration </option> : ""}
                    {section === "tracks" ? <option value="track_number" hidden={sorting[section as keyof SectionSorting].primarySorting === "track_number"}> Track Number </option> : ""}
                  </select>
                </div>

                <div className={styles.formInput}>
                  <label htmlFor="order"> Order </label>
                  <select name="order" defaultValue={sorting[section as keyof SectionSorting].ascendingOrder.toString()} disabled={sorting[section as keyof SectionSorting].primarySorting === "custom"}
                    onChange={e => {
                      const booleanValue = e.target.value === "true"
                      let sectionCopy = JSON.parse(JSON.stringify(sorting[section as keyof SectionSorting]))
                      let updatedSection = { ...sectionCopy, ascendingOrder: booleanValue }
                      let newSortingObject: Partial<SectionSorting> = {};
                      newSortingObject[section as keyof SectionSorting] = updatedSection
                      setSorting(state => ({ ...state, ...newSortingObject }))
                    }}
                  >
                    <option value="true"> Ascending </option>
                    <option value="false"> Descending </option>
                  </select>
                </div>
              </div>

              <div className={styles.sortingRow}>
                {
                  sorting[section as keyof SectionSorting].primarySorting !== 'custom' &&
                  <div className={styles.formInput}>
                    <input type="checkbox" name="grouping" checked={sorting[section as keyof SectionSorting].displayGrouping}
                      onChange={e => {
                        const sectionCopy: Sorting = JSON.parse(JSON.stringify(sorting[section as keyof SectionSorting]))
                        const updatedSection = e.target.checked && sectionCopy.displaySubSections ? 
                        { ...sectionCopy, displayGrouping: e.target.checked, displaySubSections: false }
                        : { ...sectionCopy, displayGrouping: e.target.checked }
                        setSorting(state => ({ ...state, [section as keyof SectionSorting]: updatedSection }))
                      }}
                    />
                    <label htmlFor="grouping"> Show grouping </label>
                  </div>
                }
                <div className={styles.formInput}>
                  <input type="checkbox" name="sub-section" checked={sorting[section as keyof SectionSorting].displaySubSections}
                    onChange={e => {
                      const sectionCopy: Sorting = JSON.parse(JSON.stringify(sorting[section as keyof SectionSorting]))
                      const updatedSection = e.target.checked && sectionCopy.displayGrouping ? 
                        { ...sectionCopy, displaySubSections: e.target.checked, displayGrouping: false }
                        : { ...sectionCopy, displaySubSections: e.target.checked }
                      setSorting(state => ({ ...state, [section as keyof SectionSorting]: updatedSection }))
                    }}
                  />
                  <label htmlFor="sub-section"> Show sub-sections </label>
                </div>
              </div>
            </div>
          )
        })}
      </form>
      <div id={styles.modalFooter}>
        <button onClick={() => handleUpdateSorting()}> Save settings </button>
      </div>
    </div>
  )
}

export default SortingMenu;