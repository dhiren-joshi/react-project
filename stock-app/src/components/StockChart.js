import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TextField, Grid, Paper, Typography } from '@mui/material';

const StockChart = () => {
  const { ticker } = useParams();
  const [data, setData] = useState([]);
  const [minutes, setMinutes] = useState(30);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `http://20.244.56.144/evaluation-service/stocks/${ticker}?minutes=${minutes}`
      );
      const stockData = await response.json();
      if (Array.isArray(stockData)) {
        const formatted = stockData.map(entry => ({
          time: new Date(entry.lastUpdatedAt).toLocaleTimeString(),
          price: entry.price
        }));
        setData(formatted);
      } else if (stockData.stock) {
        setData([{
          time: new Date(stockData.stock.lastUpdatedAt).toLocaleTimeString(),
          price: stockData.stock.price
        }]);
      }
    };
    fetchData();
  }, [minutes, ticker]);

  const calculateAverage = data.length > 0
    ? data.reduce((acc, curr) => acc + curr.price, 0) / data.length
    : 0;

  return (
    <Paper elevation={3} style={{ padding: 20 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            select
            label="Time Interval"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            SelectProps={{ native: true }}
          >
            <option value={15}>15 Minutes</option>
            <option value={30}>30 Minutes</option>
            <option value={60}>60 Minutes</option>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <LineChart width={800} height={400} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#8884d8" dot={{ r: 4 }} />
            <Line
              type="monotone"
              dataKey={() => calculateAverage}
              stroke="#82ca9d"
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
          <Typography variant="subtitle1">
            Average Price: {calculateAverage.toFixed(2)}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default StockChart;
