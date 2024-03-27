import React from 'react';
import styles from './Hashes.module.scss';

const Table = ({ txData }) => {
  return (
    <>
      {txData.length === 0 ? (
        <div className={styles['not-found']}>Notfound</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Transaction Type</th>
              <th>Hash ID</th>
            </tr>
          </thead>
          <tbody>
            {txData.map((tx, index) => (
              <tr key={index}>
                <td>{tx.tx_type}</td>
                <td><a href={`/transactions/${tx.hash_id}`}>{tx.hash_id}</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

const HashesTable = (props) => {
  const { data: block } = props;

  return (
    <div className={styles['root']}>
      <div className={styles['container']}>
        <div className={styles['title']}>TX Hashes</div>
        <div className={styles['line']}></div>
        <div className={styles['block-container']}>
          {/* Render the Table component directly here */}
          <Table txData={block?.tx_hashes || []} />
        </div>
      </div>
    </div>
  );
};

export default HashesTable;