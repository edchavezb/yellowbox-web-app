import { Box, Text, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { getUri } from 'core/helpers/itemDataHandlers';
import styles from './ContextSearchResult.module.css';

interface ContextSearchResultProps {
  imageUrl: string;
  name: string;
  itemId: string;
  owner?: string;
  ownerId?: string;
  buttonText?: string;
  itemType?: string;
  onButtonClick?: () => void;
}

const ContextSearchResult = ({ imageUrl, name, owner, ownerId, itemId, buttonText, itemType, onButtonClick }: ContextSearchResultProps) => {
  const renderName = () => {
    if (itemType && itemId) {
      return (
        <Link to={`/detail/${itemType}/${itemId}`} className={styles.itemLink}>
          <Text fontSize="sm" fontWeight="600" noOfLines={1}>{name}</Text>
        </Link>
      );
    }
    return (
      <Text fontSize="sm" fontWeight="600" noOfLines={1}>{name}</Text>
    );
  };

  const renderOwner = () => {
    if (!owner) return null;
    if (itemType === 'track' || itemType === 'album') {
      if (ownerId) {
        return (
          <Link to={`/detail/artist/${ownerId}`} className={styles.ownerLink}><Text fontSize="xs" noOfLines={1}>{owner}</Text></Link>
        );
      }
    }
    if (itemType === 'playlist') {
      if (ownerId) {
        return (
          <a href={getUri('user', ownerId)} target="_blank" rel="noopener noreferrer" className={styles.ownerLink}><Text fontSize="xs" noOfLines={1}>{owner}</Text></a>
        );
      }
    }
    return <Text fontSize="xs" noOfLines={1}>{owner}</Text>;
  };
  return (
    <div className={styles.resultRow}>
      {itemType && itemId ? (
        <Link to={`/detail/${itemType}/${itemId}`} className={styles.itemLink}>
          <img
            src={imageUrl}
            alt={name}
            className={styles.itemImage}
          />
        </Link>
      ) : (
        <img
          src={imageUrl}
          alt={name}
          className={styles.itemImage}
        />
      )}
      <div className={styles.contentContainer}>
        {renderName()}
        {renderOwner()}
      </div>
      {buttonText && onButtonClick && (
        <Button
          size="sm"
          onClick={onButtonClick}
          flexShrink={0}
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default ContextSearchResult;