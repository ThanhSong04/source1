import { fetchBlockByHash, fetchTransactionDetail } from '@/apis/store_api.ts';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from "./TransactionDetails.module.scss";
import TransactionInformations from './TransactionInformation/TransactionInformations';
import RawData from './RawData/RawData'

const TransactionDetails = () => {
  const { id } = useParams();

  const [tx, setTx] = useState();
  const [block, setBlock] = useState();


  const fetchData = async () => {
    try {
      const resTx = await fetchTransactionDetail(id);

      const txData = {
        hash: resTx.hash,
        blockId: resTx.block_id,
        gasWanted: '0',
        gasUsed: '0',
        returnCode: resTx.return_code,
        fee: resTx.fee_amount_per_gas_unit ? resTx.fee_amount_per_gas_unit : 0,
        data: resTx.data,
        tx:
          resTx.tx_type === 'Decrypted' && resTx.tx && resTx.tx.Ibc
            ? {
              typeUrl: resTx.tx.Ibc.Any.type_url,
              value: [...resTx.tx.Ibc.Any.value.slice(0, 10), '...'],
            }
            : { ...resTx.tx },
        txType: resTx.tx_type,
      };

      setTx(txData || {});

      const resBlock = await fetchBlockByHash(txData?.blockId);

      // Fix the variable name here from 'res' to 'resBlock'
      const block = {
        chainId: resBlock.header.chain_id,
        height: resBlock.header.height,
        hash: resBlock.block_id,
        time: resBlock?.header.time,
        proposer: resBlock.header.proposer_address,
      };

      console.log('Res block:' + resBlock);

      setBlock(block || {});
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle errors if needed
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <div className={styles["root"]}>
      <div className={styles["container"]}>
        <TransactionInformations tx={tx} block={block} />
        <RawData data={tx} />
      </div>
    </div>
  );
};

export default TransactionDetails;