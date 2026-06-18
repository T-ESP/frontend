import { useState } from 'react';
import PageLayout from "@/ui/components/layouts/PageLayout";
import { FiCheck, FiX, FiHelpCircle } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export default function PricingPage() {
  const { t } = useTranslation();
  const [isYearly, setIsYearly] = useState(false);

  const TIERS = [
    {
      name: t('pricing.tiers.starter'),
      description: t('pricing.tiers.starter_desc'),
      priceMonthly: 29,
      priceYearly: 290,
      features: [
        t('pricing.features.products_1k'),
        t('pricing.features.dashboard_basic'),
        t('pricing.features.users_1'),
        t('pricing.features.support_email'),
        t('pricing.features.backups_manual')
      ],
      notIncluded: [
        t('pricing.features.predictions_ai'),
        t('pricing.features.integration_supplier'),
        t('pricing.features.multi_store'),
        t('pricing.features.support_priority')
      ],
      color: "blue",
      cta: t('pricing.cta.start_trial')
    },
    {
      name: t('pricing.tiers.professional'),
      description: t('pricing.tiers.professional_desc'),
      priceMonthly: 99,
      priceYearly: 990,
      popular: true,
      features: [
        t('pricing.features.products_50k'),
        t('pricing.features.analytics_advanced'),
        t('pricing.features.users_5'),
        t('pricing.features.predictions_stock'),
        t('pricing.features.integration_supplier'),
        t('pricing.features.backups_daily')
      ],
      notIncluded: [
        t('pricing.features.erp_custom'),
        t('pricing.features.account_manager')
      ],
      color: "purple",
      cta: t('pricing.cta.get_started')
    },
    {
      name: t('pricing.tiers.enterprise'),
      description: t('pricing.tiers.enterprise_desc'),
      priceMonthly: 299,
      priceYearly: 2990,
      features: [
        t('pricing.features.products_unlimited'),
        t('pricing.features.models_custom'),
        t('pricing.features.users_unlimited'),
        t('pricing.features.multi_store_sync'),
        t('pricing.features.account_manager'),
        t('pricing.features.support_phone'),
        t('pricing.features.on_premise')
      ],
      notIncluded: [],
      color: "emerald",
      cta: t('pricing.cta.contact_sales')
    }
  ];

  return (
    <PageLayout
      title={t('pricing.title')}
      subtitle={t('pricing.subtitle')}
    >
      {/* Billing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="bg-muted p-1 rounded-xl flex items-center relative">
          <button
            onClick={() => setIsYearly(false)}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${!isYearly ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            {t('pricing.billing.monthly')}
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isYearly ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            {t('pricing.billing.yearly')} <span className="text-emerald-600 dark:text-emerald-400 text-xs ml-1 font-bold">-20%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`relative bg-card rounded-lg p-8 border transition-all duration-300 ${tier.popular
                ? 'border-purple-200 shadow-xl scale-105 z-10 ring-1 ring-purple-100'
                : 'border-border shadow-sm hover:shadow-md'
              }`}
          >
            {tier.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                {t('pricing.most_popular')}
              </div>
            )}

            <div className="text-center mb-8">
              <h3 className={`text-lg font-bold text-${tier.color}-600 mb-2`}>{tier.name}</h3>
              <p className="text-muted-foreground text-sm h-10">{tier.description}</p>
              <div className="mt-4 flex items-baseline justify-center gap-1">
                <span className="text-4xl font-extrabold text-foreground">
                  {isYearly ? tier.priceYearly : tier.priceMonthly}€
                </span>
                <span className="text-muted-foreground">/{isYearly ? t('pricing.billing.yearly').toLowerCase() : t('pricing.billing.monthly').toLowerCase()}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                  <div className={`mt-0.5 p-1 rounded-full bg-${tier.color}-50 text-${tier.color}-600`}>
                    <FiCheck size={12} />
                  </div>
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
              {tier.notIncluded.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm opacity-50">
                  <div className="mt-0.5 p-1 rounded-full bg-muted text-muted-foreground/70">
                    <FiX size={12} />
                  </div>
                  <span className="text-muted-foreground decoration-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            <button className={`w-full py-3 rounded-xl font-semibold transition-colors ${tier.popular
                ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-200'
                : 'bg-muted text-foreground hover:bg-muted border border-border'
              }`}>
              {tier.cta}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mt-20 max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold text-center text-foreground mb-8">{t('pricing.faq.title')}</h3>
        <div className="space-y-4">
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <FiHelpCircle className="text-muted-foreground/70" /> {t('pricing.faq.upgrade.q')}
            </h4>
            <p className="text-muted-foreground mt-2 text-sm ml-6">{t('pricing.faq.upgrade.a')}</p>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <FiHelpCircle className="text-muted-foreground/70" /> {t('pricing.faq.setup_fee.q')}
            </h4>
            <p className="text-muted-foreground mt-2 text-sm ml-6">{t('pricing.faq.setup_fee.a')}</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}