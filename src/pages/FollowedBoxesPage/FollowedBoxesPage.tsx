import styles from "./FollowedBoxesPage.module.css";
import FollowedBoxes from "./FollowedBoxes/FollowedBoxes";
import { useAppSelector } from "core/hooks/useAppSelector";
import { useEffect, useState } from "react";
import { FollowedBox } from "core/types/interfaces";
import { getFollowedBoxesDataApi } from "core/api/users";

interface FollowedData {
  followedBoxes: FollowedBox[],
}

function FollowedBoxesPage() {
  const isLoggedIn = useAppSelector(state => state.userData.isUserLoggedIn);
  const [followedData, setFollowedData] = useState<FollowedData>({
    followedBoxes: [],
  });

  useEffect(() => {
    const fetchFollowedData = async () => {
      const data = await getFollowedBoxesDataApi();
      setFollowedData(data);
    };
    fetchFollowedData();
  }
  , []);

  if(isLoggedIn === false) {
    return (
      <div className={styles.homeContainer}>
        <p>Welcome to Yellowbox, please log in or create an account</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
     <FollowedBoxes followedBoxes={followedData.followedBoxes} />
    </div>
  );
}

export default FollowedBoxesPage;