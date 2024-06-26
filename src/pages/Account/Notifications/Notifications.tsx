import styles from './Notifications.module.css'
import { Box, Text } from '@chakra-ui/react';

const Notifications = () => {

  return (
    <Box display={'flex'} flexDirection={'column'} width={'100%'} height={'100%'}>
      <Text className={styles.mobileTitle} fontWeight={700} marginBottom={'20px'}> Notifications </Text>
      <Box className={styles.smallText} width={'100%'} height={'100%'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
        No notifications to enable
      </Box>
    </Box>

  );
};

export default Notifications;