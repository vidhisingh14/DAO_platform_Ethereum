import React, { useState, useEffect } from 'react';
import VotingCard from './VotingCard';
import { formatAddress } from '../utils/contract';
import './ProposalList.css';

const ProposalList = ({ contract, account }) => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, ended, myProposals

  useEffect(() => {
    if (contract) {
      loadProposals();
    }
  }, [contract, account]);

  const loadProposals = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading proposals...');
      console.log('Contract:', contract);
      
      if (!contract) {
        console.error('❌ Contract not initialized');
        setProposals([]);
        return;
      }
      
      // First, get the proposal count
      console.log('📞 Getting proposal count...');
      const proposalCount = await contract.proposalCount();
      console.log('✅ Proposal count:', Number(proposalCount));
      
      if (Number(proposalCount) === 0) {
        console.log('📭 No proposals found');
        setProposals([]);
        return;
      }
      
      // Load each proposal by ID (1 to proposalCount)
      const loadedProposals = [];
      for (let i = 1; i <= Number(proposalCount); i++) {
        try {
          console.log(`📞 Loading proposal ${i}...`);
          const proposal = await contract.getProposal(i);
          const hasVoted = await contract.hasVoted(i, account);
          let userVote = null;
          
          if (hasVoted) {
            const voteData = await contract.getVote(i, account);
            userVote = voteData[1];
          }

          const proposalData = {
            id: Number(i),
            title: proposal[1],
            description: proposal[2],
            creator: proposal[3],
            yesVotes: Number(proposal[4]),
            noVotes: Number(proposal[5]),
            deadline: Number(proposal[6]),
            executed: proposal[7],
            hasVoted,
            userVote
          };
          
          loadedProposals.push(proposalData);
          console.log(`✅ Loaded proposal ${i}:`, proposalData);
        } catch (error) {
          console.error(`❌ Error loading proposal ${i}:`, error);
        }
      }

      const sortedProposals = loadedProposals.sort((a, b) => b.id - a.id);
      setProposals(sortedProposals);
      console.log('✅ All proposals loaded:', sortedProposals);
      
    } catch (error) {
      console.error('❌ Error loading proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProposal = async (proposalId) => {
    try {
      const proposal = await contract.getProposal(proposalId);
      const hasVoted = await contract.hasVoted(proposalId, account);
      let userVote = null;
      
      if (hasVoted) {
        const voteData = await contract.getVote(proposalId, account);
        userVote = voteData[1];
      }

      const updatedProposal = {
        id: Number(proposalId),
        title: proposal[1],
        description: proposal[2],
        creator: proposal[3],
        yesVotes: Number(proposal[4]),
        noVotes: Number(proposal[5]),
        deadline: Number(proposal[6]),
        executed: proposal[7],
        hasVoted,
        userVote
      };

      setProposals(prev => prev.map(p => 
        p.id === updatedProposal.id ? updatedProposal : p
      ));
    } catch (error) {
      console.error('Error updating proposal:', error);
    }
  };

  const getFilteredProposals = () => {
    const now = Math.floor(Date.now() / 1000);
    
    switch (filter) {
      case 'active':
        return proposals.filter(p => p.deadline > now);
      case 'ended':
        return proposals.filter(p => p.deadline <= now);
      case 'myProposals':
        return proposals.filter(p => p.creator.toLowerCase() === account.toLowerCase());
      default:
        return proposals;
    }
  };

  const filteredProposals = getFilteredProposals();
  const activeCount = proposals.filter(p => p.deadline > Math.floor(Date.now() / 1000)).length;
  const endedCount = proposals.filter(p => p.deadline <= Math.floor(Date.now() / 1000)).length;
  const myProposalsCount = proposals.filter(p => p.creator.toLowerCase() === account.toLowerCase()).length;

  if (loading) {
    return (
      <div className="proposal-list">
        <h2>📊 Proposals</h2>
        <div className="loading-state">
          <div className="spinner">⏳</div>
          <p>Loading proposals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="proposal-list">
      <div className="proposals-header">
        <h2>📊 Proposals</h2>
        <button 
          className="refresh-btn"
          onClick={loadProposals}
          disabled={loading}
        >
          🔄 Refresh
        </button>
      </div>

      <div className="filter-tabs">
        <button 
          className={`tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({proposals.length})
        </button>
        <button 
          className={`tab ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active ({activeCount})
        </button>
        <button 
          className={`tab ${filter === 'ended' ? 'active' : ''}`}
          onClick={() => setFilter('ended')}
        >
          Ended ({endedCount})
        </button>
        <button 
          className={`tab ${filter === 'myProposals' ? 'active' : ''}`}
          onClick={() => setFilter('myProposals')}
        >
          My Proposals ({myProposalsCount})
        </button>
      </div>

      {filteredProposals.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>
            {filter === 'all' && 'No proposals yet'}
            {filter === 'active' && 'No active proposals'}
            {filter === 'ended' && 'No ended proposals'}
            {filter === 'myProposals' && 'You haven\'t created any proposals yet'}
          </h3>
          <p>
            {filter === 'myProposals' 
              ? 'Create your first proposal to get started!'
              : 'Be the first to create a proposal and start the governance process!'
            }
          </p>
        </div>
      ) : (
        <div className="proposals-grid">
          {filteredProposals.map(proposal => (
            <VotingCard
              key={proposal.id}
              proposal={proposal}
              contract={contract}
              account={account}
              onVoteCast={() => updateProposal(proposal.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProposalList;