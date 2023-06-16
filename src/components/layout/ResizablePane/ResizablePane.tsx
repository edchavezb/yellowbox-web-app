import { ReactNode, useState } from 'react';
import styles from "./ResizablePane.module.css";

interface ResizablePaneProps {
  leftContent: ReactNode;
  rightContent: ReactNode;
}

function ResizablePane({ leftContent, rightContent }: ResizablePaneProps) {
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
      <div className={styles.leftContent} style={{ width: leftWidth }}>
        {leftContent}
      </div>
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