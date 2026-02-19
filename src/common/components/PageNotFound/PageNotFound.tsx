import { Link } from "react-router"
import { NavButton } from "@/common/components/NavButton/NavButton"
import styles from "./PageNotFound.module.css"

export const PageNotFound = () => (
  <div className={styles.container}>
    <h1 className={styles.title}>404</h1>
    <h2 className={styles.subtitle}>page not found</h2>
    <div className={styles.buttonContainer}>
      <Link to="/">
        <NavButton>Go to Main Page</NavButton>
      </Link>
    </div>
  </div>
)
