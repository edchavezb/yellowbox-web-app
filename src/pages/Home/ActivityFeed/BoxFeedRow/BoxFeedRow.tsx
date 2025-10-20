import { Text } from '@chakra-ui/react';
import { FeedActivity } from 'core/types/interfaces';
import styles from './BoxFeedRow.module.css';

interface UserFeedRowProps {
  activity: FeedActivity;
}

const UserFeedRow = ({ activity }: UserFeedRowProps) => {
  const getDisplayName = (actor: FeedActivity['actor']) => {
    return (actor.firstName || actor.lastName)
      ? `${actor.firstName || ''} ${actor.lastName || ''}`.trim()
      : actor.username;
  };

  const renderActivityMessage = () => {
    const actorName = getDisplayName(activity.actor);

    switch (activity.type) {
      case 'USER_FOLLOW':
        return activity.followedUser && (
          <>
            <strong>{actorName}</strong>
            <span> started following </span>
            <strong>{getDisplayName(activity.followedUser)}</strong>
          </>
        );
      case 'BOX_FOLLOW':
        return activity.box && (
          <>
            <strong>{actorName}</strong>
            <span> followed box </span>
            <strong>{activity.box.name}</strong>
          </>
        );
      case 'BOX_CREATE':
        return activity.box && (
          <>
            <strong>{actorName}</strong>
            <span> created a new box: </span>
            <strong>{activity.box.name}</strong>
          </>
        );
      case 'BIO_UPDATE':
        return (
          <>
            <strong>{actorName}</strong>
            <span> updated their bio</span>
          </>
        );
      case 'IMAGE_UPDATE':
        return (
          <>
            <strong>{actorName}</strong>
            <span> updated their profile image</span>
          </>
        );
      case 'TOP_ALBUM_UPDATE':
        return (
          <>
            <strong>{actorName}</strong>
            <span> updated their top albums</span>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.rowContainer}>
      {renderActivityMessage()}
      <Text as="span" color="gray" fontSize="sm" marginLeft={2}>
        {new Date(activity.timestamp).toLocaleDateString()}
      </Text>
    </div>
  );
};

export default UserFeedRow;
