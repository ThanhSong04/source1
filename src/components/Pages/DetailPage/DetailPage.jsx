import { fetchCurrentValidatorsList } from '@/apis/store_api.ts';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from "./DetailPage.module.scss";
import SignedBlock from './SignedBlock/SignedBlock';
import ValidatorDetail from './ValidatorInformation/ValidatorDetail';

const DetailPage = () => {
  const { id } = useParams();

  const [validationDetail, setValidationDetail] = useState();

  const fetchData = async () => {
    const dataList = await fetchCurrentValidatorsList();
    const data = dataList.find(item => item.address === id);

    setValidationDetail(data || {});
  }

  useEffect(() => {
    fetchData();
  }, [id]);
  
  return (
    <div className={styles["root"]}>
      <div className={styles["container"]}>
        <ValidatorDetail data={validationDetail} />
        <SignedBlock data={validationDetail} />
      </div>
    </div>
  );
};

export default DetailPage;