import { Box, Text, Image } from '@chakra-ui/react';
import { Link } from "react-router-dom"
import { FeedActivity } from 'core/types/interfaces';
import styles from './UserFeedRow.module.css';
import { useAppSelector } from 'core/hooks/useAppSelector';

interface UserFeedRowProps {
  activity: FeedActivity;
}

const UserFeedRow = ({ activity }: UserFeedRowProps) => {
  const currentUser = useAppSelector(state => state.userData.authenticatedUser);

  const renderActivityMessage = () => {

    switch (activity.type) {
      case 'USER_FOLLOW':
        return activity.followedUser && (
          <Text fontSize="15px">
            <Link to={`user/${activity.actor.username}`}><Text as="span" fontWeight="bold">{activity.actor.username}</Text></Link>
            {' started following '}
            <Link to={`user/${activity.followedUser.username}`}>
              <Text as="span" fontWeight="bold">
                {currentUser.username === activity.followedUser.username ? 'you' : activity.followedUser.username}
              </Text>
            </Link>
            <Text as="span" color="gray" fontSize="sm" ml={2}>{new Date(activity.timestamp).toLocaleDateString()}</Text>
          </Text>
        );
      case 'BOX_FOLLOW':
        return activity.box && (
          <Text fontSize="15px">
            <Link to={`user/${activity.actor.username}`}><Text as="span" fontWeight="bold">{activity.actor.username}</Text></Link>
            {' added a box to their favorites: '}
            <Link to={`box/${activity.box.boxId}`}>
              <Text as="span" fontWeight="bold">
                {activity.box.name}
              </Text>
            </Link>
            <Text as="span" color="gray" fontSize="sm" ml={2}>{new Date(activity.timestamp).toLocaleDateString()}</Text>
          </Text>
        );
      case 'BOX_CREATE':
        return activity.box && (
          <Text fontSize="15px">
            <Link to={`user/${activity.actor.username}`}><Text as="span" fontWeight="bold">{activity.actor.username}</Text></Link>
            {' created a new box: '}
            <Link to={`box/${activity.box.boxId}`}>
              <Text as="span" fontWeight="bold">
                {activity.box.name}
              </Text>
            </Link>
            <Text as="span" color="gray" fontSize="sm" ml={2}>{new Date(activity.timestamp).toLocaleDateString()}</Text>
          </Text>
        );
      case 'BIO_UPDATE':
        return (
          <Text fontSize="15px">
            <Link to={`user/${activity.actor.username}`}><Text as="span" fontWeight="bold">{activity.actor.username}</Text></Link>
            {' updated their bio'}
            <Text as="span" color="gray" fontSize="sm" ml={2}>{new Date(activity.timestamp).toLocaleDateString()}</Text>
          </Text>
        );
      case 'IMAGE_UPDATE':
        return (
          <Text fontSize="15px">
            <Link to={`user/${activity.actor.username}`}><Text as="span" fontWeight="bold">{activity.actor.username}</Text></Link>
            {' updated their profile image'}
            <Text as="span" color="gray" fontSize="sm" ml={2}>{new Date(activity.timestamp).toLocaleDateString()}</Text>
          </Text>
        );
      case 'TOP_ALBUM_UPDATE':
        return (
          <Text fontSize="15px">
            <Link to={`user/${activity.actor.username}`}><Text as="span" fontWeight="bold">{activity.actor.username}</Text></Link>
            {` added `}
            <Link to={`detail/${activity.itemType}/${activity.item?.spotifyId}`}>
              <Text as="span" fontWeight="bold">
                {activity.item?.name}
              </Text>
            </Link>
            {` to their highlighted albums`}
            <Text as="span" color="gray" fontSize="sm" ml={2}>{new Date(activity.timestamp).toLocaleDateString()}</Text>
          </Text>
        );
      case 'BOX_ITEM_ADD':
        return (
          <Text fontSize="15px">
            <Link to={`user/${activity.actor.username}`}><Text as="span" fontWeight="bold">{activity.actor.username}</Text></Link>
            {` added `}
            <Link to={`detail/${activity.itemType}/${activity.item?.spotifyId}`}>
              <Text as="span" fontWeight="bold">
                {activity.item?.name}
              </Text>
            </Link>
            <Text as="span">{` to ${activity.itemType}s in `}</Text>
            <Link to={`box/${activity.box?.boxId}`}>
              <Text as="span" fontWeight="bold">
                {activity.box?.name}
              </Text>
            </Link>
            <Text as="span" color="gray" fontSize="sm" ml={2}>{new Date(activity.timestamp).toLocaleDateString()}</Text>
          </Text>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.rowContainer}>
      <Box
        width="40px"
        height="40px"
        borderRadius="full"
        overflow="hidden"
        flexShrink={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={activity.type === 'BOX_ITEM_ADD' ? 'gray.600' : undefined}
      >
        {activity.type === 'BOX_ITEM_ADD' ? (
          <img src="/icons/heart-outline.svg" alt="Add to box" style={{ width: '20px', height: '20px' }} />
        ) : (
          <Image
            src={activity.actor.imageUrl || '/icons/user.svg'}
            alt={activity.actor.username}
            width="100%"
            height="100%"
            objectFit="cover"
          />
        )}
      </Box>
      <div className={styles.contentContainer}>
        {renderActivityMessage()}
      </div>
    </div>
  );
};

export default UserFeedRow;
