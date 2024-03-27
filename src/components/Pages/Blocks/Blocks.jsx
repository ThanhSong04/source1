import { fetchBlocks } from '@/apis/store_api.ts';
import { activeLinkState } from '@/recoil/listState';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid, gridPaginatedVisibleSortedGridRowEntriesSelector, useGridApiRef } from '@mui/x-data-grid';
import { debounce } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import styles from "./Blocks.module.scss";
import { CircularProgress, Tooltip } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

const Blocks = () => {
  const setActiveLink = useSetRecoilState(activeLinkState);
  const apiRef = useGridApiRef();
  const [data, setInitData] = useState([]);
  const [searchData, setSearchData] = useState("");
  const [isLoading, setIsloading] = useState(true);
  const fetchDataInterval = useRef(null);

  const columns = [
    { field: 'index', headerName: 'No', headerClassName: styles["table-header"], cellClassName: styles["table-cell"], width: 100, sortable: false },
    { field: 'height', headerName: 'Height', headerClassName: styles["table-header"], cellClassName: styles["table-cell"], width: 200, sortable: false, renderCell: (data) => <a href={`/blocks/${data.value}`}>{data.value}</a> },
    { field: 'hash', headerName: 'Hash', headerClassName: styles["table-header"], cellClassName: styles["table-cell"], width: 300, sortable: false, renderCell: (data) => <span> {data.value.substring(0, 6)}...{data.value.substring(data.value.length - 6)}</span> },
    { field: 'txs', headerName: 'Txs', headerClassName: styles["table-header"], cellClassName: styles["table-cell"], width: 100, sortable: false },
    { field: 'proposer', headerName: 'Proposer', headerClassName: styles["table-header"], cellClassName: styles["table-cell"], width: 800, sortable: false, renderCell: (data) => <a href={`/validators/${data.value}`}>{data.value}</a> },
    { field: 'time', headerName: 'Time', headerClassName: styles["table-header"], cellClassName: styles["table-cell"], width: 300, sortable: false, renderCell: (data) => <span>{formatDistanceToNow(new Date(data.value), { addSuffix: true })}</span> },
  ];

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const fetchData = async () => {
    try {
      // setIsloading(true);

      const dataRes = await fetchBlocks(paginationModel.page + 1, paginationModel.pageSize * 5);

      if (dataRes && dataRes.data) {
        const finalData = dataRes.data.map((block, index) => ({
          ...block,
          index: index + 1,
          height: block.header.height,
          hash: block.block_id,
          txs: block.tx_hashes.length,
          time: block.header.time,
          proposer: block.header.proposer_address,
        }));
        setInitData(finalData);
      } else {
        // Handle the case where dataRes or dataRes.data is falsy
        console.error("Invalid data structure:", dataRes);
      }
    } catch (error) {
      // Handle errors if needed
      console.error("Error fetching data:", error);
    } finally {
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

    setInitData((old) => {
      if (searchText.trim() === '') {
        fetchData();
        return old;
      }

      const res = old.filter(obj => Object.values(obj).some(val => String(val).toLowerCase().includes(searchText)));
      return res;
    });
  };

  const debounceSearch = useRef(debounce(searchKeyword, 500)).current;

  // useEffect(() => {
  //   //init data
  //   setActiveLink("/blocks");
  //   fetchData();
  // }, [setActiveLink]);

  useEffect(() => {
    // Init data
    setActiveLink("/blocks");
    fetchData();

    // Set up interval for fetching new data every 4 seconds
    fetchDataInterval.current = setInterval(() => {
      fetchData();
    }, 5000);

    // Clear the interval when the component unmounts
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
        <h1 className={styles["title"]}>Lastest 50 blocks</h1>
        <form className={styles["search-form"]}>
          <input type="text" id="search" name="search" className={styles["search"]} onChange={(e) => debounceSearch(e)} />
          <SearchIcon className={styles["search-icon"]} />
        </form>
        {isLoading && (
          <div className={styles["loading-overlay"]}>
            <CircularProgress />
          </div>
        )}
        {data.length === 0 && !isLoading && <p>No results found</p>}
        <DataGrid
          apiRef={apiRef}
          getRowId={(row) => row.index}
          rows={data}
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

export default Blocks;