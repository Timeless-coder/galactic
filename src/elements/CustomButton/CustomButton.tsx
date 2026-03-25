import styles from './CustomButton.module.scss'

const CustomButton = ({ children, around, between, rect }) => (
  <div className={`
    ${styles.button}
    ${around && styles.around}
    ${rect && styles.rect}
    ${between && styles.between}
   `}>
    {children}
  </div>
);

export default CustomButton