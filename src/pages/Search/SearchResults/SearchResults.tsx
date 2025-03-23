import GridView from "components/box-views/GridView/GridView"
import styles from "./SearchResults.module.css";
import { Album, Artist, Playlist, Track } from 'core/types/interfaces';
import { Text } from '@chakra-ui/react'

interface IProps<T> {
	data: T[]
  type: string
}

function SearchResults<T extends Artist | Album | Track | Playlist>({data, type}: IProps<T>) {

  return (
    <div className={styles.resultsSection}>
      <Text fontSize={"md"} fontWeight={"700"} sx={{marginTop: '20px', marginBottom: "10px"}}> {`${type}`} </Text>
      <GridView<T> data={data} isSearch />
    </div>
  )
}

export default SearchResults;