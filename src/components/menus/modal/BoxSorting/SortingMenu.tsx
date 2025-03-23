import { setModalState } from 'core/features/modal/modalSlice';
import { updateAllSectionSettings, updateAllSectionSettingsThunk } from 'core/features/currentBoxDetail/currentBoxDetailSlice';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { useState } from 'react';
import { SectionSettings, UserBox } from 'core/types/interfaces';

import styles from "./SortingMenu.module.css";
import AppButton from 'components/styled/AppButton/AppButton';
import AppSelect from 'components/styled/AppSelect/AppSelect';
import { FormControl, FormLabel } from '@chakra-ui/react';

type BoxSections = Pick<UserBox, "albums" | "artists" | "tracks" | "playlists">

function SortingMenu() {
  const dispatch = useAppDispatch();
  const currentBox = useAppSelector(state => state.currentBoxDetailData.box);
  const userBoxes = useAppSelector(state => state.userBoxesData.userBoxes)
  const isOwner = userBoxes.some(box => box.boxId === currentBox?.boxId);
  const boxSections: BoxSections = { artists: currentBox!.artists, albums: currentBox!.albums, tracks: currentBox!.tracks, playlists: currentBox!.playlists }
  const nonEmptySections = Object.keys(boxSections).filter((section) => boxSections[section as keyof BoxSections].length > 0)
  const [sectionSettings, setSectionSettings] = useState<SectionSettings[]>(currentBox?.sectionSettings!)
  const settingsMap = {
    artists: sectionSettings.find(section => section.type === 'artists')!,
    albums: sectionSettings.find(section => section.type === 'albums')!,
    tracks: sectionSettings.find(section => section.type === 'tracks')!,
    playlists: sectionSettings.find(section => section.type === 'playlists')!
  }

  const handleSaveSortingPreferences = () => {
    // API only called if current user is box owner, otherwise updates are local
    if (isOwner) {
      dispatch(updateAllSectionSettingsThunk(currentBox.boxId, sectionSettings))
    } else {
      dispatch(updateAllSectionSettings(sectionSettings))
    }
    dispatch(setModalState({ visible: false, type: "", boxId: "", page: "", itemData: undefined }))
  }

  const handleSelectChange = (value: string | boolean, type: string, field: string) => {
    const sectionCopy = JSON.parse(JSON.stringify(sectionSettings.find(section => section.type === type)))
    const updatedSection = { ...sectionCopy, [field]: value } as SectionSettings
    const newSectionSettings = [...sectionSettings.filter(section => section.type !== type), updatedSection]
    setSectionSettings(newSectionSettings)
    //if (section !== "artists") ((e.target as Element).closest("div")!.nextElementSibling!.querySelector(".sec-sectionSettings")! as HTMLSelectElement).selectedIndex = 0
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
                    value={settingsMap[section as keyof typeof settingsMap].view}
                    onChange={e => {
                      const value = e.target.value
                      handleSelectChange(value, section, "view")
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
                  <AppSelect value={settingsMap[section as keyof typeof settingsMap].primarySorting}
                    onChange={e => {
                      const value = e.target.value
                      handleSelectChange(value, section, "primarySorting")
                    }}>
                    <>
                      <option value="custom"> Custom </option>
                      {section === "artists" || section === "playlists" ? <option value="name"> Name </option> : ""}
                      {section === "albums" || section === "tracks" ? <option value="name"> Title </option> : ""}
                      {section !== "artists" && section !== "playlists" ? <option value="releaseYear"> Release Year </option> : ""}
                      {section !== "artists" && section !== "playlists" ? <option value="releaseMonth"> Release Month </option> : ""}
                      {section !== "artists" && section !== "playlists" ? <option value="releaseDate"> Release Date </option> : ""}
                      {section !== "artists" && section !== "playlists" ? <option value="artist"> Artist </option> : ""}
                      {section === "tracks" ? <option value="album"> Album </option> : ""}
                      {section === "tracks" ? <option value="duration"> Duration </option> : ""}
                      {section === "tracks" ? <option value="trackNumber"> Track Number </option> : ""}
                      <option value="playedStatus"> Played Status </option>
                    </>
                  </AppSelect>
                </FormControl>

                {section !== "artists" &&
                  <FormControl display={"inline-flex"} gap={"8px"} maxWidth={"fit-content"} alignItems={"center"}>
                    <FormLabel margin={"0px"}>then by</FormLabel>
                    <AppSelect value={settingsMap[section as keyof typeof settingsMap].secondarySorting}
                      onChange={e => {
                        const value = e.target.value
                        handleSelectChange(value, section, "secondarySorting")
                      }}
                      disabled={settingsMap[section as keyof typeof settingsMap].primarySorting === "custom"}>
                      <>
                        <option value="none" disabled hidden> Select... </option>
                        {section === "artists" || section === "playlists" ? <option value="name" hidden={settingsMap[section as keyof typeof settingsMap].primarySorting === "name"}> Name </option> : ""}
                        {section === "albums" || section === "tracks" ? <option value="name" hidden={settingsMap[section as keyof typeof settingsMap].primarySorting === "name"}> Title </option> : ""}
                        {section !== "artists" && section !== "playlists" ? <option value="releaseYear" hidden={settingsMap[section as keyof typeof settingsMap].primarySorting === "releaseYear"}> Release Year </option> : ""}
                        {section !== "artists" && section !== "playlists" ? <option value="releaseMonth" hidden={settingsMap[section as keyof typeof settingsMap].primarySorting === "releaseMonth"}> Release Month </option> : ""}
                        {section !== "artists" && section !== "playlists" ? <option value="releaseDate" hidden={settingsMap[section as keyof typeof settingsMap].primarySorting === "releaseDate"}> Release Date </option> : ""}
                        {section !== "artists" && section !== "playlists" ? <option value="artist" hidden={settingsMap[section as keyof typeof settingsMap].primarySorting === "artist"}> Artist </option> : ""}
                        {section === "tracks" ? <option value="album" hidden={settingsMap[section as keyof typeof settingsMap].primarySorting === "album"}> Album </option> : ""}
                        {section === "tracks" ? <option value="duration" hidden={settingsMap[section as keyof typeof settingsMap].primarySorting === "duration"}> Duration </option> : ""}
                        {section === "tracks" ? <option value="trackNumber" hidden={settingsMap[section as keyof typeof settingsMap].primarySorting === "track_number"}> Track Number </option> : ""}
                        <option value="playedStatus"> Played Status </option>
                      </>
                    </AppSelect>
                  </FormControl>
                }

                <FormControl display={"inline-flex"} gap={"8px"} maxWidth={"fit-content"} alignItems={"center"}>
                  <FormLabel margin={"0px"}>Order</FormLabel>
                  <AppSelect
                    value={(settingsMap[section as keyof typeof settingsMap].sortingOrder).toString()}
                    onChange={e => {
                      const newValue = e.target.value
                      console.log(newValue)
                      handleSelectChange(newValue, section, "sortingOrder")
                    }}
                    disabled={settingsMap[section as keyof typeof settingsMap].primarySorting === "custom"}
                  >
                    <>
                      <option value="ASCENDING"> Ascending </option>
                      <option value="DESCENDING"> Descending </option>
                    </>
                  </AppSelect>
                </FormControl>
              </div>

              <div className={styles.sortingRow}>
                {
                  settingsMap[section as keyof typeof settingsMap].primarySorting !== 'custom' &&
                  <div className={styles.formInput}>
                    <input type="checkbox" name="grouping" checked={settingsMap[section as keyof typeof settingsMap].displayGrouping}
                      onChange={e => {
                        const sectionCopy: SectionSettings = JSON.parse(JSON.stringify(settingsMap[section as keyof typeof settingsMap]))
                        const updatedSection = e.target.checked && sectionCopy.displaySubsections ?
                          { ...sectionCopy, displayGrouping: e.target.checked, displaySubsections: false }
                          : { ...sectionCopy, displayGrouping: e.target.checked }
                        setSectionSettings(state => ([...state.filter(item => item.type !== section), updatedSection]))
                      }}
                    />
                    <label htmlFor="grouping"> Show grouping </label>
                  </div>
                }
                <div className={styles.formInput}>
                  <input type="checkbox" name="sub-section" checked={settingsMap[section as keyof typeof settingsMap].displaySubsections}
                    onChange={e => {
                      const sectionCopy: SectionSettings = JSON.parse(JSON.stringify(settingsMap[section as keyof typeof settingsMap]))
                      const updatedSection = e.target.checked && sectionCopy.displayGrouping ?
                        { ...sectionCopy, displaySubsections: e.target.checked, displayGrouping: false }
                        : { ...sectionCopy, displaySubsections: e.target.checked }
                      setSectionSettings(state => ([...state.filter(item => item.type !== section), updatedSection]))
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