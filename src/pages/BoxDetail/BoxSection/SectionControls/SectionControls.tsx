import { useMemo } from "react";
import { ARTIST_VIEW_MODES, VIEW_MODES } from "core/constants/constants";
import { updateBoxSectionSettings, updateBoxSectionSettingsThunk } from 'core/features/currentBoxDetail/currentBoxDetailSlice';
import { setModalState } from "core/features/modal/modalSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { useAppSelector } from "core/hooks/useAppSelector";
import styles from "./SectionControls.module.css";

interface SectionControlsProps {
  type: string
  isReorderingMode: boolean;
  setIsReorderingMode: React.Dispatch<React.SetStateAction<boolean>>
}

const SectionControls = ({ type, isReorderingMode, setIsReorderingMode }: SectionControlsProps) => {
  const dispatch = useAppDispatch();
  const userBoxes = useAppSelector(state => state.userBoxesData.userBoxes);
  const currentBox = useAppSelector(state => state.currentBoxDetailData.box);
  const sectionSettings = currentBox.sectionSettings.find(section => section.type === type)!;
  const isOwner = useMemo(() => !!userBoxes.find(box => box.boxId === currentBox?.boxId), [currentBox, userBoxes]);

  const handleCycleViewMode = () => {
    const viewModes = type === 'artists' ? ARTIST_VIEW_MODES : VIEW_MODES;
    const viewIndex = Object.keys(viewModes).indexOf(sectionSettings.view);
    const newIndex = viewIndex === Object.keys(viewModes).length - 1 ? 0 : viewIndex + 1
    const newViewMode = viewModes[Object.keys(viewModes)[newIndex] as keyof typeof viewModes]
    const updatedSettings = {
      ...sectionSettings,
      view: newViewMode
    }
    if (isOwner) {
      dispatch(updateBoxSectionSettingsThunk(currentBox.boxId, updatedSettings))
    } else {
      dispatch(updateBoxSectionSettings(updatedSettings))
    }
  }

  const handleToggleSubsections = () => {
    const updatedSettings = {
      ...sectionSettings,
      displaySubsections: !sectionSettings.displaySubsections
    }
    if (isOwner) {
      dispatch(updateBoxSectionSettingsThunk(currentBox.boxId, updatedSettings))
    } else {
      dispatch(updateBoxSectionSettings(updatedSettings))
    }
  }

  const handleOpenSortingMenu = () => {
    dispatch(setModalState({ visible: true, type: "Sorting Options", boxId: currentBox.boxId, page: "Box" }))
  }

  return (
    <div className={styles.toggleButtonDashboard}>
      <div className={styles.toggleButton} onClick={handleCycleViewMode}>
        {`View as: ${sectionSettings.view?.slice(0, 1).toUpperCase()}${sectionSettings.view?.slice(1)}`}
      </div>
      {
        sectionSettings.primarySorting === 'custom' &&
        <div className={styles.toggleButton} onClick={handleToggleSubsections}>
          {`Show subsections: ${sectionSettings.displaySubsections ? 'On' : 'Off'}`}
        </div>
      }
      {
        sectionSettings.primarySorting !== 'custom' &&
        <div className={styles.toggleButton} onClick={handleOpenSortingMenu}>
          {`Show grouping: ${sectionSettings.displayGrouping ? 'On' : 'Off'}`}
        </div>
      }
      <div className={styles.toggleButton} onClick={handleOpenSortingMenu}>
        {
          sectionSettings.primarySorting === 'name' && type !== 'artists' ?
            `Sort by: Title`
            :
            `Sort by: ${sectionSettings.primarySorting?.slice(0, 1).toUpperCase()}${sectionSettings.primarySorting.replace('_', ' ')?.slice(1)}`
        }
      </div>
      {
        (sectionSettings.primarySorting === 'custom' && isOwner) &&
        <div className={styles.toggleButton} onClick={() => setIsReorderingMode(!isReorderingMode)}>
          {`Reordering: ${isReorderingMode ? 'On' : 'Off'}`}
        </div>
      }
    </div>
  )
}

export default SectionControls;