import GridView from "../components/box-views/GridView"
import styles from "./SearchResults.module.css";

function SearchResults(data, type, toggleModal) {

  return (
    <div className={styles.resultsSection}>
      <h3> {type} </h3>
      <GridView data={data} page="search" customSorting={false} toggleModal={toggleModal} boxId={undefined} />
    </div>
  )
}

export default SearchResults;