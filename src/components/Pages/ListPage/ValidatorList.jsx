import { fetchCurrentValidatorsList, fetchSpecificValidatorsWithDetails } from '@/apis/store_api.ts';
import { activeLinkState } from '@/recoil/listState';
import SearchIcon from '@mui/icons-material/Search';
import { CircularProgress } from '@mui/material';
import { DataGrid, gridPaginatedVisibleSortedGridRowEntriesSelector, useGridApiRef } from '@mui/x-data-grid';
import { debounce } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import styles from "./ValidatorList.module.scss";

const ValidatorList = () => {
  const setActiveLink = useSetRecoilState(activeLinkState);
  const apiRef = useGridApiRef();
  const [initData, setInitData] = useState([]);
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState("");
  const [detailDataList, setDetailDataList] = useState([]);
  const [isLoading, setIsloading] = useState(false);

  const columns = [
    { field: 'index', headerName: 'No', headerClassName: styles["table-header"], cellClassName: styles["table-cell"], width: 100, sortable: false },
    { field: 'address', headerName: 'Validator', headerClassName: styles["table-header"], cellClassName: styles["table-cell"], width: 700, sortable: false, renderCell: (data) => <a href={`/validators/${data.value}`}>{data.value}</a> },
    { field: 'moniker', headerName: 'Moniker', headerClassName: styles["table-header"], cellClassName: styles["table-cell"], width: 300, sortable: false },
    { field: 'uptime', headerName: 'Uptime', headerClassName: styles["table-header"], cellClassName: styles["table-cell"], width: 200, sortable: false, renderHeader: () => <div className={styles["table-header-item"]}>Uptime {isLoading && <CircularProgress />}</div> },
    { field: 'votingPower', headerName: 'Voting Power', headerClassName: styles["table-header"], cellClassName: styles["table-cell"], width: 300, sortable: false },
    { field: 'commitSignatures', headerName: 'Commit Signature', headerClassName: styles["table-header"], cellClassName: styles["table-cell"], width: 400, sortable: false, renderHeader: () => <div className={styles["table-header-item"]}>Commit Signature {isLoading && <CircularProgress />}</div> },
    {
      field: 'participation', headerName: 'Participation', headerClassName: styles["table-header"], cellClassName: styles["table-cell"], width: 400, sortable: false, renderHeader: () => <div className={styles["table-header-item"]}>Participation {isLoading && <CircularProgress />}</div>, renderCell: (data) => {
        return data.value;
      }
    },
  ];

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const fetchData = async () => {
    const data = await fetchCurrentValidatorsList();
    if (data) {
      const finalData = data.map((item, index) => ({ ...item, index: index + 1 }))

      setData(finalData);
      setInitData(finalData);
    }
  }

  const getDetailData = async (visibleDataList) => {
    setIsloading(true);
    return fetchSpecificValidatorsWithDetails(visibleDataList).then(data => {
      setDetailDataList(data);
      setIsloading(false);
    });
  }

  const searchKeyword = (e) => {
    setSearchData(e.target.value.toLowerCase());
    setInitData((old) => {
      const res = old.filter(obj => Object.values(obj).some(val => val.toString().toLowerCase().includes(e.target.value.toLowerCase())));
      setData(res);

      return old;
    })
  }

  const debounceSearch = useRef(debounce((nextValue) => searchKeyword(nextValue), 500)).current;

  useEffect(() => {
    //init data
    setActiveLink("/validators");
    fetchData();
  }, [setActiveLink]);

  useEffect(() => {
    //get and fetch detail of the visible data in the table view
    const visibleDataList = gridPaginatedVisibleSortedGridRowEntriesSelector(apiRef.current.state);
    getDetailData(visibleDataList || initData.slice(0, 10));
  }, [paginationModel, apiRef, initData, searchData]);

  useEffect(() => {
    //map missing data to the list
    setData(oldData => oldData.map(item => ({ ...item, ...detailDataList.find(detail => detail.validator === item.address) })));
  }, [detailDataList]);

  return (
    <div className={styles["root"]}>
      <div className={styles["container"]}>
        <form className={styles["search-form"]}>
          <input type="text" id="search" name="search" className={styles["search"]} onChange={(e) => debounceSearch(e)} />
          <SearchIcon className={styles["search-icon"]} />
        </form>
        <DataGrid
          apiRef={apiRef}
          getRowId={(row) => row.address}
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

export default ValidatorList;