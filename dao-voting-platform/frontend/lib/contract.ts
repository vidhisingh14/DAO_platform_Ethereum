import { ethers } from 'ethers'
import { checkNetwork, addPolygonMainnet } from './networks'

export const CONTRACT_ADDRESS = '0x739564a8771eA5165672CBF438694EFA94C3eEC7'

export const CONTRACT_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'proposalId', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'title', type: 'string' },
      { indexed: true, internalType: 'address', name: 'creator', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'deadline', type: 'uint256' },
    ],
    name: 'ProposalCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'proposalId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'voter', type: 'address' },
      { indexed: false, internalType: 'bool', name: 'voteChoice', type: 'bool' },
    ],
    name: 'VoteCast',
    type: 'event',
  },
  { inputs: [], name: 'VOTING_PERIOD', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  {
    inputs: [
      { internalType: 'uint256', name: '_proposalId', type: 'uint256' },
      { internalType: 'bool', name: '_voteChoice', type: 'bool' },
    ],
    name: 'castVote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: '_title', type: 'string' },
      { internalType: 'string', name: '_description', type: 'string' },
    ],
    name: 'createProposal',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllProposals',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_proposalId', type: 'uint256' }],
    name: 'getProposal',
    outputs: [
      { internalType: 'uint256', name: 'id', type: 'uint256' },
      { internalType: 'string', name: 'title', type: 'string' },
      { internalType: 'string', name: 'description', type: 'string' },
      { internalType: 'address', name: 'creator', type: 'address' },
      { internalType: 'uint256', name: 'yesVotes', type: 'uint256' },
      { internalType: 'uint256', name: 'noVotes', type: 'uint256' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
      { internalType: 'bool', name: 'executed', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_proposalId', type: 'uint256' },
      { internalType: 'address', name: '_voter', type: 'address' },
    ],
    name: 'getUserVote',
    outputs: [
      { internalType: 'bool', name: 'userHasVoted', type: 'bool' },
      { internalType: 'bool', name: 'voteChoice', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_proposalId', type: 'uint256' },
      { internalType: 'address', name: '_voter', type: 'address' },
    ],
    name: 'hasUserVoted',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  { inputs: [], name: 'proposalCount', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'proposals',
    outputs: [
      { internalType: 'uint256', name: 'id', type: 'uint256' },
      { internalType: 'string', name: 'title', type: 'string' },
      { internalType: 'string', name: 'description', type: 'string' },
      { internalType: 'address', name: 'creator', type: 'address' },
      { internalType: 'uint256', name: 'yesVotes', type: 'uint256' },
      { internalType: 'uint256', name: 'noVotes', type: 'uint256' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
      { internalType: 'bool', name: 'executed', type: 'bool' },
      { internalType: 'bool', name: 'exists', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'address', name: '', type: 'address' },
    ],
    name: 'votes',
    outputs: [
      { internalType: 'bool', name: 'hasVoted', type: 'bool' },
      { internalType: 'bool', name: 'voteChoice', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

export const getContract = (provider: ethers.BrowserProvider, signer: ethers.Signer | null = null) => {
  if (!CONTRACT_ADDRESS) {
    console.error('Contract address not set')
    return null
  }
  if (!CONTRACT_ABI || CONTRACT_ABI.length === 0) {
    console.error('Contract ABI not set')
    return null
  }
  if (signer) {
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
  }
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
}

export const ensureCorrectNetwork = async () => {
  const isCorrectNetwork = await checkNetwork()
  if (!isCorrectNetwork) {
    await addPolygonMainnet()
    return true
  }
  return false
}

export const formatAddress = (address?: string) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const formatTime = (timestamp: number) => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleString()
}

export const isVotingActive = (deadline: number) => {
  const now = Math.floor(Date.now() / 1000)
  return now < deadline
}

export const getTimeRemaining = (deadline: number) => {
  const now = Math.floor(Date.now() / 1000)
  const remaining = deadline - now
  if (remaining <= 0) return 'Voting ended'
  const days = Math.floor(remaining / (24 * 3600))
  const hours = Math.floor((remaining % (24 * 3600)) / 3600)
  const minutes = Math.floor((remaining % 3600) / 60)
  if (days > 0) return `${days}d ${hours}h remaining`
  if (hours > 0) return `${hours}h ${minutes}m remaining`
  return `${minutes}m remaining`
}

export const getRelativeTimeFromNow = (timestamp: number) => {
  const nowMs = Date.now()
  const tsMs = timestamp * 1000
  const diff = nowMs - tsMs
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  if (diff < minute) return 'just now'
  if (diff < hour) {
    const m = Math.floor(diff / minute)
    return `${m}m ago`
  }
  if (diff < day) {
    const h = Math.floor(diff / hour)
    return `${h}h ago`
  }
  const d = Math.floor(diff / day)
  return `${d}d ago`
}

export const handleTransactionError = (error: any) => {
  if (error?.code === 'ACTION_REJECTED') return 'Transaction was rejected by user'
  if (error?.code === 'INSUFFICIENT_FUNDS') return 'Insufficient funds for transaction'
  if (typeof error?.message === 'string' && error.message.includes('revert')) {
    const match = error.message.match(/revert (.*)/)
    return match ? match[1] : 'Transaction failed'
  }
  return 'Transaction failed. Please try again.'
}

export type Proposal = {
  id: number
  title: string
  description: string
  creator: string
  yesVotes: number
  noVotes: number
  deadline: number
  executed: boolean
  hasVoted?: boolean
  userVote?: boolean | null
}
