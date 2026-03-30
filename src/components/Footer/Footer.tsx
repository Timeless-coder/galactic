import styles from './Footer.module.scss'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <nav className={styles.linksContainer} aria-label="Attribution">
        <p>
          All planet images by:{' '}
          <a
            href='http://digitalblasphemy.com/'
            target='_blank'
            rel='noreferrer'
          >
            Digital Blasphemy
          </a>
        </p>
      </nav>
    </footer>
  )
}

export default Footer
