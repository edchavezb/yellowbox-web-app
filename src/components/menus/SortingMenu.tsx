import { updateUserBox } from 'core/features/userBoxes/userBoxesSlice';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Album, Artist, ModalState, Playlist, Track, UserBox } from '../../core/types/interfaces';
//import { useHistory } from "react-router-dom";

import styles from "./SortingMenu.module.css";

interface IProps {
  boxId: string
  toggleModal: Dispatch<SetStateAction<ModalState>>
}

type BoxSections = Pick<UserBox, "albums" | "artists" | "tracks" | "playlists">

type BoxSorting = UserBox["sectionSorting"]

function SortingMenu({boxId, toggleModal}: IProps) {
  const dispatch = useAppDispatch();
  const userBoxes = useAppSelector(state => state.userBoxesData.boxes)

  const boxCopy = JSON.parse(JSON.stringify(userBoxes.find(box => box._id === boxId)))
  const boxSections: BoxSections = {artists: boxCopy.artists, albums: boxCopy.albums, tracks: boxCopy.tracks, playlists: boxCopy.playlists}
  const nonEmptySections = Object.keys(boxSections).filter((section) => boxSections[section as keyof BoxSections].length > 0)
  const boxSorting = boxCopy.sectionSorting

  const [sorting, setSorting] = useState<BoxSorting>({...boxSorting})

  const handleUpdateSorting = () => {
    const updatedBox = {
      ...boxCopy,
      sectionSorting: sorting
    }
    console.log(boxCopy)
    console.log(updatedBox)
    dispatch(updateUserBox({ updatedBox: updatedBox, targetId: boxId }))
    toggleModal({ visible: false, type: "", boxId:"", page:"" })
  }

  useEffect(() => {
    console.log(sorting)
  }, [sorting]) 

  return (
    <div id={styles.modalBody}>
      <form id={styles.sortingForm}>
        {nonEmptySections.map(section => {
          return (
            <div className={styles.sortingRow} key={section}> 

              <span className={styles.rowNameSpan}> {section.charAt(0).toUpperCase() + section.slice(1)} </span>

              <div className={styles.formInput}>
                <label htmlFor="view"> View as </label>
                <select name="view" defaultValue={boxSorting[section].view}  
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
                <select name="sorting" defaultValue={boxSorting[section].primarySorting}
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
                <select className="sec-sorting" name="sec-sorting" disabled={sorting[section as keyof BoxSorting].primarySorting === "custom"} defaultValue={boxSorting[section].secondarySorting}
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
                <select name="order" defaultValue={boxSorting[section].ascendingOrder.toString()} disabled={sorting[section as keyof BoxSorting].primarySorting === "custom"}
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
                <input type="checkbox" name="sub-section" defaultChecked={boxSorting[section].displaySubSections}
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