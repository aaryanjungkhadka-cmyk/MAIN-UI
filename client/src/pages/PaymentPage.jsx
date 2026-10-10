import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  CreditCard,
  Lock,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Wallet,
  Zap,
} from 'lucide-react';
import AppHeader from '../components/AppHeader';
import { BottomNav } from '../components/BottomNav';
import { PLANS } from '../data/plans';
import { getProfileApi } from '../services/api';

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Selected plan from router state, defaulting to 'pro'
  const initialPlanId = location.state?.planId || 'pro';
  const initialPeriod = location.state?.billingPeriod || 'monthly';

  const [selectedPlanId, setSelectedPlanId] = useState(initialPlanId);
  const [billingPeriod, setBillingPeriod] = useState(initialPeriod);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'wallet'
  const [avatar, setAvatar] = useState(null);

  // Form states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [saveCard, setSaveCard] = useState(true);

  // Promo code
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  // Processing & completion states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    getProfileApi()
      .then((res) => setAvatar(res?.data?.data?.avatar))
      .catch(() => {});
  }, []);

  const selectedPlan = useMemo(() => {
    return PLANS.find((p) => p.id === selectedPlanId) || PLANS[2]; // Default to Pro
  }, [selectedPlanId]);

  const basePrice = useMemo(() => {
    return billingPeriod === 'yearly' ? selectedPlan.yearly : selectedPlan.monthly;
  }, [selectedPlan, billingPeriod]);

  const discountAmount = useMemo(() => {
    if (!promoApplied) return 0;
    return Math.round(basePrice * 0.2); // 20% discount
  }, [basePrice, promoApplied]);

  const totalPrice = Math.max(0, basePrice - discountAmount);

  // Format card number with spaces (#### #### #### ####)
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
  };

  // Format MM/YY
  const handleExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setCardExpiry(raw);
  };

  // Format CVC
  const handleCvcChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardCvc(raw);
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    const clean = promoCode.trim().toUpperCase();
    if (clean === 'KHANA20' || clean === 'WELCOME' || clean === 'PROMO') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid code. Try KHANA20 for 20% off.');
    }
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    setFormError('');

    if (paymentMethod === 'card') {
      const cleanNum = cardNumber.replace(/\s/g, '');
      if (cleanNum.length < 15) {
        setFormError('Please enter a valid 16-digit card number.');
        return;
      }
      if (cardExpiry.length < 5) {
        setFormError('Please enter card expiration date (MM/YY).');
        return;
      }
      if (cardCvc.length < 3) {
        setFormError('Please enter a 3 or 4 digit security CVC.');
        return;
      }
      if (!cardName.trim()) {
        setFormError('Please enter the name on the card.');
        return;
      }
    }

    setIsProcessing(true);
    setProcessingStage('Connecting to secure 256-bit gateway...');

    setTimeout(() => {
      setProcessingStage('Authorizing payment with bank...');
    }, 700);

    setTimeout(() => {
      setProcessingStage('Activating KhanaLens Pro membership...');
    }, 1400);

    setTimeout(() => {
      setIsProcessing(false);
      const generatedTxn = `KL-TXN-${Math.floor(100000 + Math.random() * 900000)}`;
      setTransactionId(generatedTxn);
      setPaymentSuccess(true);
      try {
        localStorage.setItem('kl_user_plan', selectedPlan.id);
        localStorage.setItem('kl_plan_billing', billingPeriod);
      } catch {}
    }, 2100);
  };

  return (
    <div className="kl-page payment-page-viewport kl-fade-up">
      <style>{`
        .payment-page-viewport {
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: transparent;
        }

        .payment-page-scroll {
          flex: 1 1 auto;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
          padding: 0 16px 36px;
          box-sizing: border-box;
        }

        /* Hero */
        .payment-hero {
          text-align: center;
          padding: 16px 8px 12px;
        }

        .payment-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 999px;
          background: linear-gradient(135deg, #2554D7 0%, #1D42B0 100%);
          color: #FFFFFF;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 12px rgba(37, 84, 215, 0.3);
          margin-bottom: 10px;
        }

        .payment-hero h1 {
          margin: 0 0 4px;
          font-size: 22px;
          font-weight: 850;
          color: #1F4D33;
          letter-spacing: -0.5px;
        }

        .payment-hero p {
          margin: 0 auto;
          max-width: 310px;
          font-size: 12px;
          line-height: 1.45;
          color: rgba(31, 77, 51, 0.72);
        }

        /* Plan Selection Cards */
        .payment-plans-strip {
          display: flex;
          gap: 8px;
          margin: 16px 0 14px;
        }

        .payment-plan-chip {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px 6px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.7);
          border: 1.5px solid rgba(31, 77, 51, 0.12);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }

        .payment-plan-chip:hover {
          transform: translateY(-2px);
        }

        .payment-plan-chip.active {
          border-color: #2554D7;
          background: #FFFFFF;
          box-shadow: 0 6px 18px rgba(37, 84, 215, 0.2);
        }

        .payment-plan-chip strong {
          font-size: 13px;
          font-weight: 800;
          color: #1F4D33;
        }
        .payment-plan-chip.active strong {
          color: #2554D7;
        }

        .payment-plan-chip span {
          font-size: 11px;
          font-weight: 700;
          color: rgba(31, 77, 51, 0.7);
          margin-top: 2px;
        }

        /* Billing toggle */
        .payment-billing-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 4px;
          border-radius: 999px;
          background: rgba(31, 77, 51, 0.08);
          border: 1px solid rgba(31, 77, 51, 0.1);
          width: fit-content;
          margin: 0 auto 18px;
        }

        .payment-toggle-btn {
          border: 0;
          background: transparent;
          border-radius: 999px;
          padding: 6px 14px;
          font-size: 11px;
          font-weight: 750;
          color: rgba(31, 77, 51, 0.7);
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .payment-toggle-btn.active {
          background: #FFFFFF;
          color: #1F4D33;
          box-shadow: 0 3px 10px rgba(31, 77, 51, 0.12);
        }

        .payment-save-tag {
          font-size: 9px;
          background: #FF9A1F;
          color: #FFFFFF;
          padding: 1px 6px;
          border-radius: 999px;
          font-weight: 800;
        }

        /* Main Card */
        .payment-main-card {
          padding: 18px 16px;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(31, 77, 51, 0.12);
          box-shadow: inset 0 1px 0 #FFFFFF, 0 12px 28px rgba(31, 77, 51, 0.08);
          margin-bottom: 14px;
        }

        .payment-section-heading {
          font-size: 14px;
          font-weight: 800;
          color: #1F4D33;
          margin: 0 0 12px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Order Breakdown */
        .payment-order-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12.5px;
          color: rgba(31, 77, 51, 0.78);
          margin-bottom: 6px;
        }

        .payment-order-row strong {
          color: #1F4D33;
        }

        .payment-order-total {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          padding-top: 10px;
          margin-top: 8px;
          border-top: 1px dashed rgba(31, 77, 51, 0.15);
          color: #1F4D33;
          font-size: 14px;
          font-weight: 800;
        }

        .payment-order-total strong {
          font-size: 22px;
          font-weight: 900;
          color: #2554D7;
        }

        /* Promo input */
        .payment-promo-form {
          display: flex;
          gap: 6px;
          margin: 12px 0 6px;
        }

        .payment-promo-input {
          flex: 1;
          height: 38px;
          border-radius: 12px;
          border: 1px solid rgba(31, 77, 51, 0.16);
          background: #FDFEFE;
          padding: 0 12px;
          font-size: 12px;
          font-weight: 700;
          color: #1F4D33;
          outline: none;
          text-transform: uppercase;
        }
        .payment-promo-input:focus {
          border-color: #2554D7;
        }

        .payment-promo-btn {
          height: 38px;
          padding: 0 14px;
          border-radius: 12px;
          border: 0;
          background: rgba(31, 77, 51, 0.1);
          color: #1F4D33;
          font-size: 12px;
          font-weight: 750;
          cursor: pointer;
        }

        /* Method Tabs */
        .payment-method-selector {
          display: flex;
          gap: 6px;
          margin-bottom: 14px;
        }

        .payment-method-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px;
          border-radius: 14px;
          border: 1px solid rgba(31, 77, 51, 0.14);
          background: rgba(255, 255, 255, 0.6);
          color: #1F4D33;
          font-size: 12px;
          font-weight: 750;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .payment-method-tab.active {
          background: #2554D7;
          border-color: #2554D7;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(37, 84, 215, 0.25);
        }

        /* Form fields */
        .payment-input-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 10px;
        }

        .payment-input-group label {
          font-size: 11px;
          font-weight: 750;
          color: rgba(31, 77, 51, 0.75);
        }

        .payment-input {
          height: 44px;
          border-radius: 14px;
          border: 1px solid rgba(31, 77, 51, 0.18);
          background: #FDFEFE;
          padding: 0 14px;
          font-size: 13px;
          font-weight: 600;
          color: #1F4D33;
          outline: none;
          box-sizing: border-box;
          width: 100%;
        }

        .payment-input:focus {
          border-color: #2554D7;
          box-shadow: 0 0 0 3px rgba(37, 84, 215, 0.15);
        }

        .payment-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .payment-checkbox-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11.5px;
          color: rgba(31, 77, 51, 0.7);
          margin: 12px 0 16px;
          cursor: pointer;
        }

        .payment-checkbox-row input {
          accent-color: #2554D7;
        }

        /* Submit Button */
        .payment-submit-btn {
          width: 100%;
          height: 52px;
          border-radius: var(--kl-radius-btn);
          border: 0;
          background: linear-gradient(135deg, #2554D7 0%, #1A3EB2 100%);
          color: #FFFFFF;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 10px 24px rgba(37, 84, 215, 0.35);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .payment-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(37, 84, 215, 0.45);
        }

        .payment-submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }

        /* Digital Wallet list */
        .payment-wallet-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .payment-wallet-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          border-radius: 14px;
          background: #FFFFFF;
          border: 1px solid rgba(31, 77, 51, 0.12);
          cursor: pointer;
          font-size: 13px;
          font-weight: 750;
          color: #1F4D33;
          transition: all 0.15s ease;
        }
        .payment-wallet-option:hover {
          border-color: #2554D7;
          background: #F6F8FF;
        }

        /* Security Badges */
        .payment-guarantees {
          display: flex;
          align-items: center;
          justify-content: space-around;
          margin-top: 14px;
          padding: 10px;
          font-size: 10.5px;
          color: rgba(31, 77, 51, 0.65);
          text-align: center;
        }

        .payment-guarantee-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Processing Modal */
        .payment-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(10, 25, 18, 0.65);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          padding: 20px;
        }

        .payment-modal-card {
          width: min(100%, 360px);
          padding: 28px 22px;
          border-radius: 26px;
          background: #FFFFFF;
          border: 1px solid rgba(31, 77, 51, 0.15);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
          text-align: center;
          animation: pop-modal 0.25s ease;
        }

        @keyframes pop-modal {
          from { transform: scale(0.92); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .payment-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #E6EEFA;
          border-top-color: #2554D7;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .payment-success-badge {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3FA47A 0%, #1F4D33 100%);
          color: #FFFFFF;
          display: grid;
          place-items: center;
          margin: 0 auto 14px;
          box-shadow: 0 10px 24px rgba(63, 164, 122, 0.35);
        }

        .payment-error-alert {
          padding: 9px 12px;
          border-radius: 12px;
          background: #FEECEB;
          color: #D32F2F;
          font-size: 11.5px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
        }
      `}</style>

      <div className="payment-page-scroll">
        <AppHeader
          avatar={avatar}
          showBack={true}
          showUpgrade={false}
          backTo="/upgrade"
        />

        {/* Hero */}
        <div className="payment-hero">
          <div className="payment-badge-pill">
            <span style={{ fontSize: 13 }}>✦</span>
            KHANALENS PREMIUM
          </div>
          <h1>Upgrade Your Plan</h1>
          <p>
            Choose your plan and payment method to unlock unlimited AI scanner accuracy and macro tracking.
          </p>
        </div>

        {/* Plan Chips */}
        <div className="payment-plans-strip">
          {PLANS.filter((p) => p.id !== 'free').map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const price = billingPeriod === 'yearly' ? plan.yearly : plan.monthly;
            const periodText = billingPeriod === 'yearly' ? '/yr' : '/mo';

            return (
              <div
                key={plan.id}
                className={`payment-plan-chip ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedPlanId(plan.id)}
              >
                <strong>{plan.name}</strong>
                <span>${price}{periodText}</span>
              </div>
            );
          })}
        </div>

        {/* Billing frequency toggle */}
        <div className="payment-billing-toggle">
          <button
            type="button"
            className={`payment-toggle-btn ${billingPeriod === 'monthly' ? 'active' : ''}`}
            onClick={() => setBillingPeriod('monthly')}
          >
            Monthly
          </button>
          <button
            type="button"
            className={`payment-toggle-btn ${billingPeriod === 'yearly' ? 'active' : ''}`}
            onClick={() => setBillingPeriod('yearly')}
          >
            Yearly
            <span className="payment-save-tag">Save 2 mos</span>
          </button>
        </div>

        {/* Main Card: Order Summary & Payment Form */}
        <div className="payment-main-card">
          <h2 className="payment-section-heading">
            <Zap size={16} color="#2554D7" />
            Order Summary
          </h2>

          <div className="payment-order-row">
            <span>KhanaLens {selectedPlan.name} Plan</span>
            <strong>${basePrice} {billingPeriod === 'yearly' ? '/ year' : '/ month'}</strong>
          </div>

          {promoApplied && (
            <div className="payment-order-row" style={{ color: '#2E7D32' }}>
              <span>Promo Discount (20%)</span>
              <strong>-${discountAmount}</strong>
            </div>
          )}

          <div className="payment-order-row">
            <span>Taxes & Processing</span>
            <strong>$0.00</strong>
          </div>

          <div className="payment-order-total">
            <span>Total Due Today</span>
            <strong>${totalPrice}.00</strong>
          </div>

          {/* Promo Code Form */}
          <form className="payment-promo-form" onSubmit={handleApplyPromo}>
            <input
              type="text"
              placeholder="Promo code (e.g. KHANA20)"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="payment-promo-input"
            />
            <button type="submit" className="payment-promo-btn">
              Apply
            </button>
          </form>
          {promoError && (
            <span style={{ fontSize: 10, color: '#D32F2F', fontWeight: 600 }}>
              {promoError}
            </span>
          )}
          {promoApplied && (
            <span style={{ fontSize: 10, color: '#2E7D32', fontWeight: 700 }}>
              ✓ Code applied: 20% discount applied!
            </span>
          )}
        </div>

        {/* Payment Details Card */}
        <div className="payment-main-card">
          <h2 className="payment-section-heading">
            <CreditCard size={16} color="#2554D7" />
            Payment Method
          </h2>

          {/* Selector Tabs */}
          <div className="payment-method-selector">
            <button
              type="button"
              className={`payment-method-tab ${paymentMethod === 'card' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              <CreditCard size={15} />
              Credit / Debit Card
            </button>
            <button
              type="button"
              className={`payment-method-tab ${paymentMethod === 'wallet' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('wallet')}
            >
              <Wallet size={15} />
              Digital Wallet
            </button>
          </div>

          {formError && (
            <div className="payment-error-alert">
              <AlertCircle size={15} />
              <span>{formError}</span>
            </div>
          )}

          {paymentMethod === 'card' ? (
            <form onSubmit={handleSubmitPayment}>
              <div className="payment-input-group">
                <label>Cardholder Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="payment-input"
                  required
                />
              </div>

              <div className="payment-input-group">
                <label>Card Number</label>
                <input
                  type="text"
                  placeholder="4532 •••• •••• 8892"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className="payment-input"
                  required
                />
              </div>

              <div className="payment-row-2">
                <div className="payment-input-group">
                  <label>Expiry (MM/YY)</label>
                  <input
                    type="text"
                    placeholder="12/28"
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    className="payment-input"
                    required
                  />
                </div>
                <div className="payment-input-group">
                  <label>Security CVC</label>
                  <input
                    type="password"
                    placeholder="123"
                    value={cardCvc}
                    onChange={handleCvcChange}
                    className="payment-input"
                    required
                  />
                </div>
              </div>

              <div className="payment-input-group">
                <label>Postal / ZIP Code</label>
                <input
                  type="text"
                  placeholder="10001"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="payment-input"
                />
              </div>

              <label className="payment-checkbox-row">
                <input
                  type="checkbox"
                  checked={saveCard}
                  onChange={(e) => setSaveCard(e.target.checked)}
                />
                <span>Save card for secure automatic renewal (cancel anytime)</span>
              </label>

              <button
                type="submit"
                className="payment-submit-btn"
                disabled={isProcessing}
              >
                <Lock size={15} />
                Pay ${totalPrice}.00 & Activate {selectedPlan.name}
              </button>
            </form>
          ) : (
            <div className="payment-wallet-list">
              <button
                type="button"
                className="payment-wallet-option"
                onClick={handleSubmitPayment}
              >
                <span> Pay (Apple Pay)</span>
                <ArrowRight size={14} />
              </button>
              <button
                type="button"
                className="payment-wallet-option"
                onClick={handleSubmitPayment}
              >
                <span>Google Pay</span>
                <ArrowRight size={14} />
              </button>
              <button
                type="button"
                className="payment-wallet-option"
                onClick={handleSubmitPayment}
              >
                <span>PayPal Express</span>
                <ArrowRight size={14} />
              </button>
              <button
                type="button"
                className="payment-wallet-option"
                onClick={handleSubmitPayment}
              >
                <span>eSewa / Khalti Digital Wallet</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* Guarantees */}
          <div className="payment-guarantees">
            <div className="payment-guarantee-item">
              <ShieldCheck size={14} color="#3FA47A" />
              <span>256-Bit SSL Encryption</span>
            </div>
            <div className="payment-guarantee-item">
              <RotateCcw size={14} color="#3FA47A" />
              <span>30-Day Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Modal */}
      {isProcessing && (
        <div className="payment-modal-backdrop">
          <div className="payment-modal-card">
            <div className="payment-spinner" />
            <h3 style={{ margin: '0 0 6px', fontSize: 18, color: '#1F4D33' }}>
              Processing Payment
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: 'rgba(31,77,51,0.7)' }}>
              {processingStage}
            </p>
          </div>
        </div>
      )}

      {/* Success Confirmation Modal */}
      {paymentSuccess && (
        <div className="payment-modal-backdrop">
          <div className="payment-modal-card">
            <div className="payment-success-badge">
              <Check size={32} strokeWidth={3} />
            </div>
            <h3 style={{ margin: '0 0 4px', fontSize: 20, color: '#1F4D33', fontWeight: 800 }}>
              Payment Successful!
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: 'rgba(31,77,51,0.75)' }}>
              Welcome to <strong>KhanaLens {selectedPlan.name}</strong>! All features have been unlocked.
            </p>

            <div style={{
              background: '#F6F9F7',
              borderRadius: 14,
              padding: '12px 14px',
              fontSize: 12,
              textAlign: 'left',
              color: '#1F4D33',
              marginBottom: 18,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: 'rgba(31,77,51,0.65)' }}>Transaction:</span>
                <strong>{transactionId}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: 'rgba(31,77,51,0.65)' }}>Amount Paid:</span>
                <strong>${totalPrice}.00</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(31,77,51,0.65)' }}>Plan Duration:</span>
                <strong>{billingPeriod === 'yearly' ? '1 Year' : '1 Month'}</strong>
              </div>
            </div>

            <button
              type="button"
              className="payment-submit-btn"
              onClick={() => navigate('/home')}
            >
              Start Using {selectedPlan.name} Features
            </button>
          </div>
        </div>
      )}

      <BottomNav active="profile" />
    </div>
  );
}
