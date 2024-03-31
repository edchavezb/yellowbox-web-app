import { addNoteToBoxThunk, updateItemNoteThunk } from "core/features/currentBoxDetail/currentBoxDetailSlice";
import { setModalState } from "core/features/modal/modalSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { useEffect, useRef, useState } from "react";
import { Album, Artist, ItemImage, Playlist, Track } from "core/types/interfaces";
import * as checkType from "core/helpers/typeguards";
import styles from "./ItemNote.module.css";
import { useAppSelector } from "core/hooks/useAppSelector";
import AppButton from "components/styled/AppButton/AppButton";
import { Textarea } from "@chakra-ui/react";

type MusicData = Artist | Album | Track | Playlist;

interface IProps {
  boxId: string
  itemData: MusicData
  subId?: string
}

function ItemNote({ itemData, boxId, subId }: IProps) {
  const dispatch = useAppDispatch();
  const { name, id } = itemData;
  const currentBox = useAppSelector(state => state.currentBoxDetailData.box)
  const userBoxes = useAppSelector(state => state.userBoxesData.userBoxes)
  const isOwner = userBoxes.some(box => box.boxId === currentBox._id);
  const itemNotes = currentBox.notes.filter(note => note.itemId === id);
  const currentNote = subId ? itemNotes.find(note => note.subSectionId === subId) : itemNotes.find(note => !note.subSectionId)
  const subSectionName = currentBox.subSections.find(sub => sub._id === subId)?.name
  const [editorNote, setEditorNote] = useState(currentNote?.noteText || "");
  const [isEditorEnabled, setIsEditorEnabled] = useState(false);
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
    const currentNoteId = currentNote?._id;
    if (currentNoteId) {
      dispatch(updateItemNoteThunk(boxId, currentNoteId!, editorNote!));
    }
    else {
      dispatch(addNoteToBoxThunk(boxId, itemData.id!, editorNote || "", subId));
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

  return (
    <div id={styles.modalBody}>
      <div className={styles.columnsWrapper}>
        <div id={styles.imageColumn}>
          <img draggable="false" className={styles.itemImage} alt={itemData.name} src={itemCoverArt}></img>
        </div>
        <div id={styles.noteColumn}>
          <div className={styles.name}>
            {name}
          </div>
          <div className={styles.author}>
            {authorName}
          </div>
          <div className={styles.subSectionSelect}>
            <div className={styles.subSectionPill}>
              {subSectionName || "General"}
            </div>
          </div>
          {
            isEditorEnabled ?
              <Textarea
                id={styles.noteEditor}
                ref={editorRef}
                value={editorNote}
                onChange={e => setEditorNote(e.target.value)}
                borderColor={"brandgray.600"}
                focusBorderColor={"brandblue.600"}
                rows={10}
              />
              :
              <div
                className={styles.notePanel}
                onClick={() => {
                  if (isOwner) {
                    setIsEditorEnabled(true);
                  }
                }}>
                <div className={styles.noteText}>
                  {editorNote || (isOwner ? 'Click here to write a note' : '')}
                </div>
              </div>
          }
          {
            !isOwner &&
            <div className={styles.disabledWarning}>
              Only box owners can add notes to an item
            </div>
          }
        </div>
      </div>
      {
        isOwner &&
        <div id={styles.modalFooter}>
          <AppButton
            onClick={saveNoteHandler} disabled={itemNotes.find(note => note.subSectionId === subId)?.noteText === editorNote || !editorNote}
            text={"Save changes"}
          />
          <AppButton
            onClick={() => dispatch(setModalState({ visible: false, type: "", boxId: "", page: "", itemData: undefined }))}
            text={"Cancel"}
          />
        </div>
      }
    </div>
  )
}

export default ItemNote;