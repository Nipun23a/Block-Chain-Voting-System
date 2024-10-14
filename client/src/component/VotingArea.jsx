import React, { useState, useEffect } from 'react';
import { Box, Button, VStack, Heading, useToast,Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ethers } from 'ethers';
import axios from 'axios';

function VotingArea() {
  const [candidates, setCandidates] = useState([]);
  const [votingStatus, setVotingStatus] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchCandidates();
    checkVotingStatus();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get('http://localhost:5000/candidates');
      setCandidates(response.data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  const checkVotingStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/voting-status');
      setVotingStatus(response.data.isActive);
    } catch (error) {
      console.error('Error checking voting status:', error);
    }
  };

  const vote = async (candidateId) => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contractAddress = "0x65849AE3876739a2950017b7d69326D5BfF2c75d";
        const contractABI = [
            {
              "inputs": [
                {
                  "internalType": "string[]",
                  "name": "candidateNames",
                  "type": "string[]"
                },
                {
                  "internalType": "uint256",
                  "name": "durationInMinutes",
                  "type": "uint256"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "constructor"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "voter",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "uint256",
                  "name": "candidateId",
                  "type": "uint256"
                }
              ],
              "name": "VoteCast",
              "type": "event"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "name": "candidates",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "id",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "voteCount",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "getCandidateCount",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "getVotingStatus",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "candidateId",
                  "type": "uint256"
                }
              ],
              "name": "vote",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "voters",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "votingEnd",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "votingStart",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            }
          ]; 
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        const transaction = await contract.vote(candidateId);
        await transaction.wait();

        toast({
          title: "Vote cast successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        fetchCandidates();
      } catch (error) {
        console.error('Error voting:', error);
        toast({
          title: "Error casting vote",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "MetaMask is not installed",
        description: "Please install MetaMask to vote",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box maxW="32rem" margin="auto">
        <Heading mb={4}>Cast Your Vote</Heading>
        {votingStatus ? (
          <VStack spacing={4}>
            {candidates.map((candidate) => (
              <motion.div key={candidate.id} whileHover={{ scale: 1.05 }}>
                <Button 
                  onClick={() => vote(candidate.id)} 
                  colorScheme="teal" 
                  size="lg" 
                  width="100%"
                >
                  {candidate.name}
                </Button>
              </motion.div>
            ))}
          </VStack>
        ) : (
          <Text>Voting is currently closed.</Text>
        )}
      </Box>
    </motion.div>
  );
}

export default VotingArea;