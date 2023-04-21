import { useState, useEffect } from 'react';
import AnimateHeight from 'react-animate-height';
import SubSection from "./SubSection"
import styles from "./BoxSection.module.css";
import { Album, Artist, Playlist, Sorting, Subsection, Track, UserBox } from 'core/types/interfaces';
import { getItemProperty } from "core/helpers/getItemProperty";
import { twoFactorSort } from 'core/helpers/twoFactorSort';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { updateBoxSorting, updateBoxSortingThunk } from 'core/features/currentBoxDetail/currentBoxDetailSlice';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { ARTIST_VIEW_MODES, VIEW_MODES } from 'core/constants/constants';
import { setModalState } from 'core/features/modal/modalSlice';

interface IProps<T> {
  data: T[]
  type: string
  box: UserBox
  sorting: Sorting
  visible: boolean
  isOwner?: boolean
}

function BoxSection<T extends Artist | Album | Track | Playlist>({ isOwner, data, type, box, sorting, visible }: IProps<T>) {
  const dispatch = useAppDispatch();
  const boxSectionSorting = useAppSelector(state => state.currentBoxDetailData.box.sectionSorting)
  const [height, setHeight] = useState<string | number>("auto")
  const [isReorderingMode, setIsReorderingMode] = useState(false)
  const sectionIconSrc = `/icons/${type.toLowerCase()}.svg`
  const sortedData = twoFactorSort<T>([...data], sorting.primarySorting, sorting.secondarySorting, sorting.ascendingOrder)
  const subSectionArray = box.subSections.filter(s => s.type === type.toLowerCase()).sort(
    (a: Subsection, b: Subsection) => {
      if (a.index! < b.index!) return -1
      else if (a.index! > b.index!) return 1
      return 0
    }
  )
  const groupingArray = Array.from(new Set(data.map(e => getItemProperty(e, sorting.primarySorting, false) as string))).sort()

  useEffect(() => {
    const heightProp = visible ? "auto" : 0
    setHeight(heightProp)
  }, [visible])

  const handleCycleViewMode = () => {
    const viewModes = type === 'Artists' ? ARTIST_VIEW_MODES : VIEW_MODES;
    const viewIndex = Object.keys(viewModes).indexOf(sorting.view);
    const newIndex = viewIndex === Object.keys(viewModes).length - 1 ? 0 : viewIndex + 1
    const newViewMode = viewModes[Object.keys(viewModes)[newIndex] as keyof typeof viewModes]
    const updatedSorting = {
      ...boxSectionSorting,
      [type.toLowerCase()]: { ...sorting, view: newViewMode }
    }
    if (isOwner) {
      dispatch(updateBoxSortingThunk(box._id, updatedSorting))
    } else {
      dispatch(updateBoxSorting(updatedSorting))
    }
  }

  const handleToggleSubsections = () => {
    const updatedSorting = {
      ...boxSectionSorting,
      [type.toLowerCase()]: { ...sorting, displaySubSections: !sorting.displaySubSections }
    }
    if (isOwner) {
      dispatch(updateBoxSortingThunk(box._id, updatedSorting))
    } else {
      dispatch(updateBoxSorting(updatedSorting))
    }
  }

  const handleOpenSortingMenu = () => {
    dispatch(setModalState({ visible: true, type: "Sorting Options", boxId: box._id, page: "Box" }))
  }

  return (
    <AnimateHeight duration={250} height={height}>
      <div className={styles.sectionPanel}>
        <div className={styles.sectionUtilities}>
          <div className={styles.sectionDescriptor}>
            <img className={styles.sectionIcon} src={sectionIconSrc} alt="Section icon"></img>
            <span> {type} ({data.length}) </span>
          </div>
          <div className={styles.toggleButtonDashboard}>
            <div className={styles.toggleButton} onClick={handleCycleViewMode}>
              {`View as: ${sorting.view?.slice(0, 1).toUpperCase()}${sorting.view?.slice(1)}`}
            </div>
            <div className={styles.toggleButton} onClick={handleToggleSubsections}>
              {`Show subsections: ${sorting.displaySubSections ? 'On' : 'Off'}`}
            </div>
            <div className={styles.toggleButton} onClick={handleOpenSortingMenu}>
              {`Sort by: ${sorting.primarySorting?.slice(0, 1).toUpperCase()}${sorting.primarySorting?.slice(1)}`}
            </div>
            {
              (sorting.primarySorting === 'custom' && isOwner) &&
              <div className={styles.toggleButton} onClick={() => setIsReorderingMode(!isReorderingMode)}>
                {`Reordering: ${isReorderingMode ? 'On' : 'Off'}`}
              </div>
            }
          </div>
        </div>

        {sorting.displaySubSections || sorting.displayGrouping ?
          <div className={styles.sectionWithSubs}>
            {
              sorting.displaySubSections &&
              <div className={styles.defaultSubSection}>
                <SubSection
                  isOwner={isOwner}
                  itemsMatch={(sortedData as T[]).filter(e => !e.subSectionCount)}
                  subName="default"
                  viewType={sorting.view}
                  sectionType={type}
                  isDefault={true}
                  page="box"
                  customSorting={sorting.primarySorting === "custom"}
                  boxId={box._id}
                  isReorderingMode={isReorderingMode}
                />
              </div>
            }
            {
              sorting.displaySubSections &&
              subSectionArray.map(subsection => {
                const { name, _id, items } = subsection
                return (
                  !!items.length &&
                  <SubSection
                    isOwner={isOwner}
                    itemsMatch={items}
                    page="box"
                    subName={name}
                    subId={_id}
                    key={_id}
                    viewType={sorting.view}
                    sectionType={type}
                    isDefault={false}
                    customSorting={sorting.primarySorting === "custom"}
                    boxId={box._id}
                    isReorderingMode={isReorderingMode}
                  />
                )
              })
            }
            {
              sorting.displayGrouping &&
              groupingArray.map(group => {
                const matchedItems = sortedData.filter(e => getItemProperty(e, sorting.primarySorting, false) === group)
                return (
                  !!matchedItems.length &&
                  <SubSection
                    isOwner={isOwner}
                    itemsMatch={matchedItems}
                    page="box"
                    subName={group}
                    key={group}
                    viewType={sorting.view}
                    sectionType={""}
                    isDefault={false}
                    customSorting={sorting.primarySorting === "custom"}
                    boxId={box._id}
                    isReorderingMode={isReorderingMode}
                  />
                )
              })
            }
          </div>
          :
          <SubSection
            isOwner={isOwner}
            itemsMatch={sortedData}
            subName="default"
            viewType={sorting.view}
            sectionType={type}
            isDefault={true}
            page="box"
            customSorting={sorting.primarySorting === "custom"}
            boxId={box._id}
            isReorderingMode={isReorderingMode}
          />
        }

      </div>
    </AnimateHeight>
  )
}

export default BoxSection;