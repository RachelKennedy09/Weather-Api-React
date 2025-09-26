//----------------
//loader component
//-----------------------

import styles from "./Loader.module.css";
export default function Loader({ label = "Loading..." }) {
  return (
    <div className={styles.wrap} role="status" aria-live="polite">
      <div className={styles.spinner} />
      <span>{label}</span>
    </div>
  );
}
