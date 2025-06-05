class SoundManager {
  constructor() {
    this.sounds = new Map();
    this.isMuted = false;
  }

  // Cargar un sonido
  loadSound(name, src) {
    const audio = new Audio(src);
    audio.preload = 'auto';
    this.sounds.set(name, audio);
  }

  // Reproducir un sonido
  play(name) {
    if (this.isMuted) return;
    const sound = this.sounds.get(name);
    if (sound) {
      sound.currentTime = 0;
      sound.muted = this.isMuted;
      sound.play().catch(error => console.log('Error playing sound:', error));
    }
  }

  // Reproducir un sonido en loop
  playLoop(name) {
    if (this.isMuted) return;
    const sound = this.sounds.get(name);
    if (sound) {
      sound.loop = true;
      sound.currentTime = 0;
      sound.muted = this.isMuted;
      sound.play().catch(error => console.log('Error playing sound:', error));
    }
  }

  // Detener un sonido
  stop(name) {
    const sound = this.sounds.get(name);
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  // Silenciar todos los sonidos
  muteAll() {
    this.isMuted = true;
    this.sounds.forEach(sound => {
      sound.muted = true;
    });
  }

  // Activar todos los sonidos
  unmuteAll() {
    this.isMuted = false;
    this.sounds.forEach(sound => {
      sound.muted = false;
    });
  }

  // Ajustar el volumen (0-1)
  setVolume(name, volume) {
    const sound = this.sounds.get(name);
    if (sound) {
      sound.volume = Math.max(0, Math.min(1, volume));
    }
  }
}

export const soundManager = new SoundManager(); 