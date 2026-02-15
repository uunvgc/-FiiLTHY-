import { useState, useEffect } from 'react'
import { Crown, Download, RefreshCw, Users, TrendingUp, DollarSign, Mail, Building2, Target } from 'lucide-react'
import { generateLeads, downloadLeads, getStats } from '../services/api'

export default function Dashboard() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    totalLeads: 0,
    avgScore: 0,
    tier: 'PLATINUM',
    subscribers: 0,
    mrr: 0
  })

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const data = await getStats()
      setStats(prev => ({
        ...prev,
        subscribers: data.subscribers,
        mrr: data.mrr
      }))
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  const handleGenerateLeads = async () => {
    setLoading(true)
    try {
      const data = await generateLeads('test_subscriber', 'platinum')
      setLeads(data.leads)
      setStats(prev => ({
        ...prev,
        totalLeads: data.leads_delivered,
        avgScore: Math.round(data.leads.reduce((acc, l) => acc + l.intent_score, 0) / data.leads.length)
      }))
    } catch (err) {
      alert('Error generating leads: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    downloadLeads('test_subscriber')
  }

  return (
    <div className="min-h-screen bg-fiilthy-black">
      {/* Header */}
      <header className="bg-gradient-to-r from-fiilthy-dark to-fiilthy-darker border-b border-fiilthy-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👑</span>
            <span className="text-2xl font-black gradient-gold tracking-wider">FIILTHY</span>
          </div>
          <div className="text-gray-400 text-sm">Your Lead Empire</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-glass p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-fiilthy-gold" />
              <span className="text-xs text-gray-500 uppercase tracking-wider">This Month</span>
            </div>
            <div className="text-4xl font-bold text-fiilthy-gold mb-1">
              {stats.totalLeads}
            </div>
            <div className="text-gray-400 text-sm">Leads Generated</div>
          </div>

          <div className="card-glass p-6 border-fiilthy-platinum">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-fiilthy-platinum" />
              <span className="text-xs text-gray-500 uppercase tracking-wider">Quality</span>
            </div>
            <div className="text-4xl font-bold text-fiilthy-platinum mb-1">
              {stats.avgScore || '—'}
            </div>
            <div className="text-gray-400 text-sm">Avg Intent Score</div>
          </div>

          <div className="card-glass p-6 border-fiilthy-crown">
            <div className="flex items-center justify-between mb-4">
              <Crown className="w-8 h-8 text-fiilthy-crown" />
              <span className="text-xs text-gray-500 uppercase tracking-wider">Plan</span>
            </div>
            <div className="text-4xl font-bold text-fiilthy-crown mb-1">
              {stats.tier}
            </div>
            <div className="text-gray-400 text-sm">Current Tier</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={handleGenerateLeads}
            disabled={loading}
            className="btn-gold flex items-center gap-2"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Target className="w-5 h-5" />
            )}
            {loading ? 'Mining Intent Data...' : '🚀 Generate Fresh Leads'}
          </button>
          
          <button
            onClick={handleDownload}
            className="btn-secondary bg-gray-800 text-white hover:bg-gray-700 flex items-center gap-2 px-8 py-4 rounded-lg font-bold uppercase tracking-widest transition-all"
          >
            <Download className="w-5 h-5" />
            Download CSV
          </button>
        </div>

        {/* Leads Table */}
        <div className="card-glass overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Building2 className="w-5 h-5 text-fiilthy-gold" />
              Discovered Prospects
            </h2>
          </div>
          
          {leads.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Target className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Click "Generate Fresh Leads" to discover your empire</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-6 py-4 text-fiilthy-gold font-semibold uppercase text-xs tracking-wider">Name</th>
                    <th className="text-left px-6 py-4 text-fiilthy-gold font-semibold uppercase text-xs tracking-wider">Title</th>
                    <th className="text-left px-6 py-4 text-fiilthy-gold font-semibold uppercase text-xs tracking-wider">Company</th>
                    <th className="text-left px-6 py-4 text-fiilthy-gold font-semibold uppercase text-xs tracking-wider">Score</th>
                    <th className="text-left px-6 py-4 text-fiilthy-gold font-semibold uppercase text-xs tracking-wider">Signals</th>
                    <th className="text-left px-6 py-4 text-fiilthy-gold font-semibold uppercase text-xs tracking-wider">AI Icebreaker</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, idx) => (
                    <tr key={idx} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold">{lead.name}</div>
                        <div className="text-sm text-gray-500">{lead.email}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{lead.title}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{lead.company}</div>
                        <div className="text-sm text-gray-500">{lead.domain}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                          lead.intent_score >= 90 ? 'bg-green-500/20 text-green-400' :
                          lead.intent_score >= 75 ? 'bg-fiilthy-gold/20 text-fiilthy-gold' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {lead.intent_score}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {lead.intent_signals.slice(0, 2).map((signal, i) => (
                            <span key={i} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                              {signal.replace(/_/g, ' ')}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-400 italic">"{lead.ai_personalization}"</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
