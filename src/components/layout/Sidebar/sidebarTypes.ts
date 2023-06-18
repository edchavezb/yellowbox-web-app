import { Active, Over, Collision, Translate, DndContextProps, DndContext } from "@dnd-kit/core";
import { AppSortableData } from "./SidebarBox/SidebarBox";

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
