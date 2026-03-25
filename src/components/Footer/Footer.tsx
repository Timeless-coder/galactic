import styles from './Footer.module.scss'

const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.linksContainer}>
        <p>
          All planet images by:{' '}
          <a
            href='http://digitalblasphemy.com/'
            target='_blank'
            rel='noreferrer'>
            Digital Blasphemy
          </a>
        </p>
      </div>
    </div>
  )
}

export default Footer
