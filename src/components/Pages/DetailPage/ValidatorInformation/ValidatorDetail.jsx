import styles from "./ValidatorDetail.module.scss";

const ValidatorDetail = (props) => {
  const { data: validationDetail } = props;

  return (
    <div className={styles["root"]}>
      <div className={styles["container"]}>
        <div className={styles["title"]}>Validator Details</div>
        <div className={styles["line"]}></div>
        {
          validationDetail && validationDetail.address ? <>
            <div className={styles["content"]}><span>Address: </span><br />{validationDetail?.address}</div>
            <div className={styles["content"]}><span>Voting Power: </span><br />{validationDetail?.votingPower}</div>
            <div className={styles["content"]}><span>Moniker: </span><br />{validationDetail?.moniker}</div>
            <div className={styles["content"]}><span>Tendermint Address: </span><br />{validationDetail?.tmAddress}</div>
            <div className={styles["content"]}><span>Participation: </span><br />{validationDetail?.participation}</div>
          </> : <div className={styles["not-found"]}>Not found!</div>
        }
      </div>
    </div>
  );
};

export default ValidatorDetail;