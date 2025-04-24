import { Howl } from 'howler';

const sounds = {
  hover: new Howl({
    src: ['/sounds/hover.mp3'],
    volume: 0.2
  }),
  click: new Howl({
    src: ['/sounds/click.mp3'],
    volume: 0.3
  }),
  success: new Howl({
    src: ['/sounds/success.mp3'],
    volume: 0.4
  })
};

export const playSound = (soundName) => {
  if (sounds[soundName]) {
    sounds[soundName].play();
  }
};

// Custom hook for sound-enabled elements
export const useSoundHover = () => {
  return {
    onMouseEnter: () => playSound('hover'),
    onClick: () => playSound('click')
  };
};

// Initialize sounds (preload)
export const initSounds = () => {
  Object.values(sounds).forEach(sound => sound.load());
}; 