import { Box, Text, Button } from '@chakra-ui/react';
import styles from './ContextSearchResult.module.css';

interface ContextSearchResultProps {
  imageUrl: string;
  name: string;
  owner: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const ContextSearchResult = ({ imageUrl, name, owner, buttonText, onButtonClick }: ContextSearchResultProps) => {
  return (
    <div className={styles.resultRow}>
      <img 
        src={imageUrl} 
        alt={name}
        className={styles.itemImage}
      />
      <div className={styles.contentContainer}>
        <Text 
          fontSize="sm" 
          fontWeight="600" 
          noOfLines={1}
        >
          {name}
        </Text>
        <Text 
          fontSize="xs" 
          noOfLines={1}
        >
          {owner}
        </Text>
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