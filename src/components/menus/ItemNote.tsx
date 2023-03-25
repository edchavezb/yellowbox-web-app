import { addNoteToBoxThunk, updateItemNoteThunk } from "core/features/currentBoxDetail/currentBoxDetailSlice";
import { setModalState } from "core/features/modal/modalSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { useEffect, useRef, useState } from "react";
import { Album, Artist, ItemImage, Playlist, Track } from "../../core/types/interfaces";
import * as checkType from "../../core/helpers/typeguards";
import styles from "./ItemNote.module.css";
import { useAppSelector } from "core/hooks/useAppSelector";

type MusicData = Artist | Album | Track | Playlist;

interface IProps {
  boxId: string
  itemData: MusicData
}

function ItemNote({ itemData, boxId }: IProps) {
  const dispatch = useAppDispatch();
  const { name, id } = itemData;
  const currentBox = useAppSelector(state => state.currentBoxDetailData.box)
  const userBoxes = useAppSelector(state => state.userBoxesData.boxes)
  const isOwner = userBoxes.some(box => box._id === currentBox._id);
  const boxNotes = currentBox.notes;
  const itemNote = boxNotes.find(note => note.itemId === id)
  const [isEditorEnabled, setIsEditorEnabled] = useState(false);
  const [editorNote, setEditorNote] = useState(itemNote?.noteText);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    document.addEventListener('mousedown', isClickOutsideEditor)
    return () => {
      document.removeEventListener("mousedown", isClickOutsideEditor);
    }
  }, [])

  useEffect(() => {
    if (isEditorEnabled) {
      editorRef.current?.focus();
    }
  }, [isEditorEnabled])

  const isClickOutsideEditor = (e: MouseEvent) => {
    if (editorRef.current && !editorRef.current.contains(e.target as Node)) {
      setIsEditorEnabled(false);
    }
  }

  const saveNoteHandler = () => {
    if (itemNote) {
      dispatch(updateItemNoteThunk(boxId, itemData.id!, editorNote!));
    }
    else {
      dispatch(addNoteToBoxThunk(boxId, itemData.id!, editorNote || ""));
    }
    dispatch(setModalState({ visible: false, type: "", boxId: "", page: "", itemData: undefined }))
  }

  let elementImages: ItemImage[] | undefined;
  let authorName!: string;

  if (checkType.isAlbum(itemData)) {
    const { images, artists } = itemData;
    authorName = artists[0].name
    elementImages = images
  }
  else if (checkType.isArtist(itemData)) {
    const { images } = itemData as Artist;
    authorName = ""
    elementImages = images
  }
  else if (checkType.isTrack(itemData)) {
    const { artists, album } = itemData;
    authorName = artists[0].name
    elementImages = album!.images;
  }
  else if (checkType.isPlaylist(itemData)) {
    const { images, owner } = itemData;
    authorName = owner.display_name!;
    elementImages = images
  }

  const itemCoverArt = elementImages && elementImages.length ? elementImages[0].url : "https://via.placeholder.com/150"
  const isNameItalic = (item: MusicData) => item.type === 'album' || item.type === 'track'

  return (
    <div id={styles.modalBody}>
      <div className={styles.columnsWrapper}>
        <div id={styles.imageColumn}>
          <img draggable="false" className={styles.itemImage} alt={itemData.name} src={itemCoverArt}></img>
        </div>
        <div id={styles.noteColumn}>
          <div className={isNameItalic(itemData) ? styles.nameItalic : styles.name}>
            {name}
          </div>
          <div className={styles.author}>
            {authorName}
          </div>
          {
            isEditorEnabled ?
              <textarea
                id={styles.noteEditor}
                rows={15}
                ref={editorRef}
                onChange={e => setEditorNote(e.target.value)}
                value={editorNote}
              />
              :
              <div
                className={styles.notePanel}
                onClick={() => {
                  if (isOwner) {
                    setIsEditorEnabled(true);
                  }
                }}>
                <p className={styles.noteText}>
                  {editorNote
                    || (isOwner ? 'Click here to write a note' : '')}
                </p>
              </div>
          }
          <div className={styles.disabledWarning}>
            Only box owners can add notes to an item
          </div>
        </div>
      </div>
      <div id={styles.modalFooter}>
        <button onClick={saveNoteHandler} disabled={!itemNote?.noteText && !editorNote}> Save changes </button>
        <button onClick={() => dispatch(setModalState({ visible: false, type: "", boxId: "", page: "", itemData: undefined }))}> Cancel </button>
      </div>
    </div>
  )
}

export default ItemNote;