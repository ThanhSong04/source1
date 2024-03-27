import styles from "./BlockInformations.module.scss";
import { formatDistanceToNow } from 'date-fns';

const BlockInformations = (props) => {
  const { data: block } = props;
  console.log(block);

  return (
    <div className={styles["root"]}>
      <div className={styles["container"]}>
        <div className={styles["title"]}>Block Details</div>
        <div className={styles["line"]}></div>
        <div className={styles['details-container']}>
          {
            block && block.block_id ? <>
              <div className={styles["content"]}><span>Height: </span><br />{block?.header.height}</div>
              <div className={styles["content"]}><span>Hash: </span><br />{block?.block_id}</div>
              <div className={styles["content"]}><span>No of Txs: </span><br />{block?.tx_hashes.length}</div>
              <div className={styles["content"]}><span>Proposer: </span><br /> <a href={`/validators/${block?.header.proposer_address}`}>{block?.header.proposer_address}</a> </div>
              <div className={styles["content"]}><span>Time: </span><br />{formatDistanceToNow(new Date(block?.header.time), { addSuffix: true })}  <br />{block?.header.time}</div>
            </> : <div className={styles["not-found"]}>Notfound</div>
          }
        </div>
      </div>
    </div>
  );
};

export default BlockInformations;