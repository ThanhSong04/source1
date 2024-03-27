import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import { RecoilRoot } from 'recoil';

import Blocks from './pages/Blocks/Blocks';
import BlockDetail from './pages/Blocks/BlockDetail';
import Validators from './pages/Validators/Validators';
import ValidatorDetail from './pages/Validators/ValidatorDetail';
import Transactions from './pages/Transactions/Transactions';
import TransactionsDetails from './pages/Transactions/TransactionDetail';


import '@/styles/variable.scss';

const App = () => {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/blocks" />} />
            <Route path="blocks" element={<Blocks />} />
            <Route path="blocks/:id" element={<BlockDetail />} />
            <Route path="validators" element={<Validators />} />
            <Route path="validators/:id" element={<ValidatorDetail />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="transactions/:id" element={<TransactionsDetails />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
};


export default App;