import { Placement } from "@popperjs/core";
import { ReactElement, RefObject, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { usePopper } from "react-popper";
import componentStyles from "./PopperMenu.module.css";

interface PopperMenuProps {
  referenceRef: RefObject<HTMLElement>
  placement: Placement
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  children: ReactElement
}

function createWrapperAndAppendToBody() {
  const wrapperElement = document.createElement('div');
  wrapperElement.setAttribute("id", 'popper');
  document.body.appendChild(wrapperElement);
  return wrapperElement;
}

const PopperMenu = ({ referenceRef, placement, isOpen, setIsOpen, children }: PopperMenuProps) => {
  const { menuPanel, hidden } = componentStyles;

  const popperRef = useRef<HTMLDivElement>(null);
  let containerEl = document.getElementById('popper');
  if (!containerEl) {
    containerEl = createWrapperAndAppendToBody();
  }

  const { styles, attributes } = usePopper(
    referenceRef.current,
    popperRef.current,
    {
      placement: placement,
      modifiers: [
        {
          name: "offset",
          enabled: true,
          options: {
            offset: [0, 10]
          }
        }
      ]
    }
  );

  useEffect(() => {
    // listen for clicks and close dropdown on body
    document.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  function handleDocumentClick(event: MouseEvent) {
    if (popperRef.current!.contains(event.target as Node)) {
      return;
    }
    setIsOpen(false);
  }

  return (
    <>
      {ReactDOM.createPortal(
        <div ref={popperRef} style={styles.popper} {...attributes.popper} className={isOpen ? menuPanel : hidden}>
          <div style={styles.offset}>
            {children}
          </div>
        </div>,
        containerEl
      )}
    </>
  );
};

export default PopperMenu;