import styles from './Notifications.module.css'
import { Box } from '@chakra-ui/react';

const Notifications = () => {

  return (
    <Box className={styles.smallText} width={'100%'} height={'100%'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
      No notifications to enable
    </Box>
  );
};

export default Notifications;