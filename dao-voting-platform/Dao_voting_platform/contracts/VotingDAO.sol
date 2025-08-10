// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Optimized for Polygon Amoy Testnet - Lower Gas Costs

contract VotingDAO {
    struct Proposal {
        uint256 id;
        string title;
        string description;
        address creator;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 deadline;
        bool executed;
        bool exists;
    }
    
    struct Vote {
        bool hasVoted;
        bool vote; // true = yes, false = no
    }
    
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => Vote)) public votes;
    
    uint256 public proposalCount;
    uint256 public constant VOTING_PERIOD = 3 days;
    
    event ProposalCreated(
        uint256 indexed proposalId,
        string title,
        address indexed creator,
        uint256 deadline
    );
    
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        bool vote
    );
    
    modifier validProposal(uint256 _proposalId) {
        require(proposals[_proposalId].exists, "Proposal does not exist");
        _;
    }
    
    modifier votingActive(uint256 _proposalId) {
        require(block.timestamp < proposals[_proposalId].deadline, "Voting period ended");
        _;
    }
    
    function createProposal(
        string memory _title,
        string memory _description
    ) external {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        
        proposalCount++;
        uint256 deadline = block.timestamp + VOTING_PERIOD;
        
        proposals[proposalCount] = Proposal({
            id: proposalCount,
            title: _title,
            description: _description,
            creator: msg.sender,
            yesVotes: 0,
            noVotes: 0,
            deadline: deadline,
            executed: false,
            exists: true
        });
        
        emit ProposalCreated(proposalCount, _title, msg.sender, deadline);
    }
    
    function vote(uint256 _proposalId, bool _vote) 
        external 
        validProposal(_proposalId) 
        votingActive(_proposalId) 
    {
        require(!votes[_proposalId][msg.sender].hasVoted, "Already voted");
        
        votes[_proposalId][msg.sender] = Vote({
            hasVoted: true,
            vote: _vote
        });
        
        if (_vote) {
            proposals[_proposalId].yesVotes++;
        } else {
            proposals[_proposalId].noVotes++;
        }
        
        emit VoteCast(_proposalId, msg.sender, _vote);
    }
    
    function getProposal(uint256 _proposalId) 
        external 
        view 
        validProposal(_proposalId) 
        returns (
            uint256 id,
            string memory title,
            string memory description,
            address creator,
            uint256 yesVotes,
            uint256 noVotes,
            uint256 deadline,
            bool executed
        ) 
    {
        Proposal memory proposal = proposals[_proposalId];
        return (
            proposal.id,
            proposal.title,
            proposal.description,
            proposal.creator,
            proposal.yesVotes,
            proposal.noVotes,
            proposal.deadline,
            proposal.executed
        );
    }
    
    function getAllProposals() external view returns (uint256[] memory) {
        uint256[] memory proposalIds = new uint256[](proposalCount);
        for (uint256 i = 1; i <= proposalCount; i++) {
            proposalIds[i-1] = i;
        }
        return proposalIds;
    }
    
    function hasVoted(uint256 _proposalId, address _voter) 
        external 
        view 
        returns (bool) 
    {
        return votes[_proposalId][_voter].hasVoted;
    }
    
    function getVote(uint256 _proposalId, address _voter) 
        external 
        view 
        returns (bool hasVoted, bool vote) 
    {
        Vote memory userVote = votes[_proposalId][_voter];
        return (userVote.hasVoted, userVote.vote);
    }
}