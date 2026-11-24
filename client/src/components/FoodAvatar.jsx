import React from 'react';
import dokoAvatar from '../assets/avatars/person-01.png';
import dokoDhakaTopi from '../assets/avatars/person-09.png';
import dokoDalBhat from '../assets/avatars/person-14.png';
import tacoAvatar from '../assets/images/avatar-taco.png';
import sushiAvatar from '../assets/images/avatar-sushi.png';

export const FOOD_AVATARS = [
  { id: 'doko', label: 'Doko (Mascot)', image: dokoAvatar },
  { id: 'doko-topi', label: 'Dhaka Topi Doko', image: dokoDhakaTopi },
  { id: 'doko-dalbhat', label: 'Dal Bhat Doko', image: dokoDalBhat },
  { id: 'taco', label: 'Taco', image: tacoAvatar },
  { id: 'sushi', label: 'Sushi', image: sushiAvatar },
];

export function FoodAvatar({ avatar = 'doko', className = '', alt = 'Food avatar' }) {
  if (avatar && (avatar.startsWith('data:') || avatar.startsWith('http') || avatar.startsWith('/'))) {
    return (
      <span className={`food-avatar ${className}`} role="img" aria-label={alt}>
        <img
          className="food-avatar-image"
          src={avatar}
          alt=""
          aria-hidden="true"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </span>
    );
  }
  const option = FOOD_AVATARS.find((item) => item.id === avatar) || FOOD_AVATARS[0];
  return (
    <span className={`food-avatar food-avatar-${option.id} ${className}`} role="img" aria-label={alt}>
      <img className="food-avatar-image" src={option.image} alt="" aria-hidden="true" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    </span>
  );
}
