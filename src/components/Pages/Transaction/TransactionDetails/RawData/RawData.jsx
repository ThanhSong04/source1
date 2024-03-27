import React, { useState } from 'react';
import styles from './RawData.module.scss';

const RawData = (props) => {
  const { data: tx } = props;
  const jsonString = JSON.stringify(tx || [], null, 2);

  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonString);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div className={`${styles['root']} ${styles['container']}`}>
      <div className={styles['title']}>Raw data</div>
      <div className={styles['copy-button-container']}>
        <button className={styles['copy-button']} onClick={copyToClipboard}>
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className={`${styles['block-container']} ${styles['box']}`}>
        <pre>{jsonString}</pre>
      </div>
    </div>
  );
};

export default RawData;
