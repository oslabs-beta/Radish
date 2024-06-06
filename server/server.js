const express = require('express');
const fetchAllNodes = require('./fetch_nodes');

const app = express();
const ports = [7001, 7002, 7003, 7004, 7005, 7006];

app.get('/api/nodes', async (req, res) => {
//   try {
//     const nodes = await fetchAllNodes(ports);
//     res.json(nodes);
//   } catch (error) {
//     res.status(500).send('Error fetching nodes');
//   }
});

app.use(express.static('public'));

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
