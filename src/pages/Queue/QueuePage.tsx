import { useAppSelector } from 'core/hooks/useAppSelector';
import { useEffect, useRef, useState } from 'react';
import styles from "./QueuePage.module.css";
import { Text } from '@chakra-ui/react'
import Queue from 'components/box-views/Queue/Queue';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { fetchUserQueueThunk } from 'core/features/userQueue/userQueueSlice';

const QueuePage = () => {
  const menuToggleRef = useRef(null);
  const dispatch = useAppDispatch();
  const userData = useAppSelector(state => state.userData);
  const queueData = useAppSelector(state => state.userQueueData.userQueue);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isBoxMenuOpen, setIsBoxMenuOpen] = useState(false);
  const [isReorderingMode, setIsReorderingMode] = useState(false);

  const { authenticatedUser, isUserLoggedIn } = userData;

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        if (!isUserLoggedIn) {
          throw new Error('User not logged in');
        }
        await dispatch(fetchUserQueueThunk(authenticatedUser.userId));
      } catch (err) {
        setError('Failed to fetch queue');
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchQueue();
  }, [authenticatedUser, dispatch])


  if (loading) {
    return <div></div>;
  }

  if (error) {
    return (
      <div id={styles.mainPanel}>
        <div>{error}</div>
      </div>
    )
  }

  return (
    <>
      {
        isUserLoggedIn !== null &&
        <div id={styles.mainPanel}>
          <div className={styles.boxHeader}>
            <div className={styles.boxSquare}>
              <img className={styles.boxIcon} src="/icons/library.svg" alt="box" />
            </div>
            <div className={styles.boxInfo}>
              <Text fontSize={"2xl"} fontWeight={"700"}> {"Your library queue"} </Text>
              <div id={styles.boxDesc}>
                {"What do you want to play next?"}
              </div>
            </div>
            <div className={styles.menuButtonWrapper}>
              <div className={styles.toggleButton} onClick={() => setIsReorderingMode(!isReorderingMode)}>
                {`Reordering: ${isReorderingMode ? 'On' : 'Off'}`}
              </div>
            </div>
          </div>
          {!!queueData.length &&
            <Queue data={queueData} isReorderingMode={isReorderingMode} />
          }
          {
            (queueData.length === 0 && !loading) &&
            <div id={styles.emptyMsgDiv}>
              <Text fontSize={"lg"} fontWeight={"700"} sx={{ marginTop: '10px', marginBottom: "20px", textAlign: "center" }}>
                You have not added any items to your queue yet. <br /> Start by searching some music you like!
              </Text>
            </div>
          }
        </div>
      }
    </>
  )
};

export default QueuePage;