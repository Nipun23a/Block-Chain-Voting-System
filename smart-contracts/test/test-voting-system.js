const VotingSystem = artifacts.require("VotingSystem");
const truffleAssert = require('truffle-assertions');

contract('VotingSystem',(accounts) => {
    let votingSystem ;
    const owner = accounts[0];
    const voter1 = accounts[1];
    const voter2 = accounts[2];

    beforeEach(async() =>{
        votingSystem = await VotingSystem.new(['Candidate1','Candidate2'],60);
    });

    it("should initialize with correct candidates", async () => {
        const votingSystem = await VotingSystem.deployed();
        
        const candidateCount = await votingSystem.getCandidateCount();
        assert.equal(candidateCount.toNumber(), 2, "Should have 2 candidates");
      
        const candidate1 = await votingSystem.candidates(0);
        assert.equal(candidate1.name, "Candidate 1", "First candidate name should match");
      
        const candidate2 = await votingSystem.candidates(1);
        assert.equal(candidate2.name, "Candidate 2", "Second candidate name should match");
      });

    it("should allow a voter to cast a vote", async () => {
        await votingSystem.vote(0, { from: voter1 });
        const candidate = await votingSystem.candidates(0);
        assert.equal(candidate.voteCount, 1, "Vote count should be incremented");
    });

    it("should not allow a voter to vote twice", async () => {
        await votingSystem.vote(0, { from: voter1 });
        await truffleAssert.reverts(
          votingSystem.vote(1, { from: voter1 }),
          "You have already voted"
        );
    });

    it("should not allow voting for non-existent candidate", async () => {
        const votingSystem = await VotingSystem.deployed();
        await truffleAssert.reverts(
          votingSystem.vote(99, { from: accounts[0] }),
          "Invalid candidate Id"
        );
      });
});