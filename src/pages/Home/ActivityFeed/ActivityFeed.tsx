import { Box } from '@chakra-ui/react';
import { FeedActivity } from 'core/types/interfaces';
import UserFeedRow from './UserFeedRow/UserFeedRow';

interface ActivityFeedProps {
  activities: FeedActivity[];
  isLoading: boolean;
}

const ActivityFeed = ({ activities, isLoading }: ActivityFeedProps) => {
  return (
    <Box>
      {isLoading ? (
        <p></p>
      ) : activities.length > 0 ? (
        <Box>
          {activities.map((activity: FeedActivity, index: number) => (
            <UserFeedRow key={index} activity={activity} />
          ))}
        </Box>
      ) : (
        <Box textAlign="center" color="gray.500" py={8}>
          No recent activity from users or boxes you follow
        </Box>
      )}
    </Box>
  );
};

export default ActivityFeed;
