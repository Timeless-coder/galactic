import { Link } from 'react-router'

import styles from './NotFound.module.scss'

const NotFound = () => {
  return (
    <main className={styles.notFoundContainer} aria-labelledby="notfound-title">
      <section className={styles.notFoundText}>
        <header>
          <h1 id="notfound-title">Page Not Found</h1>
        </header>
        <h2>Of the countless universes and timelines you could have explored...you chose one that does not exist.</h2>
        <br />
        <h2>But we can see your planet from here.</h2>
        <br />
        <Link className={styles.link} to='/'>Home</Link>
      </section>
    </main>
  );
}
 
export default NotFound;

// <a href='https://www.freepik.com/vectors/business'>Business vector created by pikisuperstar - www.freepik.com</a>