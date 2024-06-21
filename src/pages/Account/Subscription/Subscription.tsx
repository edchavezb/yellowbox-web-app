import { useAppSelector } from 'core/hooks/useAppSelector';
import styles from './Subscription.module.css'
import { Box, Text } from '@chakra-ui/react';
import AppButton from 'components/styled/AppButton/AppButton';

const Subscription = () => {
  const user = useAppSelector(state => state.userData.authenticatedUser);

  const handleUpgradeAccount = () => {

  }

  return (
    <Box className={styles.container}>
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} width={'100%'}>
        <div className={styles.userWrapper}>
          <img className={styles.ybxIconSmall} src='/ideogram.png' alt='yellowbox'></img>
          <Box>
            <Text className={styles.smallText} fontSize={'sm'} fontWeight={'300'}> CURRENT SUBSCRIPTION </Text>
            <Text className={styles.userName} fontSize={'md'} fontWeight={'700'}> Your account is on the {user?.account.accountTier} plan </Text>
          </Box>
        </div>
        <AppButton disabled text={user?.account.accountTier === 'free' ? 'Upgrade to Pro' : 'Manage Subscription'} onClick={handleUpgradeAccount} />
      </Box>
    </Box>
  );
};

export default Subscription;