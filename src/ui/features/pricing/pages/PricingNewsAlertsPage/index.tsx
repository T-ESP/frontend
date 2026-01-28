import { useState } from 'react';
import PageLayout from "@/ui/components/layouts/PageLayout";
import { FiCheck, FiX, FiHelpCircle } from "react-icons/fi";

const TIERS = [
  {
    name: "Starter",
    description: "Perfect for small convenience stores.",
    priceMonthly: 29,
    priceYearly: 290,
    features: [
      "Up to 1,000 Products",
      "Basic Sales Dashboard",
      "1 User Account",
      "Email Support",
      "Manual Backups"
    ],
    notIncluded: [
      "AI Predictions",
      "Supplier API Integration",
      "Multi-store Management",
      "Priority Support"
    ],
    color: "blue",
    cta: "Start Free Trial"
  },
  {
    name: "Professional",
    description: "For growing supermarkets and chains.",
    priceMonthly: 99,
    priceYearly: 990,
    popular: true,
    features: [
      "Up to 50,000 Products",
      "Advanced Analytics & KPIs",
      "5 User Accounts",
      "AI Stock Predictions",
      "Supplier Integration",
      "Daily Automated Backups"
    ],
    notIncluded: [
      "Custom ERP Integrations",
      "Dedicated Account Manager"
    ],
    color: "purple",
    cta: "Get Started"
  },
  {
    name: "Enterprise",
    description: "Full control for large retail networks.",
    priceMonthly: 299,
    priceYearly: 2990,
    features: [
      "Unlimited Products",
      "Custom AI Models",
      "Unlimited Users",
      "Multi-Store Sync",
      "Dedicated Account Manager",
      "24/7 Phone Support",
      "On-premise Deployment Option"
    ],
    notIncluded: [],
    color: "emerald",
    cta: "Contact Sales"
  }
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <PageLayout 
      title="Subscription Plans" 
      subtitle="Choose the perfect plan for your retail business"
    >
      {/* Billing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="bg-gray-100 p-1 rounded-xl flex items-center relative">
          <button
            onClick={() => setIsYearly(false)}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              !isYearly ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isYearly ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Yearly <span className="text-emerald-600 text-xs ml-1 font-bold">-20%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {TIERS.map((tier) => (
          <div 
            key={tier.name}
            className={`relative bg-white rounded-2xl p-8 border transition-all duration-300 ${
              tier.popular 
                ? 'border-purple-200 shadow-xl scale-105 z-10 ring-1 ring-purple-100' 
                : 'border-gray-200 shadow-sm hover:shadow-md'
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                Most Popular
              </div>
            )}

            <div className="text-center mb-8">
              <h3 className={`text-lg font-bold text-${tier.color}-600 mb-2`}>{tier.name}</h3>
              <p className="text-gray-500 text-sm h-10">{tier.description}</p>
              <div className="mt-4 flex items-baseline justify-center gap-1">
                <span className="text-4xl font-extrabold text-gray-900">
                  €{isYearly ? tier.priceYearly : tier.priceMonthly}
                </span>
                <span className="text-gray-500">/{isYearly ? 'year' : 'month'}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                  <div className={`mt-0.5 p-1 rounded-full bg-${tier.color}-50 text-${tier.color}-600`}>
                    <FiCheck size={12} />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
              {tier.notIncluded.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm opacity-50">
                  <div className="mt-0.5 p-1 rounded-full bg-gray-100 text-gray-400">
                    <FiX size={12} />
                  </div>
                  <span className="text-gray-500 decoration-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            <button className={`w-full py-3 rounded-xl font-semibold transition-colors ${
              tier.popular
                ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-200'
                : 'bg-gray-50 text-gray-900 hover:bg-gray-100 border border-gray-200'
            }`}>
              {tier.cta}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mt-20 max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <FiHelpCircle className="text-gray-400" /> Can I upgrade later?
            </h4>
            <p className="text-gray-600 mt-2 text-sm ml-6">Yes, you can upgrade or downgrade your plan at any time. The price will be prorated based on your billing cycle.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <FiHelpCircle className="text-gray-400" /> Is there a setup fee?
            </h4>
            <p className="text-gray-600 mt-2 text-sm ml-6">No, there are no hidden setup fees. You only pay the monthly or yearly subscription cost.</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}