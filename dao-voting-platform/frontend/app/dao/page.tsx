"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ethers } from 'ethers'
import WalletConnect from '@/components/dao/WalletConnect'
import ProposalForm from '@/components/dao/ProposalForm'
import ProposalList from '@/components/dao/ProposalList'
import { getContract } from '@/lib/contract'
import { checkNetwork, getNetworkName, addPolygonMainnet } from '@/lib/networks'

export default function DaoPage() {
  const router = useRouter()
  const [account, setAccount] = useState<string>('')
  const [contract, setContract] = useState<any>(null)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [loading, setLoading] = useState(false)
  const [networkError, setNetworkError] = useState(false)
  const [currentNetwork, setCurrentNetwork] = useState('')

  useEffect(() => {
    checkWalletConnection()
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const eth = (window as any).ethereum
      const handleChainChanged = async (chainId: string) => {
        setCurrentNetwork(getNetworkName(chainId))
        const isCorrect = await checkNetwork()
        setNetworkError(!isCorrect)
        if (isCorrect && account) await initializeContract()
      }
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) disconnectWallet()
        else if (accounts[0] !== account) setAccount(accounts[0])
      }
      eth.on('chainChanged', handleChainChanged)
      eth.on('accountsChanged', handleAccountsChanged)
      return () => {
        eth.removeListener('chainChanged', handleChainChanged)
        eth.removeListener('accountsChanged', handleAccountsChanged)
      }
    }
  }, [])

  const checkWalletConnection = async () => {
    const eth = (window as any).ethereum
    if (!eth) return
    try {
      const [accounts, chainId]: [string[], string] = await Promise.all([
        eth.request({ method: 'eth_accounts' }),
        eth.request({ method: 'eth_chainId' }),
      ])
      if (accounts.length > 0) {
        setAccount(accounts[0])
        setCurrentNetwork(getNetworkName(chainId))
        const isCorrect = await checkNetwork()
        setNetworkError(!isCorrect)
        if (isCorrect) await initializeContract()
      }
    } catch (e) {
      console.error('Error checking wallet connection:', e)
    }
  }

  const initializeContract = async () => {
    try {
      if (provider && signer && contract) return true
      const providerInstance = new ethers.BrowserProvider((window as any).ethereum)
      const signerInstance = await providerInstance.getSigner()
      const contractInstance = getContract(providerInstance, signerInstance)
      setProvider(providerInstance)
      setSigner(signerInstance)
      setContract(contractInstance)
      return true
    } catch (e) {
      console.error('Error initializing contract:', e)
      return false
    }
  }

  const connectWallet = async () => {
    const eth = (window as any).ethereum
    if (!eth) {
      alert('Please install MetaMask!')
      return
    }
    try {
      setLoading(true)
      const [accounts] = await Promise.all([
        eth.request({ method: 'eth_requestAccounts' }) as Promise<string[]>,
      ])
      // Fast network check and switch only if needed
      let isCorrect = await checkNetwork()
      if (!isCorrect) {
        await addPolygonMainnet()
        isCorrect = await checkNetwork()
      }
      setAccount(accounts[0])
      setNetworkError(!isCorrect)
      setCurrentNetwork(getNetworkName(await eth.request({ method: 'eth_chainId' })))
      if (!isCorrect) return
      const success = await initializeContract()
      if (!success) throw new Error('Failed to initialize contract')
    } catch (e) {
      console.error('Error connecting wallet:', e)
      alert('Error connecting wallet. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const disconnectWallet = () => {
    setAccount('')
    setContract(null)
    setProvider(null)
    setSigner(null)
    setNetworkError(false)
    router.push('/')
  }

  const switchToPolygonMainnet = async () => {
    try {
      await ensureCorrectNetwork()
    } catch (e) {
      console.error('Error switching network:', e)
    }
  }

  const handleProposalCreated = () => {
    setTimeout(() => {
      // ProposalList fetches on contract state, nothing to call directly here
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Geometric accents to match landing */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-24 left-16 w-24 h-24 border-2 border-cyan-400 rotate-45 animate-pulse"></div>
        <div className="absolute top-48 right-24 w-20 h-20 border-2 border-purple-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 left-1/5 w-16 h-16 bg-emerald-400 clip-path-triangle animate-spin"></div>
        <div className="absolute bottom-24 right-1/3 w-16 h-16 border-2 border-orange-400 rotate-12 animate-pulse"></div>
      </div>

      <header className="relative z-10 bg-slate-900/50 backdrop-blur border-b border-slate-800 px-6 py-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300">🏠 Home</button>
          <h1 className="font-black text-2xl">🗳️ DAO Voting</h1>
        </div>
        <p className="text-slate-300">Polygon Mainnet</p>
        <WalletConnect account={account} onConnect={connectWallet} onDisconnect={disconnectWallet} loading={loading} />
      </header>

      {networkError && account && (
        <div className="bg-gradient-to-r from-rose-500 to-amber-500 text-white text-center px-6 py-4 border-b-4 border-white/30">
          <div className="font-semibold">⚠️ Wrong Network</div>
          <div className="text-sm">Currently connected to: {currentNetwork}</div>
          <div className="text-sm">Please switch to Polygon Mainnet</div>
          <button onClick={switchToPolygonMainnet} className="mt-3 px-4 py-2 rounded-lg border border-white/50 hover:bg-white/10 transition">Switch to Polygon Mainnet</button>
        </div>
      )}

      <main className="relative z-10 mx-auto px-4 py-8">
        {account && !networkError ? (
          <div className="w-full max-w-2xl mx-auto space-y-6">
            <ProposalForm contract={contract} account={account} onProposalCreated={handleProposalCreated} />
            <ProposalList contract={contract} account={account} />
          </div>
        ) : !account ? (
          <div className="text-center text-white max-w-xl mx-auto mt-16">
            <h2 className="text-3xl font-bold mb-2 drop-shadow">Welcome to DAO Voting Platform</h2>
            <p className="text-white/90">Connect your wallet to create proposals and vote!</p>
            <div className="grid gap-2 mt-6">
              <div className="bg-slate-900/60 backdrop-blur px-4 py-2 rounded-lg border border-slate-800">✅ Create transparent proposals</div>
              <div className="bg-slate-900/60 backdrop-blur px-4 py-2 rounded-lg border border-slate-800">✅ Vote on community decisions</div>
              <div className="bg-slate-900/60 backdrop-blur px-4 py-2 rounded-lg border border-slate-800">✅ All votes stored on Polygon blockchain</div>
              <div className="bg-slate-900/60 backdrop-blur px-4 py-2 rounded-lg border border-slate-800">✅ Low gas fees with Polygon</div>
              <div className="bg-slate-900/60 backdrop-blur px-4 py-2 rounded-lg border border-slate-800">✅ Fully decentralized governance</div>
            </div>
            <div className="bg-slate-900/60 backdrop-blur rounded-2xl border border-slate-800 p-6 mt-8">
              <h3 className="text-xl font-semibold mb-2">🚀 Mainnet Deployment</h3>
              <p>This app uses Polygon Mainnet</p>
              <p>Real MATIC tokens required for transactions</p>
              <a href="https://polygonscan.com/" target="_blank" rel="noreferrer" className="inline-block mt-2 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700">View on PolygonScan</a>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  )
}


