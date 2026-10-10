import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, ChevronRight, UserRound, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getProfileApi, saveProfileApi } from '../services/api';
import { Avatar, PEOPLE_AVATARS } from '../components/Avatar';
import AvatarPicker from '../components/AvatarPicker';
import BrandLogo from '../components/BrandLogo';

/* Finds any font file in src/assets/fonts. Does not break the page if the folder is empty. */
const fontFiles = import.meta.glob('../assets/fonts/*.{ttf,otf,woff2}', {
  eager: true,
  query: '?url',
  import: 'default',
});
const fontUrl = Object.values(fontFiles)[0];
const fontFormat = fontUrl?.endsWith('.woff2')
  ? 'woff2'
  : fontUrl?.endsWith('.otf')
    ? 'opentype'
    : 'truetype';

const fontFaceRule = fontUrl
  ? `@font-face {
  font-family: 'Google Sans Local';
  src: url('${fontUrl}') format('${fontFormat}');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}`
  : '';

/* Palette matches the splash, login and logo:
   forest green #1F4D33, deep green #163D29, mint #3FA47A, mint light #8FD7B4,
   cream #FBF7EE, beige #F7F1E4 / #E9DCC3 */
const setupCss = `
${fontFaceRule}

.setup-page,
.setup-page * {
  font-family: 'Google Sans Local', 'Google Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-sizing: border-box;
}

.setup-page {
  min-height: 100%;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  background: transparent;
  color: #1F4D33;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.setup-loading {
  color: #1F4D33;
  font-size: 14px;
  font-weight: 600;
  padding: 40px;
}

/* Beige glass card fills the app frame */
.setup-card {
  position: relative;
  width: 100%;
  flex: 1 1 auto;
  padding: 20px 16px 36px;
  background: transparent;
  border: none;
  box-shadow: none;
  border-radius: 0;
  box-sizing: border-box;
}

.setup-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 35%);
  pointer-events: none;
}

.setup-card > * {
  position: relative;
  z-index: 1;
}

@keyframes setup-fade-in {
  from { opacity: 0; transform: translateY(12px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.setup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.setup-back {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  border: 1px solid rgba(31, 77, 51, 0.15);
  background: rgba(255, 255, 255, 0.7);
  color: #1F4D33;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: background 0.2s ease, transform 0.15s ease;
}
.setup-back:hover {
  background: #FFFFFF;
  transform: translateX(-2px);
}

/* Round logo badge, like the splash page */
.setup-brand {
  display: flex;
  align-items: center;
  gap: 9px;
}
.setup-brand-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(145deg, #FBF7EE, #E9DCC3);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.9),
    0 0 0 1px rgba(31, 77, 51, 0.15),
    0 8px 18px rgba(31, 77, 51, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.setup-brand-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
  display: block;
}
.setup-brand strong {
  display: block;
  color: #1F4D33;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.4px;
}
.setup-brand strong span {
  color: #3FA47A;
}
.setup-brand small {
  display: block;
  margin-top: 2px;
  color: rgba(31, 77, 51, 0.65);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.2px;
}

.setup-avatar-wrap {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid rgba(251, 247, 238, 0.95);
  display: grid;
  place-items: center;
  box-shadow: 0 4px 10px rgba(31, 77, 51, 0.12);
}

.setup-title {
  margin-bottom: 16px;
}
.setup-title p {
  margin: 0;
  color: #3FA47A;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.2px;
}
.setup-title h1 {
  margin: 6px 0 4px;
  color: #1F4D33;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.6px;
  line-height: 1.2;
}
.setup-title span {
  color: rgba(31, 77, 51, 0.72);
  font-size: 13px;
  line-height: 1.45;
}

.setup-progress {
  width: 100%;
  height: 6px;
  background: rgba(31, 77, 51, 0.1);
  border-radius: 99px;
  margin: 16px 0 12px;
  overflow: hidden;
}
.setup-progress span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #4E8266, #1F4D33);
  border-radius: 99px;
  transition: width 0.35s cubic-bezier(0.2, 0.8, 0.25, 1);
}

.setup-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  margin-bottom: 22px;
}
.setup-steps div {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
  color: rgba(31, 77, 51, 0.5);
  font-size: 10px;
  font-weight: 600;
}
.setup-steps div.active {
  color: #1F4D33;
}
.setup-steps b {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(31, 77, 51, 0.08);
  color: rgba(31, 77, 51, 0.6);
  font-size: 10px;
  font-weight: 700;
  transition: all 0.25s ease;
}
.setup-steps div.active b {
  background: linear-gradient(180deg, #4E8266 0%, #1F4D33 100%);
  color: #FBF7EE;
  box-shadow: 0 4px 10px rgba(31, 77, 51, 0.25);
}

.setup-form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
  color: #1F4D33;
  font-size: 13px;
  font-weight: 600;
}
.setup-form input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid rgba(31, 77, 51, 0.18);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.6);
  color: #1F4D33;
  font: inherit;
  font-size: 14px;
  outline: none;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.9), 0 4px 14px rgba(31, 77, 51, 0.06);
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}
.setup-form input::placeholder {
  color: rgba(31, 77, 51, 0.45);
  opacity: 1;
}
.setup-form input:focus {
  border-color: rgba(63, 164, 122, 0.7);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 0 3px rgba(63, 164, 122, 0.18), 0 6px 18px rgba(31, 77, 51, 0.1);
}

.setup-callout {
  padding: 12px 14px;
  margin-bottom: 16px;
  border: 1px solid rgba(63, 164, 122, 0.3);
  border-radius: 14px;
  background: rgba(143, 215, 180, 0.15);
  color: #1F4D33;
  font-size: 12.5px;
  font-weight: 500;
  line-height: 1.45;
}

.setup-form fieldset {
  border: 0;
  padding: 0;
  margin: 0 0 16px;
}
.setup-form legend {
  color: #1F4D33;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
}

.setup-choice-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.setup-choice-row button,
.setup-condition-grid button,
.setup-goal-grid button {
  border: 1px solid rgba(31, 77, 51, 0.18);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(251, 247, 238, 0.55) 100%);
  color: #1F4D33;
  font-weight: 600;
  cursor: pointer;
  box-shadow: inset 0 1.5px 0 rgba(255, 255, 255, 0.9), 0 6px 14px rgba(31, 77, 51, 0.08);
  transition: all 0.2s ease;
}
.setup-choice-row button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 11px 8px;
  border-radius: 14px;
  font-size: 13px;
}
.setup-choice-row button:hover,
.setup-condition-grid button:hover,
.setup-goal-grid button:hover {
  transform: translateY(-2px);
  background: #FFFFFF;
}
.setup-choice-row button.selected,
.setup-condition-grid button.selected,
.setup-goal-grid button.selected {
  background: linear-gradient(180deg, #6A9E82 0%, #4E8266 50%, #3A6E52 100%);
  color: #FBF7EE;
  border-color: rgba(31, 77, 51, 0.5);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35), 0 8px 18px rgba(31, 77, 51, 0.2);
}

.setup-avatar-picker-block {
  padding: 12px 14px;
  margin-bottom: 16px;
  border: 1px solid rgba(31, 77, 51, 0.12);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.55);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
}
.setup-avatar-picker-block strong {
  display: block;
  color: #1F4D33;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
}
.setup-avatar-grid-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.setup-avatar-choice-btn {
  padding: 3px;
  border: 2px solid transparent;
  border-radius: 13px;
  background: #FFFFFF;
  cursor: pointer;
  transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}
.setup-avatar-choice-btn:hover {
  transform: scale(1.05);
}
.setup-avatar-choice-btn.selected {
  border-color: #3FA47A;
  box-shadow: 0 4px 10px rgba(31, 77, 51, 0.2);
}
.setup-avatar-choice-btn .food-avatar {
  width: 44px;
  height: 44px;
  display: block;
  border-radius: 10px;
  overflow: hidden;
}
.setup-avatar-upload-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  padding: 8px 14px;
  border-radius: 12px;
  border: 1px solid rgba(31, 77, 51, 0.18);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(247, 241, 228, 0.95) 100%);
  color: #1F4D33;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 4px 10px rgba(31, 77, 51, 0.08);
  transition: all 0.2s ease;
}
.setup-avatar-upload-label svg {
  color: #3FA47A;
}
.setup-avatar-upload-label:hover {
  background: #FFFFFF;
  transform: translateY(-1px);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 6px 14px rgba(31, 77, 51, 0.12);
}
.setup-avatar-upload-label:active {
  transform: scale(0.98);
}
.setup-avatar-upload-label input {
  display: none;
}

.setup-label {
  color: #1F4D33;
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 10px;
}
.setup-condition-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 16px;
}
.setup-condition-grid button {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  padding: 11px 12px;
  border-radius: 14px;
  font-size: 12.5px;
  text-align: left;
}

.setup-goal-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 16px;
}
.setup-goal-grid button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 13px;
  border-radius: 14px;
  font-size: 13px;
}

.setup-macro-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}
.setup-macro-grid label {
  font-size: 12px !important;
}

.setup-error {
  padding: 10px 14px;
  margin-bottom: 14px;
  border-radius: 14px;
  background: rgba(255, 240, 238, 0.9);
  border: 1px solid rgba(181, 71, 60, 0.35);
  color: #b5473c;
  font-size: 12.5px;
  font-weight: 600;
  text-align: center;
}

/* Primary button: lighter green liquid glass with shine */
.setup-submit {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  width: 100%;
  height: 53px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid rgba(143, 215, 180, 0.35);
  border-radius: 16px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0) 48%),
    linear-gradient(180deg, #6A9E82 0%, #4E8266 50%, #3A6E52 100%);
  color: #FBF7EE;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.35),
    0 6px 14px rgba(31, 77, 51, 0.12);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.setup-submit::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: -60%;
  width: 45%;
  z-index: -1;
  background: linear-gradient(
    105deg,
    transparent 0%,
    rgba(255, 255, 255, 0.05) 30%,
    rgba(255, 255, 255, 0.45) 50%,
    rgba(255, 255, 255, 0.05) 70%,
    transparent 100%
  );
  transform: skewX(-18deg);
  pointer-events: none;
  animation: setup-shine 3.2s ease-in-out infinite;
}
.setup-submit:hover {
  transform: translateY(-2px);
}
.setup-submit:active {
  transform: scale(0.98);
}
.setup-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@keyframes setup-shine {
  0% { left: -60%; }
  55%, 100% { left: 130%; }
}

.setup-safe {
  margin: 14px 0 0;
  text-align: center;
  color: rgba(31, 77, 51, 0.65);
  font-size: 11.5px;
  font-weight: 500;
  line-height: 1.4;
}

@media (max-width: 480px) {
  .setup-card {
    padding: 22px 18px 24px;
    border-radius: 28px;
  }
  .setup-form input {
    font-size: 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .setup-submit::before {
    animation: none !important;
  }
}

.setup-avatar-tabs { display: flex; gap: 6px; margin-bottom: 10px; }
.setup-avatar-tabs button {
  flex: 1; padding: 7px 10px; border-radius: 12px;
  border: 1px solid rgba(31, 77, 51, 0.18); background: rgba(255, 255, 255, 0.7);
  color: #1F4D33; font-size: 12px; font-weight: 600; cursor: pointer;
}
.setup-avatar-tabs button.selected {
  background: linear-gradient(180deg, #4E8266 0%, #1F4D33 100%);
  color: #FBF7EE; border-color: transparent;
}
.setup-people-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  gap: 8px; max-height: 240px; overflow-y: auto; padding: 2px;
}
.setup-people-grid .setup-avatar-choice-btn { padding: 2px; }
.people-avatar {
  width: 44px; height: 44px; border-radius: 50%; object-fit: cover; display: block;
}
.setup-people-grid .people-avatar { width: 100%; height: auto; aspect-ratio: 1 / 1; }
.setup-avatar-wrap .people-avatar { width: 100%; height: 100%; border-radius: 10px; }
.setup-avatar-upload-row { display: flex; justify-content: flex-end; margin-top: 10px; }
`;

