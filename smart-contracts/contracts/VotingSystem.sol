pragma solidity ^0.8.0;

contract VotingSystem {
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    mapping(address => bool) public voters;
    Candidate[] public candidates;
    uint256 public votingStart;
    uint256 public votingEnd;

    event VoteCast(address indexed voter, uint256 indexed candidateId);

    constructor(string[] memory candidateNames, uint256 durationInMinutes) {
        for (uint256 i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate({
                id: i,
                name: candidateNames[i],
                voteCount: 0
            }));
        }
        votingStart = block.timestamp;
        votingEnd = block.timestamp + (durationInMinutes * 1 minutes);
    }

    function vote(uint256 candidateId) public {
        require(block.timestamp >= votingStart && block.timestamp < votingEnd, "Voting is not active");
        require(!voters[msg.sender], "You have already voted");
        require(candidateId < candidates.length, "Invalid candidate Id");

        voters[msg.sender] = true;
        candidates[candidateId].voteCount++;

        emit VoteCast(msg.sender, candidateId);
    }

    function getCandidateCount() external view returns (uint256) {
        return candidates.length;
    }

    function getVotingStatus() external view returns (bool) {
        return (block.timestamp >= votingStart && block.timestamp < votingEnd);
    }
}