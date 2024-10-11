import { useState, useEffect, useMemo } from 'react';
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

  const sortedData = useMemo(
    () => {
      if (sectionSettings.primarySorting === "custom") {
        return sectionItems.map((item, index) => ({...item, dbIndex: index}))
      }
      return twoFactorSort<T>([...sectionItems as T[]], sectionSettings.primarySorting, sectionSettings.secondarySorting, sectionSettings.sortingOrder === 'ASCENDING');
    },
    [sectionItems, sectionSettings]
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
    () => currentBox.subsections.filter(subsection => subsection.type === type).sort(
      (a: Subsection, b: Subsection) => {
        if (a.index! < b.index!) return -1
        else if (a.index! > b.index!) return 1
        return 0
      }),
    [currentBox.subsections, type]
  );

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
                  data={(sortedData as T[]).filter(item => !item.subSectionCount)}
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
                let { name, subsectionId, items } = subsection
                if (sectionSettings.primarySorting !== "custom"){
                  items = twoFactorSort([...items as T[]], sectionSettings.primarySorting, sectionSettings.secondarySorting, sectionSettings.sortingOrder === 'ASCENDING')
                }
                return (
                  !!items.length &&
                  <SubSection
                    itemsMatch={items as T[]}
                    subName={name}
                    subId={subsectionId}
                    key={subsectionId}
                    viewType={sectionSettings.view}
                    listType={type}
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
                    subName={group}
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