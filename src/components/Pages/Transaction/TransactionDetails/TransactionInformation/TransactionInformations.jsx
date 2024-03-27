import styles from "./TransactionInformations.module.scss";
import { formatDistanceToNow } from 'date-fns';

const TransactionInformations = (props) => {
  const { tx, block } = props;
  console.log(tx);
  console.log(block);

  return (
    <div className={styles["root"]}>
      <div className={styles["container"]}>
        <div className={styles["title"]}>Transaction Details</div>
        <div className={styles["line"]}></div>
        <div className={styles['details-container']}>
          {
            tx && tx.hash ? <>
              <div className={styles["content"]}><span>Chain Id: </span><br />{block?.chainId}</div>
              <div className={styles["content"]}><span>Tx Hash: </span><br />{tx?.hash}</div>
              <div className={styles["content"]}><span>Status: </span><br />{tx?.returnCode == 0 || tx?.txType == 'Wrapper' ? 'Success' : 'false'}</div>
              <div className={styles["content"]}><span>Height: </span><br /> <a href={`/blocks/${block?.height}`}>{block?.height}</a> </div>
              <div className={styles["content"]}><span>Time: </span><br /> {block && block?.time ? (
                <>
                  {formatDistanceToNow(new Date(block.time), { addSuffix: true })}  <br />
                  {block.time}
                </>
              ) : (
                "Time information not available"
              )}</div>
              <div className={styles["content"]}><span>Fee: </span><br />{tx?.fee} NAAN </div>
              <div className={styles["content"]}><span>Gas (used / wanted): </span><br />  {tx?.gasUsed ? `${tx.gasUsed} / ${tx.gasWanted}` : ''}</div>
              <div className={styles["content"]}><span>Shielded: </span><br />  {tx && tx.tx && tx.tx.Transfer && tx.tx.Transfer.shielded
                ? 'Yes'
                : 'No'} </div>
              {/* <div className={styles["content"]}><span>Memo: </span><br /> <a href={`/validators/${tx?.header.proposer_address}`}>{tx?.header.proposer_address}</a> </div> */}
            </> : <div className={styles["not-found"]}>Notfound</div>
          }
        </div>
      </div>
    </div>
  );
};

export default TransactionInformations;