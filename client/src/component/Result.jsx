import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Progress, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import axios from 'axios';

function Results() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await axios.get('http://localhost:5000/candidates');
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  const totalVotes = results.reduce((sum, candidate) => sum + Number(candidate.voteCount), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box maxW="32rem" margin="auto">
        <Heading mb={4}>Voting Results</Heading>
        <VStack spacing={4} align="stretch">
          {results.map((candidate) => (
            <Box key={candidate.id}>
              <Text>{candidate.name}</Text>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1 }}
              >
                <Progress 
                  value={(candidate.voteCount / totalVotes) * 100} 
                  colorScheme="teal" 
                  size="sm"
                />
              </motion.div>
              <Text>{candidate.voteCount} votes ({((candidate.voteCount / totalVotes) * 100).toFixed(2)}%)</Text>
            </Box>
          ))}
        </VStack>
      </Box>
    </motion.div>
  );
}

export default Results;