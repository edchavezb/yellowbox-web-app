import { useState, useEffect } from 'react';
import AnimateHeight from 'react-animate-height';
import SubSection from "./SubSection"
import styles from "./BoxSection.module.css";
import { Album, Artist, Playlist, Sorting, Subsection, Track, UserBox } from 'core/types/interfaces';
import { getItemProperty } from "core/helpers/getItemProperty";
import { twoFactorSort } from 'core/helpers/twoFactorSort';

interface IProps<T> {
  data: T[]
  type: string
  box: UserBox
  sorting: Sorting
  visible: boolean
  isOwner?: boolean
}

function BoxSection<T extends Artist | Album | Track | Playlist>({ isOwner, data, type, box, sorting, visible }: IProps<T>) {
  const [height, setHeight] = useState<string | number>("auto")
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

  return (
    <AnimateHeight duration={250} height={height}>
      <div className={styles.sectionPanel}>
        <div className={styles.sectionUtilities}>
          <img className={styles.sectionIcon} src={sectionIconSrc} alt="Section icon"></img>
          <span> {type} ({data.length}) </span>
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
                />
              </div>
            }
            {
              sorting.displaySubSections &&
              subSectionArray.map(subsection => {
                const { name, _id, items } = subsection
                return (
                  !!items.length &&
                  <SubSection itemsMatch={items} page="box" subName={name} key={_id} viewType={sorting.view}
                    sectionType={""} isDefault={false} customSorting={sorting.primarySorting === "custom"} boxId={box._id} />
                )
              })
            }
            {
              sorting.displayGrouping &&
              groupingArray.map(group => {
                const matchedItems = sortedData.filter(e => getItemProperty(e, sorting.primarySorting, false) === group)
                return (
                  !!matchedItems.length &&
                  <SubSection itemsMatch={matchedItems} page="box" subName={group} key={group} viewType={sorting.view}
                    sectionType={""} isDefault={false} customSorting={sorting.primarySorting === "custom"} boxId={box._id} />
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
          />
        }

      </div>
    </AnimateHeight>
  )
}

export default BoxSection;