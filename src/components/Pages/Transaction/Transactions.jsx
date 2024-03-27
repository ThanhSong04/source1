import { fetchBlockByHash, fetchBlocks, fetchTransactions } from '@/apis/store_api.ts';
import { activeLinkState } from '@/recoil/listState';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid, gridPaginatedVisibleSortedGridRowEntriesSelector, useGridApiRef } from '@mui/x-data-grid';
import { debounce } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import styles from "./Transactions.module.scss";
import { CircularProgress, Tooltip } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

const Transactions = () => {
  const setActiveLink = useSetRecoilState(activeLinkState);
  const apiRef = useGridApiRef();
  const [txs, setTxs] = useState([]);
  const [searchData, setSearchData] = useState("");
  const [isLoading, setIsloading] = useState(true);
  const blocks = new Map(); // Assuming blocks is a Map
  const blockPromises = new Map(); // Assuming blockPromises is a Map
  const fetchDataInterval = useRef(null);

  const columns = [
    { field: 'index', headerName: 'No', headerClassName: styles["table-header"], cellClassName: styles["table-cell"], width: 100, sortable: false },
    { field: 'hash', headerName: 'Tx', headerClassName: styles["table-header"], cellClassName: styles["table-cell"], width: 300, sortable: false, renderCell: (data) => <a href={`/transactions/${data.value}`}><span> {data.value.substring(0, 3)}...{data.value.substring(data.value.length - 3)}</span></a> },
    { field: 'height', headerName: 'Height', headerClassName: styles["table-header"], cellClassName: styles["table-cell"], width: 300, sortable: false, renderCell: (data) => <a href={`/blocks/${data.value}`}>{data.value}</a> },
    { field: 'txType', headerName: 'Type', headerClassName: styles["table-header"], cellClassName: styles["table-cell"], width: 300, sortable: false, renderCell: (data) => data?.row.tx && Object.keys(data?.row.tx).length > 0 ? Object.keys(data?.row.tx)[0] : data?.row.txType },
    {
      field: 'returnCode',
      headerName: 'Shielded', headerClassName: styles["table-header"], cellClassName: styles["table-cell"], width: 300, sortable: false, renderCell: (data) => data.row.tx &&
        data.row.tx.Transfer &&
        data.row.tx.Transfer.shielded
        ? 'Yes'
        : 'No'
    },
    { field: 'tx', headerName: 'Status', headerClassName: styles["table-header"], cellClassName: styles["table-cell"], width: 300, sortable: false, renderCell: (data) => data?.row.returnCode === 0 || data?.row.txType === 'Wrapper' ? "Success" : "Fail" },
    { field: 'time', headerName: 'Time', headerClassName: styles["table-header"], cellClassName: styles["table-cell"], width: 300, sortable: false, renderCell: (data) => <span>{formatDistanceToNow(new Date(data.value), { addSuffix: true })}</span> },
  ];

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  var isFetchingData = false;
  const fetchData = async () => {
    try {
      // setIsloading(true);
      if (isFetchingData) {
        return;
      }
  
      const res = await fetchTransactions(paginationModel.page + 1, paginationModel.pageSize);
      isFetchingData = true;
      const data = res.data;
  
      const newBlockPromises = new Map(); // Create a new blockPromises map for each call
  
      const updatedTxs = [];
  
      for (let index = 0; index < data.length; index++) {
        const tx = data[index];
        blocks.clear();
        const block = blocks.get(tx.block_id);
  
        if (!block) {
          let blockPromise = newBlockPromises.get(tx.block_id); // Use the new blockPromises map
  
          if (!blockPromise) {
            blockPromise = await fetchBlockByHash(tx.block_id);
            blocks.set(tx.block_id, {
              blockId: tx.block_id,
              height: blockPromise.header.height,
              time: blockPromise.header.time,
            });
            newBlockPromises.delete(tx.block_id);
          }
  
          const updatedTx = {
            index: index + 1,
            height: blocks.get(tx.block_id).height,
            hash: tx.hash,
            time: blocks.get(tx.block_id).time,
            returnCode: tx.return_code,
            txType: tx.tx_type,
            tx: tx.tx,
          };
  
          updatedTxs.push(updatedTx);
        } else {
          const updatedTx = {
            index: index + 1,
            height: block.height,
            hash: tx.hash,
            time: block.time,
            returnCode: tx.return_code,
          };
  
          updatedTxs.push(updatedTx);
        }
      }
  
      setTxs(updatedTxs);
      // setTxs((prevTxs) => [...prevTxs, ...updatedTxs]);
    } catch (error) {
      // Handle errors if needed
      console.error("Error fetching data:", error);
    } finally {
      isFetchingData = false;
      setIsloading(false);
    }
  };
  

  // const getDetailData = async (visibleDataList) => {
  //   setIsloading(true);
  //   return fetchSpecificValidatorsWithDetails(visibleDataList).then(data => {
  //     setDetailDataList(data);
  //     setIsloading(false);
  //   });
  // }

  const searchKeyword = (e) => {
    const searchText = e.target.value.toLowerCase();
    setSearchData(searchText);

    if (searchText.trim() === '') {
      // Fetch data only when the search text is empty
      fetchData();
    } else {
      // Filter data based on search text
      setTxs((old) =>
        old.filter((obj) =>
          Object.values(obj).some((val) => String(val).toLowerCase().includes(searchText))
        )
      );
    }
  };


  const debounceSearch = useRef(debounce(searchKeyword, 500)).current;

  useEffect(() => {
    // Init data
    setActiveLink("/transactions");
    fetchData();

    //Set up interval for fetching new data every 4 seconds
    fetchDataInterval.current = setInterval(() => {
      fetchData();
    }, 5000);

    //Clear the interval when the component unmounts
    return () => clearInterval(fetchDataInterval.current);
  }, [setActiveLink]);

  // useEffect(() => {
  //   //get and fetch detail of the visible data in the table view
  //   const visibleDataList = gridPaginatedVisibleSortedGridRowEntriesSelector(apiRef.current.state);
  //   getDetailData(visibleDataList || initData.slice(0, 10));
  // }, [paginationModel, apiRef, initData, searchData]);

  // useEffect(() => {
  //   //map missing data to the list
  //   setData(oldData => oldData.map(item => ({ ...item, ...detailDataList.find(detail => detail.validator === item.address) })));
  // }, [initData]);

  return (
    <div className={styles["root"]}>
      <div className={styles["container"]}>
        <h1 className={styles["title"]}>Lastest {paginationModel.pageSize} Transactions</h1>
        <form className={styles["search-form"]}>
          <input type="text" id="search" name="search" className={styles["search"]} onChange={(e) => debounceSearch(e)} />
          <SearchIcon className={styles["search-icon"]} />
        </form>
        {isLoading && (
          <div className={styles["loading-overlay"]}>
            <CircularProgress />
          </div>
        )}
        {txs.length === 0 && !isLoading && <p>No results found</p>}
        <DataGrid
          apiRef={apiRef}
          getRowId={(row) => row.index}
          rows={txs}
          columns={columns}
          pageSizeOptions={[10]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          disableColumnFilter
        />
      </div>
    </div>
  );
};

export default Transactions;