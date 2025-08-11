"use client"
import React, { useState } from 'react'
import { formatAddress, formatTime, isVotingActive, getTimeRemaining, handleTransactionError, getRelativeTimeFromNow } from '@/lib/contract'
import type { Proposal } from '@/lib/contract'

type Props = {
  proposal: Proposal
  contract: any
  account: string
  onVoteCast?: () => void
}

export default function VotingCard({ proposal, contract, account, onVoteCast }: Props) {
  const [voting, setVoting] = useState(false)
  const [selectedVote, setSelectedVote] = useState<boolean | null>(null)
  const [expanded, setExpanded] = useState(false)

  const totalVotes = proposal.yesVotes + proposal.noVotes
  const yesPercentage = totalVotes > 0 ? (proposal.yesVotes / totalVotes) * 100 : 0
  const noPercentage = totalVotes > 0 ? (proposal.noVotes / totalVotes) * 100 : 0
  const votingActive = isVotingActive(proposal.deadline)
  const timeRemaining = getTimeRemaining(proposal.deadline)
  const isCreator = proposal.creator.toLowerCase() === account.toLowerCase()

  const handleVote = async (voteChoice: boolean) => {
    if (!contract || voting) return
    setSelectedVote(voteChoice)
    setVoting(true)
    try {
      const gasEstimate = await contract.castVote.estimateGas(proposal.id, voteChoice)
      const tx = await contract.castVote(proposal.id, voteChoice, {
        gasLimit: (gasEstimate * 120n) / 100n,
      })
      await tx.wait()
      alert(`Vote cast successfully! You voted: ${voteChoice ? 'YES' : 'NO'}\nTx: ${tx.hash}`)
      onVoteCast?.()
    } catch (error: any) {
      const errorMessage = handleTransactionError(error)
      alert(`Error casting vote: ${errorMessage}`)
    } finally {
      setVoting(false)
      setSelectedVote(null)
    }
  }

  const getStatusBadge = () => (votingActive ? (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow">Active</span>
  ) : (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-500 to-gray-600 text-white">Ended</span>
  ))

  const getResultIcon = () => {
    if (totalVotes === 0) return '🤷‍♂️'
    if (yesPercentage > noPercentage) return '✅'
    if (noPercentage > yesPercentage) return '❌'
    return '⚖️'
  }

  return (
    <div className={`bg-slate-900/60 rounded-2xl p-5 md:p-6 shadow-2xl border border-slate-800 ${!votingActive ? 'opacity-95' : ''}`}>
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold font-mono px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300">#{proposal.id}</span>
          {getStatusBadge()}
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-xs uppercase tracking-wide text-slate-400">Posted {getRelativeTimeFromNow(proposal.deadline - 3*24*3600)}</span>
          <span className={`text-sm font-mono ${isCreator ? 'text-cyan-400 font-semibold' : 'text-slate-300'}`}>{isCreator ? 'You' : formatAddress(proposal.creator)}</span>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-black text-white mb-2">{proposal.title}</h3>
        <p className={`text-slate-300 text-sm leading-6 ${expanded ? '' : 'line-clamp-3'}`}>{proposal.description}</p>
        {proposal.description.length > 140 && (
          <button className="text-cyan-400 text-sm mt-1" onClick={() => setExpanded((v) => !v)}>
            {expanded ? 'Read less' : 'Read more'}
          </button>
        )}
      </div>

      <div className="mt-6 border-t pt-4">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xl">{getResultIcon()}</span>
            <span className="text-slate-600 text-sm font-medium">{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="min-w-[90px] flex items-center justify-between text-sm font-semibold"><span>✅ Yes</span><span className="text-slate-600 font-medium">{proposal.yesVotes}</span></div>
              <div className="flex-1 h-2 rounded bg-slate-100 overflow-hidden"><div className="h-full rounded bg-gradient-to-r from-emerald-500 to-green-500 transition-all" style={{ width: `${yesPercentage}%` }} /></div>
              <span className="min-w-[45px] text-right text-sm font-semibold text-slate-600">{yesPercentage.toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="min-w-[90px] flex items-center justify-between text-sm font-semibold"><span>❌ No</span><span className="text-slate-600 font-medium">{proposal.noVotes}</span></div>
              <div className="flex-1 h-2 rounded bg-slate-100 overflow-hidden"><div className="h-full rounded bg-gradient-to-r from-rose-500 to-red-500 transition-all" style={{ width: `${noPercentage}%` }} /></div>
              <span className="min-w-[45px] text-right text-sm font-semibold text-slate-600">{noPercentage.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          {proposal.hasVoted ? (
            <div className="text-center px-3 py-2 rounded-lg border border-slate-800 bg-slate-900/60 text-emerald-300 text-sm font-semibold">
              🗳️ You voted: {proposal.userVote ? 'YES' : 'NO'}
            </div>
          ) : votingActive ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                className={`px-4 py-2 rounded-lg font-bold text-white shadow ${selectedVote === true && voting ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:-translate-y-0.5'} transition`}
                onClick={() => handleVote(true)}
                disabled={voting}
              >
                {selectedVote === true && voting ? '⏳ Voting...' : '✅ Vote Yes'}
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-bold text-white shadow ${selectedVote === false && voting ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-purple-500 to-rose-500 hover:-translate-y-0.5'} transition`}
                onClick={() => handleVote(false)}
                disabled={voting}
              >
                {selectedVote === false && voting ? '⏳ Voting...' : '❌ Vote No'}
              </button>
            </div>
          ) : (
            <div className="text-center px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-sm font-medium">Voting has ended</div>
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap text-slate-300 text-sm">
        <div className="flex items-center gap-2"><span>⏰</span><span>{votingActive ? timeRemaining : `Ended ${formatTime(proposal.deadline)}`}</span></div>
        {votingActive && <div className="flex items-center gap-2"><span>💡</span><span>Gas cost: ~0.001 MATIC</span></div>}
      </div>
    </div>
  )
}


