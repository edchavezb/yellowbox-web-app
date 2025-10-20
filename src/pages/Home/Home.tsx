import styles from "./Home.module.css"
import { withRouter } from "react-router-dom";
import { useAppSelector } from "core/hooks/useAppSelector";
import FolderTile from "components/common/FolderTile/FolderTile";
import BoxTile from "components/common/BoxTile/BoxTile";
import { Button, IconButton, Text } from '@chakra-ui/react'
import { useEffect, useState } from "react";
import { getActivityFeedApi } from "core/api/users";
import { FeedActivity } from "core/types/interfaces";
import ActivityFeed from "./ActivityFeed/ActivityFeed";

function Home() {
  const isLoggedIn = useAppSelector(state => state.userData.isUserLoggedIn);
  const userFolders = useAppSelector(state => state.userFoldersData.folders);
  const [activities, setActivities] = useState<FeedActivity[]>([]);
  const [isActivityLoading, setIsActivityLoading] = useState(false);
  const [showActivityFeed, setShowActivityFeed] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!isLoggedIn) return;

      setIsActivityLoading(true);
      try {
        const { activities: activityData } = await getActivityFeedApi();
        setActivities(activityData);
      } catch (error) {
        console.error('Error fetching activity:', error);
      } finally {
        setIsActivityLoading(false);
      }
    };

    fetchActivity();
  }, [isLoggedIn, showActivityFeed]);

  const sortedFolders = [...userFolders].sort((folderA, folderB) => {
    if (folderA.name > folderB.name) return 1
    if (folderA.name < folderB.name) return -1
    else {
      return 0
    }
  })
  const dashboardBoxes = useAppSelector(state => state.userBoxesData.dashboardBoxes);

  if (isLoggedIn) {
    return (
      <div className={styles.homeContainer}>
        <Text fontSize={"2xl"} fontWeight={"700"} marginTop={'5px'} marginBottom={'30px'}> Home </Text>
        <div style={{ marginTop: '5px' }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Text
              fontSize={"xl"}
              fontWeight={"700"}
              color={!showActivityFeed ? "inherit" : "gray.500"}
              cursor="pointer"
              onClick={() => setShowActivityFeed(false)}
            >
              My Collection
            </Text>
            <Text
              fontSize={"xl"}
              fontWeight={"700"}
              color={showActivityFeed ? "inherit" : "gray.500"}
              cursor="pointer"
              onClick={() => setShowActivityFeed(true)}
            >
              Feed
            </Text>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '32px', marginTop: '10px', position: 'relative' }}>
          {!showActivityFeed ? (
            <div style={{ flex: '1 1 auto', marginTop:"15px" }}>
              <div className={styles.folderList}>
                {!!sortedFolders.length &&
                  sortedFolders.map(folder => {
                    return (
                      <FolderTile folder={folder} />
                    )
                  })
                }
                {
                  !!dashboardBoxes.length &&
                  dashboardBoxes.map(box => {
                    return (
                      <BoxTile box={box} displayUser={false} />
                    )
                  })
                }
              </div>
            </div>
          ) : (
            <div style={{ flex: '1 1 auto', margin: '0 auto' }}>
              <ActivityFeed activities={activities} isLoading={isActivityLoading} />
            </div>
          )}
        </div>
      </div>
    );
  }
  else if (isLoggedIn === false) {
    return (
      <div className={styles.homeContainer}>
        <Text fontSize={"xl"} fontWeight={"700"}> Welcome to Yellowbox, please log in or create an account </Text>
      </div>
    );
  }

  return (
    <></>
  )
}

export default withRouter(Home);