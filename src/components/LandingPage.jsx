import { useState, useEffect } from 'react'
import { Crown, Diamond, Medal, Zap, Shield, TrendingUp, Users, DollarSign } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { createCheckout, getStats } from '../services/api'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

const tiers = [
  {
    id: 'gold',
    name: 'GOLD',
    emoji: '🥇',
    icon: Medal,
    price: 199,
    leads: 100,
    description: 'For the hungry. Start stacking.',
    features: [
      '100 High-Intent Leads/Month',
      'Basic Contact Intelligence',
      'Email Automation',
      'Gold Support',
    ],
    color: 'gold',
    popular: false,
  },
  {
    id: 'platinum',
    name: 'PLATINUM',
    emoji: '💎',
    icon: Diamond,
    price: 399,
    leads: 500,
    description: 'For the serious. Scale fast.',
    features: [
      '500 Verified Leads/Month',
      'AI Personalization Engine',
      'Multi-Channel Outreach',
      'CRM Integration',
      'Platinum Support',
    ],
    color: 'platinum',
    popular: true,
  },
  {
    id: 'crown',
    name: 'CROWN',
    emoji: '👑',
    icon: Crown,
    price: 999,
    leads: 'Unlimited',
    description: 'For the kings. Dominate markets.',
    features: [
      'Unlimited Leads',
      'White-Glove Setup',
      'Dedicated Account King',
      'Custom AI Training',
      'API Access',
    ],
    color: 'crown',
    popular: false,
  },
]

const stats = [
  { icon: DollarSign, value: '$47M+', label: 'Revenue Generated' },
  { icon: Users, value: '2,400+', label: 'Crown Members' },
  { icon: TrendingUp, value: '340%', label: 'Avg ROI' },
]

export default function LandingPage() {
  const [loading, setLoading] = useState(null)
  const [publicStats, setPublicStats] = useState({ subscribers: 2400, mrr: 0, arr: 0 })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const data = await getStats()
      setPublicStats(data)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  const handleSubscribe = async (tierId) => {
    setLoading(tierId)
    try {
      const { id: sessionId } = await createCheckout(tierId)
      const stripe = await stripePromise
      const { error } = await stripe.redirectToCheckout({ sessionId })
      if (error) throw error
    } catch (err) {
      alert('Crowning failed: ' + err.message)
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-fiilthy-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-fiilthy-black to-fiilthy-black" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          {/* Logo */}
          <div className="text-center mb-16">
            <div className="inline-block animate-float mb-8">
              <span className="text-8xl filter drop-shadow-[0_0_30px_rgba(255,215,0,0.5)]">👑</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black gradient-gold tracking-widest mb-6">
              FIILTHY
            </h1>
            <p className="text-xl md:text-2xl text-fiilthy-platinum tracking-[0.3em] uppercase font-light">
              Stack Subscriptions. Build Empire.
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-12 md:gap-20 mb-20">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <stat.icon className="w-6 h-6 text-fiilthy-gold" />
                  <span className="text-4xl md:text-5xl font-bold text-fiilthy-gold">
                    {stat.value}
                  </span>
                </div>
                <p className="text-gray-500 text-sm uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {tiers.map((tier) => {
            const Icon = tier.icon
            return (
              <div
                key={tier.id}
                className={`relative ${
                  tier.popular ? 'md:-mt-8 md:mb-8' : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-pink-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div
                  className={`relative p-8 rounded-2xl h-full ${
                    tier.popular
                      ? 'card-popular'
                      : tier.id === 'crown'
                      ? 'card-glass border-fiilthy-crown'
                      : 'card-glass'
                  }`}
                >
                  {/* Badge */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span
                      className={`px-6 py-1 rounded-full text-sm font-bold uppercase tracking-wider ${
                        tier.id === 'gold'
                          ? 'bg-fiilthy-gold text-black'
                          : tier.id === 'platinum'
                          ? 'bg-fiilthy-platinum text-black'
                          : 'bg-fiilthy-crown text-white'
                      }`}
                    >
                      {tier.name}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="text-center mt-6 mb-4">
                    <span className="text-6xl">{tier.emoji}</span>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-2">
                    <span className="text-5xl font-bold text-fiilthy-gold">${tier.price}</span>
                    <span className="text-gray-500">/mo</span>
                  </div>

                  <p className="text-center text-gray-400 italic mb-6">{tier.description}</p>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-fiilthy-gold flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSubscribe(tier.id)}
                    disabled={loading === tier.id}
                    className={`w-full py-4 rounded-lg font-bold uppercase tracking-widest transition-all duration-300 ${
                      tier.id === 'gold'
                        ? 'btn-gold'
                        : tier.id === 'platinum'
                        ? 'btn-platinum'
                        : 'btn-crown'
                    } ${loading === tier.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading === tier.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">👑</span> Securing...
                      </span>
                    ) : tier.id === 'gold' ? (
                      'Start Stacking'
                    ) : tier.id === 'platinum' ? (
                      'Claim Your Crown'
                    ) : (
                      'Ascend to Throne'
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Trust Section */}
      <section className="border-t border-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-fiilthy-gold" />
            <span className="text-gray-400">30-Day Money-Back Guarantee</span>
          </div>
          <p className="text-gray-500 text-sm">
            Trusted by revenue teams at Stripe, Notion, and 10,000+ companies
          </p>
        </div>
      </section>
    </div>
  )
}
