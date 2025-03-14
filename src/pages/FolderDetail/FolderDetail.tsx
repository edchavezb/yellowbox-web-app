import { useEffect, useRef, useState } from 'react';
import styles from "./FolderDetail.module.css";
import { useAppSelector } from 'core/hooks/useAppSelector';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { useParams } from 'react-router-dom';
import { fetchFolderDetailThunk, setIsUserViewing } from 'core/features/currentFolderDetail/currentFolderDetailSlice';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { DndContext, DragEndEvent, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import BoxTile from 'components/common/BoxTile/BoxTile';
import PopperMenu from 'components/menus/popper/PopperMenu';
import FolderMenu from 'components/menus/popper/FolderMenu/FolderMenu';
import { Text } from '@chakra-ui/react'
import { reorderFolderBoxesThunk } from 'core/features/userFolders/userFoldersSlice';

function FolderDetail() {
  const { id: folderId } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const menuToggleRef = useRef(null);
  const isLoggedIn = useAppSelector(state => state.userData.isUserLoggedIn);
  const currentFolder = useAppSelector(state => state.currentFolderDetailData.folder);
  const isFolderEmpty = !currentFolder?.boxes?.length;
  const [isFolderMenuOpen, setIsFolderMenuOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  )

  useEffect(() => {
    dispatch(fetchFolderDetailThunk(folderId))
    dispatch(setIsUserViewing(true))
    return () => {
      dispatch(setIsUserViewing(false))
    }
  }, [folderId, dispatch])

  const handleDragEnd = ({ over, active }: DragEndEvent) => {
    if (over) {
      const activeSortable = active?.data?.current?.sortable
      const targetSortable = over?.data?.current?.sortable
      if (targetSortable) {
        dispatch(reorderFolderBoxesThunk(folderId, active?.id as string, activeSortable.index, targetSortable.index))
      }
    }
  }

  return (
    <>
      {
        (isLoggedIn !== null && currentFolder.folderId === folderId) &&
        <div id={styles.mainPanel}>
          <div className={styles.folderHeader}>
            <div className={styles.folderSquare}>
              <img className={styles.folderIcon} src="/icons/folder.svg" alt="folder" />
            </div>
            <div className={styles.folderInfo}>
              <Text fontSize={"2xl"} fontWeight={"700"}> {currentFolder?.name} </Text>
              <div className={styles.folderDesc}>
                {currentFolder?.description}
              </div>
              <div className={styles.creator}>
                Folder by <span className={styles.creatorName}>{currentFolder.creatorName}</span>
              </div>
            </div>
            <div className={styles.menuButtonWrapper}>
              <div className={styles.menuButton} onClick={() => setIsFolderMenuOpen(true)} ref={menuToggleRef}>
                <img className={styles.dotsIcon} src="/icons/ellipsis.svg" alt='menu' />
              </div>
            </div>
          </div>
          <div className={styles.folderContents}>
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              sensors={sensors}
            >
              <SortableContext
                items={currentFolder.boxes.map(item => item.boxId!)}
                strategy={rectSortingStrategy}
                id={`detail-${currentFolder.folderId}`}
              >
                {currentFolder.boxes.map(box => {
                  return (
                    <BoxTile box={box} key={box.boxId} />
                  )
                })}
              </SortableContext>
            </DndContext>
          </div>
          {isFolderEmpty &&
            <div className={styles.emptyMsgDiv}>
              <Text fontSize={"lg"} fontWeight={"700"} sx={{ marginTop: '10px', marginBottom: "20px", textAlign: "center" }}>
                You have not added any boxes to this folder yet.
              </Text>
            </div>}
          <PopperMenu referenceRef={menuToggleRef} placement={'bottom-start'} isOpen={isFolderMenuOpen} setIsOpen={setIsFolderMenuOpen}>
            <FolderMenu setIsOpen={setIsFolderMenuOpen} />
          </PopperMenu>
        </div>
      }
    </>
  )
}

export default FolderDetail;