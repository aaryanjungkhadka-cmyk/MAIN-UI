import { FoodAvatar } from './FoodAvatar';

const personFiles = import.meta.glob('../assets/avatars/*.png', {
  eager: true,
  import: 'default',
});

export const PEOPLE_AVATARS = Object.entries(personFiles)
  .map(([path, src]) => ({ id: path.split('/').pop().replace('.png', ''), src }))
  .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

export function Avatar({ avatar, alt = 'Avatar' }) {
  if (typeof avatar === 'string' && avatar.startsWith('data:')) {
    return <img src={avatar} alt={alt} className="people-avatar" />;
  }
  const person = PEOPLE_AVATARS.find((item) => item.id === avatar);
  if (person) {
    return <img src={person.src} alt={alt} className="people-avatar" />;
  }
  return <FoodAvatar avatar={avatar} alt={alt} />;
}
