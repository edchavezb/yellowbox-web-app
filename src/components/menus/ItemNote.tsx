import { addNoteToBoxThunk, updateItemNoteThunk } from "core/features/currentBoxDetail/currentBoxDetailSlice";
import { setModalState } from "core/features/modal/modalSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { useEffect, useRef, useState } from "react";
import { Album, Artist, ItemImage, Playlist, Track } from "../../core/types/interfaces";
import * as checkType from "../../core/helpers/typeguards";
import styles from "./ItemNote.module.css";
import { useAppSelector } from "core/hooks/useAppSelector";
import PopperMenu from "./popper/PopperMenu";
import AddNoteContextMenu from "./popper/AddNoteContextMenu/AddNoteContextMenu";

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
  const subSectionsWithItem = currentBox.subSections.filter(subSection => subSection.items.some(item => item.id === id))
  const subSectionsWithItemNote = itemNotes.filter(note => note.subSectionId).map(note => note.subSectionId);
  const subSectionsWithoutItemNote = subSectionsWithItem.filter(subSection => !subSectionsWithItemNote.includes(subSection._id));
  const [currentSubSection, setCurrentSubSection] = useState(subId && subSectionsWithItemNote.includes(subId) ? subId : "")
  const [editorNote, setEditorNote] = useState("");
  const [isEditorEnabled, setIsEditorEnabled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const menuButtonRef = useRef(null);

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

  useEffect(() => {
    setEditorNote(
      currentSubSection ? itemNotes.find(note => note.subSectionId === currentSubSection)?.noteText! : itemNotes.find(note => !note.subSectionId)?.noteText!
    )
  }, [currentSubSection])

  const isClickOutsideEditor = (e: MouseEvent) => {
    if (editorRef.current && !editorRef.current.contains(e.target as Node)) {
      setIsEditorEnabled(false);
    }
  }

  const saveNoteHandler = () => {
    const currentNoteId = currentSubSection ? itemNotes.find(note => note.subSectionId === currentSubSection)?._id : itemNotes.find(note => !note.subSectionId)?._id;
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
          <div className={styles.subSectionSelect}>
            <div className={!currentSubSection ? styles.subSectionPillSelected : styles.subSectionPill} onClick={() => setCurrentSubSection('')}>{'General'}</div>
            {
              subSectionsWithItemNote.map(subSection => {
                const { name, _id: subSectionId } = currentBox.subSections.find(sub => sub._id === subSection)!
                return (
                  <div className={currentSubSection === subSectionId ? styles.subSectionPillSelected : styles.subSectionPill} onClick={() => setCurrentSubSection(subSectionId!)}>
                    {name}
                  </div>
                )
              })
            }
            {
              (!!subSectionsWithoutItemNote.length && isOwner) &&
              <div className={styles.addButton} onClick={() => setIsMenuOpen(true)} ref={menuButtonRef}>
                <img id={styles.plusIcon} src="/icons/plus_white.svg" alt="new box"></img>
              </div>
            }
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
                <div className={styles.noteText}>
                  {editorNote
                    || (isOwner ? 'Click here to write a note' : '')}
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
          <button onClick={saveNoteHandler} disabled={itemNotes.find(note => note.subSectionId === currentSubSection)?.noteText === editorNote || !editorNote}> Save changes </button>
          <button onClick={() => dispatch(setModalState({ visible: false, type: "", boxId: "", page: "", itemData: undefined }))}> Cancel </button>
        </div>
      }
      <PopperMenu referenceRef={menuButtonRef} placement={'right-start'} isOpen={isMenuOpen} setIsOpen={setIsMenuOpen}>
        <AddNoteContextMenu setIsOpen={setIsMenuOpen} subSections={subSectionsWithoutItemNote} item={itemData} />
      </PopperMenu>
    </div>
  )
}

export default ItemNote;