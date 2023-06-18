import { ReactNode, useState } from 'react';
import styles from "./ResizablePane.module.css";
import { useAppSelector } from 'core/hooks/useAppSelector';

interface ResizablePaneProps {
  leftContent: ReactNode;
  rightContent: ReactNode;
}

function ResizablePane({ leftContent, rightContent }: ResizablePaneProps) {
  const isLoggedIn = useAppSelector(state => state.userData.isUserLoggedIn);
  const [leftWidth, setLeftWidth] = useState(200);

  const handleDrag = (event: MouseEvent): void => {
    event.preventDefault();
    const newWidth = event.clientX;
    if (newWidth > 150 && newWidth < 350) {
      setLeftWidth(newWidth);
    }
  };

  return (
    <div className={styles.frame}>
      {
        isLoggedIn &&
        <div className={styles.leftContent} style={{ width: leftWidth }}>
        {leftContent}
      </div>
      }
      <div
        className={styles.sliderEdge}
        onMouseDown={(event) => {
          document.addEventListener('mousemove', handleDrag);
          document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', handleDrag);
          });
        }}
      />
      <div className={styles.rightContent} >
        {rightContent}
      </div>
    </div>
  );
}

export default ResizablePane;