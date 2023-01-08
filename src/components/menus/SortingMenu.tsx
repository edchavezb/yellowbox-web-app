import { setModalState } from 'core/features/modal/modalSlice';
import { updateBoxSorting, updateBoxSortingThunk } from 'core/features/currentBoxDetail/currentBoxDetailSlice';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { useState, useEffect } from 'react';
import { UserBox } from '../../core/types/interfaces';
//import { useHistory } from "react-router-dom";

import styles from "./SortingMenu.module.css";

type BoxSections = Pick<UserBox, "albums" | "artists" | "tracks" | "playlists">

type BoxSorting = UserBox["sectionSorting"]

function SortingMenu() {
  const dispatch = useAppDispatch();
  const targetBox = useAppSelector(state => state.currentBoxDetailData.box);
  const userBoxes = useAppSelector(state => state.userBoxesData.boxes)
  const isOwner = !!userBoxes.find(box => box._id === targetBox?._id);
  const boxSections: BoxSections = {artists: targetBox!.artists, albums: targetBox!.albums, tracks: targetBox!.tracks, playlists: targetBox!.playlists}
  const nonEmptySections = Object.keys(boxSections).filter((section) => boxSections[section as keyof BoxSections].length > 0)
  const [sorting, setSorting] = useState<BoxSorting>(targetBox?.sectionSorting!)

  const handleUpdateSorting = () => {
    // API only called if current user is box owner, otherwise updates are local
    if (isOwner) {
      dispatch(updateBoxSortingThunk(targetBox._id, sorting))
    } else {
      dispatch(updateBoxSorting(sorting))
    }
    dispatch(setModalState({ visible: false, type:"", boxId:"", page: "", itemData: undefined }))
  }

  useEffect(() => {
    console.log(targetBox)
    setSorting(targetBox?.sectionSorting!)
  }, [targetBox]) 

  return (
    <div id={styles.modalBody}>
      <form id={styles.sortingForm}>
        {nonEmptySections.map(section => {
          return (
            <div className={styles.sortingRow} key={section}> 

              <span className={styles.rowNameSpan}> {section.charAt(0).toUpperCase() + section.slice(1)} </span>

              <div className={styles.formInput}>
                <label htmlFor="view"> View as </label>
                <select name="view" value={sorting[section as keyof BoxSorting].view}  
                  onChange={e => {
                    let sectionCopy = JSON.parse(JSON.stringify(sorting[section as keyof BoxSorting]))
                    let updatedSection = {...sectionCopy, view: e.target.value}
                    let newSortingObject: Partial<BoxSorting> = {};
                    newSortingObject[section as keyof BoxSorting] = updatedSection
                    console.log(newSortingObject)
                    setSorting((state: BoxSorting) => ({...state, ...newSortingObject})) 
                  }}> 
                    <option value="grid"> Grid </option> 
                    {section !== "artists" ? <option value="list"> List </option> : ""}
                    <option value="details"> Details </option>
                </select>
              </div>

              <div className={styles.formInput}>
                <label htmlFor="sorting"> Sort by </label>
                <select name="sorting" value={sorting[section as keyof BoxSorting].primarySorting}
                  onChange={e => {
                    let sectionCopy = JSON.parse(JSON.stringify(sorting[section as keyof BoxSorting]))
                    console.log(sectionCopy)
                    let updatedSection = {...sectionCopy, primarySorting: e.target.value}
                    console.log(updatedSection)
                    let newSortingObject: Partial<BoxSorting> = {};
                    newSortingObject[section as keyof BoxSorting] = updatedSection
                    console.log(newSortingObject)
                    setSorting(state => ({...state, ...newSortingObject})) 
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
                  disabled={sorting[section as keyof BoxSorting].primarySorting === "custom"} 
                  value={sorting[section as keyof BoxSorting].secondarySorting}
                  onChange={e => {
                    let sectionCopy = JSON.parse(JSON.stringify(sorting[section as keyof BoxSorting]))
                    let updatedSection = {...sectionCopy, secondarySorting: e.target.value}
                    let newSortingObject: Partial<BoxSorting> = {};
                    newSortingObject[section as keyof BoxSorting] = updatedSection
                    console.log(newSortingObject)
                    setSorting(state => ({...state, ...newSortingObject})) 
                  }}
                  >
                  <option value="none" disabled hidden> Select... </option> 
                  {section === "artists" ? <option value="name" hidden={sorting[section as keyof BoxSorting].primarySorting === "name"}> Name </option> : ""}
                  {section !== "artists" ? <option value="name" hidden={sorting[section as keyof BoxSorting].primarySorting === "name"}> Title </option> : ""}
                  {section !== "artists" ? <option value="release_year" hidden={sorting[section as keyof BoxSorting].primarySorting === "release_year"}> Release Year </option> : ""}
                  {section !== "artists" ? <option value="release_date" hidden={sorting[section as keyof BoxSorting].primarySorting === "release_date"}> Release Date </option> : ""}
                  {section !== "artists" ? <option value="artist" hidden={sorting[section as keyof BoxSorting].primarySorting === "artist"}> Artist </option> : ""}
                  {section !== "albums" ? <option value="popularity" hidden={sorting[section as keyof BoxSorting].primarySorting === "popularity"}> Popularity </option> : ""}
                  {section === "tracks" ? <option value="album" hidden={sorting[section as keyof BoxSorting].primarySorting === "album"}> Album </option> : ""}
                  {section === "tracks" ? <option value="duration" hidden={sorting[section as keyof BoxSorting].primarySorting === "duration"}> Duration </option> : ""}
                  {section === "tracks" ? <option value="track_number" hidden={sorting[section as keyof BoxSorting].primarySorting === "track_number"}> Track Number </option> : ""}
                </select> 
              </div>

              <div className={styles.formInput}>
                <label htmlFor="order"> Order </label>
                <select name="order" defaultValue={sorting[section as keyof BoxSorting].ascendingOrder.toString()} disabled={sorting[section as keyof BoxSorting].primarySorting === "custom"}
                  onChange={e => {
                    const booleanValue = e.target.value === "true"
                    let sectionCopy = JSON.parse(JSON.stringify(sorting[section as keyof BoxSorting]))
                    let updatedSection = {...sectionCopy, ascendingOrder: booleanValue}
                    let newSortingObject: Partial<BoxSorting> = {};
                    newSortingObject[section as keyof BoxSorting] = updatedSection
                    console.log(newSortingObject)
                    setSorting(state => ({...state, ...newSortingObject})) 
                  }}
                  > 
                  <option value="true"> Ascending </option>
                  <option value="false"> Descending </option>
                </select>
              </div>
              

              <div className={styles.formInput}>
                <input type="checkbox" name="sub-section" defaultChecked={sorting[section as keyof BoxSorting].displaySubSections}
                  onChange={e => {
                    console.log(e.target.checked)
                    let sectionCopy = JSON.parse(JSON.stringify(sorting[section as keyof BoxSorting]))
                    let updatedSection = {...sectionCopy, displaySubSections: e.target.checked}
                    let newSortingObject: Partial<BoxSorting> = {};
                    newSortingObject[section as keyof BoxSorting] = updatedSection
                    console.log(newSortingObject)
                    setSorting(state => ({...state, ...newSortingObject})) 
                  }}
                />
                <label htmlFor="sub-section"> Show sub-sections </label>
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