import React from "react";
import {CgSpinner} from "react-icons/cg";
import styles from "./Button.module.css";

type IconPosition = 'left' | 'right';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
}

const Button = ({
                  icon,
                  iconPosition = 'left',
                  children,
                  className = "",
                  loading = false,
                  ...props
}: ButtonProps) => {
  return (
    <button
      className={`${styles.primary} ${styles[iconPosition]} ${className}`}
      {...props}
    >
      {loading && <CgSpinner className={styles.spinner} />}
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
}

export default Button;
