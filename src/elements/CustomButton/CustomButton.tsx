import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'
import styles from './CustomButton.module.scss'

type ButtonLayout = 'between' | 'around' | 'center'

type CustomButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  layout?: ButtonLayout
  width?: CSSProperties['width']
  minWidth?: CSSProperties['minWidth']
  height?: CSSProperties['height']
  minHeight?: CSSProperties['minHeight']
  fontSize?: CSSProperties['fontSize']
  gap?: CSSProperties['gap']
  fullWidth?: boolean
  iconOnly?: boolean
}

const CustomButton = ({ children, className, layout = 'between', width = 'auto', minWidth, height, minHeight, fontSize, gap, fullWidth = false, iconOnly = false, style, type = 'button', ...props }: CustomButtonProps) => {
  const buttonClassName = [styles.button, styles[layout], iconOnly ? styles.iconOnly : '', className ?? '',].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      className={buttonClassName}
      style={{
        width: fullWidth ? '100%' : width,
        minWidth,
        height,
        minHeight,
        fontSize,
        gap,
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  )
}

export default CustomButton