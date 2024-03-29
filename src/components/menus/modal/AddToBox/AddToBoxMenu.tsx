import { setModalState } from 'core/features/modal/modalSlice';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { useState } from 'react';
import { Album, Artist, Playlist, SectionSorting, Track } from "core/types/interfaces";
import styles from "./AddToBoxMenu.module.css";
import { isAlbum, isArtist, isPlaylist, isTrack } from 'core/helpers/typeguards';
import { extractCrucialData } from 'core/helpers/itemDataHandlers';
import { addAlbumToBoxApi } from 'core/api/userboxes/albums';
import { addArtistToBoxApi } from 'core/api/userboxes/artists';
import { addPlaylistToBoxApi } from 'core/api/userboxes/playlists';
import { addTrackToBoxApi } from 'core/api/userboxes/tracks';
import AppButton from 'components/styled/AppButton/AppButton';
import { FormControl, FormLabel } from '@chakra-ui/react';
import AppSelect from 'components/styled/AppSelect/AppSelect';

type MusicData = Artist | Album | Track | Playlist;

interface IProps {
  itemData: MusicData
}

function AddToBoxMenu({ itemData }: IProps) {
  const dispatch = useAppDispatch();
  const userBoxes = useAppSelector(state => state.userBoxesData.userBoxes)
  const itemCopy = JSON.parse(JSON.stringify(itemData))
  const [addBox, setAddBox] = useState(userBoxes[0].boxId)

  const handleAddItem = () => {
    const targetId = addBox
    const updatedItem = { ...extractCrucialData(itemCopy) }
    const isOwner = !!userBoxes.find(box => box.boxId === targetId);
    if (isOwner) {
      try {
        if (isArtist(updatedItem)) {
          addArtistToBoxApi(targetId, updatedItem)
        }
        else if (isAlbum(updatedItem)) {
          addAlbumToBoxApi(targetId, updatedItem)
        }
        else if (isTrack(updatedItem)) {
          addTrackToBoxApi(targetId, updatedItem)
        }
        else if (isPlaylist(updatedItem)) {
          addPlaylistToBoxApi(targetId, updatedItem)
        }
      } catch {
        console.log('Could not add item to box')
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
                return (<option key={box.boxId} value={box.boxId}> {box.boxName} </option>)
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