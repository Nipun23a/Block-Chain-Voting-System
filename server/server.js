const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const ethers = require('ethers');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Allow only this origin
  optionsSuccessStatus: 200 // For legacy browser support
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// ABI of your deployed contract
const contractABI = require('./contractABI.json');
const contractAddress = process.env.CONTRACT_ADDRESS;

// Provider setup
const provider = new ethers.JsonRpcProvider('http://127.0.0.1:7545');

// Contract instance
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

app.post('/vote', async (req, res) => {
    try {
      const { candidateId, voterAddress } = req.body;
      
      // Check voting status
      const isActive = await contract.getVotingStatus();
      if (!isActive) {
        return res.status(400).json({ error: 'Voting is not active' });
      }
  
      // Check if voter has already voted
      const hasVoted = await contract.voters(voterAddress);
      if (hasVoted) {
        return res.status(400).json({ error: 'You have already voted' });
      }
  
      // Check if candidate exists
      const candidateCount = await contract.getCandidateCount();
      if (candidateId >= candidateCount) {
        return res.status(400).json({ error: 'Invalid candidate ID' });
      }
  
      // Attempt to vote (this will require a transaction to be signed by the voter)
      const signer = await provider.getSigner(voterAddress);
      const contractWithSigner = contract.connect(signer);
      const tx = await contractWithSigner.vote(candidateId);
      await tx.wait();
  
      res.json({ success: true, message: 'Vote cast successfully' });
    } catch (error) {
      console.error('Error casting vote:', error);
      res.status(500).json({ error: 'Error casting vote', details: error.message });
    }
  });

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});