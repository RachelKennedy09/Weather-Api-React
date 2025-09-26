//--------------------------
//Error message if error
//---------------------------------------


import styles from "./ErrorBanner.module.css";
export default function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div role="alert" className={styles.err}>
      {message}
    </div>
  );
}
