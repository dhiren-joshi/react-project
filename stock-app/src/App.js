import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import StockList from './components/StockList';
import StockChart from './components/StockChart';
import StockHeatmap from './components/StockHeatmap';

function App() {
  return (
    <Router>
      <nav style={{ padding: 20 }}>
        <Link to="/" style={{ marginRight: 20 }}>Home (Stocks)</Link>
        <Link to="/heatmap">Heatmap</Link>
      </nav>
      <Routes>
        <Route path="/" element={<StockList />} />
        <Route path="/chart/:ticker" element={<StockChart />} />
        <Route path="/heatmap" element={<StockHeatmap />} />
      </Routes>
    </Router>
  );
}

export default App;
