import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import { BottomNav } from '../components/BottomNav';
import { PLANS } from '../data/plans';
import { getProfileApi } from '../services/api';
import { ConnectIpsLogo, EsewaLogo, FonepayLogo, KhaltiLogo, SctLogo } from '../components/PaymentLogos';

export default function UpgradePage() {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' | 'yearly'
  const [toastMessage, setToastMessage] = useState('');
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    getProfileApi()
      .then((res) => setAvatar(res?.data?.data?.avatar))
      .catch(() => {});
  }, []);

  const handleSelectPlan = (plan) => {
    if (plan.current) return;
    navigate('/payment', { state: { planId: plan.id, billingPeriod } });
  };

  return (
    <div className="kl-page upgrade-page-viewport kl-fade-up">
      <style>{`
        .upgrade-page-viewport,
        .upgrade-page-viewport * {
          font-family: var(--kl-font) !important;
        }

        .upgrade-page-viewport {
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: transparent;
        }

        .upgrade-page-scroll {
          flex: 1 1 auto;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
          padding: 0 16px 36px;
          box-sizing: border-box;
        }

        .upgrade-header-section {
          text-align: center;
          padding: 20px 8px 16px;
        }

        .upgrade-title {
          margin: 0 0 6px;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.6px;
          color: #1F4D33;
        }

        .upgrade-subtitle {
          margin: 0 auto;
          max-width: 310px;
          font-size: 13px;
          line-height: 1.45;
          color: rgba(31, 77, 51, 0.72);
        }

        /* Toggle pill */
        .upgrade-toggle-wrap {
          display: flex;
          justify-content: center;
          margin: 18px 0 22px;
        }

        .upgrade-toggle {
          display: flex;
          align-items: center;
          padding: 4px;
          border-radius: 999px;
          background: rgba(31, 77, 51, 0.08);
          border: 1px solid rgba(31, 77, 51, 0.12);
          gap: 2px;
        }

        .upgrade-toggle-btn {
          border: 0;
          background: transparent;
          border-radius: 999px;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 700;
          color: rgba(31, 77, 51, 0.7);
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .upgrade-toggle-btn.active {
          background: #FFFFFF;
          color: #1F4D33;
          box-shadow: 0 4px 12px rgba(31, 77, 51, 0.12);
        }

        .upgrade-save-badge {
          background: linear-gradient(135deg, #FFB347, #FF9A1F);
          color: #FFFFFF;
          font-size: 10px;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 999px;
          line-height: 1.2;
        }

        /* Grid */
        .upgrade-plans-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }

        @media (min-width: 600px) {
          .upgrade-plans-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .upgrade-plan-card {
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 20px 18px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.78);
          border: 1.5px solid rgba(31, 77, 51, 0.12);
          box-shadow: inset 0 1px 0 #FFFFFF, 0 10px 24px rgba(31, 77, 51, 0.06);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .upgrade-plan-card:hover {
          transform: translateY(-2px);
        }

        .upgrade-plan-card.highlight {
          border: 2px solid #3FA47A;
          background: linear-gradient(160deg, rgba(255, 255, 255, 0.92) 0%, rgba(234, 248, 242, 0.6) 100%);
          box-shadow: inset 0 1px 0 #FFFFFF, 0 12px 30px rgba(63, 164, 122, 0.18);
        }

        .upgrade-popular-badge {
          position: absolute;
          top: -11px;
          right: 18px;
          background: linear-gradient(135deg, #3FA47A 0%, #1F4D33 100%);
          color: #FBF7EE;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.2px;
          padding: 3px 10px;
          border-radius: 999px;
          box-shadow: 0 4px 10px rgba(31, 77, 51, 0.2);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .upgrade-plan-header {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 10px;
        }

        .upgrade-plan-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
        }

        .upgrade-plan-name {
          font-size: 17px;
          font-weight: 800;
          color: #1F4D33;
          margin: 0;
          letter-spacing: -0.3px;
        }

        .upgrade-plan-current-tag {
          font-size: 9.5px;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 999px;
          background: rgba(31, 77, 51, 0.1);
          color: #1F4D33;
          letter-spacing: 0.2px;
          text-transform: uppercase;
        }

        .upgrade-plan-price-block {
          display: flex;
          align-items: baseline;
        }

        .upgrade-plan-price-free {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .upgrade-plan-price-free strong {
          font-size: 24px;
          font-weight: 900;
          color: #1F4D33;
          letter-spacing: -0.5px;
          line-height: 1;
        }

        .upgrade-plan-price-free span {
          font-size: 11px;
          font-weight: 600;
          color: rgba(31, 77, 51, 0.65);
        }

        .upgrade-plan-price-paid {
          display: flex;
          align-items: baseline;
          gap: 3px;
          flex-wrap: wrap;
        }

        .upgrade-currency-prefix {
          font-size: 13px;
          font-weight: 800;
          color: #1F4D33;
        }

        .upgrade-amount-num {
          font-size: 24px;
          font-weight: 900;
          color: #1F4D33;
          letter-spacing: -0.5px;
          line-height: 1;
        }

        .upgrade-period-suffix {
          font-size: 11px;
          font-weight: 600;
          color: rgba(31, 77, 51, 0.65);
          margin-left: 2px;
        }

        .upgrade-plan-tagline {
          margin: 0 0 14px;
          font-size: 12px;
          color: rgba(31, 77, 51, 0.7);
          line-height: 1.4;
        }

        .upgrade-features-list {
          list-style: none;
          padding: 0;
          margin: 0 0 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .upgrade-feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12.5px;
          color: #1F4D33;
          line-height: 1.35;
        }

        .upgrade-feature-check {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #E8F5EF;
          color: #1F4D33;
          flex-shrink: 0;
        }

        .upgrade-plan-btn {
          width: 100%;
          height: 48px;
          border-radius: var(--kl-radius-btn);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border: 0;
        }

        .upgrade-plan-btn.primary {
          background: linear-gradient(180deg, rgba(62, 116, 88, 0.96) 0%, rgba(31, 77, 51, 0.96) 100%);
          color: #FBF7EE;
          box-shadow: 0 8px 18px rgba(31, 77, 51, 0.25);
        }

        .upgrade-plan-btn.secondary {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(251, 247, 238, 0.6) 100%);
          color: #1F4D33;
          border: 1.5px solid rgba(31, 77, 51, 0.25);
        }

        .upgrade-plan-btn.current {
          background: rgba(31, 77, 51, 0.08);
          color: rgba(31, 77, 51, 0.55);
          cursor: default;
          border: 1px dashed rgba(31, 77, 51, 0.2);
        }

        .upgrade-toast {
          position: fixed;
          bottom: 86px;
          left: 50%;
          transform: translateX(-50%);
          background: #1F4D33;
          color: #FFFFFF;
          padding: 10px 18px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
          z-index: 100;
          animation: fade-toast 0.25s ease;
        }

        .upgrade-nepal-payments {
          margin-top: 24px;
          padding: 18px 16px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.75);
          border: 1px solid rgba(31, 77, 51, 0.12);
          box-shadow: 0 10px 24px rgba(31, 77, 51, 0.06);
          text-align: center;
        }
        .upgrade-nepal-title {
          font-size: 13.5px;
          font-weight: 800;
          color: #1F4D33;
          margin: 0 0 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .upgrade-nepal-subtitle {
          font-size: 11px;
          color: rgba(31, 77, 51, 0.7);
          margin: 0 0 14px;
        }
        .upgrade-nepal-badges {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
        }
        .upgrade-nepal-badges {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 10px;
        }
        .upgrade-nepal-logo-card {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 7px 12px;
          border-radius: 12px;
          background: #FFFFFF;
          border: 1px solid rgba(31, 77, 51, 0.12);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .upgrade-nepal-logo-card:hover {
          transform: translateY(-1.5px);
          box-shadow: 0 5px 12px rgba(31, 77, 51, 0.12);
        }

        @keyframes fade-toast {
          from { opacity: 0; transform: translate(-50%, 8px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>

      <div className="upgrade-page-scroll">
        <AppHeader
          avatar={avatar}
          showBack={true}
          backTo="/home"
        />

        <div className="upgrade-header-section">
          <h1 className="upgrade-title">Choose your plan</h1>
          <p className="upgrade-subtitle">
            Pick the plan that fits your tracking goals. Change or cancel anytime.
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="upgrade-toggle-wrap">
            <div className="upgrade-toggle" role="group" aria-label="Billing frequency">
              <button
                type="button"
                className={`upgrade-toggle-btn ${billingPeriod === 'monthly' ? 'active' : ''}`}
                onClick={() => setBillingPeriod('monthly')}
              >
                Monthly
              </button>
              <button
                type="button"
                className={`upgrade-toggle-btn ${billingPeriod === 'yearly' ? 'active' : ''}`}
                onClick={() => setBillingPeriod('yearly')}
              >
                Yearly
                <span className="upgrade-save-badge">Save 2 months</span>
              </button>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="upgrade-plans-grid">
          {PLANS.map((plan) => {
            const isYearly = billingPeriod === 'yearly';
            const price = isYearly ? plan.yearly : plan.monthly;
            const pricePeriod = isYearly ? '/year' : '/month';

            return (
              <div
                key={plan.id}
                className={`upgrade-plan-card ${plan.highlight ? 'highlight' : ''}`}
              >
                {plan.highlight && (
                  <span className="upgrade-popular-badge">
                    <Sparkles size={11} />
                    Most popular
                  </span>
                )}

                <div className="upgrade-plan-header">
                  <div className="upgrade-plan-meta">
                    <h2 className="upgrade-plan-name">{plan.name}</h2>
                    {plan.current && (
                      <span className="upgrade-plan-current-tag">Current</span>
                    )}
                  </div>
                  <div className="upgrade-plan-price-block">
                    {price === 0 ? (
                      <div className="upgrade-plan-price-free">
                        <strong>Free</strong>
                        <span>forever</span>
                      </div>
                    ) : (
                      <div className="upgrade-plan-price-paid">
                        <span className="upgrade-currency-prefix">Rs.</span>
                        <strong className="upgrade-amount-num">{price.toLocaleString()}</strong>
                        <span className="upgrade-period-suffix">{pricePeriod}</span>
                      </div>
                    )}
                  </div>
                </div>

                <p className="upgrade-plan-tagline">{plan.tagline}</p>

                <ul className="upgrade-features-list">
                  {plan.features.map((feature) => (
                    <li key={feature} className="upgrade-feature-item">
                      <span className="upgrade-feature-check">
                        <Check size={12} strokeWidth={2.5} />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.current ? (
                  <button type="button" className="upgrade-plan-btn current" disabled>
                    Current plan
                  </button>
                ) : (
                  <button
                    type="button"
                    className={`upgrade-plan-btn ${plan.highlight ? 'primary' : 'secondary'}`}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    Choose {plan.name}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Supported Nepali Payment Methods */}
        <div className="upgrade-nepal-payments">
          <div className="upgrade-nepal-title">
            <ShieldCheck size={16} color="#1F4D33" />
            <span>Supported Nepali Payment Gateways</span>
          </div>
          <p className="upgrade-nepal-subtitle">
            Fast, secure local payments with instant Pro activation & OTP verification
          </p>
          <div className="upgrade-nepal-badges">
            <div className="upgrade-nepal-logo-card" title="eSewa Wallet">
              <EsewaLogo height={22} />
            </div>
            <div className="upgrade-nepal-logo-card" title="Khalti Digital Wallet">
              <KhaltiLogo height={22} />
            </div>
            <div className="upgrade-nepal-logo-card" title="Fonepay QR">
              <FonepayLogo height={22} />
            </div>
            <div className="upgrade-nepal-logo-card" title="ConnectIPS Bank Transfer">
              <ConnectIpsLogo height={20} />
            </div>
            <div className="upgrade-nepal-logo-card" title="SCT / Nepali Debit Cards">
              <SctLogo height={22} />
            </div>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="upgrade-toast" role="status">
          {toastMessage}
        </div>
      )}

      <BottomNav active="profile" />
    </div>
  );
}
