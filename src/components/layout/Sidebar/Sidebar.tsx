import { fetchDashboardBoxes, fetchUserBoxes, reorderDashboardBoxesThunk } from "core/features/userBoxes/userBoxesSlice";
import { addBoxToFolderThunk, fetchDashboardFolders, moveBoxBetweenFoldersThunk, removeBoxFromFolderThunk, reorderSidebarFolderBoxesThunk } from "core/features/userFolders/userFoldersSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { useAppSelector } from "core/hooks/useAppSelector";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { YellowboxUser } from "core/types/interfaces";
import styles from "./Sidebar.module.css";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import SidebarFolder from "./SidebarFolder/SidebarFolder";
import SidebarBoxList from "./SidebarBoxList/SidebarBoxList";
import { DndContextTypesafeProps, DragEndEvent, DragOverEvent, DragStartEvent } from "./sidebarTypes";
import AccountMenu from "components/menus/popper/AccountMenu/AccountMenu";
import PopperMenu from "components/menus/popper/PopperMenu";

interface IProps {
  user: YellowboxUser
}

export function AppDndContext(props: DndContextTypesafeProps) {
  return <DndContext {...props} />;
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
  const accountWidgetRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    if (user?._id) {
      dispatch(fetchDashboardFolders(user.dashboardFolders!))
      dispatch(fetchDashboardBoxes(user.dashboardBoxes!))
      dispatch(fetchUserBoxes(user._id!))
    }
  }, [user, dispatch])

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
            dispatch(reorderDashboardBoxesThunk(activeSortable.index, targetSortable.index))
          }
          else {
            dispatch(reorderSidebarFolderBoxesThunk(activeSortable?.containerId as string, activeSortable.index, targetSortable.index))
          }
        }
        else if (targetSortable.containerId === 'boxList') {
          // Remove from folder
          dispatch(removeBoxFromFolderThunk(activeSortable?.containerId! as string, active.id as string, boxName!))
        }
        else {
          if (activeSortable?.containerId === 'boxList' && boxName) {
            // Add to folder
            dispatch(addBoxToFolderThunk(targetSortable.containerId as string, active.id as string, boxName))
          }
          else {
            // Move between folders
            dispatch(moveBoxBetweenFoldersThunk(activeSortable?.containerId as string, targetSortable.containerId as string, active.id as string, boxName!))
          }
        }
      }
      else if (over.id === 'boxList') {
        // Remove from folder
        dispatch(removeBoxFromFolderThunk(activeSortable?.containerId! as string, active.id as string, boxName!))
      }
      else {
        if (activeSortable?.containerId === 'boxList' && boxName) {
          // Add to folder
          dispatch(addBoxToFolderThunk(over.id as string, active.id as string, boxName))
        }
        else {
          // Move between folders
          dispatch(moveBoxBetweenFoldersThunk(activeSortable?.containerId as string, over.id as string, active.id as string, boxName!))
        }
      }
    }
    setActiveDraggable(null);
    setDragOverFolder(null);
  }

  return (
    <div id={styles.mainPanel}>
      {
        user._id &&
        <>
          <div id={styles.user} onClick={() => setIsMenuOpen(true)}>
            <img id={styles.userImage} src={user.image ? user.image : "/user.png"} alt="user" />
            <span id={styles.userName} ref={accountWidgetRef}> {user.displayName} </span>
          </div>
          <div id={styles.servicesList}>
            <h4 className={styles.sectionTitle}> Your Services </h4>
            <Link className={styles.serviceLink} to={`/myaccounts/spotify`}>
              <div className={styles.serviceButton}><img className={styles.spotifyIcon} src='/icons/spotify_icon.png' alt='spotify'></img><span> Spotify </span></div>
            </Link>
          </div>
          <div id={styles.boxList}>
            <h4 className={styles.sectionTitle}> Your Boxes </h4>
            <AppDndContext onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd} sensors={sensors}>
              <div className={styles.folderList}>
                {!!sortedFolders.length && sortedFolders.map(folder => {
                  return (
                    <SidebarFolder folder={folder} key={folder._id} isDraggingOver={folder._id === dragOverFolder} />
                  )
                })}
              </div>
              <SidebarBoxList boxes={userDashboardBoxes} isDraggingOver={dragOverFolder === 'boxList'} />
              <DragOverlay>
                {activeDraggable ? <div id={activeDraggable.id}> {activeDraggable.name} </div> : null}
              </DragOverlay>
            </AppDndContext>
          </div>
          <PopperMenu referenceRef={accountWidgetRef} placement={'right'} isOpen={isMenuOpen} setIsOpen={setIsMenuOpen}>
            <AccountMenu setIsOpen={setIsMenuOpen} />
          </PopperMenu>
        </>
      }
    </div>
  )
}

export default Sidebar;