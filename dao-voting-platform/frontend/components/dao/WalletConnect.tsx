"use client"
import React from 'react'
import { formatAddress } from '@/lib/contract'

type Props = {
  account?: string
  onConnect: () => void
  onDisconnect: () => void
  loading?: boolean
}

export default function WalletConnect({ account, onConnect, onDisconnect, loading }: Props) {
  return (
    <div className="flex items-center gap-4">
      {account ? (
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur px-3 py-2 rounded-xl border border-white/20">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white flex items-center justify-center text-lg border border-white/30">
            👤
          </div>
          <div className="flex flex-col">
            <span className="text-white font-semibold font-mono text-sm">{formatAddress(account)}</span>
            <span className="text-xs text-white/80 bg-gradient-to-r from-purple-500 to-fuchsia-500 px-2 py-0.5 rounded-md border border-white/20 w-fit">Polygon Mainnet</span>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); onDisconnect() }}>
            <button
              type="submit"
              className="text-white text-sm px-3 py-1.5 rounded-md border border-white/30 hover:bg-white/10 transition"
              title="Disconnect Wallet"
            >
              🔌 Disconnect
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={onConnect}
          disabled={!!loading}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg border-2 border-white/20 disabled:opacity-70"
        >
          {loading ? '⏳ Connecting...' : (<span className="inline-flex items-center gap-2"><span>🦊</span> Connect MetaMask</span>)}
        </button>
      )}
    </div>
  )
}


