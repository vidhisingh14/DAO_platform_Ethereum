"use client"
import React, { useState } from 'react'
import { handleTransactionError } from '@/lib/contract'

type Props = {
  contract: any
  account: string
  onProposalCreated?: () => void
}

export default function ProposalForm({ contract, account, onProposalCreated }: Props) {
  const [formData, setFormData] = useState({ title: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if ((errors as any)[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors: { title?: string; description?: string } = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    else if (formData.title.trim().length < 5) newErrors.title = 'Title must be at least 5 characters'
    else if (formData.title.trim().length > 100) newErrors.title = 'Title must be less than 100 characters'

    if (!formData.description.trim()) newErrors.description = 'Description is required'
    else if (formData.description.trim().length < 10) newErrors.description = 'Description must be at least 10 characters'
    else if (formData.description.trim().length > 500) newErrors.description = 'Description must be less than 500 characters'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    if (!contract) {
      alert('Contract not initialized. Please refresh and try again.')
      return
    }
    setLoading(true)
    try {
      const gasEstimate = await contract.createProposal.estimateGas(
        formData.title.trim(),
        formData.description.trim()
      )
      const tx = await contract.createProposal(
        formData.title.trim(),
        formData.description.trim(),
        { gasLimit: (gasEstimate * 120n) / 100n }
      )
      await tx.wait()
      setFormData({ title: '', description: '' })
      alert(`Proposal created successfully! \nTransaction: ${tx.hash}`)
      onProposalCreated?.()
    } catch (error: any) {
      const errorMessage = handleTransactionError(error)
      alert(`Error creating proposal: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = formData.title.trim() && formData.description.trim() && !loading

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-2xl backdrop-blur">
      <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">📝 Create Proposal</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="flex items-center justify-between text-slate-300 font-semibold text-sm mb-2">
            <span>Proposal Title *</span>
            <span className="text-slate-400 text-xs">{formData.title.length}/100</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter a clear, concise title for your proposal"
            className={`w-full px-3 py-2 rounded-lg border ${errors.title ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-700 focus:border-cyan-400 ring-2 ring-cyan-400/20'} bg-slate-900 text-white placeholder:text-slate-500`}
            maxLength={100}
            disabled={loading}
          />
          {errors.title && <span className="text-red-400 text-xs mt-1 block">{errors.title}</span>}
        </div>

        <div>
          <label htmlFor="description" className="flex items-center justify-between text-slate-300 font-semibold text-sm mb-2">
            <span>Description *</span>
            <span className="text-slate-400 text-xs">{formData.description.length}/500</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Provide detailed information about your proposal. What are you proposing and why should people vote for it?"
            rows={6}
            className={`w-full px-3 py-2 rounded-lg border ${errors.description ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-700 focus:border-cyan-400 ring-2 ring-cyan-400/20'} bg-slate-900 text-white placeholder:text-slate-500`}
            maxLength={500}
            disabled={loading}
          />
          {errors.description && <span className="text-red-400 text-xs mt-1 block">{errors.description}</span>}
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 grid gap-2 text-slate-300 text-sm">
          <div className="flex items-center gap-2"><span>⏰</span><span>Voting period: 3 days</span></div>
          <div className="flex items-center gap-2"><span>💰</span><span>Gas fee: ~0.001 MATIC</span></div>
          <div className="flex items-center gap-2"><span>🔗</span><span>Stored on Polygon blockchain</span></div>
        </div>

        <button
          type="submit"
          className={`w-full text-white font-bold px-4 py-3 rounded-xl border-2 transition ${loading ? 'bg-gradient-to-r from-orange-500 to-amber-500 border-white/10' : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 border-white/10 shadow-2xl hover:-translate-y-0.5'}`}
          disabled={!isFormValid}
        >
          {loading ? '⏳ Creating Proposal...' : '🚀 Create Proposal'}
        </button>
      </form>
    </div>
  )
}


