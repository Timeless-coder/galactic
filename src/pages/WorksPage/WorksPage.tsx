import HowThisWorks from '../../components/HowThisWorks/HowThisWorks'

import styles from './WorksPage.module.scss'

const Works = () => {
  return (
    <main className={styles.works} aria-labelledby="works-page-title">
      <header>
        <h1 id="works-page-title" className={styles.srOnly}>How This Works</h1>
      </header>
      <HowThisWorks />
    </main>
  )
}

export default Works