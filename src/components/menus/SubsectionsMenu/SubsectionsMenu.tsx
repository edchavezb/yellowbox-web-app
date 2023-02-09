import { useAppDispatch } from 'core/hooks/useAppDispatch';
import styles from "./SubsectionsMenu.module.css";
import { setModalState } from 'core/features/modal/modalSlice';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { addSubsectionToBoxThunk } from 'core/features/currentBoxDetail/currentBoxDetailSlice';
import SubsectionRow from './SubsectionRow/SubsectionRow';
import { BoxSections } from 'core/types/types';

function SubsectionsMenu() {
  const dispatch = useAppDispatch();
  const currentBox = useAppSelector(state => state.currentBoxDetailData.box);
  const artistSubsections = currentBox.subSections.filter(subsection => subsection.type === 'artists')
  const albumSubsections = currentBox.subSections.filter(subsection => subsection.type === 'albums')
  const trackSubsections = currentBox.subSections.filter(subsection => subsection.type === 'tracks')
  const playlistSubsections = currentBox.subSections.filter(subsection => subsection.type === 'playlists')


  const handleCreateSubsection = async (type: BoxSections, index: number) => {
    dispatch(addSubsectionToBoxThunk(currentBox._id, type, index, ''));
  }

  const handleEditSubsection = async (type: string) => {
    //dispatch(addSubsectionToBoxThunk(currentBox._id, type, ''));
  }

  return (
    <div className={styles.modalBody}>
      <div className={styles.sectionsWrapper}>
        <div className={styles.section}>
          <div className={styles.sectionName}>
            Artists
          </div>
          <div className={styles.rowsWrapper}>
            {!!currentBox?.artists?.length &&
              artistSubsections.map((subsection, index) => {
                return (
                  <SubsectionRow section={subsection.type} name={subsection.name} rowId={subsection._id!} />
                )
              })
            }
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
            {!!currentBox?.albums?.length &&
              albumSubsections.map((subsection, index) => {
                return (
                  <SubsectionRow section={subsection.type} name={subsection.name} rowId={subsection._id!} />
                )
              })
            }
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
            {!!currentBox?.tracks?.length &&
              trackSubsections.map((subsection, index) => {
                return (
                  <SubsectionRow section={subsection.type} name={subsection.name} rowId={subsection._id!} />
                )
              })
            }
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
            {!!currentBox?.playlists?.length &&
              playlistSubsections.map((subsection, index) => {
                return (
                  <SubsectionRow section={subsection.type} name={subsection.name} rowId={subsection._id!} />
                )
              })
            }
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
  )
}

export default SubsectionsMenu;