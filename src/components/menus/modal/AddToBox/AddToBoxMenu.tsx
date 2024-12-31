import { setModalState } from 'core/features/modal/modalSlice';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { useState } from 'react';
import { Album, Artist, Playlist, Track } from "core/types/interfaces";
import styles from "./AddToBoxMenu.module.css";
import { isAlbum, isArtist, isErrorWithMessage, isPlaylist, isTrack } from 'core/helpers/typeguards';
import { addAlbumToBoxApi } from 'core/api/userboxes/albums';
import { addArtistToBoxApi } from 'core/api/userboxes/artists';
import { addPlaylistToBoxApi } from 'core/api/userboxes/playlists';
import { addTrackToBoxApi } from 'core/api/userboxes/tracks';
import AppButton from 'components/styled/AppButton/AppButton';
import { FormControl, FormLabel } from '@chakra-ui/react';
import AppSelect from 'components/styled/AppSelect/AppSelect';
import { initAddToBoxToast, initAlreadyInBoxToast, initErrorToast } from 'core/features/toast/toastSlice';
import { BoxItemType } from 'core/types/types';

type MusicData = Artist | Album | Track | Playlist;

interface IProps {
  itemData: MusicData
}

function AddToBoxMenu({ itemData }: IProps) {
  const dispatch = useAppDispatch();
  const userBoxes = useAppSelector(state => state.userBoxesData.userBoxes)
  const itemCopy = JSON.parse(JSON.stringify(itemData))
  const [addBox, setAddBox] = useState(userBoxes[0].boxId)

  const handleAddItem = async () => {
    const targetId = addBox
    const updatedItem = itemCopy
    const userBox = userBoxes.find(box => box.boxId === targetId);
    if (!!userBox) {
      try {
        if (isArtist(updatedItem)) {
          await addArtistToBoxApi(targetId, updatedItem)
        }
        else if (isAlbum(updatedItem)) {
          await addAlbumToBoxApi(targetId, updatedItem)
        }
        else if (isTrack(updatedItem)) {
          await addTrackToBoxApi(targetId, updatedItem)
        }
        else if (isPlaylist(updatedItem)) {
          await addPlaylistToBoxApi(targetId, updatedItem)
        }
        dispatch(initAddToBoxToast({ itemType: itemData.type as BoxItemType, boxName: userBox.name }));
      } catch (error) {
        if (isErrorWithMessage(error) && error.message === "Item already in box") {
          dispatch(initAlreadyInBoxToast({ itemType: itemData.type as BoxItemType, boxName: userBox.name }))
        }
        else {
          dispatch(initErrorToast({ error: `Failed to add item to ${userBox.name}` }))
        }
      }
    }
    dispatch(setModalState({ visible: false, type: "", boxId: "", page: "", itemData: undefined }))
  }

  return (
    <div id={styles.modalBody}>
      <div id={styles.confirmation}>
        <FormControl display={"inline-flex"} gap={"8px"} maxWidth={"fit-content"} alignItems={"center"} marginBottom={"10px"}>
          <FormLabel margin={"0px"}>Select a box to add this item to: </FormLabel>
          <AppSelect
            value={addBox}
            onChange={(e) => setAddBox(e.target.value)}
          >
            <>
              {userBoxes.map(box => {
                return (<option key={box.boxId} value={box.boxId}> {box.name} </option>)
              })}
            </>
          </AppSelect>
        </FormControl>
      </div>
      <div id={styles.modalFooter}>
        <AppButton onClick={() => handleAddItem()} text={"Add item"} />
      </div>
    </div>
  )
}

export default AddToBoxMenu;