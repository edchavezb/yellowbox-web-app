import { useAppDispatch } from 'core/hooks/useAppDispatch';
import styles from "./SubsectionRow.module.css";
import { BoxSections } from 'core/types/types';
import { useEffect, useRef, useState } from 'react';
import { updateSubsectionNameThunk } from 'core/features/currentBoxDetail/currentBoxDetailSlice';
import { useAppSelector } from 'core/hooks/useAppSelector';

interface SubsectionRowProps {
  rowId: string;
  section: BoxSections;
  name: string;
}

function SubsectionRow({ rowId, section, name }: SubsectionRowProps) {
  const dispatch = useAppDispatch();
  const currentBox = useAppSelector(state => state.currentBoxDetailData.box);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isInputEnabled, setIsInputEnabled] = useState(false);
  const [nameInput, setNameInput] = useState(name);
  const { subSectionRow, dragHandle, nameInputBox, deleteButton } = styles;

  const handleSaveName = () => {
    dispatch(updateSubsectionNameThunk(currentBox._id, rowId, nameInput))
    setIsInputEnabled(false);
  }

  const handleFocusOut = (e: React.FocusEvent) => {
    if (!(e.currentTarget! as Node).contains(e.relatedTarget as Node)) {
      setIsInputEnabled(false);
    }
  }

  useEffect(() => {
    if(isInputEnabled) {
      inputRef.current!.focus();
    }
  }, [isInputEnabled])

  return (
    <div className={styles.rowWrapper}>
      <div className={dragHandle}>
        <img className={styles.reorderIcon} src="/icons/reorder.svg" alt="reorder"></img>
      </div>
      <div className={subSectionRow} onBlur={e => handleFocusOut(e)}>
        {
          !isInputEnabled &&
          <div 
            className={name ? styles.nameRow : styles.nameRowEmpty}
            onClick={() => setIsInputEnabled(true)}
          >
            {name || 'Enter a name for this section'}
          </div>
        }
        {
          isInputEnabled &&
          <div className={styles.inputRow}>
            <input
              type={'text'}
              className={nameInputBox}
              value={nameInput}
              ref={inputRef}
              onChange={(e) => setNameInput(e.target.value)}
            />
            <div className={styles.saveNameBtn} onClick={handleSaveName} tabIndex={-1}>
              <img className={styles.checkmark} src="/icons/checkmark.svg" alt="save name"></img>
            </div>
          </div>
        }
      </div>
      <div className={deleteButton}>
        <img className={styles.deleteIcon} src="/icons/circleminus.svg" alt="delete"></img>
      </div>
    </div>
  )
}

export default SubsectionRow;