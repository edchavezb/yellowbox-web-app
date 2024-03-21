import { setModalState } from 'core/features/modal/modalSlice';
import { updateBoxSorting, updateBoxSortingThunk } from 'core/features/currentBoxDetail/currentBoxDetailSlice';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { useState } from 'react';
import { SectionSorting, Sorting, UserBox } from 'core/types/interfaces';

import styles from "./SortingMenu.module.css";
import AppButton from 'components/styled/AppButton/AppButton';
import AppSelect from 'components/styled/AppSelect/AppSelect';
import { FormControl, FormLabel } from '@chakra-ui/react';

type BoxSections = Pick<UserBox, "albums" | "artists" | "tracks" | "playlists">

function SortingMenu() {
  const dispatch = useAppDispatch();
  const targetBox = useAppSelector(state => state.currentBoxDetailData.box);
  const userBoxes = useAppSelector(state => state.userBoxesData.userBoxes)
  const isOwner = userBoxes.some(box => box.boxId === targetBox?._id);
  const boxSections: BoxSections = { artists: targetBox!.artists, albums: targetBox!.albums, tracks: targetBox!.tracks, playlists: targetBox!.playlists }
  const nonEmptySections = Object.keys(boxSections).filter((section) => boxSections[section as keyof BoxSections].length > 0)
  const [sorting, setSorting] = useState<SectionSorting>(targetBox?.sectionSorting!)

  const handleSaveSortingPreferences = () => {
    // API only called if current user is box owner, otherwise updates are local
    if (isOwner) {
      dispatch(updateBoxSortingThunk(targetBox._id, sorting))
    } else {
      dispatch(updateBoxSorting(sorting))
    }
    dispatch(setModalState({ visible: false, type: "", boxId: "", page: "", itemData: undefined }))
  }

  const handleSelectChange = (value: string | boolean, section: keyof SectionSorting, field: string) => {
    let sectionCopy = JSON.parse(JSON.stringify(sorting[section as keyof SectionSorting]))
    let updatedSection = { ...sectionCopy, [field]: value }
    let newSortingObject: Partial<SectionSorting> = {};
    newSortingObject[section as keyof SectionSorting] = updatedSection
    setSorting((state: SectionSorting) => ({ ...state, ...newSortingObject }))
    //if (section !== "artists") ((e.target as Element).closest("div")!.nextElementSibling!.querySelector(".sec-sorting")! as HTMLSelectElement).selectedIndex = 0
  }

  return (
    <div id={styles.modalBody}>
      <form id={styles.sortingForm}>
        {nonEmptySections.map(section => {
          return (
            <div className={styles.section} key={section}>
              <div className={styles.rowName}> {section.charAt(0).toUpperCase() + section.slice(1)} </div>

              <div className={styles.sortingRow}>
                <FormControl display={"inline-flex"} gap={"8px"} maxWidth={"fit-content"} alignItems={"center"}>
                  <FormLabel margin={"0px"}>View as</FormLabel>
                  <AppSelect
                   value={sorting[section as keyof SectionSorting].view}
                   onChange={e => {
                     const value = e.target.value
                     handleSelectChange(value, section as keyof SectionSorting, "view")
                   }}
                  >
                    <>
                    <option value="grid"> Grid </option>
                    {section !== "artists" && <option value="list"> List </option>}
                    {section === "artists" && <option value="wall"> Wall </option>}
                    <option value="details"> Details </option>
                    </>
                  </AppSelect>
                </FormControl>

                <FormControl display={"inline-flex"} gap={"8px"} maxWidth={"fit-content"} alignItems={"center"}>
                  <FormLabel margin={"0px"}>Sort by</FormLabel>
                  <AppSelect value={sorting[section as keyof SectionSorting].primarySorting}
                    onChange={e => {
                      const value = e.target.value
                      handleSelectChange(value, section as keyof SectionSorting, "primarySorting")
                    }}>
                    <>
                      <option value="custom"> Custom </option>
                      {section === "artists" || section === "playlists" ? <option value="name"> Name </option> : ""}
                      {section === "albums" || section === "tracks" ? <option value="name"> Title </option> : ""}
                      {section !== "artists" && section !== "playlists" ? <option value="release_year"> Release Year </option> : ""}
                      {section !== "artists" && section !== "playlists" ? <option value="artist"> Artist </option> : ""}
                      {section !== "albums" && section !== "playlists" ? <option value="popularity"> Popularity </option> : ""}
                      {section === "tracks" ? <option value="album"> Album </option> : ""}
                      {section === "tracks" ? <option value="duration"> Duration </option> : ""}
                      {section === "tracks" ? <option value="track_number"> Track Number </option> : ""}
                    </>
                  </AppSelect>
                </FormControl>

                <FormControl display={"inline-flex"} gap={"8px"} maxWidth={"fit-content"} alignItems={"center"}>
                  <FormLabel margin={"0px"}>then by</FormLabel>
                  <AppSelect value={sorting[section as keyof SectionSorting].secondarySorting}
                    onChange={e => {
                      const value = e.target.value
                      handleSelectChange(value, section as keyof SectionSorting, "secondarySorting")
                    }}
                    disabled={sorting[section as keyof SectionSorting].primarySorting === "custom"}>
                    <>
                      <option value="none" disabled hidden> Select... </option>
                      {section === "artists" || section === "playlists" ? <option value="name" hidden={sorting[section as keyof SectionSorting].primarySorting === "name"}> Name </option> : ""}
                      {section === "albums" || section === "tracks" ? <option value="name" hidden={sorting[section as keyof SectionSorting].primarySorting === "name"}> Title </option> : ""}
                      {section !== "artists" && section !== "playlists" ? <option value="release_year" hidden={sorting[section as keyof SectionSorting].primarySorting === "release_year"}> Release Year </option> : ""}
                      {section !== "artists" && section !== "playlists" ? <option value="release_date" hidden={sorting[section as keyof SectionSorting].primarySorting === "release_date"}> Release Date </option> : ""}
                      {section !== "artists" && section !== "playlists" ? <option value="artist" hidden={sorting[section as keyof SectionSorting].primarySorting === "artist"}> Artist </option> : ""}
                      {section !== "albums" && section !== "playlists" ? <option value="popularity" hidden={sorting[section as keyof SectionSorting].primarySorting === "popularity"}> Popularity </option> : ""}
                      {section === "tracks" ? <option value="album" hidden={sorting[section as keyof SectionSorting].primarySorting === "album"}> Album </option> : ""}
                      {section === "tracks" ? <option value="duration" hidden={sorting[section as keyof SectionSorting].primarySorting === "duration"}> Duration </option> : ""}
                      {section === "tracks" ? <option value="track_number" hidden={sorting[section as keyof SectionSorting].primarySorting === "track_number"}> Track Number </option> : ""}
                    </>
                  </AppSelect>
                </FormControl>

                <FormControl display={"inline-flex"} gap={"8px"} maxWidth={"fit-content"} alignItems={"center"}>
                  <FormLabel margin={"0px"}>Order</FormLabel>
                  <AppSelect
                   value={sorting[section as keyof SectionSorting].ascendingOrder.toString()}
                   onChange={e => {
                     const booleanValue = e.target.value === "true"
                     handleSelectChange(booleanValue, section as keyof SectionSorting, "ascendingOrder")
                   }}
                   disabled={sorting[section as keyof SectionSorting].primarySorting === "custom"}
                  >
                    <>
                    <option value="true"> Ascending </option>
                    <option value="false"> Descending </option>
                    </>
                  </AppSelect>
                </FormControl>
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
        <AppButton
          onClick={handleSaveSortingPreferences}
          text={"Save settings"}
        />
      </div>
    </div>
  )
}

export default SortingMenu;