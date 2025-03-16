import { setModalState } from 'core/features/modal/modalSlice';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { useAppSelector } from 'core/hooks/useAppSelector';
import styles from "./AddToSubsectionMenu.module.css";
import { addItemToSubsectionThunk, removeItemFromSubsectionThunk } from 'core/features/currentBoxDetail/currentBoxDetailSlice';
import { BoxSections, ItemData } from 'core/types/types';
import AppButton from 'components/styled/AppButton/AppButton';

interface IProps {
  itemData: ItemData
}

function AddToSubsectionMenu({ itemData }: IProps) {
  const dispatch = useAppDispatch();
  const currentBox = useAppSelector(state => state.currentBoxDetailData.box)
  const validSubsections = currentBox.subsections.filter(subsection => subsection.itemType === `${itemData.type}s`)

  const handleAddItem = (subsectionId: string) => {
    dispatch(addItemToSubsectionThunk(currentBox.boxId, `${itemData.type}s` as BoxSections, subsectionId, itemData))
  }

  const handleRemoveItem = (subsectionId: string) => {
    dispatch(removeItemFromSubsectionThunk(currentBox.boxId, subsectionId, itemData.boxItemId!, `${itemData.type}s` as BoxSections))
  }

  return (
    <div id={styles.modalBody}>
      <div id={styles.menu}>
        {
          validSubsections.length ?
            <>
              <div className={styles.title}>
                <label htmlFor="add-type"> Add this item to </label>
              </div>
              <div className={styles.subsectionList}>
                {validSubsections.map(subsection => {
                  return (
                    <div key={subsection.subsectionId} className={styles.subsectionRow}>
                      <input
                        type={'checkbox'}
                        value={subsection.subsectionId}
                        checked={subsection.items.some((item: ItemData) => item.spotifyId === itemData.spotifyId)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleAddItem(e.target.value);
                          }
                          else {
                            handleRemoveItem(e.target.value);
                          }
                        }}
                      />
                      <span> {subsection.name} </span>
                    </div>
                  )
                })}
              </div>
            </>
            :
            <div>
              {'No subsections available for this item type. \n Go to "Manage Sections" to create one.'}
            </div>
        }
      </div>
      <div id={styles.modalFooter}>
        <AppButton
          onClick={() => dispatch(setModalState({ visible: false, type: "", boxId: "", page: "", itemData: undefined }))}
          text={"Done"}
        />
      </div>
    </div>
  )
}

export default AddToSubsectionMenu;