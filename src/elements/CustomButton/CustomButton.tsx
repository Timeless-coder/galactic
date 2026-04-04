import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './CustomButton.module.scss'

type CustomButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  layout?: string
  width?: string
}

const CustomButton = ({ children, layout = 'between', width = 'auto', ...props }: CustomButtonProps) => (
  <button className={`${styles.button} ${styles[layout]}`} style={{ width }}  {...props}>
    {children}
  </button>
)

export default CustomButton