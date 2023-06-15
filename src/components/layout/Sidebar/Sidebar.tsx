import { fetchDashboardBoxes, fetchUserBoxes, reorderDashboardBoxesThunk } from "core/features/userBoxes/userBoxesSlice";
import { addBoxToFolderThunk, fetchDashboardFolders, moveBoxBetweenFoldersThunk, removeBoxFromFolderThunk, reorderFolderBoxesThunk } from "core/features/userFolders/userFoldersSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { useAppSelector } from "core/hooks/useAppSelector";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SpotifyLoginData, YellowboxUser } from "core/types/interfaces";
import styles from "./Sidebar.module.css";
import { Active, DndContext, DragOverlay, Over, PointerSensor, useDroppable, useSensor, useSensors, DndContextProps, Translate, Collision } from "@dnd-kit/core";
import SidebarFolder from "./SidebarFolder/SidebarFolder";
import SidebarBox, { AppSortableData } from "./SidebarBox/SidebarBox";
import { SortableContext } from "@dnd-kit/sortable";
import SidebarBoxList from "./SidebarBoxList/SidebarBoxList";
import { reorderBoxItemsThunk } from "core/features/currentBoxDetail/currentBoxDetailSlice";

interface IProps {
  user: YellowboxUser
  login: SpotifyLoginData
}

interface AppActive extends Omit<Active, "data"> {
  data: React.MutableRefObject<AppSortableData | undefined>;
}

interface AppOver extends Omit<Over, "data"> {
  data: React.MutableRefObject<AppSortableData | undefined>;
}

interface DragEvent {
  activatorEvent: Event;
  active: AppActive;
  collisions: Collision[] | null;
  delta: Translate;
  over: AppOver | null;
}

export interface DragStartEvent extends Pick<DragEvent, "active"> { }
export interface DragMoveEvent extends DragEvent { }
export interface DragOverEvent extends DragMoveEvent { }
export interface DragEndEvent extends DragEvent { }
export interface DragCancelEvent extends DragEndEvent { }
export interface DndContextTypesafeProps extends Omit<
  DndContextProps,
  "onDragStart" | "onDragMove" | "onDragOver" | "onDragEnd" | "onDragCancel"
> {
  onDragStart?(event: DragStartEvent): void;
  onDragMove?(event: DragEvent): void;
  onDragOver?(event: DragEvent): void;
  onDragEnd?(event: DragEvent): void;
  onDragCancel?(event: DragEvent): void;
}
export function AppDndContext(props: DndContextTypesafeProps) {
  return <DndContext {...props} />;
}

function Sidebar({ user, login }: IProps) {
  const dispatch = useAppDispatch();
  const userFolders = useAppSelector(state => state.userFoldersData.folders)
  const userDashboardBoxes = useAppSelector(state => state.userBoxesData.dashboardBoxes)
  const [activeDraggable, setActiveDraggable] = useState<null | {name: string, id: string}>(null);
  const [dragOverFolder, setDragOverFolder] = useState<null | string>(null);
  const { isOver, setNodeRef } = useDroppable({
    id: 'boxList',
  });
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
  }, [user])

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveDraggable({name: active.data.current?.name!, id: active.id as string});
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
          // Reorder
          if (targetSortable.containerId === 'boxList') {
            dispatch(reorderDashboardBoxesThunk(activeSortable.index, targetSortable.index))
          } 
          else {
            dispatch(reorderFolderBoxesThunk(activeSortable?.containerId as string, activeSortable.index, targetSortable.index))
          }
        }
        else if (targetSortable.containerId === 'boxList') {
          // Remove from folder
          dispatch(removeBoxFromFolderThunk(activeSortable?.containerId! as string, active.id as string))
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
        dispatch(removeBoxFromFolderThunk(activeSortable?.containerId! as string, active.id as string))
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
        login.auth.code &&
        <>
          <div id={styles.user}>
            <img id={styles.userImage} src={login.userData.image ? login.userData.image : "/user.png"} alt="user" />
            <span id={styles.userName}> {login.userData.displayName} </span>
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
                {!!userFolders.length && userFolders.map(folder => {
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
        </>
      }
    </div>
  )
}

export default Sidebar;