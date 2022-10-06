import React from "react";
import styles from "./Loading.module.scss";

const Loading = () => {
  return (
      <div className={ styles.loading }>
        <div data-cy="loading-dots" className={ styles.dots }></div>
      </div>
  );
};

export default Loading;
