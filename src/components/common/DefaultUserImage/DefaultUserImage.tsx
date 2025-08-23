import styles from './DefaultUserImage.module.css';

interface DefaultUserImageProps {
  width?: number;
}

const DefaultUserImage = ({ width }: DefaultUserImageProps) => {
  return (
    <div
      className={styles.container}
      style={{
        width: width ? `${width}px` : '100%',
        height: width ? `${width}px` : '100%',
      }}
    >
      <img src="/icons/user.svg" alt="Default User" className={styles.icon} />
    </div>
  );
};

export default DefaultUserImage;