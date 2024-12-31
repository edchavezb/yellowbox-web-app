import { useAppDispatch } from 'core/hooks/useAppDispatch';
import styles from "./SubsectionsMenu.module.css";
import { setModalState } from 'core/features/modal/modalSlice';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { addSubsectionToBoxThunk, reorderSubsectionsThunk } from 'core/features/currentBoxDetail/currentBoxDetailSlice';
import SubsectionRow from './SubsectionRow/SubsectionRow';
import { BoxSections } from 'core/types/types';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import AppButton from 'components/styled/AppButton/AppButton';

function SubsectionsMenu() {
  const dispatch = useAppDispatch();
  const currentBox = useAppSelector(state => state.currentBoxDetailData.box);
  const artistSubsections = currentBox.subsections
    .filter(subsection => subsection.itemType === 'artists')
  const albumSubsections = currentBox.subsections
    .filter(subsection => subsection.itemType === 'albums')
  const trackSubsections = currentBox.subsections
    .filter(subsection => subsection.itemType === 'tracks')
  const playlistSubsections = currentBox.subsections
    .filter(subsection => subsection.itemType === 'playlists')

  const handleCreateSubsection = async (type: BoxSections, index: number) => {
    dispatch(addSubsectionToBoxThunk(currentBox.boxId, type, index, ''));
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    console.log(over, active);
    const subsectionType = currentBox.subsections.find(sub => sub.subsectionId === active.id)?.itemType
    dispatch(
      reorderSubsectionsThunk(
        currentBox.boxId,
        currentBox.subsections,
        active?.data?.current?.sortable.index as number,
        over?.data?.current?.sortable.index as number,
        subsectionType!
      )
    );
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}>
      <div className={styles.modalBody}>
        <div className={styles.sectionsWrapper}>
          {!!currentBox?.artists?.length &&
            <div className={styles.section}>
              <div className={styles.sectionName}>
                Artists
              </div>
              <div className={styles.rowsWrapper}>
                <SortableContext
                  items={artistSubsections.map(subsection => subsection.subsectionId!)}
                  strategy={verticalListSortingStrategy}
                >
                  {
                    artistSubsections.map((subsection) => {
                      return (
                        <SubsectionRow section={subsection.itemType} name={subsection.name} rowId={subsection.subsectionId!} key={subsection.subsectionId} />
                      )
                    })
                  }
                </SortableContext>
              </div>
              <div className={styles.newButtonWrapper}>
                <div className={styles.newButton} onClick={() => handleCreateSubsection('artists', artistSubsections.length)}>
                  <img className={styles.plusIcon} src="/icons/plus.svg" alt="new subsection"></img>
                </div>
              </div>
            </div>
          }

          {!!currentBox?.albums?.length &&
            <div className={styles.section}>
              <div className={styles.sectionName}>
                Albums
              </div>
              <div className={styles.rowsWrapper}>
                <SortableContext
                  items={albumSubsections.map(subsection => subsection.subsectionId!)}
                  strategy={verticalListSortingStrategy}
                >
                  {
                    albumSubsections.map((subsection) => {
                      return (
                        <SubsectionRow section={subsection.itemType} name={subsection.name} rowId={subsection.subsectionId!} key={subsection.subsectionId} />
                      )
                    })
                  }
                </SortableContext>
              </div>
              <div className={styles.newButtonWrapper}>
                <div className={styles.newButton} onClick={() => handleCreateSubsection('albums', albumSubsections.length)}>
                  <img className={styles.plusIcon} src="/icons/plus.svg" alt="new subsection"></img>
                </div>
              </div>
            </div>
          }

          {!!currentBox?.tracks?.length &&
            <div className={styles.section}>
              <div className={styles.sectionName}>
                Tracks
              </div>
              <div className={styles.rowsWrapper}>
                <SortableContext
                  items={trackSubsections.map(subsection => subsection.subsectionId!)}
                  strategy={verticalListSortingStrategy}
                >
                  {!!currentBox?.tracks?.length &&
                    trackSubsections.map((subsection) => {
                      return (
                        <SubsectionRow section={subsection.itemType} name={subsection.name} rowId={subsection.subsectionId!} key={subsection.subsectionId} />
                      )
                    })
                  }
                </SortableContext>
              </div>
              <div className={styles.newButtonWrapper}>
                <div className={styles.newButton} onClick={() => handleCreateSubsection('tracks', trackSubsections.length)}>
                  <img className={styles.plusIcon} src="/icons/plus.svg" alt="new subsection"></img>
                </div>
              </div>
            </div>
          }

          {!!currentBox?.playlists?.length &&
            <div className={styles.section}>
              <div className={styles.sectionName}>
                Playlists
              </div>
              <div className={styles.rowsWrapper}>
                <SortableContext
                  items={playlistSubsections.map(subsection => subsection.subsectionId!)}
                  strategy={verticalListSortingStrategy}
                >
                  {!!currentBox?.playlists?.length &&
                    playlistSubsections.map((subsection) => {
                      return (
                        <SubsectionRow section={subsection.itemType} name={subsection.name} rowId={subsection.subsectionId!} key={subsection.subsectionId} />
                      )
                    })
                  }
                </SortableContext>
              </div>
              <div className={styles.newButtonWrapper}>
                <div className={styles.newButton} onClick={() => handleCreateSubsection('playlists', playlistSubsections.length)}>
                  <img className={styles.plusIcon} src="/icons/plus.svg" alt="new subsection"></img>
                </div>
              </div>
            </div>
          }
        </div>

        <div className={styles.modalFooter}>
          <AppButton
            onClick={() => dispatch(setModalState({ visible: false, type: "", boxId: "", page: "", itemData: undefined }))}
            text={"Done"}
          />
        </div>
      </div>
    </DndContext>
  )
}

export default SubsectionsMenu;