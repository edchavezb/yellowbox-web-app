import styles from "./PageSwitcher.module.css"

interface PageSwitcherProps {
  pageNumber: number
  decrementHandler: () => void
  incrementHandler: () => void
  hasNext: boolean
  hasPrevious: boolean
}

const PageSwitcher = ({ pageNumber, decrementHandler, incrementHandler, hasNext, hasPrevious }: PageSwitcherProps) => {

  return (
    <div className={styles.switcherWrapper}>
      <div className={styles.pageNumberPanel}>
        <span className={styles.pageNumber}>Page {pageNumber}</span>
      </div>
      <div className={hasPrevious ? styles.switcherButton : styles.switcherButtonDisabled} onClick={decrementHandler}>
        <img
          className={styles.chevronIcon}
          src="/icons/chevronleft.svg"
          alt="previous page">
        </img>
      </div>
      <div className={hasNext ? styles.switcherButton : styles.switcherButtonDisabled} onClick={incrementHandler}>
        <img
          className={styles.chevronIcon}
          src="/icons/chevronright.svg"
          alt="next page">
        </img>
      </div>
    </div>
  )
}

export default PageSwitcher;