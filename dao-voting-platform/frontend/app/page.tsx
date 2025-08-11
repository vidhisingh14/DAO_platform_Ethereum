"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, Vote, Users, Shield, Clock, TrendingUp, CheckCircle, Globe, Zap, ArrowRight } from "lucide-react"

export default function LandingPage() {
  const [isConnecting, setIsConnecting] = useState(false)
  const router = useRouter()

  const handleConnectWallet = async () => {
    setIsConnecting(true)
    setTimeout(() => {
      setIsConnecting(false)
      router.push('/dao')
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Geometric Background Pattern */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-cyan-400 rotate-45 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border-2 border-purple-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-16 h-16 bg-emerald-400 clip-path-triangle animate-spin"></div>
        <div className="absolute bottom-20 right-1/3 w-20 h-20 border-2 border-orange-400 rotate-12 animate-pulse"></div>
      </div>

      {/* Hero Section with Asymmetric Layout */}
      <div className="relative min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8">
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 backdrop-blur-sm w-fit">
                <Globe className="w-4 h-4 mr-2" />
                Live on Polygon Amoy
              </Badge>

              <div className="space-y-6">
                <h1 className="text-6xl md:text-8xl font-black leading-none">
                  <span className="block text-white">VOTE</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400">
                    DECIDE
                  </span>
                  <span className="block text-white">GOVERN</span>
                </h1>

                <p className="text-xl text-slate-300 max-w-lg leading-relaxed">
                  Shape the future through transparent blockchain governance. Every voice matters, every vote counts.
                </p>
              </div>

              <Button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-12 py-8 text-xl font-bold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-white/20"
              >
                <Wallet className="w-8 h-8 mr-4" />
                {isConnecting ? "Connecting..." : "Connect & Vote"}
              </Button>
            </div>

            {/* Right Visual Element */}
            <div className="lg:col-span-5 relative">
              <div className="relative w-full h-96 lg:h-[500px]">
                {/* Voting Visualization */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Central Voting Circle */}
                    <div className="w-48 h-48 rounded-full border-4 border-cyan-400 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
                      <Vote className="w-16 h-16 text-cyan-400" />
                    </div>

                    {/* Orbiting Elements */}
                    <div className="absolute -top-8 -right-8 w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center animate-bounce">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center animate-pulse">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute top-1/2 -right-16 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center animate-spin">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 border border-slate-700 rounded-2xl bg-slate-900/30 backdrop-blur-sm">
              <div className="text-4xl font-black text-cyan-400 mb-2">~0.001</div>
              <div className="text-slate-400 uppercase tracking-wide">MATIC per Vote</div>
            </div>
            <div className="text-center p-6 border border-slate-700 rounded-2xl bg-slate-900/30 backdrop-blur-sm">
              <div className="text-4xl font-black text-purple-400 mb-2">72hrs</div>
              <div className="text-slate-400 uppercase tracking-wide">Voting Window</div>
            </div>
            <div className="text-center p-6 border border-slate-700 rounded-2xl bg-slate-900/30 backdrop-blur-sm">
              <div className="text-4xl font-black text-emerald-400 mb-2">100%</div>
              <div className="text-slate-400 uppercase tracking-wide">On-Chain</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section with Creative Layout */}
      <div className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              <span className="text-white">Built for</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                Democracy
              </span>
            </h2>
          </div>

          {/* Hexagonal Feature Grid */}
          <div className="relative max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {/* Feature 1 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative p-8 border border-slate-700 rounded-3xl bg-slate-900/50 backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300">
                  <div className="w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center mb-6 rotate-12 group-hover:rotate-0 transition-transform duration-300">
                    <Vote className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Binary Choice</h3>
                  <p className="text-slate-300 leading-relaxed">
                    Clear Yes/No decisions with real-time tallying and transparent results.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-emerald-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative p-8 border border-slate-700 rounded-3xl bg-slate-900/50 backdrop-blur-sm hover:border-purple-400/50 transition-all duration-300">
                  <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-6 rotate-12 group-hover:rotate-0 transition-transform duration-300">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Proposal Engine</h3>
                  <p className="text-slate-300 leading-relaxed">
                    Submit governance proposals with rich descriptions and community validation.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-orange-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative p-8 border border-slate-700 rounded-3xl bg-slate-900/50 backdrop-blur-sm hover:border-emerald-400/50 transition-all duration-300">
                  <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6 rotate-12 group-hover:rotate-0 transition-transform duration-300">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Cryptographic Security</h3>
                  <p className="text-slate-300 leading-relaxed">
                    One vote per wallet with immutable blockchain records and full transparency.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-cyan-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative p-8 border border-slate-700 rounded-3xl bg-slate-900/50 backdrop-blur-sm hover:border-orange-400/50 transition-all duration-300">
                  <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-6 rotate-12 group-hover:rotate-0 transition-transform duration-300">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Time-Locked Voting</h3>
                  <p className="text-slate-300 leading-relaxed">
                    72-hour voting periods with countdown timers and automatic closure.
                  </p>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative p-8 border border-slate-700 rounded-3xl bg-slate-900/50 backdrop-blur-sm hover:border-pink-400/50 transition-all duration-300">
                  <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center mb-6 rotate-12 group-hover:rotate-0 transition-transform duration-300">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Live Analytics</h3>
                  <p className="text-slate-300 leading-relaxed">
                    Real-time vote tracking with visual progress indicators and statistics.
                  </p>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-emerald-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative p-8 border border-slate-700 rounded-3xl bg-slate-900/50 backdrop-blur-sm hover:border-yellow-400/50 transition-all duration-300">
                  <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mb-6 rotate-12 group-hover:rotate-0 transition-transform duration-300">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Polygon Power</h3>
                  <p className="text-slate-300 leading-relaxed">
                    Lightning-fast transactions with minimal fees on Polygon's network.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Process Section with Creative Timeline */}
      <div className="py-32 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Democracy in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Motion</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Connecting Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-cyan-400 via-purple-400 to-emerald-400"></div>

              {/* Steps */}
              <div className="space-y-24">
                {/* Step 1 */}
                <div className="relative flex items-center">
                  <div className="flex-1 text-right pr-8">
                    <h3 className="text-3xl font-bold text-white mb-4">Connect Your Identity</h3>
                    <p className="text-slate-300 text-lg">
                      Link your MetaMask wallet to establish your voting identity on the blockchain.
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center relative z-10 border-4 border-slate-950">
                    <Wallet className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 pl-8"></div>
                </div>

                {/* Step 2 */}
                <div className="relative flex items-center">
                  <div className="flex-1 pr-8"></div>
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center relative z-10 border-4 border-slate-950">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 text-left pl-8">
                    <h3 className="text-3xl font-bold text-white mb-4">Explore Governance</h3>
                    <p className="text-slate-300 text-lg">
                      Browse active proposals or create your own to shape the community's future.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex items-center">
                  <div className="flex-1 text-right pr-8">
                    <h3 className="text-3xl font-bold text-white mb-4">Cast Your Decision</h3>
                    <p className="text-slate-300 text-lg">
                      Vote Yes or No on proposals that align with your vision for the community.
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center relative z-10 border-4 border-slate-950">
                    <Vote className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 pl-8"></div>
                </div>

                {/* Step 4 */}
                <div className="relative flex items-center">
                  <div className="flex-1 pr-8"></div>
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center relative z-10 border-4 border-slate-950">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 text-left pl-8">
                    <h3 className="text-3xl font-bold text-white mb-4">Watch Democracy Unfold</h3>
                    <p className="text-slate-300 text-lg">
                      Monitor real-time results and see how collective decisions shape the future.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Powered by{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                Innovation
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl mx-auto">
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-white mb-8 flex items-center">
                <div className="w-8 h-8 bg-cyan-500 rounded-lg mr-4"></div>
                Frontend Arsenal
              </h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <CheckCircle className="w-6 h-6 text-cyan-400" />
                  <span className="text-xl text-slate-300">React 19.1 + Vite Lightning</span>
                </div>
                <div className="flex items-center space-x-4">
                  <CheckCircle className="w-6 h-6 text-cyan-400" />
                  <span className="text-xl text-slate-300">Ethers.js v6 Blockchain Bridge</span>
                </div>
                <div className="flex items-center space-x-4">
                  <CheckCircle className="w-6 h-6 text-cyan-400" />
                  <span className="text-xl text-slate-300">Responsive Design System</span>
                </div>
                <div className="flex items-center space-x-4">
                  <CheckCircle className="w-6 h-6 text-cyan-400" />
                  <span className="text-xl text-slate-300">MetaMask Deep Integration</span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-white mb-8 flex items-center">
                <div className="w-8 h-8 bg-purple-500 rounded-lg mr-4"></div>
                Blockchain Foundation
              </h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <CheckCircle className="w-6 h-6 text-purple-400" />
                  <span className="text-xl text-slate-300">Solidity ^0.8.19 Smart Contracts</span>
                </div>
                <div className="flex items-center space-x-4">
                  <CheckCircle className="w-6 h-6 text-purple-400" />
                  <span className="text-xl text-slate-300">Polygon Amoy Testnet</span>
                </div>
                <div className="flex items-center space-x-4">
                  <CheckCircle className="w-6 h-6 text-purple-400" />
                  <span className="text-xl text-slate-300">Gas Optimization Engine</span>
                </div>
                <div className="flex items-center space-x-4">
                  <CheckCircle className="w-6 h-6 text-purple-400" />
                  <span className="text-xl text-slate-300">Military-Grade Security</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-emerald-500/10"></div>
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-6xl md:text-7xl font-black text-white mb-8">
            The Future is
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400">
              Decentralized
            </span>
          </h2>
          <p className="text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join the revolution of transparent governance. Your voice, your vote, your future.
          </p>

          <Button
            onClick={handleConnectWallet}
            disabled={isConnecting}
            className="bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500 hover:from-cyan-600 hover:via-purple-600 hover:to-emerald-600 text-white px-16 py-8 text-2xl font-black rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-white/20"
          >
            <Wallet className="w-10 h-10 mr-4" />
            {isConnecting ? "Connecting..." : "Enter the DAO"}
            <ArrowRight className="w-10 h-10 ml-4" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-16 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400 text-lg">
            Built for the decentralized future • Contract: 0x9e4556466798bcD6F97133a1C7556f324c28203A
          </p>
        </div>
      </footer>
    </div>
  )
}
