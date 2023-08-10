import DetailView from "components/box-views/DetailView/DetailView";
import GridView from "components/box-views/GridView/GridView";
import ListView from "components/box-views/ListView/ListView";
import WallView from "components/box-views/WallView/WallView";
import { Artist, Album, Track, Playlist } from "core/types/interfaces";

interface ViewComponentProps<T> {
    data: T[], 
    viewType: string
    listType?: string
    isSubsection: boolean
    subId?: string
    isReorderingMode: boolean
}

function ViewComponent<T extends Artist | Album | Track | Playlist>({data, viewType, listType, isSubsection, subId, isReorderingMode}: ViewComponentProps<T>) {
    let sectionView: JSX.Element;
    switch (viewType) {
      case "grid":
        sectionView = <GridView data={data} isSubsection={isSubsection} subId={subId} isReorderingMode={isReorderingMode} />
        break;
      case "list":
        sectionView = <ListView data={data} isSubsection={isSubsection} subId={subId} isReorderingMode={isReorderingMode} sectionType={listType!}  />
        break;
      case "details":
        sectionView = <DetailView data={data} isSubsection={isSubsection} subId={subId} isReorderingMode={isReorderingMode} />
        break;
      case "wall":
        sectionView = <WallView data={data} isSubsection={isSubsection} subId={subId} isReorderingMode={isReorderingMode} />
        break;
      default:
        sectionView = <div></div>
    }
    return sectionView
}

export default ViewComponent;