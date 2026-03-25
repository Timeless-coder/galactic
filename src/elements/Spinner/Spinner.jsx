import { IoRocketOutline } from 'react-icons/io5'
import styles from './Spinner.module.scss'

const Spinner = () => (
  <>
  <div className={`${styles.loader} ${styles.loaderWhite}`} >
  <div className={styles.loaderSpined} >
    <div className={styles.loaderIcon}>
    <IoRocketOutline className={`${styles.offset45deg}`}></IoRocketOutline>
    </div>
  </div>  
  <div className={styles.pufs}>
    <i></i><i></i><i></i>
    <i></i><i></i><i></i>
    <i></i><i></i><i></i>
    <i></i><i></i><i></i>
    <i></i><i></i><i></i>
    <i></i><i></i><i></i>
    <i></i><i></i><i></i>
    <i></i><i></i><i></i>
    <i></i><i></i><i></i>
    <i></i><i></i><i></i>
    <i></i><i></i><i></i>
    <i></i><i></i><i></i>
    <i></i><i></i><i></i>
    <i></i><i></i><i></i>
    <i></i><i></i><i></i>
  </div>
  <div className={styles.particles}>
    <i></i><i></i><i></i>
    <i></i><i></i><i></i>
    <i></i><i></i><i></i>
    <i></i><i></i><i></i>
    <i></i><i></i><i></i>
    <i></i><i></i><i></i>
    <i></i><i></i><i></i>
    <i></i><i></i><i></i>
    <i></i><i></i><i></i>
    <i></i><i></i><i></i>
    <i></i><i></i><i></i>
    <i></i><i></i><i></i>
    <i></i><i></i><i></i>
    <i></i><i></i><i></i>
    <i></i><i></i><i></i>
  </div>
  </div>
  </>
);

export default Spinner;
