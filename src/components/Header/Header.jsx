import SearchIcon from '@mui/icons-material/Search';
import { debounce } from 'lodash';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./Header.module.scss";

const Header = () => {
  const navigate = useNavigate();
  const searchRef = useRef();
  const rpcUrl = process.env.REACT_APP_NEXT_PUBLIC_RPC_URL;

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    const searchData = searchRef.current.value.trim();
    if (searchData.length > 0) {
      if (searchData.length === 64) {
        navigate(`/transactions/${searchData}`);
      } else if (searchData.length === 40) {
        navigate(`/validators/${searchData}`);
      }
      else {
        navigate(`/blocks/${searchData}`);
      }
    }
  };

  return (
    <div className={styles['root']}>
      <div className={styles['container']}>
        <div className={styles['title-container']}>
          <div className={styles['title']}>shielded-expedition.88f17d1d14</div>
          <div className={styles['description']}>
            <a href={rpcUrl} target='_blank'>{rpcUrl}</a>
          </div>
        </div>
        <div className={styles['search-form']}>
          <input
            ref={searchRef}
            type="text"
            id="search"
            name="search"
            className={styles['search']}
            style={{ width: '800px' }}
            placeholder=" height / tx / validator address"
            onKeyDown={handleKeyPress}
          />
          <SearchIcon className={styles['search-icon']} onClick={handleSearch} />
        </div>
      </div>
    </div>
  );
};

export default Header;