import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';

function StockList() {
  const [stocks, setStocks] = useState({});

  useEffect(() => {
    const fetchStocks = async () => {
      const response = await fetch(fetch('/evaluation-service/stocks')
    );
      const data = await response.json();
      setStocks(data.stocks || {});
    };
    fetchStocks();
  }, []);

  return (
    <Paper elevation={3} style={{ padding: 20 }}>
      <Typography variant="h4">Available Stocks</Typography>
      <List>
        {Object.entries(stocks).map(([name, ticker]) => (
          <ListItem key={ticker} button component={Link} to={`/chart/${ticker}`}>
            <ListItemText primary={name} secondary={ticker} />
          </ListItem>
        ))}
      </List>
      <Link to="/heatmap">
        <Typography variant="button" color="primary">View Heatmap</Typography>
      </Link>
    </Paper>
  );
}

export default StockList;
