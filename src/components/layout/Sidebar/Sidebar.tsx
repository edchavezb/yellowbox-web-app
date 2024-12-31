import { reorderDashboardBoxesThunk, setDashboardBoxes, setUserBoxes } from "core/features/userBoxes/userBoxesSlice";
import { addBoxToFolderThunk, moveBoxBetweenFoldersThunk, removeBoxFromFolderThunk, reorderFolderBoxesThunk, setUserFolders } from "core/features/userFolders/userFoldersSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { useAppSelector } from "core/hooks/useAppSelector";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { YellowboxUser } from "core/types/interfaces";
import styles from "./Sidebar.module.css";
import { DndContext, DndContextProps, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import SidebarFolder from "./SidebarFolder/SidebarFolder";
import SidebarBoxList from "./SidebarBoxList/SidebarBoxList";
import { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { Text } from '@chakra-ui/react'
import { DndContextTypesafeProps } from "./sidebarTypes";

interface IProps {
  user: YellowboxUser
}

export function AppDndContext(props: DndContextTypesafeProps) {
  return <DndContext {...props as DndContextProps} />;
}

function Sidebar({ user }: IProps) {
  const dispatch = useAppDispatch();
  const userFolders = useAppSelector(state => state.userFoldersData.folders);
  const sortedFolders = [...userFolders].sort((folderA, folderB) => {
    if (folderA.name > folderB.name) return 1
    if (folderA.name < folderB.name) return -1
    else {
      return 0
    }
  })
  const userDashboardBoxes = useAppSelector(state => state.userBoxesData.dashboardBoxes)
  const highestDashboardBoxPosition = Math.max(...userDashboardBoxes.map(box => box.position!));
  const accountWidgetRef = useRef(null);

  const [userImage, setUserImage] = useState(user.imageUrl);
  const [activeDraggable, setActiveDraggable] = useState<null | { name: string, id: string }>(null);
  const [dragOverFolder, setDragOverFolder] = useState<null | string>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  )

  useEffect(() => {
    if (user?.userId) {
      dispatch(setUserFolders(user.folders!))
      dispatch(setUserBoxes(user.boxes!))
      dispatch(setDashboardBoxes(user.boxes!.filter(box => !box.folderId)))
    }
  }, [user, dispatch])

  const handleImageError = async () => {
    setUserImage("/user.png");
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveDraggable({ name: active.data.current?.name!, id: active.id as string });
  }

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    const activeSortable = active?.data?.current?.sortable
    const targetSortable = over?.data?.current?.sortable
    if (targetSortable && targetSortable.containerId !== activeSortable?.containerId) {
      setDragOverFolder(targetSortable.containerId as string)
    }
    else if (over?.id !== activeSortable?.containerId) {
      setDragOverFolder(over?.id as string)
    }
  }

  const handleDragEnd = ({ over, active }: DragEndEvent) => {
    if (over) {
      const activeSortable = active?.data?.current?.sortable
      const targetSortable = over?.data?.current?.sortable
      const boxName = active.data.current?.name;
      if (targetSortable) {
        if (targetSortable.containerId === activeSortable?.containerId) {
          // Reorder dashboard boxes or within folder 
          if (targetSortable.containerId === 'boxList') {
            dispatch(reorderDashboardBoxesThunk(active?.id as string, activeSortable.index, targetSortable.index));
          }
          else {
            dispatch(reorderFolderBoxesThunk(activeSortable?.containerId as string, active?.id as string, activeSortable.index, targetSortable.index));
          }
        }
        else if (targetSortable.containerId === 'boxList') {
          // Remove from folder
          dispatch(removeBoxFromFolderThunk(activeSortable?.containerId! as string, active.id as string, boxName!, highestDashboardBoxPosition + 1))
        }
        else {
          const highestFolderPosition = Math.max(0, ...(userFolders.find(folder => folder.folderId === targetSortable.containerId)?.boxes.map(box => box.folderPosition!) || []));
          if (activeSortable?.containerId === 'boxList' && boxName) {
            // Add to folder
            dispatch(addBoxToFolderThunk(targetSortable.containerId as string, active.id as string, boxName, highestFolderPosition + 1))
          }
          else {
            // Move between folders
            dispatch(moveBoxBetweenFoldersThunk(activeSortable?.containerId as string, targetSortable.containerId as string, active.id as string, boxName!, highestFolderPosition + 1))
          }
        }
      }
      else if (over.id === 'boxList') {
        // Remove from folder
        dispatch(removeBoxFromFolderThunk(activeSortable?.containerId! as string, active.id as string, boxName!, highestDashboardBoxPosition + 1))
      }
      else {
        const highestFolderPosition = Math.max(0, ...(userFolders.find(folder => folder.folderId === over.id)?.boxes.map(box => box.folderPosition!) || []));
        if (activeSortable?.containerId === 'boxList' && boxName) {
          // Add to folder
          dispatch(addBoxToFolderThunk(over.id as string, active.id as string, boxName, highestFolderPosition + 1))
        }
        else {
          // Move between folders
          dispatch(moveBoxBetweenFoldersThunk(activeSortable?.containerId as string, over.id as string, active.id as string, boxName!, highestFolderPosition + 1))
        }
      }
    }
    setActiveDraggable(null);
    setDragOverFolder(null);
  }

  return (
    <div className={`${styles.mainPanel} ${styles.customScrollbar}`}>
      {
        user.userId &&
        <>
          <Link className={styles.serviceLink} to={`/account`}>
            <div id={styles.user}>
              <img id={styles.userImage} src={userImage || "/user.png"} alt="user" onError={handleImageError} />
              <span id={styles.userName} ref={accountWidgetRef}> {user.username} </span>
            </div>
          </Link>
          {
            <div id={styles.servicesList}>
              <Text fontSize={"md"} fontWeight={"700"} sx={{ marginTop: '15px', marginBottom: "5px" }}>
                Linked services
              </Text>
              {
                !user.spotifyAccount?.spotifyId &&
                <div className={styles.servicesPrompt} >
                  <span> Navigate to your <Link to={`/account`} className={styles.accountLink}>account settings</Link> to link services </span>
                </div>
              }
              {
                user.spotifyAccount?.spotifyId &&
                <Link className={styles.serviceLink} to={`/linked-services/spotify`}>
                  <div className={styles.serviceButton}><img className={styles.spotifyIcon} src='/icons/spotify_icon.png' alt='spotify'></img><span> Spotify </span></div>
                </Link>
              }
            </div>
          }
          <div className={styles.folderBoxListWrapper}>
            <Text fontSize={"md"} fontWeight={"700"} sx={{ marginTop: '15px', marginBottom: "5px" }}>
              Your boxes
            </Text>
            <AppDndContext onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd} sensors={sensors}>
              <div className={styles.folderList}>
                {!!sortedFolders.length && sortedFolders.map(folder => {
                  return (
                    <SidebarFolder folder={folder} key={folder.folderId} isDraggingOver={folder.folderId === dragOverFolder} />
                  )
                })}
              </div>
              <SidebarBoxList boxes={userDashboardBoxes} isDraggingOver={dragOverFolder === 'boxList'} />
              <DragOverlay>
                {activeDraggable ? <div id={activeDraggable.id}> {activeDraggable.name} </div> : null}
              </DragOverlay>
            </AppDndContext>
          </div>
        </>
      }
    </div>
  )
}

export default Sidebar;