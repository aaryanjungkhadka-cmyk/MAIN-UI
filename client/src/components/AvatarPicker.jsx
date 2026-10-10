import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { FOOD_AVATARS, FoodAvatar } from './FoodAvatar';
import { PEOPLE_AVATARS } from './Avatar';

export default function AvatarPicker({ value, onChange, onUpload }) {
  const [tab, setTab] = useState(String(value).startsWith('person-') ? 'people' : 'food');

  return (
    <div className="avatar-picker">
      <strong className="avatar-picker-title">Choose your avatar</strong>

      <div className="avatar-picker-tabs">
        <button type="button" className={tab === 'food' ? 'selected' : ''} onClick={() => setTab('food')}>
          Food
        </button>
        <button type="button" className={tab === 'people' ? 'selected' : ''} onClick={() => setTab('people')}>
          People
        </button>
      </div>

      {tab === 'food' ? (
        <div className="avatar-picker-row">
          {FOOD_AVATARS.map((option) => (
            <button
              type="button"
              key={option.id}
              className={`avatar-choice ${value === option.id ? 'selected' : ''}`}
              onClick={() => onChange(option.id)}
            >
              <FoodAvatar avatar={option.id} alt={option.label} />
            </button>
          ))}
        </div>
      ) : (
        <div className="avatar-picker-grid">
          {PEOPLE_AVATARS.map((option) => (
            <button
              type="button"
              key={option.id}
              className={`avatar-choice ${value === option.id ? 'selected' : ''}`}
              onClick={() => onChange(option.id)}
            >
              <img src={option.src} alt={option.id} className="people-avatar" />
            </button>
          ))}
        </div>
      )}

      {onUpload && (
        <div className="avatar-picker-upload">
          <label className="avatar-upload-label">
            <Sparkles size={13} /> Upload Photo
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={onUpload} />
          </label>
        </div>
      )}
    </div>
  );
}
