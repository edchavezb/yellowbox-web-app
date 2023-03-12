import { useAppDispatch } from 'core/hooks/useAppDispatch';
import styles from "./SubsectionsMenu.module.css";
import { setModalState } from 'core/features/modal/modalSlice';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { addSubsectionToBoxThunk, reorderSubsectionsThunk } from 'core/features/currentBoxDetail/currentBoxDetailSlice';
import SubsectionRow from './SubsectionRow/SubsectionRow';
import { BoxSections } from 'core/types/types';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Subsection } from 'core/types/interfaces';

function SubsectionsMenu() {
  const dispatch = useAppDispatch();
  const currentBox = useAppSelector(state => state.currentBoxDetailData.box);
  const artistSubsections = currentBox.subSections
    .filter(subsection => subsection.type === 'artists').sort(sortSubsections)
  const albumSubsections = currentBox.subSections
    .filter(subsection => subsection.type === 'albums').sort(sortSubsections)
  const trackSubsections = currentBox.subSections
    .filter(subsection => subsection.type === 'tracks').sort(sortSubsections)
  const playlistSubsections = currentBox.subSections
    .filter(subsection => subsection.type === 'playlists').sort(sortSubsections)

  const handleCreateSubsection = async (type: BoxSections, index: number) => {
    dispatch(addSubsectionToBoxThunk(currentBox._id, type, index, ''));
  }

  const handleDragEnd = (event: DragEndEvent) => {
    console.log('Drag Ended')
    const { over, active } = event;
    const subsectionType = currentBox.subSections.find(sub => sub._id === active.id)?.type
    dispatch(
      reorderSubsectionsThunk(
        currentBox._id,
        currentBox.subSections,
        active.id as string,
        over?.id as string,
        subsectionType!
      )
    );
  }

  function sortSubsections(a: Subsection, b: Subsection) {
    if (a.index! > b.index!) return 1
    if (a.index! < b.index!) return -1
    return 0
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}>
      <div className={styles.modalBody}>
        <div className={styles.sectionsWrapper}>
          <div className={styles.section}>
            <div className={styles.sectionName}>
              Artists
            </div>
            <div className={styles.rowsWrapper}>
              <SortableContext
                items={artistSubsections.map(subsection => subsection._id!)}
                strategy={verticalListSortingStrategy}
              >
                {!!currentBox?.artists?.length &&
                  artistSubsections.map((subsection) => {
                    return (
                      <SubsectionRow section={subsection.type} name={subsection.name} rowId={subsection._id!} />
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

          <div className={styles.section}>
            <div className={styles.sectionName}>
              Albums
            </div>
            <div className={styles.rowsWrapper}>
              <SortableContext
                items={albumSubsections.map(subsection => subsection._id!)}
                strategy={verticalListSortingStrategy}
              >
                {!!currentBox?.albums?.length &&
                  albumSubsections.map((subsection) => {
                    return (
                      <SubsectionRow section={subsection.type} name={subsection.name} rowId={subsection._id!} />
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

          <div className={styles.section}>
            <div className={styles.sectionName}>
              Tracks
            </div>
            <div className={styles.rowsWrapper}>
              <SortableContext
                items={trackSubsections.map(subsection => subsection._id!)}
                strategy={verticalListSortingStrategy}
              >
                {!!currentBox?.tracks?.length &&
                  trackSubsections.map((subsection) => {
                    return (
                      <SubsectionRow section={subsection.type} name={subsection.name} rowId={subsection._id!} />
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

          <div className={styles.section}>
            <div className={styles.sectionName}>
              Playlists
            </div>
            <div className={styles.rowsWrapper}>
              <SortableContext
                items={playlistSubsections.map(subsection => subsection._id!)}
                strategy={verticalListSortingStrategy}
              >
                {!!currentBox?.playlists?.length &&
                  playlistSubsections.map((subsection) => {
                    return (
                      <SubsectionRow section={subsection.type} name={subsection.name} rowId={subsection._id!} />
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
        </div>

        <div className={styles.modalFooter}>
          <button onClick={() => dispatch(setModalState({ visible: false, type: "", boxId: "", page: "", itemData: undefined }))}> Done </button>
        </div>
      </div>
    </DndContext>
  )
}

export default SubsectionsMenu;