import { useState, useEffect, useMemo } from 'react';
import AnimateHeight from 'react-animate-height';
import SubSection from "./SubSection/SubSection"
import styles from "./BoxSection.module.css";
import { Album, Artist, Playlist, SectionSorting, Subsection, Track, UserBox } from 'core/types/interfaces';
import { getItemProperty } from "core/helpers/itemDataHandlers";
import { twoFactorSort } from 'core/helpers/twoFactorSort';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { updateBoxSorting, updateBoxSortingThunk } from 'core/features/currentBoxDetail/currentBoxDetailSlice';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { ARTIST_VIEW_MODES, VIEW_MODES } from 'core/constants/constants';
import { setModalState } from 'core/features/modal/modalSlice';

interface IProps {
  type: string
  visible: boolean
}

function BoxSection<T extends Artist | Album | Track | Playlist>({ type, visible }: IProps) {
  const dispatch = useAppDispatch();
  const userBoxes = useAppSelector(state => state.userBoxesData.userBoxes);
  const currentBox = useAppSelector(state => state.currentBoxDetailData.box);
  const sectionItems = currentBox[type as keyof Pick<UserBox, 'albums' | 'artists' | 'tracks' | 'playlists'> ] as T[];
  const boxSorting = currentBox.sectionSorting;
  const sectionSorting = boxSorting[type as keyof SectionSorting];
  const sectionIconSrc = `/icons/${type}.svg`;

  const isOwner = useMemo(() => !!userBoxes.find(box => box.boxId === currentBox?._id), [currentBox, userBoxes]);
  const sortedData = useMemo(
    () => twoFactorSort<T>([...sectionItems as T[]], sectionSorting.primarySorting, sectionSorting.secondarySorting, sectionSorting.ascendingOrder), 
    [sectionItems, sectionSorting]
  );
  const groupingSections = useMemo(
    () => Array.from(new Set(sectionItems.map(e => getItemProperty(e, sectionSorting.primarySorting, false) as string))).sort(), 
    [sectionItems, sectionSorting]
  );
  const subSectionArray = useMemo(
    () => currentBox.subSections.filter(s => s.type === type).sort(
    (a: Subsection, b: Subsection) => {
      if (a.index! < b.index!) return -1
      else if (a.index! > b.index!) return 1
      return 0
    }), 
    [currentBox.subSections, type]
  );

  const [height, setHeight] = useState<string | number>("auto");
  const [isReorderingMode, setIsReorderingMode] = useState(false);

  useEffect(() => {
    const heightProp = visible ? "auto" : 0
    setHeight(heightProp)
  }, [visible])

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
    <AnimateHeight duration={250} height={height}>
      <div className={styles.sectionPanel}>
        <div className={styles.sectionUtilities}>
          <div className={styles.sectionDescriptor}>
            <img className={styles.sectionIcon} src={sectionIconSrc} alt="Section icon"></img>
            <span> {`${type.slice(0, 1).toUpperCase()}${type.slice(1)}`} ({sectionItems.length}) </span>
          </div>
          <div className={styles.toggleButtonDashboard}>
            <div className={styles.toggleButton} onClick={handleCycleViewMode}>
              {`View as: ${sectionSorting.view?.slice(0, 1).toUpperCase()}${sectionSorting.view?.slice(1)}`}
            </div>
            <div className={styles.toggleButton} onClick={handleToggleSubsections}>
              {`Show subsections: ${sectionSorting.displaySubSections ? 'On' : 'Off'}`}
            </div>
            <div className={styles.toggleButton} onClick={handleOpenSortingMenu}>
              {
                sectionSorting.primarySorting === 'name' && type !== 'artists' ?
                `Sort by: Title`
                : 
                `Sort by: ${sectionSorting.primarySorting?.slice(0, 1).toUpperCase()}${sectionSorting.primarySorting?.slice(1)}`
              }
            </div>
            {
              (sectionSorting.primarySorting === 'custom' && isOwner) &&
              <div className={styles.toggleButton} onClick={() => setIsReorderingMode(!isReorderingMode)}>
                {`Reordering: ${isReorderingMode ? 'On' : 'Off'}`}
              </div>
            }
          </div>
        </div>

        {sectionSorting.displaySubSections || sectionSorting.displayGrouping ?
          <div className={styles.sectionWithSubs}>
            {
              sectionSorting.displaySubSections && 
              <div className={styles.defaultSubSection}>
                <SubSection
                  itemsMatch={(sortedData as T[]).filter(e => !e.subSectionCount)}
                  subName="default"
                  viewType={sectionSorting.view}
                  sectionType={type}
                  isDefault={true}
                  isReorderingMode={isReorderingMode}
                />
              </div>
            }
            {
              sectionSorting.displaySubSections &&
              subSectionArray.map(subsection => {
                const { name, _id, items } = subsection
                return (
                  !!items.length &&
                  <SubSection
                    itemsMatch={items}
                    subName={name}
                    subId={_id}
                    key={_id}
                    viewType={sectionSorting.view}
                    sectionType={type}
                    isDefault={false}
                    isReorderingMode={isReorderingMode}
                  />
                )
              })
            }
            {
              sectionSorting.displayGrouping &&
              groupingSections.map(group => {
                const matchedItems = sortedData.filter(e => getItemProperty(e, sectionSorting.primarySorting, false) === group)
                return (
                  !!matchedItems.length &&
                  <SubSection
                    itemsMatch={matchedItems}
                    subName={group}
                    key={group}
                    viewType={sectionSorting.view}
                    sectionType={""}
                    isDefault={false}
                    isReorderingMode={isReorderingMode}
                  />
                )
              })
            }
          </div>
          :
          <SubSection
            itemsMatch={sortedData}
            subName="default"
            viewType={sectionSorting.view}
            sectionType={type}
            isDefault={true}
            isReorderingMode={isReorderingMode}
          />
        }

      </div>
    </AnimateHeight>
  )
}

export default BoxSection;