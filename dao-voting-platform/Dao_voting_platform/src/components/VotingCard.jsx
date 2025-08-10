import React, { useState } from 'react';
import { formatAddress, formatTime, isVotingActive, getTimeRemaining, handleTransactionError } from '../utils/contract';
import './VotingCard.css';

const VotingCard = ({ proposal, contract, account, onVoteCast }) => {
  const [voting, setVoting] = useState(false);
  const [selectedVote, setSelectedVote] = useState(null);

  const totalVotes = proposal.yesVotes + proposal.noVotes;
  const yesPercentage = totalVotes > 0 ? (proposal.yesVotes / totalVotes) * 100 : 0;
  const noPercentage = totalVotes > 0 ? (proposal.noVotes / totalVotes) * 100 : 0;
  const votingActive = isVotingActive(proposal.deadline);
  const timeRemaining = getTimeRemaining(proposal.deadline);
  const isCreator = proposal.creator.toLowerCase() === account.toLowerCase();

  const handleVote = async (voteChoice) => {
    if (!contract || voting) return;
    
    setSelectedVote(voteChoice);
    setVoting(true);

    try {
      console.log(`Voting ${voteChoice ? 'YES' : 'NO'} on proposal ${proposal.id}`);
      
      // Estimate gas
      const gasEstimate = await contract.vote.estimateGas(proposal.id, voteChoice);
      console.log('Gas estimate:', gasEstimate.toString());

      // Cast vote
      const tx = await contract.vote(proposal.id, voteChoice, {
        gasLimit: gasEstimate * 120n / 100n // Add 20% buffer
      });

      console.log('Vote transaction submitted:', tx.hash);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      console.log('Vote confirmed:', receipt);

      // Show success message
      const voteText = voteChoice ? 'YES' : 'NO';
      alert(`Vote cast successfully! 🗳️\nYou voted: ${voteText}\nTransaction: ${tx.hash}`);
      
      // Trigger refresh
      if (onVoteCast) {
        onVoteCast();
      }

    } catch (error) {
      console.error('Error casting vote:', error);
      const errorMessage = handleTransactionError(error);
      alert(`Error casting vote: ${errorMessage}`);
    } finally {
      setVoting(false);
      setSelectedVote(null);
    }
  };

  const getStatusBadge = () => {
    if (!votingActive) {
      return <span className="status-badge ended">Ended</span>;
    }
    return <span className="status-badge active">Active</span>;
  };

  const getResultIcon = () => {
    if (totalVotes === 0) return '🤷‍♂️';
    if (yesPercentage > noPercentage) return '✅';
    if (noPercentage > yesPercentage) return '❌';
    return '⚖️'; // tie
  };

  return (
    <div className={`voting-card ${!votingActive ? 'ended' : ''}`}>
      <div className="card-header">
        <div className="proposal-meta">
          <span className="proposal-id">#{proposal.id}</span>
          {getStatusBadge()}
        </div>
        <div className="creator-info">
          <span className="creator-label">Created by:</span>
          <span className={`creator-address ${isCreator ? 'own-proposal' : ''}`}>
            {isCreator ? 'You' : formatAddress(proposal.creator)}
          </span>
        </div>
      </div>

      <div className="card-content">
        <h3 className="proposal-title">{proposal.title}</h3>
        <p className="proposal-description">{proposal.description}</p>
      </div>

      <div className="voting-section">
        <div className="vote-stats">
          <div className="stats-header">
            <span className="result-icon">{getResultIcon()}</span>
            <span className="total-votes">{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</span>
          </div>
          
          <div className="vote-bars">
            <div className="vote-bar yes">
              <div className="vote-info">
                <span className="vote-option">✅ Yes</span>
                <span className="vote-count">{proposal.yesVotes}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill yes-fill" 
                  style={{ width: `${yesPercentage}%` }}
                ></div>
              </div>
              <span className="vote-percentage">{yesPercentage.toFixed(1)}%</span>
            </div>

            <div className="vote-bar no">
              <div className="vote-info">
                <span className="vote-option">❌ No</span>
                <span className="vote-count">{proposal.noVotes}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill no-fill" 
                  style={{ width: `${noPercentage}%` }}
                ></div>
              </div>
              <span className="vote-percentage">{noPercentage.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="voting-actions">
          {proposal.hasVoted ? (
            <div className="already-voted">
              <span className="voted-indicator">
                🗳️ You voted: {proposal.userVote ? 'YES' : 'NO'}
              </span>
            </div>
          ) : votingActive ? (
            <div className="vote-buttons">
              <button
                className={`vote-btn yes-btn ${selectedVote === true && voting ? 'voting' : ''}`}
                onClick={() => handleVote(true)}
                disabled={voting}
              >
                {selectedVote === true && voting ? (
                  <>⏳ Voting...</>
                ) : (
                  <>✅ Vote Yes</>
                )}
              </button>
              <button
                className={`vote-btn no-btn ${selectedVote === false && voting ? 'voting' : ''}`}
                onClick={() => handleVote(false)}
                disabled={voting}
              >
                {selectedVote === false && voting ? (
                  <>⏳ Voting...</>
                ) : (
                  <>❌ Vote No</>
                )}
              </button>
            </div>
          ) : (
            <div className="voting-ended">
              <span className="ended-message">Voting has ended</span>
            </div>
          )}
        </div>
      </div>

      <div className="card-footer">
        <div className="timing-info">
          <span className="time-icon">⏰</span>
          <span className="deadline">
            {votingActive ? timeRemaining : `Ended ${formatTime(proposal.deadline)}`}
          </span>
        </div>
        {votingActive && (
          <div className="voting-tip">
            <span className="tip-icon">💡</span>
            <span className="tip-text">Gas cost: ~0.001 MATIC</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VotingCard;