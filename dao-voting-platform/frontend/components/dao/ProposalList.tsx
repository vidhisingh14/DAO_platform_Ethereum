"use client"
import React, { useEffect, useState } from 'react'
import VotingCard from './VotingCard'
import type { Proposal } from '@/lib/contract'

type Props = {
  contract: any
  account: string
}

export default function ProposalList({ contract, account }: Props) {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'ended' | 'myProposals'>('all')

  useEffect(() => {
    if (contract && account) {
      loadProposals()
    }
  }, [contract, account])

  const loadProposals = async () => {
    try {
      setLoading(true)
      if (!contract || !account) {
        setProposals([])
        return
      }
      const proposalCount = await contract.proposalCount()
      if (Number(proposalCount) === 0) {
        setProposals([])
        return
      }
      const loaded: Proposal[] = []
      for (let i = 1; i <= Number(proposalCount); i++) {
        try {
          const p = await contract.getProposal(i)
          const hasVoted: boolean = await contract.hasUserVoted(i, account)
          let userVote: boolean | null = null
          if (hasVoted) {
            const voteData = await contract.getUserVote(i, account)
            userVote = voteData[1]
          }
          loaded.push({
            id: Number(i),
            title: p[1],
            description: p[2],
            creator: p[3],
            yesVotes: Number(p[4]),
            noVotes: Number(p[5]),
            deadline: Number(p[6]),
            executed: p[7],
            hasVoted,
            userVote,
          })
        } catch {}
      }
      loaded.sort((a, b) => b.id - a.id)
      setProposals(loaded)
    } catch (e) {
      console.error('Error loading proposals:', e)
    } finally {
      setLoading(false)
    }
  }

  const updateProposal = async (proposalId: number) => {
    try {
      const p = await contract.getProposal(proposalId)
      const hasVoted: boolean = await contract.hasUserVoted(proposalId, account)
      let userVote: boolean | null = null
      if (hasVoted) {
        const voteData = await contract.getUserVote(proposalId, account)
        userVote = voteData[1]
      }
      const updated: Proposal = {
        id: Number(proposalId),
        title: p[1],
        description: p[2],
        creator: p[3],
        yesVotes: Number(p[4]),
        noVotes: Number(p[5]),
        deadline: Number(p[6]),
        executed: p[7],
        hasVoted,
        userVote,
      }
      setProposals((prev) => prev.map((x) => (x.id === updated.id ? updated : x)))
    } catch (e) {
      console.error(`Error updating proposal ${proposalId}:`, e)
    }
  }

  const now = Math.floor(Date.now() / 1000)
  const filtered = proposals.filter((p) => {
    if (filter === 'active') return p.deadline > now
    if (filter === 'ended') return p.deadline <= now
    if (filter === 'myProposals') return p.creator.toLowerCase() === account.toLowerCase()
    return true
  })

  const activeCount = proposals.filter((p) => p.deadline > now).length
  const endedCount = proposals.filter((p) => p.deadline <= now).length
  const myCount = proposals.filter((p) => p.creator.toLowerCase() === account.toLowerCase()).length

  if (loading) {
    return (
      <div className="w-full text-center py-12 text-slate-300">
        <div className="text-2xl mb-2 animate-spin inline-block">⏳</div>
        <p>Loading proposals...</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
        <h2 className="text-lg font-black text-white">For you</h2>
        <button className="px-3 py-1.5 rounded-lg text-white bg-slate-800 border border-slate-700 hover:bg-slate-700 transition" onClick={loadProposals}>🔄 Refresh</button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-300">
          <div className="text-4xl mb-2 opacity-60">📭</div>
          <h3 className="text-white font-semibold mb-1">
            {filter === 'all' && 'No proposals yet'}
            {filter === 'active' && 'No active proposals'}
            {filter === 'ended' && 'No ended proposals'}
            {filter === 'myProposals' && "You haven't created any proposals yet"}
          </h3>
          <p className="text-slate-400 max-w-md mx-auto">
            {filter === 'myProposals' ? 'Create your first proposal to get started!' : 'Be the first to create a proposal and start the governance process!'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((p) => (
            <VotingCard key={p.id} proposal={p} contract={contract} account={account} onVoteCast={() => updateProposal(p.id)} />
          ))}
        </div>
      )}
    </div>
  )
}


