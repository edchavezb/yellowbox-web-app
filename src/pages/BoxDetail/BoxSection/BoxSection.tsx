import { useState, useEffect, useMemo } from 'react';
import AnimateHeight from 'react-animate-height';
import SubSection from "./SubSection/SubSection"
import styles from "./BoxSection.module.css";
import { Album, Artist, Playlist, SectionSorting, Subsection, Track, UserBox } from 'core/types/interfaces';
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
  const boxSorting = currentBox.sectionSorting;
  const sectionSorting = boxSorting[type as keyof SectionSorting];
  const sectionIconSrc = `/icons/${type}.svg`;

  const sortedData = useMemo(
    () => {
      if (sectionSorting.primarySorting === "custom") {
        return sectionItems.map((item, index) => ({...item, dbIndex: index}))
      }
      return twoFactorSort<T>([...sectionItems as T[]], sectionSorting.primarySorting, sectionSorting.secondarySorting, sectionSorting.ascendingOrder);
    },
    [sectionItems, sectionSorting]
  );
  const groupingSections = useMemo(
    () => Array.from(new Set(sectionItems.map(e => getItemProperty(e, sectionSorting.primarySorting, false) as string))).sort((a, b) => {
      if (a > b) {
        return sectionSorting.ascendingOrder ? 1 : -1;
      }
      else if (a < b) {
        return sectionSorting.ascendingOrder ? -1 : 1;
      }
      return 0;
    }),
    [sectionItems, sectionSorting]
  );
  const subSectionArray = useMemo(
    () => currentBox.subSections.filter(subsection => subsection.type === type).sort(
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

        {sectionSorting.displaySubSections || sectionSorting.displayGrouping ?
          <div className={styles.sectionWithSubs}>
            {
              sectionSorting.displaySubSections &&
              <div className={styles.defaultSubSection}>
                <ViewComponent
                  data={(sortedData as T[]).filter(item => !item.subSectionCount)}
                  viewType={sectionSorting.view}
                  isReorderingMode={isReorderingMode}
                  isSubsection={false}
                  listType={type}
                />
              </div>
            }
            {
              sectionSorting.displaySubSections &&
              subSectionArray.map(subsection => {
                let { name, _id, items } = subsection
                if (sectionSorting.primarySorting !== "custom"){
                  items = twoFactorSort([...items as T[]], sectionSorting.primarySorting, sectionSorting.secondarySorting, sectionSorting.ascendingOrder)
                }
                return (
                  !!items.length &&
                  <SubSection
                    itemsMatch={items}
                    subName={name}
                    subId={_id}
                    key={_id}
                    viewType={sectionSorting.view}
                    listType={type}
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
            viewType={sectionSorting.view}
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