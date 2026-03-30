import styles from './CustomButton.module.scss'

export enum Layout {
  Around = 'around',
  Between = 'between'
}

type CustomButtonProps = {
  children: React.ReactNode
  layout?: Layout
}

const CustomButton = ({ children, layout }: CustomButtonProps) => (
  <div className={`
    ${styles.button}
    ${layout === Layout.Around && styles.around}
    ${layout === Layout.Between && styles.between}
   `}>
    {children}
  </div>
);

export default CustomButton