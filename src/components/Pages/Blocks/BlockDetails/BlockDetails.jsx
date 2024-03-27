import { fetchBlockDetail } from '@/apis/store_api.ts';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from "./BlockDetails.module.scss";
import BlockInformations from './BlockInformations/BlockInformations';
import HashesTable from './Hashes/Hashes'

const BlockDetails = () => {
  const { id } = useParams();

  const [blockDetails, setBlockDetails] = useState();

  const fetchData = async () => {
    const blockDetails = await fetchBlockDetail(id);
    setBlockDetails(blockDetails || {});
  }

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <div className={styles["root"]}>
      <div className={styles["container"]}>
        <BlockInformations data={blockDetails} />
        <HashesTable data={blockDetails}/>
      </div>
    </div>
  );
};

export default BlockDetails;