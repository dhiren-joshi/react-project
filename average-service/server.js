const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 9876;

const WINDOW_SIZE = 10;
const numberWindows = {
  p: [], // prime numbers
  f: [], // fibonacci numbers
  e: [], // even numbers
  r: []  // random numbers
};

const fetchNumbers = async (type) => {
  const endpoints = {
    p: 'primes',
    f: 'fibo',
    e: 'even',
    r: 'rand'
  };
  try {
    const response = await axios.get(
        `http://20.244.56.144/evaluation-service/${endpoints[type]}`,
        {
          timeout: 500,
          headers: {
            'Authorization': 'Bearer YOUR_TOKEN_HERE'
          }
        }
      );
      
  } catch (error) {
    console.error('Error fetching numbers:', error.message);
    return [];
  }
};

const updateWindow = (window, newNumbers) => {
  const uniqueNew = [...new Set(newNumbers)];
  const updated = [...window, ...uniqueNew]
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(-WINDOW_SIZE);
  return updated;
};

app.get('/numbers/:id', async (req, res) => {
  const type = req.params.id;
  if (!['p', 'f', 'e', 'r'].includes(type)) {
    return res.status(400).json({ error: 'Invalid number type' });
  }
  const prevState = [...numberWindows[type]];
  const numbers = await fetchNumbers(type);
  numberWindows[type] = updateWindow(numberWindows[type], numbers);
  const currWindow = numberWindows[type];
  const avg = currWindow.length > 0
    ? currWindow.reduce((a, b) => a + b, 0) / currWindow.length
    : 0;
  res.json({
    windowPrevState: prevState,
    windowCurrState: currWindow,
    numbers: numbers,
    avg: Number(avg.toFixed(2))
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
