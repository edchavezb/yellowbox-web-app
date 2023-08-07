import { useMemo } from "react";
import { ARTIST_VIEW_MODES, VIEW_MODES } from "core/constants/constants";
import { updateBoxSortingThunk, updateBoxSorting } from "core/features/currentBoxDetail/currentBoxDetailSlice";
import { setModalState } from "core/features/modal/modalSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { useAppSelector } from "core/hooks/useAppSelector";
import { SectionSorting } from "core/types/interfaces";
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
  const boxSorting = currentBox.sectionSorting;
  const sectionSorting = boxSorting[type as keyof SectionSorting];
  const isOwner = useMemo(() => !!userBoxes.find(box => box.boxId === currentBox?._id), [currentBox, userBoxes]);

  const handleCycleViewMode = () => {
    const viewModes = type === 'artists' ? ARTIST_VIEW_MODES : VIEW_MODES;
    const viewIndex = Object.keys(viewModes).indexOf(sectionSorting.view);
    const newIndex = viewIndex === Object.keys(viewModes).length - 1 ? 0 : viewIndex + 1
    const newViewMode = viewModes[Object.keys(viewModes)[newIndex] as keyof typeof viewModes]
    const updatedSorting = {
      ...boxSorting,
      [type]: { ...sectionSorting, view: newViewMode }
    }
    if (isOwner) {
      dispatch(updateBoxSortingThunk(currentBox._id, updatedSorting))
    } else {
      dispatch(updateBoxSorting(updatedSorting))
    }
  }

  const handleToggleSubsections = () => {
    const updatedSorting = {
      ...boxSorting,
      [type]: { ...sectionSorting, displaySubSections: !sectionSorting.displaySubSections }
    }
    if (isOwner) {
      dispatch(updateBoxSortingThunk(currentBox._id, updatedSorting))
    } else {
      dispatch(updateBoxSorting(updatedSorting))
    }
  }

  const handleOpenSortingMenu = () => {
    dispatch(setModalState({ visible: true, type: "Sorting Options", boxId: currentBox._id, page: "Box" }))
  }

  return (
    <div className={styles.toggleButtonDashboard}>
      <div className={styles.toggleButton} onClick={handleCycleViewMode}>
        {`View as: ${sectionSorting.view?.slice(0, 1).toUpperCase()}${sectionSorting.view?.slice(1)}`}
      </div>
      {
        sectionSorting.primarySorting === 'custom' &&
        <div className={styles.toggleButton} onClick={handleToggleSubsections}>
          {`Show subsections: ${sectionSorting.displaySubSections ? 'On' : 'Off'}`}
        </div>
      }
      {
        sectionSorting.primarySorting !== 'custom' &&
        <div className={styles.toggleButton}>
          {`Show grouping: ${sectionSorting.displayGrouping ? 'On' : 'Off'}`}
        </div>
      }
      <div className={styles.toggleButton} onClick={handleOpenSortingMenu}>
        {
          sectionSorting.primarySorting === 'name' && type !== 'artists' ?
            `Sort by: Title`
            :
            `Sort by: ${sectionSorting.primarySorting?.slice(0, 1).toUpperCase()}${sectionSorting.primarySorting.replace('_', ' ')?.slice(1)}`
        }
      </div>
      {
        (sectionSorting.primarySorting === 'custom' && isOwner) &&
        <div className={styles.toggleButton} onClick={() => setIsReorderingMode(!isReorderingMode)}>
          {`Reordering: ${isReorderingMode ? 'On' : 'Off'}`}
        </div>
      }
    </div>
  )
}

export default SectionControls;