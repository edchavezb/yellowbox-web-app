import styles from "./SubSection.module.css";
import { Album, Artist, Playlist, Track } from "core/types/interfaces";
import ViewComponent from "components/box-views/ViewComponent/ViewComponent";
import { addItemToSubsectionThunk, moveItemBetweenSubsectionsThunk } from "core/features/currentBoxDetail/currentBoxDetailSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { useAppSelector } from "core/hooks/useAppSelector";
import { BoxSections } from "core/types/types";
import { initErrorToast } from "core/features/toast/toastSlice";
import { Box } from "@chakra-ui/react";

interface IProps<T> {
  itemsMatch: T[]
  subName: string
  subId?: string
  viewType: string
  listType?: string
  isReorderingMode: boolean
}

function SubSection<T extends Artist | Album | Track | Playlist>({
  itemsMatch,
  subName,
  subId,
  viewType,
  listType,
  isReorderingMode
}: IProps<T>) {
  const dispatch = useAppDispatch();
  const currentBox = useAppSelector(state => state.currentBoxDetailData.box)

  const addItemToSubsection = (data: T, subsectionId: string) => {
    if (`${data.type}s` !== listType) {
      dispatch(initErrorToast({ error: `Can't move ${data.type} to ${listType}` }));
      return;
    }
    dispatch(addItemToSubsectionThunk(currentBox.boxId, `${data.type}s` as BoxSections, subsectionId, data))
  }

  const moveItemBetweenSubsections = (data: T, currentSubsectionId: string, destinationSubsectionId: string) => {
    if (`${data.type}s` !== listType) {
      dispatch(initErrorToast({ error: `Can't move ${data.type} to ${listType}` }));
      return;
    }
    dispatch(moveItemBetweenSubsectionsThunk(currentBox.boxId, `${data.type}s` as BoxSections, currentSubsectionId, destinationSubsectionId, data))
  }

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    (event.target as Element).className = styles.linkDragOver
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    (event.target as Element).className = styles.subSectionName
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    (event.target as Element).className = styles.subSectionName
    const data = JSON.parse(event.dataTransfer.getData("data"))
    if (!data.subsectionId) {
      addItemToSubsection(data, event.currentTarget.id)
    }
    else {
      moveItemBetweenSubsections(data, data.subsectionId, event.currentTarget.id)
    }
  }

  return (
    <div className={styles.subSectionWrapper} key={subName}>
      <Box className={styles.subSectionName} id={subId}
        onDragEnter={(e) => handleDragEnter(e)}
        onDragLeave={(e) => handleDragLeave(e)}
        onDragOver={(e) => handleDragOver(e)}
        onDrop={(e) => handleDrop(e)}>
        {subName}
      </Box>
      <ViewComponent data={itemsMatch} viewType={viewType} listType={listType} isSubsection subId={subId} isReorderingMode={isReorderingMode} />
    </div>
  )
}

export default SubSection;