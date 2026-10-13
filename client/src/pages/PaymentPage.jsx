import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CreditCard,
  Lock,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Wallet,
  Zap,
} from 'lucide-react';
import AppHeader from '../components/AppHeader';
import { BottomNav } from '../components/BottomNav';
import { PLANS } from '../data/plans';
import { getProfileApi } from '../services/api';
import { EsewaLogo, KhaltiLogo, SctLogo } from '../components/PaymentLogos';

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Selected plan from router state, defaulting to 'pro'
  const initialPlanId = location.state?.planId || 'pro';
  const initialPeriod = location.state?.billingPeriod || 'monthly';

  const [selectedPlanId, setSelectedPlanId] = useState(initialPlanId);
  const [billingPeriod, setBillingPeriod] = useState(initialPeriod);
  const [paymentMethod, setPaymentMethod] = useState('esewa'); // 'esewa' | 'khalti' | 'card'
  const [avatar, setAvatar] = useState(null);

  // eSewa Form State
  const [esewaId, setEsewaId] = useState('');
  const [esewaMpin, setEsewaMpin] = useState('');
  const [esewaOtpStep, setEsewaOtpStep] = useState(false);
  const [esewaOtp, setEsewaOtp] = useState(['', '', '', '', '', '']);

  // Khalti Form State
  const [khaltiMobile, setKhaltiMobile] = useState('');
  const [khaltiMpin, setKhaltiMpin] = useState('');
  const [khaltiOtpStep, setKhaltiOtpStep] = useState(false);
  const [khaltiOtp, setKhaltiOtp] = useState(['', '', '', '', '', '']);

  // Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');

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

  // Pricing in Nepali Rupees (NPR / Rs.)
  const basePriceNpr = useMemo(() => {
    return billingPeriod === 'yearly' ? selectedPlan.yearly : selectedPlan.monthly;
  }, [selectedPlan, billingPeriod]);

  const discountAmountNpr = useMemo(() => {
    if (!promoApplied) return 0;
    return Math.round(basePriceNpr * 0.2); // 20% discount
  }, [basePriceNpr, promoApplied]);

  const totalPriceNpr = Math.max(0, basePriceNpr - discountAmountNpr);

  // Apply promo
  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    const clean = promoCode.trim().toUpperCase();
    if (clean === 'KHANA20' || clean === 'WELCOME' || clean === 'PROMO' || clean === 'NEPAL') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid code. Try KHANA20 for 20% off.');
    }
  };

  // eSewa Submit
  const handleEsewaLogin = (e) => {
    e.preventDefault();
    setFormError('');
    if (!esewaId.trim()) {
      setFormError('Please enter your eSewa ID or Registered Mobile number.');
      return;
    }
    if (esewaMpin.length < 4) {
      setFormError('Please enter your 4-digit eSewa MPIN.');
      return;
    }

    setIsProcessing(true);
    setProcessingStage('Authenticating with eSewa portal...');
    setTimeout(() => {
      setIsProcessing(false);
      setEsewaOtpStep(true);
      setEsewaOtp(['9', '4', '8', '2', '1', '6']); // pre-populate sample OTP for realistic UX
    }, 800);
  };

  // Khalti Submit
  const handleKhaltiLogin = (e) => {
    e.preventDefault();
    setFormError('');
    if (khaltiMobile.length < 10) {
      setFormError('Please enter a valid 10-digit Khalti mobile number.');
      return;
    }
    if (khaltiMpin.length < 4) {
      setFormError('Please enter your 4-digit Khalti MPIN.');
      return;
    }

    setIsProcessing(true);
    setProcessingStage('Connecting to Khalti digital gateway...');
    setTimeout(() => {
      setIsProcessing(false);
      setKhaltiOtpStep(true);
      setKhaltiOtp(['7', '3', '1', '9', '5', '0']);
    }, 800);
  };

  // Finalize payment
  const handleConfirmFinalPayment = () => {
    setIsProcessing(true);
    setProcessingStage(`Processing NPR ${totalPriceNpr.toLocaleString()} transaction...`);

    setTimeout(() => {
      setProcessingStage('Verifying token and activating KhanaLens Pro...');
    }, 800);

    setTimeout(() => {
      setIsProcessing(false);
      const prefix = paymentMethod === 'esewa' ? 'ESEWA' : paymentMethod === 'khalti' ? 'KHALTI' : 'CARD';
      const generatedTxn = `${prefix}-${Math.floor(1000000 + Math.random() * 9000000)}`;
      setTransactionId(generatedTxn);
      setPaymentSuccess(true);
      try {
        localStorage.setItem('kl_user_plan', selectedPlan.id);
        localStorage.setItem('kl_plan_billing', billingPeriod);
      } catch {}
    }, 1600);
  };

  return (
    <div className="kl-page payment-page-viewport kl-fade-up">
      <style>{`
        .payment-page-viewport,
        .payment-page-viewport * {
          font-family: var(--kl-font) !important;
        }

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
          padding: 16px 8px 10px;
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
          margin-bottom: 8px;
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
          margin: 14px 0 12px;
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
          margin: 0 auto 16px;
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
          color: #1F4D33;
        }

        .payment-order-total small {
          font-size: 12px;
          color: rgba(31, 77, 51, 0.6);
          margin-left: 6px;
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
        .payment-gateway-tabs {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          margin-bottom: 16px;
        }

        .payment-gateway-tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 10px 4px;
          border-radius: 14px;
          border: 1.5px solid rgba(31, 77, 51, 0.14);
          background: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .payment-gateway-tab:hover {
          transform: translateY(-1.5px);
        }

        /* eSewa Tab Active */
        .payment-gateway-tab.active.esewa {
          border-color: #41A124;
          background: #F2FAF0;
          box-shadow: 0 4px 14px rgba(65, 161, 36, 0.25);
        }

        /* Khalti Tab Active */
        .payment-gateway-tab.active.khalti {
          border-color: #5D2E8E;
          background: #F7F3FB;
          box-shadow: 0 4px 14px rgba(93, 46, 142, 0.25);
        }

        /* Card Tab Active */
        .payment-gateway-tab.active.card {
          border-color: #2554D7;
          background: #F4F7FF;
          box-shadow: 0 4px 14px rgba(37, 84, 215, 0.25);
        }

        .payment-gateway-tab span {
          font-size: 11px;
          font-weight: 800;
        }

        /* Branded Gateway Panels */
        .esewa-portal-box {
          border-radius: 16px;
          border: 1.5px solid #41A124;
          background: #FAFDF9;
          padding: 16px;
          margin-bottom: 12px;
        }

        .esewa-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 10px;
          margin-bottom: 12px;
          border-bottom: 1px solid rgba(65, 161, 36, 0.2);
        }

        .esewa-brand-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #41A124;
          font-size: 14px;
          font-weight: 900;
          letter-spacing: -0.3px;
        }
        .esewa-brand-icon {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          background: #41A124;
          color: #FFFFFF;
          display: grid;
          place-items: center;
          font-size: 13px;
          font-weight: 900;
        }

        .esewa-btn {
          width: 100%;
          height: 48px;
          border-radius: 14px;
          border: 0;
          background: #41A124;
          color: #FFFFFF;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 6px 18px rgba(65, 161, 36, 0.35);
          transition: all 0.2s ease;
          margin-top: 12px;
        }
        .esewa-btn:hover {
          background: #388E20;
          transform: translateY(-1.5px);
        }

        /* Khalti Portal */
        .khalti-portal-box {
          border-radius: 16px;
          border: 1.5px solid #5D2E8E;
          background: #FAF8FD;
          padding: 16px;
          margin-bottom: 12px;
        }

        .khalti-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 10px;
          margin-bottom: 12px;
          border-bottom: 1px solid rgba(93, 46, 142, 0.2);
        }

        .khalti-brand-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #5D2E8E;
          font-size: 14px;
          font-weight: 900;
          letter-spacing: -0.3px;
        }
        .khalti-brand-icon {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          background: #5D2E8E;
          color: #FFFFFF;
          display: grid;
          place-items: center;
          font-size: 13px;
          font-weight: 900;
        }

        .khalti-btn {
          width: 100%;
          height: 48px;
          border-radius: 14px;
          border: 0;
          background: #5D2E8E;
          color: #FFFFFF;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 6px 18px rgba(93, 46, 142, 0.35);
          transition: all 0.2s ease;
          margin-top: 12px;
        }
        .khalti-btn:hover {
          background: #4C2475;
          transform: translateY(-1.5px);
        }

        /* Form fields */
        .gateway-input-label {
          display: block;
          font-size: 11px;
          font-weight: 800;
          color: #1F4D33;
          margin-bottom: 4px;
        }

        .gateway-input {
          width: 100%;
          height: 42px;
          border-radius: 12px;
          border: 1px solid rgba(31, 77, 51, 0.2);
          background: #FFFFFF;
          padding: 0 12px;
          font-size: 13px;
          font-weight: 600;
          color: #1F4D33;
          outline: none;
          box-sizing: border-box;
          margin-bottom: 10px;
        }
        .gateway-input:focus {
          border-color: #2554D7;
          box-shadow: 0 0 0 3px rgba(37, 84, 215, 0.12);
        }

        /* OTP Boxes */
        .otp-inputs-row {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin: 14px 0 16px;
        }
        .otp-box {
          width: 40px;
          height: 44px;
          border-radius: 10px;
          border: 1.5px solid rgba(31, 77, 51, 0.25);
          background: #FFFFFF;
          font-size: 18px;
          font-weight: 800;
          text-align: center;
          color: #1F4D33;
          outline: none;
        }
        .otp-box:focus {
          border-color: #2554D7;
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

        /* Modal Overlay */
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
          padding: 26px 20px;
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
          width: 46px;
          height: 46px;
          border: 4px solid #E6EEFA;
          border-top-color: #41A124;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 14px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .payment-success-badge {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #41A124 0%, #297712 100%);
          color: #FFFFFF;
          display: grid;
          place-items: center;
          margin: 0 auto 14px;
          box-shadow: 0 10px 24px rgba(65, 161, 36, 0.35);
        }

        .payment-error-alert {
          padding: 8px 12px;
          border-radius: 12px;
          background: #FEECEB;
          color: #D32F2F;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 10px;
        }
      `}</style>

      <div className="payment-page-scroll">
        <AppHeader
          avatar={avatar}
          showBack={true}
          backTo="/upgrade"
        />

        {/* Hero */}
        <div className="payment-hero">
          <div className="payment-badge-pill">
            <span style={{ fontSize: 13 }}>✦</span>
            UPGRADE TO PREMIUM
          </div>
          <h1>Select Plan & Payment</h1>
          <p>
            Upgrade KhanaLens with Nepal's trusted digital wallets or international cards.
          </p>
        </div>

        {/* Plan Chips */}
        <div className="payment-plans-strip">
          {PLANS.filter((p) => p.id !== 'free').map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const priceNpr = plan.id === 'plus' ? (billingPeriod === 'yearly' ? 12000 : 1200)
              : plan.id === 'pro' ? (billingPeriod === 'yearly' ? 25000 : 2500)
              : (billingPeriod === 'yearly' ? 65000 : 6500);

            return (
              <div
                key={plan.id}
                className={`payment-plan-chip ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedPlanId(plan.id)}
              >
                <strong>{plan.name}</strong>
                <span>Rs. {priceNpr.toLocaleString()}</span>
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

        {/* Main Card: Order Summary */}
        <div className="payment-main-card">
          <h2 className="payment-section-heading">
            <Zap size={16} color="#FF9A1F" />
            Order Summary
          </h2>

          <div className="payment-order-row">
            <span>KhanaLens {selectedPlan.name} Plan ({billingPeriod})</span>
            <strong>Rs. {basePriceNpr.toLocaleString()}</strong>
          </div>

          {promoApplied && (
            <div className="payment-order-row" style={{ color: '#2E7D32' }}>
              <span>Promo Code Discount (20%)</span>
              <strong>-Rs. {discountAmountNpr.toLocaleString()}</strong>
            </div>
          )}

          <div className="payment-order-row">
            <span>Taxes & Service Fee</span>
            <strong>Rs. 0.00</strong>
          </div>

          <div className="payment-order-total">
            <span>Total Payable</span>
            <div>
              <strong>Rs. {totalPriceNpr.toLocaleString()}</strong>
              <small>(NPR local pricing)</small>
            </div>
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

        {/* Payment Gateways Card */}
        <div className="payment-main-card">
          <h2 className="payment-section-heading">
            <Wallet size={16} color="#1F4D33" />
            Select Payment Gateway
          </h2>

          {/* Method Tabs */}
          <div className="payment-gateway-tabs">
            <div
              className={`payment-gateway-tab ${paymentMethod === 'esewa' ? 'active esewa' : ''}`}
              onClick={() => { setPaymentMethod('esewa'); setEsewaOtpStep(false); setFormError(''); }}
            >
              <EsewaLogo height={22} />
            </div>

            <div
              className={`payment-gateway-tab ${paymentMethod === 'khalti' ? 'active khalti' : ''}`}
              onClick={() => { setPaymentMethod('khalti'); setKhaltiOtpStep(false); setFormError(''); }}
            >
              <KhaltiLogo height={22} />
            </div>

            <div
              className={`payment-gateway-tab ${paymentMethod === 'card' ? 'active card' : ''}`}
              onClick={() => { setPaymentMethod('card'); setFormError(''); }}
            >
              <SctLogo height={22} />
            </div>
          </div>

          {formError && (
            <div className="payment-error-alert">
              <AlertCircle size={14} />
              <span>{formError}</span>
            </div>
          )}

          {/* ESEWA PORTAL UI */}
          {paymentMethod === 'esewa' && (
            <div className="esewa-portal-box">
              <div className="esewa-header-row">
                <div className="esewa-brand-badge">
                  <span className="esewa-brand-icon">e</span>
                  <span>eSewa Payment</span>
                </div>
                <strong style={{ fontSize: 13, color: '#41A124' }}>
                  Rs. {totalPriceNpr.toLocaleString()}
                </strong>
              </div>

              {!esewaOtpStep ? (
                <form onSubmit={handleEsewaLogin}>
                  <label className="gateway-input-label">eSewa ID (Mobile / Email)</label>
                  <input
                    type="text"
                    placeholder="e.g. 9841234567"
                    value={esewaId}
                    onChange={(e) => setEsewaId(e.target.value)}
                    className="gateway-input"
                    required
                  />

                  <label className="gateway-input-label">eSewa MPIN / Password</label>
                  <input
                    type="password"
                    placeholder="••••"
                    maxLength={6}
                    value={esewaMpin}
                    onChange={(e) => setEsewaMpin(e.target.value)}
                    className="gateway-input"
                    required
                  />

                  <button type="submit" className="esewa-btn">
                    <span>Login & Pay with eSewa</span>
                    <ArrowRight size={15} />
                  </button>
                </form>
              ) : (
                <div>
                  <p style={{ margin: '0 0 10px', fontSize: 12, color: 'rgba(31,77,51,0.75)', textAlign: 'center' }}>
                    Enter the 6-digit OTP sent to <strong>{esewaId || '9841******'}</strong>:
                  </p>
                  <div className="otp-inputs-row">
                    {esewaOtp.map((digit, idx) => (
                      <input
                        key={idx}
                        type="text"
                        maxLength={1}
                        value={digit}
                        readOnly
                        className="otp-box"
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    className="esewa-btn"
                    onClick={handleConfirmFinalPayment}
                  >
                    <Check size={16} />
                    <span>Confirm & Pay Rs. {totalPriceNpr.toLocaleString()}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEsewaOtpStep(false)}
                    style={{
                      background: 'none', border: 0, color: '#68897E', fontSize: 11,
                      cursor: 'pointer', display: 'block', margin: '8px auto 0'
                    }}
                  >
                    Back to eSewa login
                  </button>
                </div>
              )}
            </div>
          )}

          {/* KHALTI PORTAL UI */}
          {paymentMethod === 'khalti' && (
            <div className="khalti-portal-box">
              <div className="khalti-header-row">
                <div className="khalti-brand-badge">
                  <span className="khalti-brand-icon">K</span>
                  <span>Khalti Digital Wallet</span>
                </div>
                <strong style={{ fontSize: 13, color: '#5D2E8E' }}>
                  Rs. {totalPriceNpr.toLocaleString()}
                </strong>
              </div>

              {!khaltiOtpStep ? (
                <form onSubmit={handleKhaltiLogin}>
                  <label className="gateway-input-label">Khalti Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="98XXXXXXXX"
                    maxLength={10}
                    value={khaltiMobile}
                    onChange={(e) => setKhaltiMobile(e.target.value.replace(/\D/g, ''))}
                    className="gateway-input"
                    required
                  />

                  <label className="gateway-input-label">Khalti MPIN (4-Digits)</label>
                  <input
                    type="password"
                    placeholder="••••"
                    maxLength={4}
                    value={khaltiMpin}
                    onChange={(e) => setKhaltiMpin(e.target.value.replace(/\D/g, ''))}
                    className="gateway-input"
                    required
                  />

                  <button type="submit" className="khalti-btn">
                    <span>Pay with Khalti</span>
                    <ArrowRight size={15} />
                  </button>
                </form>
              ) : (
                <div>
                  <p style={{ margin: '0 0 10px', fontSize: 12, color: 'rgba(31,77,51,0.75)', textAlign: 'center' }}>
                    Enter verification code sent to <strong>{khaltiMobile}</strong>:
                  </p>
                  <div className="otp-inputs-row">
                    {khaltiOtp.map((digit, idx) => (
                      <input
                        key={idx}
                        type="text"
                        maxLength={1}
                        value={digit}
                        readOnly
                        className="otp-box"
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    className="khalti-btn"
                    onClick={handleConfirmFinalPayment}
                  >
                    <Check size={16} />
                    <span>Authorize Rs. {totalPriceNpr.toLocaleString()}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setKhaltiOtpStep(false)}
                    style={{
                      background: 'none', border: 0, color: '#68897E', fontSize: 11,
                      cursor: 'pointer', display: 'block', margin: '8px auto 0'
                    }}
                  >
                    Back to Khalti login
                  </button>
                </div>
              )}
            </div>
          )}

          {/* CARD PAYMENT UI */}
          {paymentMethod === 'card' && (
            <div>
              <label className="gateway-input-label">Name on Card</label>
              <input
                type="text"
                placeholder="Cardholder Name"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="gateway-input"
                required
              />

              <label className="gateway-input-label">Card Number (SCT / Visa / Mastercard)</label>
              <input
                type="text"
                placeholder="4532 •••• •••• 8892"
                value={cardNumber}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
                  setCardNumber(raw.match(/.{1,4}/g)?.join(' ') || raw);
                }}
                className="gateway-input"
                required
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <label className="gateway-input-label">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    placeholder="12/28"
                    value={cardExpiry}
                    onChange={(e) => {
                      let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
                      if (raw.length >= 3) raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
                      setCardExpiry(raw);
                    }}
                    className="gateway-input"
                    required
                  />
                </div>
                <div>
                  <label className="gateway-input-label">CVC</label>
                  <input
                    type="password"
                    placeholder="123"
                    maxLength={4}
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                    className="gateway-input"
                    required
                  />
                </div>
              </div>

              <button
                type="button"
                className="kl-btn-primary"
                onClick={handleConfirmFinalPayment}
                style={{ height: 48, marginTop: 8 }}
              >
                <Lock size={15} />
                <span>Pay Rs. {totalPriceNpr.toLocaleString()}</span>
              </button>
            </div>
          )}

          {/* Guarantees */}
          <div className="payment-guarantees">
            <div className="payment-guarantee-item">
              <ShieldCheck size={14} color="#41A124" />
              <span>Verified Nepal Gateway</span>
            </div>
            <div className="payment-guarantee-item">
              <RotateCcw size={14} color="#41A124" />
              <span>Instant Activation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Modal */}
      {isProcessing && (
        <div className="payment-modal-backdrop">
          <div className="payment-modal-card">
            <div className="payment-spinner" style={{
              borderTopColor: paymentMethod === 'esewa' ? '#41A124' : paymentMethod === 'khalti' ? '#5D2E8E' : '#2554D7'
            }} />
            <h3 style={{ margin: '0 0 6px', fontSize: 18, color: '#1F4D33' }}>
              Authorizing Payment
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
              Payment Successful! 🎉
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: 'rgba(31,77,51,0.75)' }}>
              Congratulations! Your <strong>KhanaLens {selectedPlan.name}</strong> membership is now active.
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
                <span style={{ color: 'rgba(31,77,51,0.65)' }}>Gateway:</span>
                <strong>{paymentMethod === 'esewa' ? 'eSewa Digital Wallet' : paymentMethod === 'khalti' ? 'Khalti Wallet' : 'Debit/Credit Card'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: 'rgba(31,77,51,0.65)' }}>Transaction ID:</span>
                <strong>{transactionId}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: 'rgba(31,77,51,0.65)' }}>Amount Paid:</span>
                <strong style={{ color: '#41A124' }}>Rs. {totalPriceNpr.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(31,77,51,0.65)' }}>Plan Duration:</span>
                <strong>{billingPeriod === 'yearly' ? '1 Year Access' : '1 Month Access'}</strong>
              </div>
            </div>

            <button
              type="button"
              className="kl-btn-primary"
              onClick={() => navigate('/home')}
              style={{ height: 48 }}
            >
              Start Exploring {selectedPlan.name}
            </button>
          </div>
        </div>
      )}

      <BottomNav active="profile" />
    </div>
  );
}
