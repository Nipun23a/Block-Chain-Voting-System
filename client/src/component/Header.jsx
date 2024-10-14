import React from 'react';
import { Box, Heading, Flex, Button } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

function Header() {
  return (
    <Box>
      <Flex as="nav" align="center" justify="space-between" wrap="wrap" padding="1.5rem" bg="teal.500" color="white">
        <Flex align="center" mr={5}>
          <Heading as="h1" size="lg" letterSpacing={"-.1rem"}>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              Decentralized Voting
            </motion.div>
          </Heading>
        </Flex>

        <Box>
          <Button as={NavLink} to="/" colorScheme="teal" mr={3}>
            Home
          </Button>
          <Button as={NavLink} to="/vote" colorScheme="teal" mr={3}>
            Vote
          </Button>
          <Button as={NavLink} to="/results" colorScheme="teal" mr={3}>
            Results
          </Button>
          <Button as={NavLink} to="/admin" colorScheme="teal">
            Admin
          </Button>
        </Box>
      </Flex>
    </Box>
  );
}

export default Header;