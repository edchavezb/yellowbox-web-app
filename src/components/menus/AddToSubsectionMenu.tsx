import { setModalState } from 'core/features/modal/modalSlice';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { useState } from 'react';
import { Album, Artist, Playlist, Track, UserBox } from "core/types/interfaces";
import styles from "./AddToSubsectionMenu.module.css";
import { setItemSubsectionThunk } from 'core/features/currentBoxDetail/currentBoxDetailSlice';
import { BoxSections } from 'core/types/types';

type MusicData = Artist | Album | Track | Playlist;

interface IProps {
  itemData: MusicData
}

function AddToSubsectionMenu({ itemData }: IProps) {
  const dispatch = useAppDispatch();
  const currentBox = useAppSelector(state => state.currentBoxDetailData.box)
  const validSubsections = currentBox.subSections.filter(subsection => subsection.type === `${itemData.type}s`)
  const [targetSubsection, setTargetSubsection] = useState(validSubsections[0]?._id)

  const handleAddItem = () => {
    dispatch(setItemSubsectionThunk(currentBox._id, itemData._id!, `${itemData.type}s` as BoxSections, targetSubsection!))
    dispatch(setModalState({ visible: false, type: "", boxId: "", page: "", itemData: undefined }))
  }

  return (
    <div id={styles.modalBody}>
      <div id={styles.confirmation}>
        <label htmlFor="add-type"> Add this item to </label>
        <select name="subsection-select" defaultValue={targetSubsection} onChange={(e) => setTargetSubsection(e.target.value)}>
          {validSubsections.map(subsection => {
            return (<option key={subsection._id} value={subsection._id}> {subsection.name} </option>)
          })}
        </select>
      </div>
      <div id={styles.modalFooter}>
        <button onClick={() => handleAddItem()} disabled={!validSubsections.length}> Add item </button>
      </div>
    </div>
  )
}

export default AddToSubsectionMenu;