const steps = ['Basic info', 'Body', 'Health', 'Goals'];
const defaultDraft = {
  name: '',
  age: '',
  gender: '',
  height: '',
  currentWeight: '',
  targetWeight: '',
  conditions: [],
  calorieGoal: 2000,
  proteinGoal: 120,
  carbsGoal: 250,
  fatGoal: 70,
  avatar: 'taco',
};
const healthOptions = [
  'Diabetes',
  'High blood pressure',
  'Heart disease',
  'Thyroid',
  'PCOS',
  'Asthma',
  'None of the above',
];

const requiredForStep = (step, draft) => {
  if (step === 0) return Boolean(draft.name.trim() && draft.age && draft.gender);
  if (step === 1) return Boolean(draft.height && draft.currentWeight);
  return true;
};

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState({ ...defaultDraft, name: user?.name || '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [avatarTab, setAvatarTab] = useState(
    String(defaultDraft.avatar).startsWith('person-') ? 'people' : 'food'
  );

  useEffect(() => {
    if (!user?.id) return;
    getProfileApi()
      .then((response) => {
        const profile = response.data.data;
        if (profile?.completed) {
          navigate('/progress', { replace: true });
          return;
        }
        if (profile) {
          setDraft((current) => ({
            ...current,
            ...profile,
            name: profile.name || user.name || '',
          }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id, user?.name, navigate]);

  const progress = useMemo(() => `${((step + 1) / steps.length) * 100}%`, [step]);
  const update = (field, value) => setDraft((current) => ({ ...current, [field]: value }));

  const toggleCondition = (condition) => {
    if (condition === 'None of the above') {
      update('conditions', draft.conditions.includes(condition) ? [] : [condition]);
      return;
    }
    update(
      'conditions',
      draft.conditions.includes(condition)
        ? draft.conditions.filter((item) => item !== condition)
        : [...draft.conditions.filter((item) => item !== 'None of the above'), condition]
    );
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      update('avatar', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const next = () => {
    setError('');
    if (!requiredForStep(step, draft)) {
      setError(
        step === 0
          ? 'Please provide your name, age, and gender to proceed.'
          : 'Please enter your height and current weight to proceed.'
      );
      return;
    }
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const finish = async (event) => {
    event.preventDefault();
    if (!requiredForStep(0, draft) || !requiredForStep(1, draft)) {
      setError('Please complete your basic info and body measurements.');
      setStep(!requiredForStep(0, draft) ? 0 : 1);
      return;
    }
    setSaving(true);
    setError('');
    try {
      await saveProfileApi({ ...draft, email: user.email, completed: true });
      navigate('/home', { replace: true });
    } catch (saveError) {
      setError(saveError.response?.data?.message || 'Could not save your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="setup-page">
        <style>{setupCss}</style>
        <div className="setup-loading">Loading your profile…</div>
      </div>
    );
  }

  return (
    <div className="kl-page setup-page kl-fade-up">
      <style>{setupCss}</style>

      <main className="setup-card">
        <header className="setup-header">
          <button
            type="button"
            className="setup-back"
            onClick={() => (step ? setStep(step - 1) : navigate('/home'))}
            aria-label="Go back"
          >
            <ArrowLeft size={17} />
          </button>
          <BrandLogo size={38} tagline={false} />
          <div className="setup-avatar-wrap">
            <Avatar avatar={draft.avatar} alt="Selected avatar" />
          </div>
        </header>

        <div className="setup-title">
          <p>
            STEP {step + 1} OF {steps.length}
          </p>
          <h1>
            {step === 0
              ? "Let's build your health profile"
              : step === 1
              ? 'Tell us about your body'
              : step === 2
              ? 'Help us personalize your plan'
              : 'What are your main goals?'}
          </h1>
          <span>
            {step === 0
              ? 'This helps calculate your daily nutritional targets.'
              : step === 1
              ? 'We use height and weight to estimate calorie needs accurately.'
              : step === 2
              ? 'Select any health conditions so guidance is tailored to you.'
              : 'Set your calorie and macronutrient targets.'}
          </span>
        </div>

        <div className="setup-progress">
          <span style={{ width: progress }} />
        </div>
        <div className="setup-steps">
          {steps.map((label, index) => (
            <div className={index <= step ? 'active' : ''} key={label}>
              <b>{index < step ? <Check size={12} /> : index + 1}</b>
              <small>{label}</small>
            </div>
          ))}
        </div>

        <form
          onSubmit={
            step === steps.length - 1
              ? finish
              : (event) => {
                  event.preventDefault();
                  next();
                }
          }
        >
          {step === 0 && (
            <section className="setup-form">
              <label>
                Full name
                <input
                  value={draft.name}
                  onChange={(event) => update('name', event.target.value)}
                  placeholder="e.g. Aashish Sharma"
                  autoFocus
                  required
                />
              </label>
              <label>
                Age
                <input
                  type="number"
                  min="7"
                  max="120"
                  value={draft.age}
                  onChange={(event) => update('age', event.target.value)}
                  placeholder="e.g. 24"
                  required
                />
              </label>
              <fieldset>
                <legend>Gender</legend>
                <div className="setup-choice-row">
                  {['Male', 'Female', 'Other'].map((value) => (
                    <button
                      type="button"
                      className={draft.gender === value ? 'selected' : ''}
                      key={value}
                      onClick={() => update('gender', value)}
                    >
                      <UserRound size={15} />
                      {value}
                    </button>
                  ))}
                </div>
              </fieldset>

              <AvatarPicker
                value={draft.avatar}
                onChange={(id) => update('avatar', id)}
                onUpload={handleImageUpload}
              />
            </section>
          )}

          {step === 1 && (
            <section className="setup-form">
              <div className="setup-callout">
                Your body measurements calculate your Basal Metabolic Rate (BMR) and daily targets.
              </div>
              <label>
                Height (cm)
                <input
                  type="number"
                  min="100"
                  max="250"
                  step="0.1"
                  value={draft.height}
                  onChange={(event) => update('height', event.target.value)}
                  placeholder="e.g. 172"
                  required
                />
              </label>
              <label>
                Current weight (kg)
                <input
                  type="number"
                  min="25"
                  max="400"
                  step="0.1"
                  value={draft.currentWeight}
                  onChange={(event) => update('currentWeight', event.target.value)}
                  placeholder="e.g. 68"
                  required
                />
              </label>
              <label>
                Target weight (kg){' '}
                <span style={{ fontWeight: 400, color: 'rgba(31,77,51,0.6)' }}>(optional)</span>
                <input
                  type="number"
                  min="25"
                  max="400"
                  step="0.1"
                  value={draft.targetWeight}
                  onChange={(event) => update('targetWeight', event.target.value)}
                  placeholder="e.g. 65"
                />
              </label>
            </section>
          )}

          {step === 2 && (
            <section className="setup-form">
              <p className="setup-label">Health conditions (select all that apply)</p>
              <div className="setup-condition-grid">
                {healthOptions.map((condition) => (
                  <button
                    type="button"
                    className={draft.conditions.includes(condition) ? 'selected' : ''}
                    key={condition}
                    onClick={() => toggleCondition(condition)}
                  >
                    {draft.conditions.includes(condition) && <Check size={13} />}
                    {condition}
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="setup-form">
              <p className="setup-label">Choose your primary goal</p>
              <div className="setup-goal-grid">
                {[
                  ['Lose weight', 1800],
                  ['Maintain weight', 2000],
                  ['Gain weight', 2400],
                  ['Improve health', 2000],
                ].map(([label, calories]) => (
                  <button
                    type="button"
                    className={Number(draft.calorieGoal) === calories ? 'selected' : ''}
                    key={label}
                    onClick={() => update('calorieGoal', calories)}
                  >
                    <span>{label}</span>
                    <ChevronRight size={14} />
                  </button>
                ))}
              </div>

              <p className="setup-label" style={{ marginTop: 14 }}>
                Daily Macronutrient Targets
              </p>
              <div className="setup-macro-grid">
                <label>
                  Protein (g)
                  <input
                    type="number"
                    value={draft.proteinGoal}
                    onChange={(event) => update('proteinGoal', event.target.value)}
                  />
                </label>
                <label>
                  Carbs (g)
                  <input
                    type="number"
                    value={draft.carbsGoal}
                    onChange={(event) => update('carbsGoal', event.target.value)}
                  />
                </label>
                <label>
                  Fat (g)
                  <input
                    type="number"
                    value={draft.fatGoal}
                    onChange={(event) => update('fatGoal', event.target.value)}
                  />
                </label>
              </div>
            </section>
          )}

          {error && <p className="setup-error">{error}</p>}

          <button className="setup-submit" type="submit" disabled={saving}>
            {saving ? 'Saving…' : step === steps.length - 1 ? 'Complete profile' : 'Continue'}{' '}
            <ChevronRight size={17} />
          </button>
        </form>

        <p className="setup-safe">
          Your information is stored securely and can be edited anytime from your Profile.
        </p>
      </main>
    </div>
  );
}