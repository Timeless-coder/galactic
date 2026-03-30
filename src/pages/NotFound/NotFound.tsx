import { Link } from 'react-router'

import styles from './NotFound.module.scss'

const NotFound = () => {
  return ( 
    <div className={styles.notFoundContainer}>
      <div className={styles.notFoundText}>
        <h2>Of the countless universes and timelines you could have explored...you chose one that does not exist.</h2>
        <br />
        <h2>But we can see your planet from here.</h2>
        <br />
        <Link className={styles.link} to='/'>Home</Link>
      </div>
    </div>
   );
}
 
export default NotFound;

// <a href='https://www.freepik.com/vectors/business'>Business vector created by pikisuperstar - www.freepik.com</a>