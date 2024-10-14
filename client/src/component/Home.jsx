import React from 'react';
import { Box, Heading, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box maxW="32rem" margin="auto">
        <Heading mb={4}>Welcome to Decentralized Voting</Heading>
        <Text fontSize="xl">
          This platform allows you to participate in secure, transparent voting using blockchain technology.
        </Text>
      </Box>
    </motion.div>
  );
}

export default Home;