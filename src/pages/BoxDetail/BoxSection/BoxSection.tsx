import { useState, useEffect, useMemo, useCallback } from 'react';
import AnimateHeight from 'react-animate-height';
import SubSection from "./SubSection/SubSection"
import styles from "./BoxSection.module.css";
import { Album, Artist, Playlist, Subsection, Track, UserBox } from 'core/types/interfaces';
import { getItemProperty } from "core/helpers/itemDataHandlers";
import { twoFactorSort } from 'core/helpers/twoFactorSort';
import { useAppSelector } from 'core/hooks/useAppSelector';
import ViewComponent from 'components/box-views/ViewComponent/ViewComponent';
import SectionControls from './SectionControls/SectionControls';

interface IProps {
  type: string
  visible: boolean
}

function BoxSection<T extends Artist | Album | Track | Playlist>({ type, visible }: IProps) {
  const currentBox = useAppSelector(state => state.currentBoxDetailData.box);
  const sectionItems = currentBox[type as keyof Pick<UserBox, 'albums' | 'artists' | 'tracks' | 'playlists'>] as T[];
  const sectionSettings = currentBox.sectionSettings.find(section => section.type === type)!;
  const sectionIconSrc = `/icons/${type}.svg`;

  const sortData = useCallback(
    (data: T[]) => {
      if (sectionSettings.primarySorting === "custom") {
        return data; // Sorting by custom position occurs in the backend
      }
      return twoFactorSort<T>([...data as T[]], sectionSettings.primarySorting, sectionSettings.secondarySorting, sectionSettings.sortingOrder === 'ASCENDING');
    },
    [sectionSettings]
  );
  const groupingSections = useMemo(
    () => Array.from(new Set(sectionItems.map(e => getItemProperty(e, sectionSettings.primarySorting, false) as string))).sort((a, b) => {
      if (a > b) {
        return sectionSettings.sortingOrder === 'ASCENDING' ? 1 : -1;
      }
      else if (a < b) {
        return sectionSettings.sortingOrder === 'ASCENDING' ? -1 : 1;
      }
      return 0;
    }),
    [sectionItems, sectionSettings]
  );
  const subSectionArray = useMemo(
    () => currentBox.subsections.filter(subsection => subsection.itemType === type).sort(
      (a: Subsection, b: Subsection) => {
        if (a.position! < b.position!) return -1
        else if (a.position! > b.position!) return 1
        return 0
      }),
    [currentBox.subsections, type]
  );
  const sortedData = useMemo(() => sortData(sectionItems), [sectionItems, sortData]);

  const getGroupingName = (group: string) => {
    const sorting = sectionSettings.primarySorting;
    if (sorting === "releaseDate" || sorting === "releaseMonth") {
      const [year, month, day] = group.split('-').map(Number);
      const date = new Date(year, month - 1, day); // month is 0-indexed
      return sorting === "releaseDate" ? 
        date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) 
        : date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    else if (sorting === "playedStatus") {
      return +group === 0 ? "Not Played" : "Played"
    }

    return group;
  }

  const [height, setHeight] = useState<string | number>("auto");
  const [isReorderingMode, setIsReorderingMode] = useState(false);

  useEffect(() => {
    const heightProp = visible ? "auto" : 0
    setHeight(heightProp)
  }, [visible])

  return (
    <AnimateHeight duration={250} height={height}>
      <div className={styles.sectionPanel}>
        <div className={styles.sectionUtilities}>
          <div className={styles.sectionDescriptor}>
            <img className={styles.sectionIcon} src={sectionIconSrc} alt="Section icon"></img>
            <span> {`${type.slice(0, 1).toUpperCase()}${type.slice(1)}`} ({sectionItems.length}) </span>
          </div>
          <SectionControls type={type} isReorderingMode={isReorderingMode} setIsReorderingMode={setIsReorderingMode} />
        </div>

        {sectionSettings.displaySubsections || sectionSettings.displayGrouping ?
          <div className={styles.sectionWithSubs}>
            {
              sectionSettings.displaySubsections &&
              <div className={styles.defaultSubSection}>
                <ViewComponent
                  data={(sortedData as T[]).filter(item => !item.subsections!.length)}
                  viewType={sectionSettings.view}
                  isReorderingMode={isReorderingMode}
                  isSubsection={false}
                  listType={type}
                />
              </div>
            }
            {
              sectionSettings.displaySubsections &&
              subSectionArray.map(subsection => {
                const { name, subsectionId, itemType, items } = subsection;
                const subsectionItems = sortData(items as T[]);
                return (
                  <SubSection
                    itemsMatch={subsectionItems as T[]}
                    subName={name}
                    subId={subsectionId}
                    key={subsectionId}
                    viewType={sectionSettings.view}
                    listType={itemType}
                    isReorderingMode={isReorderingMode}
                  />
                )
              })
            }
            {
              sectionSettings.displayGrouping &&
              groupingSections.map(group => {
                const matchedItems = sortedData.filter(e => getItemProperty(e, sectionSettings.primarySorting, false) === group)
                return (
                  !!matchedItems.length &&
                  <SubSection
                    itemsMatch={matchedItems}
                    subName={getGroupingName(group)}
                    key={group}
                    viewType={sectionSettings.view}
                    listType={type}
                    isReorderingMode={isReorderingMode}
                  />
                )
              })
            }
          </div>
          :
          <ViewComponent
            data={sortedData}
            viewType={sectionSettings.view}
            isReorderingMode={isReorderingMode}
            isSubsection={false}
            listType={type}
          />
        }
      </div>
    </AnimateHeight>
  )
}

export default BoxSection;