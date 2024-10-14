// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const ethers = require('ethers');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ABI of your deployed contract
const contractABI = require('./contractABI.json');
const contractAddress = process.env.CONTRACT_ADDRESS;
const provider = new ethers.JsonRpcProvider('http://127.0.0.1:7545');

// The rest of your code remains the same
const contract = new ethers.Contract(contractAddress, contractABI, provider);

// Routes
app.get('/candidates', async (req, res) => {
  try {
    const candidateCount = await contract.getCandidateCount();
    const candidates = [];
    for (let i = 0; i < candidateCount; i++) {
      const candidate = await contract.candidates(i);
      candidates.push({
        id: i,
        name: candidate.name,
        voteCount: candidate.voteCount.toString()
      });
    }
    res.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'Error fetching candidates' });
  }
});

app.get('/voting-status', async (req, res) => {
  try {
    const status = await contract.getVotingStatus();
    res.json({ isActive: status });
  } catch (error) {
    console.error('Error fetching voting status:', error);
    res.status(500).json({ error: 'Error fetching voting status' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});