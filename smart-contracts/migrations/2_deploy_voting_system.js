const VotingSystem = artifacts.require("VotingSystem");

module.exports = function(deployer) {
  deployer.deploy(VotingSystem, ["Candidate 1", "Candidate 2"], 60);
};
