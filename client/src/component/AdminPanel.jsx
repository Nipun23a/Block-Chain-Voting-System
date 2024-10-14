import React, { useState } from 'react';
import { Box, Button, Input, VStack, Heading, useToast, FormControl, FormLabel } from "@chakra-ui/react";
import { ethers } from 'ethers';

function AdminPanel({ contractAddress, contractABI }) {
  const [candidateName, setCandidateName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const toast = useToast();

  const addCandidate = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        const transaction = await contract.addCandidate(candidateName);
        await transaction.wait();

        toast({
          title: "Candidate added successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setCandidateName('');
      } catch (error) {
        console.error('Error adding candidate:', error);
        toast({
          title: "Error adding candidate",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const setVotingTime = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        const startTimestamp = Math.floor(new Date(startTime).getTime() / 1000);
        const endTimestamp = Math.floor(new Date(endTime).getTime() / 1000);

        const transaction = await contract.setVotingTime(startTimestamp, endTimestamp);
        await transaction.wait();

        toast({
          title: "Voting time set successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setStartTime('');
        setEndTime('');
      } catch (error) {
        console.error('Error setting voting time:', error);
        toast({
          title: "Error setting voting time",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Box maxW="32rem" margin="auto">
      <Heading mb={4}>Admin Panel</Heading>
      <VStack spacing={4}>
        <FormControl>
          <FormLabel>Add Candidate</FormLabel>
          <Input 
            placeholder="Candidate Name" 
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
          />
          <Button onClick={addCandidate} colorScheme="teal" mt={2}>
            Add Candidate
          </Button>
        </FormControl>

        <FormControl>
          <FormLabel>Set Voting Time</FormLabel>
          <Input 
            type="datetime-local" 
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <Input 
            type="datetime-local" 
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            mt={2}
          />
          <Button onClick={setVotingTime} colorScheme="teal" mt={2}>
            Set Voting Time
          </Button>
        </FormControl>
      </VStack>
    </Box>
  );
}

export default AdminPanel;