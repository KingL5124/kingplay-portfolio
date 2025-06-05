import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { soundManager } from '../utils/soundManager';
import { SOUNDS } from '../assets/sounds';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

const SpaceGame = () => {
  const canvasRef = useRef(null);
  const requestIdRef = useRef(null);
  const ctxRef = useRef(null);
  const shipRef = useRef({
    x: 0,
    y: 0,
    width: 20,
    height: 30,
    speed: 5,
    color: '#ff0000',
    moving: {
      left: false,
      right: false,
      up: false,
      down: false
    }
  });
  const gameStateRef = useRef({
    asteroids: [],
    bullets: [],
    particles: [],
    lastAsteroidSpawn: 0,
    lastShot: 0,
    slowMotionTimeoutId: null,
    stars: []
  });
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [newBestScore, setNewBestScore] = useState(false);
  const [deathFlash, setDeathFlash] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState('astronaut');
  const [isSlowMotion, setIsSlowMotion] = useState(false);
  const [shipVisible, setShipVisible] = useState(true);
  const [isDestroyed, setIsDestroyed] = useState(false);
  const [menuTab, setMenuTab] = useState('play'); // 'play', 'characters', 'scores'
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [highScores, setHighScores] = useState(() => {
    const saved = localStorage.getItem("highScores");
    return saved ? JSON.parse(saved) : [];
  });
  const [isMuted, setIsMuted] = useState(false);

  const characters = {
    astronaut: {
      name: 'Astronauta',
      color: '#ff0000',
      helmet: true,
      cape: true
    },
    alien: {
      name: 'Alien',
      color: '#00ff00',
      bigEyes: true,
      antenna: true
    },
    robot: {
      name: 'Robot',
      color: '#0000ff',
      metallic: true,
      glowing: true
    }
  };

  // Load best score from localStorage
  useEffect(() => {
    const savedBestScore = localStorage.getItem("mejorScore");
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore));
    }
  }, []);

  // Save best score when game ends
  useEffect(() => {
    if (gameOver && score > bestScore) {
      setBestScore(score);
      setNewBestScore(true);
      localStorage.setItem("mejorScore", score.toString());
    }
  }, [gameOver, score, bestScore]);

  // Reset new best score animation
  useEffect(() => {
    if (newBestScore) {
      const timer = setTimeout(() => setNewBestScore(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [newBestScore]);

  // Glitch animation effect
  useEffect(() => {
    if (gameOver) {
      setGlitchActive(true);
      const timer = setTimeout(() => setGlitchActive(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [gameOver]);

  // Game properties
  const gameProperties = {
    asteroidSpawnRate: 1000, // ms
    bulletCooldown: 250, // ms
    baseAsteroidSpeeds: {
      small: 1,    // Velocidad base más lenta (antes 2)
      medium: 0.8, // Velocidad base más lenta (antes 1.5)
      large: 0.5   // Velocidad base más lenta (antes 1)
    },
    bulletSpeed: 7,
    // Niveles de dificultad basados en score con incrementos más graduales
    difficultyLevels: [
      { score: 0, speedMultiplier: 1, level: 1 },
      { score: 100, speedMultiplier: 1.1, level: 2 },  // Antes 1.2
      { score: 300, speedMultiplier: 1.2, level: 3 },  // Antes 1.4
      { score: 500, speedMultiplier: 1.3, level: 4 },  // Antes 1.6
      { score: 1000, speedMultiplier: 1.4, level: 5 }, // Antes 1.8
      { score: 2000, speedMultiplier: 1.5, level: 6 }  // Antes 2.0
    ]
  };

  // Asteroid shapes - cada forma es un array de puntos relativos al centro
  const asteroidShapes = {
    small: [
      [
        [-8, -5], [-3, -8], [3, -8], [8, -5],
        [8, 3], [5, 8], [-5, 8], [-8, 3]
      ],
      [
        [-7, -7], [0, -9], [7, -7],
        [9, 0], [7, 7], [0, 9],
        [-7, 7], [-9, 0]
      ]
    ],
    medium: [
      [
        [-15, -8], [-5, -15], [5, -15], [15, -8],
        [15, 5], [8, 15], [-8, 15], [-15, 5]
      ],
      [
        [-12, -12], [0, -15], [12, -12],
        [15, 0], [12, 12], [0, 15],
        [-12, 12], [-15, 0]
      ]
    ],
    large: [
      [
        [-20, -12], [-8, -20], [8, -20], [20, -12],
        [20, 8], [12, 20], [-12, 20], [-20, 8]
      ],
      [
        [-18, -18], [0, -22], [18, -18],
        [22, 0], [18, 18], [0, 22],
        [-18, 18], [-22, 0]
      ]
    ]
  };

  // Cargar sonidos al iniciar
  useEffect(() => {
    soundManager.loadSound('menu-music', SOUNDS.MENU_MUSIC);
    soundManager.loadSound('game-music', SOUNDS.GAME_MUSIC);
    soundManager.loadSound('hit', SOUNDS.HIT);
    soundManager.loadSound('collect', SOUNDS.COLLECT);
    soundManager.loadSound('game-over', SOUNDS.GAME_OVER);
    soundManager.loadSound('victory', SOUNDS.VICTORY);
    soundManager.loadSound('button-click', SOUNDS.BUTTON_CLICK);
    soundManager.loadSound('menu-select', SOUNDS.MENU_SELECT);

    // Reproducir música del menú
    soundManager.playLoop('menu-music');

    // Limpiar sonidos al desmontar
    return () => {
      soundManager.stop('menu-music');
      soundManager.stop('game-music');
    };
  }, []);

  // Handle keyboard input
  const handleKeyDown = useCallback((e) => {
    if (!gameStarted || isDestroyed) return;
    
    // Prevent default behavior for game controls
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
      e.preventDefault();
    }

    const ship = shipRef.current;
    if (e.key === 'ArrowLeft') ship.moving.left = true;
    if (e.key === 'ArrowRight') ship.moving.right = true;
    if (e.key === 'ArrowUp') ship.moving.up = true;
    if (e.key === 'ArrowDown') ship.moving.down = true;
    if (e.key === ' ') shootBullet();
  }, [gameStarted, isDestroyed]);

  const handleKeyUp = useCallback((e) => {
    if (!gameStarted || isDestroyed) return;
    
    // Prevent default behavior for game controls
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
      e.preventDefault();
    }

    const ship = shipRef.current;
    if (e.key === 'ArrowLeft') ship.moving.left = false;
    if (e.key === 'ArrowRight') ship.moving.right = false;
    if (e.key === 'ArrowUp') ship.moving.up = false;
    if (e.key === 'ArrowDown') ship.moving.down = false;
  }, [gameStarted, isDestroyed]);

  // Shoot bullet
  const shootBullet = useCallback(() => {
    if (isDestroyed) return;
    
    const now = Date.now();
    const gameState = gameStateRef.current;
    const ship = shipRef.current;
    
    if (now - gameState.lastShot < gameProperties.bulletCooldown) return;

    gameState.bullets.push({
      x: ship.x + ship.width / 2,
      y: ship.y,
      width: 4,
      height: 10,
      color: '#ff0000'
    });

    gameState.lastShot = now;
    soundManager.play('hit'); // Sonido de disparo
  }, [isDestroyed]);

  // Check collisions
  const checkCollisions = useCallback(() => {
    if (isDestroyed) return;

    const gameState = gameStateRef.current;
    const ship = shipRef.current;

    // Bullet-asteroid collisions
    gameState.bullets = gameState.bullets.filter(bullet => {
      let bulletHit = false;
      gameState.asteroids = gameState.asteroids.filter(asteroid => {
        if (
          bullet.x < asteroid.x + asteroid.width &&
          bullet.x + bullet.width > asteroid.x &&
          bullet.y < asteroid.y + asteroid.height &&
          bullet.y + bullet.height > asteroid.y
        ) {
          bulletHit = true;
          asteroid.health--;

          // Crear explosión más pequeña al impactar
          createExplosion(
            bullet.x,
            bullet.y,
            '#ffaa00'
          );

          // Si el asteroide aún tiene vida, no lo eliminamos
          if (asteroid.health > 0) {
            return true;
          }

          // Explosión final cuando el asteroide es destruido
          createExplosion(
            asteroid.x + asteroid.width / 2,
            asteroid.y + asteroid.height / 2,
            '#ffaa00'
          );

          // Puntuación basada en el tamaño
          const points = {
            small: 10,
            medium: 20,
            large: 30
          }[asteroid.size];
          
          setScore(prev => prev + points);
          soundManager.play('collect'); // Sonido de recolección
          return false;
        }
        return true;
      });
      return !bulletHit;
    });

    // Ship-asteroid collisions
    for (let asteroid of gameState.asteroids) {
      if (
        ship.x < asteroid.x + asteroid.width &&
        ship.x + ship.width > asteroid.x &&
        ship.y < asteroid.y + asteroid.height &&
        ship.y + ship.height > asteroid.y
      ) {
        setIsDestroyed(true);
        setShipVisible(false);
        
        // Detenemos todo movimiento de la nave
        ship.moving.left = false;
        ship.moving.right = false;
        ship.moving.up = false;
        ship.moving.down = false;
        
        // Limpiamos todos los asteroides y balas
        gameState.asteroids = [];
        gameState.bullets = [];
        
        // Creamos múltiples explosiones para un efecto más dramático
        for (let i = 0; i < 3; i++) {
          createExplosion(
            ship.x + ship.width / 2 + (Math.random() - 0.5) * 20,
            ship.y + ship.height / 2 + (Math.random() - 0.5) * 20,
            '#ff0000'
          );
        }
        
        createExplosion(
          asteroid.x + asteroid.width / 2,
          asteroid.y + asteroid.height / 2,
          '#808080'
        );

        triggerSlowMotion();
        setDeathFlash(true);
        soundManager.play('game-over'); // Sonido de game over

        setTimeout(() => {
          setGameOver(true);
          setGameStarted(false);
          setDeathFlash(false);
          setShipVisible(true);
          setIsDestroyed(false);
        }, 2000);
        
        return;
      }
    }
  }, [isDestroyed]);

  // Update game state
  const update = useCallback(() => {
    const timeScale = isSlowMotion ? 0.2 : 1;
    const gameState = gameStateRef.current;
    const ship = shipRef.current;
    const canvas = canvasRef.current;

    // Update particles with time scale
    gameState.particles = gameState.particles.filter(particle => {
      particle.update(timeScale);
      return particle.alpha > 0 && particle.size > 0;
    });

    if (!isDestroyed) {
      // Move ship
      if (ship.moving.left) ship.x = Math.max(0, ship.x - ship.speed * timeScale);
      if (ship.moving.right) ship.x = Math.min(canvas.width - ship.width, ship.x + ship.speed * timeScale);
      if (ship.moving.up) ship.y = Math.max(0, ship.y - ship.speed * timeScale);
      if (ship.moving.down) ship.y = Math.min(canvas.height - ship.height, ship.y + ship.speed * timeScale);
    }

    // Move bullets with time scale
    gameState.bullets = gameState.bullets.filter(bullet => {
      bullet.y -= gameProperties.bulletSpeed * timeScale;
      return bullet.y > -bullet.height;
    });

    // Move asteroids with time scale and individual speeds
    gameState.asteroids = gameState.asteroids.filter(asteroid => {
      asteroid.y += asteroid.speed * timeScale;
      return asteroid.y < canvas.height;
    });

    // Only spawn asteroids if not in slow motion and not destroyed
    if (!isSlowMotion && !isDestroyed) {
      spawnAsteroid();
    }

    // Check collisions
    checkCollisions();
  }, [isSlowMotion, isDestroyed, checkCollisions]);

  // Initialize game
  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 400;
    canvas.height = 600;
    ctxRef.current = canvas.getContext('2d');

    const ship = shipRef.current;
    ship.x = canvas.width / 2 - ship.width / 2;
    ship.y = canvas.height - ship.height - 10;

    const gameState = gameStateRef.current;
    gameState.asteroids = [];
    gameState.bullets = [];
    gameState.particles = [];
    gameState.lastAsteroidSpawn = 0;
    gameState.lastShot = 0;

    // Inicializar estrellas
    gameState.stars = [];
    for (let i = 0; i < 100; i++) { // Crear 100 estrellas
      gameState.stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5, // Tamaño entre 0.5 y 2.5
        speed: Math.random() * 2 + 1,  // Velocidad entre 1 y 3
        brightness: Math.random() * 0.5 + 0.5 // Brillo entre 0.5 y 1
      });
    }
  }, []);

  // Draw background with stars
  const drawBackground = useCallback(() => {
    if (!ctxRef.current) return;

    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    const gameState = gameStateRef.current;
    const timeScale = isSlowMotion ? 0.2 : 1;

    // Fondo negro
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar y actualizar estrellas
    gameState.stars.forEach(star => {
      // Actualizar posición
      star.y += star.speed * timeScale;

      // Si la estrella sale de la pantalla, reiniciar en la parte superior
      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }

      // Dibujar estrella con brillo variable
      ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [isSlowMotion]);

  // Game loop
  const gameLoop = useCallback(() => {
    if (!gameStarted || gameOver) return;

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    // Draw background with stars first
    drawBackground();

    // Update game state
    update();

    // Draw everything
    drawShip();
    drawThruster();
    drawBullets();
    drawAsteroids();

    // Draw particles
    gameStateRef.current.particles.forEach(particle => particle.draw(ctx));

    // Continue game loop
    requestIdRef.current = requestAnimationFrame(gameLoop);
  }, [gameStarted, gameOver, update, drawBackground]);

  // Start game effect
  useEffect(() => {
    if (gameStarted && !gameOver) {
      initGame();
      requestIdRef.current = requestAnimationFrame(gameLoop);

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      return () => {
        if (requestIdRef.current) {
          cancelAnimationFrame(requestIdRef.current);
        }
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [gameStarted, gameOver, gameLoop, handleKeyDown, handleKeyUp, initGame]);

  // Draw functions
  const drawShip = useCallback(() => {
    if (!shipVisible || !ctxRef.current) return;

    const ctx = ctxRef.current;
    const ship = shipRef.current;
    const character = characters[selectedCharacter];
    
    if (character.helmet) {
      // Cuerpo del astronauta
      ctx.fillStyle = '#ff0000'; // Traje rojo
      ctx.fillRect(ship.x, ship.y + 15, ship.width, ship.height - 15);
      
      // Botas
      ctx.fillStyle = '#333333';
      ctx.fillRect(ship.x + 2, ship.y + ship.height - 5, 6, 5);
      ctx.fillRect(ship.x + ship.width - 8, ship.y + ship.height - 5, 6, 5);
      
      // Casco
      ctx.fillStyle = '#ff0000'; // Casco rojo
      ctx.beginPath();
      ctx.arc(ship.x + ship.width / 2, ship.y + 10, 10, 0, Math.PI * 2);
      ctx.fill();
      
      // Visor del casco
      ctx.fillStyle = '#00ffff'; // Visor celeste
      ctx.beginPath();
      ctx.arc(ship.x + ship.width / 2, ship.y + 10, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Reflejo del visor
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ship.x + ship.width / 2 - 3, ship.y + 8, 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Brazos
      ctx.fillStyle = '#ff0000';
      // Brazo izquierdo
      ctx.fillRect(ship.x - 4, ship.y + 15, 4, 15);
      ctx.fillStyle = '#cccccc'; // Guante
      ctx.fillRect(ship.x - 5, ship.y + 30, 6, 6);
      
      // Brazo derecho
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(ship.x + ship.width, ship.y + 15, 4, 15);
      ctx.fillStyle = '#cccccc'; // Guante
      ctx.fillRect(ship.x + ship.width - 1, ship.y + 30, 6, 6);
      
      // Detalles del traje
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(ship.x + (ship.width / 2) - 3, ship.y + 20, 6, 2); // Insignia
    } else if (character.bigEyes) {
      // Cuerpo del alien
      ctx.fillStyle = '#00ff00'; // Verde brillante
      ctx.fillRect(ship.x, ship.y + 15, ship.width, ship.height - 15);
      
      // Cabeza grande
      ctx.fillStyle = '#00dd00'; // Verde más oscuro
      ctx.beginPath();
      ctx.arc(ship.x + ship.width / 2, ship.y + 12, 12, 0, Math.PI * 2);
      ctx.fill();
      
      // Ojos grandes
      ctx.fillStyle = '#000000'; // Contorno negro
      ctx.beginPath();
      ctx.arc(ship.x + ship.width / 2 - 5, ship.y + 10, 4, 0, Math.PI * 2);
      ctx.arc(ship.x + ship.width / 2 + 5, ship.y + 10, 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Brillo en los ojos
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ship.x + ship.width / 2 - 4, ship.y + 9, 1.5, 0, Math.PI * 2);
      ctx.arc(ship.x + ship.width / 2 + 6, ship.y + 9, 1.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Antenas
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      // Antena izquierda
      ctx.beginPath();
      ctx.moveTo(ship.x + ship.width / 2 - 6, ship.y);
      ctx.lineTo(ship.x + ship.width / 2 - 8, ship.y - 8);
      ctx.stroke();
      // Antena derecha
      ctx.beginPath();
      ctx.moveTo(ship.x + ship.width / 2 + 6, ship.y);
      ctx.lineTo(ship.x + ship.width / 2 + 8, ship.y - 8);
      ctx.stroke();
      
      // Puntas de antenas brillantes
      ctx.fillStyle = '#80ff80';
      ctx.beginPath();
      ctx.arc(ship.x + ship.width / 2 - 8, ship.y - 8, 2, 0, Math.PI * 2);
      ctx.arc(ship.x + ship.width / 2 + 8, ship.y - 8, 2, 0, Math.PI * 2);
      ctx.fill();
      
    } else if (character.metallic) {
      // Cuerpo del robot
      ctx.fillStyle = '#4169E1'; // Azul real
      ctx.fillRect(ship.x, ship.y + 15, ship.width, ship.height - 15);
      
      // Cabeza cuadrada
      ctx.fillStyle = '#4169E1';
      ctx.fillRect(ship.x + 2, ship.y, ship.width - 4, 15);
      
      // Visor del robot
      ctx.fillStyle = '#000000'; // Base negra
      ctx.fillRect(ship.x + 4, ship.y + 4, ship.width - 8, 4);
      
      // Luz escaneadora
      ctx.fillStyle = '#ff0000'; // Luz roja
      ctx.fillRect(ship.x + 6, ship.y + 5, 4, 2);
      
      // Detalles metálicos
      ctx.fillStyle = '#87CEEB'; // Azul claro
      // Hombros
      ctx.fillRect(ship.x - 2, ship.y + 15, 4, 4);
      ctx.fillRect(ship.x + ship.width - 2, ship.y + 15, 4, 4);
      
      // Brazos robóticos
      ctx.strokeStyle = '#87CEEB';
      ctx.lineWidth = 3;
      // Brazo izquierdo
      ctx.beginPath();
      ctx.moveTo(ship.x, ship.y + 17);
      ctx.lineTo(ship.x - 4, ship.y + 25);
      ctx.lineTo(ship.x - 4, ship.y + 35);
      ctx.stroke();
      // Brazo derecho
      ctx.beginPath();
      ctx.moveTo(ship.x + ship.width, ship.y + 17);
      ctx.lineTo(ship.x + ship.width + 4, ship.y + 25);
      ctx.lineTo(ship.x + ship.width + 4, ship.y + 35);
      ctx.stroke();
      
      // Pinzas
      ctx.strokeStyle = '#4169E1';
      ctx.lineWidth = 2;
      // Pinza izquierda
      ctx.beginPath();
      ctx.moveTo(ship.x - 6, ship.y + 35);
      ctx.lineTo(ship.x - 2, ship.y + 35);
      ctx.stroke();
      // Pinza derecha
      ctx.beginPath();
      ctx.moveTo(ship.x + ship.width + 6, ship.y + 35);
      ctx.lineTo(ship.x + ship.width + 2, ship.y + 35);
      ctx.stroke();
      
      // Detalles brillantes
      ctx.fillStyle = '#ffffff';
      // Luces en el cuerpo
      ctx.fillRect(ship.x + 4, ship.y + 20, 2, 2);
      ctx.fillRect(ship.x + ship.width - 6, ship.y + 20, 2, 2);
      // Reflejo en la cabeza
      ctx.fillRect(ship.x + 4, ship.y + 2, 2, 2);
    }
  }, [shipVisible, selectedCharacter]);

  const drawThruster = useCallback(() => {
    if (!shipVisible || !ctxRef.current) return;

    const ctx = ctxRef.current;
    const ship = shipRef.current;
    const character = characters[selectedCharacter];
    let thrusterColor, particleColor;

    if (character.helmet) {
      thrusterColor = '#ff3300';
      particleColor = '#ff9966';
    } else if (character.bigEyes) {
      thrusterColor = '#33ff33';
      particleColor = '#99ff99';
    } else if (character.metallic) {
      thrusterColor = '#3366ff';
      particleColor = '#99ccff';
    }

    // Solo dibujamos el propulsor si nos estamos moviendo
    if (ship.moving.up || ship.moving.down) {
      // Efecto principal del propulsor
      ctx.fillStyle = thrusterColor;
      const thrusterHeight = ship.moving.up ? 15 : 8;
      const direction = ship.moving.up ? 1 : -1;
      
      // Forma de llama
      ctx.beginPath();
      ctx.moveTo(ship.x + ship.width / 2 - 5, ship.moving.up ? ship.y + ship.height : ship.y);
      ctx.lineTo(ship.x + ship.width / 2 + 5, ship.moving.up ? ship.y + ship.height : ship.y);
      ctx.lineTo(ship.x + ship.width / 2, ship.moving.up ? ship.y + ship.height + thrusterHeight : ship.y - thrusterHeight);
      ctx.closePath();
      ctx.fill();

      // Partículas
      for (let i = 0; i < 3; i++) {
        const particleSize = Math.random() * 3 + 1;
        const offset = Math.random() * 6 - 3;
        const distance = Math.random() * 5 + thrusterHeight;
        
        ctx.fillStyle = particleColor;
        ctx.beginPath();
        ctx.arc(
          ship.x + ship.width / 2 + offset,
          ship.moving.up ? ship.y + ship.height + distance : ship.y - distance,
          particleSize,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }
  }, [shipVisible, selectedCharacter]);

  const drawBullets = useCallback(() => {
    if (!ctxRef.current) return;

    const ctx = ctxRef.current;
    const gameState = gameStateRef.current;

    gameState.bullets.forEach(bullet => {
      ctx.fillStyle = bullet.color;
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
  }, []);

  const drawAsteroids = useCallback(() => {
    if (!ctxRef.current) return;

    const ctx = ctxRef.current;
    const gameState = gameStateRef.current;

    gameState.asteroids.forEach(asteroid => {
      ctx.save();
      
      // Trasladar al centro del asteroide
      ctx.translate(
        asteroid.x + asteroid.width / 2,
        asteroid.y + asteroid.height / 2
      );
      
      // Aplicar rotación
      ctx.rotate(asteroid.rotation);
      
      // Dibujar forma irregular
      ctx.beginPath();
      asteroid.shape.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point[0], point[1]);
        } else {
          ctx.lineTo(point[0], point[1]);
        }
      });
      ctx.closePath();

      // Rellenar con gradiente para dar efecto de profundidad
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, asteroid.width / 2);
      gradient.addColorStop(0, '#a0a0a0');
      gradient.addColorStop(1, '#505050');
      ctx.fillStyle = gradient;
      ctx.fill();

      // Agregar grietas
      ctx.strokeStyle = '#404040';
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        const startAngle = Math.random() * Math.PI * 2;
        const length = Math.random() * (asteroid.width / 3) + asteroid.width / 6;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(
          Math.cos(startAngle) * length,
          Math.sin(startAngle) * length
        );
        ctx.stroke();
      }

      ctx.restore();

      // Actualizar rotación para el siguiente frame
      asteroid.rotation += asteroid.rotationSpeed;
    });
  }, []);

  // Trigger slow motion
  const triggerSlowMotion = () => {
    setIsSlowMotion(true);
    if (gameStateRef.current.slowMotionTimeoutId) clearTimeout(gameStateRef.current.slowMotionTimeoutId);
    gameStateRef.current.slowMotionTimeoutId = setTimeout(() => {
      setIsSlowMotion(false);
    }, 1000); // Duración de la cámara lenta
  };

  // Get current difficulty level based on score
  const getCurrentLevel = useCallback((currentScore) => {
    const { difficultyLevels } = gameProperties;
    // Encontrar el nivel de dificultad actual basado en el score
    const currentLevel = [...difficultyLevels]
      .reverse()
      .find(level => currentScore >= level.score);
    
    return currentLevel || difficultyLevels[0];
  }, []);

  // Spawn asteroid with random shape and size
  const spawnAsteroid = () => {
    const now = Date.now();
    const gameState = gameStateRef.current;
    if (now - gameState.lastAsteroidSpawn < gameProperties.asteroidSpawnRate) return;

    // Determinar tamaño aleatorio
    const sizes = ['small', 'medium', 'large'];
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    
    // Seleccionar forma aleatoria para el tamaño elegido
    const shapeIndex = Math.floor(Math.random() * asteroidShapes[size].length);
    const shape = asteroidShapes[size][shapeIndex];

    // Calcular dimensiones basadas en el tamaño
    const dimensions = {
      small: { width: 20, height: 20, health: 1 },
      medium: { width: 35, height: 35, health: 2 },
      large: { width: 50, height: 50, health: 3 }
    }[size];

    // Obtener el nivel actual y su multiplicador de velocidad
    const currentLevel = getCurrentLevel(score);

    // Crear el asteroide con propiedades basadas en su tamaño
    gameState.asteroids.push({
      x: Math.random() * (canvasRef.current.width - dimensions.width),
      y: -dimensions.height,
      width: dimensions.width,
      height: dimensions.height,
      color: '#808080',
      shape: shape,
      size: size,
      health: dimensions.health,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      speed: gameProperties.baseAsteroidSpeeds[size] * currentLevel.speedMultiplier
    });

    gameState.lastAsteroidSpawn = now;
  };

  // Particle class
  class Particle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.size = Math.random() * 4 + 2;
      this.speedX = (Math.random() - 0.5) * 12;
      this.speedY = (Math.random() - 0.5) * 12;
      this.alpha = 1;
      this.gravity = 0.1;
    }

    update(timeScale = 1) {
      this.x += this.speedX * timeScale;
      this.y += this.speedY * timeScale;
      this.speedY += this.gravity * timeScale;
      this.alpha -= 0.02 * timeScale;
      this.size = Math.max(0, this.size - 0.1 * timeScale);
    }

    draw(ctx) {
      if (!ctx) return;
      
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Create explosion particles
  const createExplosion = useCallback((x, y, color) => {
    const gameState = gameStateRef.current;
    for (let i = 0; i < 30; i++) {
      gameState.particles.push(new Particle(x, y, color));
    }
  }, []);

  // Guardar puntuación alta
  useEffect(() => {
    if (gameOver && score > 0) {
      setShowNameInput(true);
    }
  }, [gameOver, score]);

  const handleSaveScore = () => {
    if (playerName.trim()) {
      const newHighScores = [...highScores, { 
        name: playerName.trim(),
        score, 
        character: selectedCharacter, 
        date: new Date().toLocaleDateString() 
      }]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10); // Mantener solo los 10 mejores
      setHighScores(newHighScores);
      localStorage.setItem("highScores", JSON.stringify(newHighScores));
      setShowNameInput(false);
      setPlayerName('');
    }
  };

  // Reproducir música del juego al iniciar
  useEffect(() => {
    if (gameStarted && !gameOver) {
      soundManager.stop('menu-music');
      soundManager.playLoop('game-music');
    } else if (gameOver) {
      soundManager.stop('game-music');
      soundManager.playLoop('menu-music');
    }
  }, [gameStarted, gameOver]);

  // Reproducir sonido de botón
  const handleButtonClick = () => {
    soundManager.play('button-click');
  };

  // Función para alternar el mute
  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev;
      if (newMuted) {
        soundManager.muteAll();
      } else {
        soundManager.unmuteAll();
        // Reproducir el sonido apropiado según el estado del juego
        if (gameStarted && !gameOver) {
          soundManager.stop('menu-music');
          soundManager.playLoop('game-music');
        } else {
          soundManager.stop('game-music');
          soundManager.playLoop('menu-music');
        }
      }
      return newMuted;
    });
  }, [gameStarted, gameOver]);

  return (
    <div className="relative">
      {/* Botón de mute */}
      <motion.button
        onClick={toggleMute}
        className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isMuted ? (
          <FaVolumeMute className="text-white text-xl" />
        ) : (
          <FaVolumeUp className="text-white text-xl" />
        )}
      </motion.button>

      <canvas
        ref={canvasRef}
        width={400}
        height={600}
        className={`pixel-border bg-black mx-auto transition-all duration-100 ${
          deathFlash ? 'animate-death-flash' : ''
        }`}
      />
      
      {/* Score display while playing */}
      {gameStarted && !gameOver && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <p className="text-xl pixel-text text-[#ffffff] text-center">
            Score: {score}
          </p>
          <p className="text-sm pixel-text text-[#ffaa00] text-center mt-1">
            Nivel {getCurrentLevel(score).level}
          </p>
        </div>
      )}
      
      {!gameStarted && (
        <div className="absolute inset-0 flex flex-col items-center justify-start bg-black/80">
          <motion.h3 
            className={`text-3xl font-bold pixel-text text-[#ff3333] mt-8 mb-6 ${glitchActive ? 'glitch-text' : ''}`}
            animate={glitchActive ? {
              x: [0, -2, 2, -2, 2, 0],
              opacity: [1, 0.8, 1, 0.8, 1],
              textShadow: [
                '2px 2px #ff0000',
                '-2px -2px #00ff00',
                '2px -2px #0000ff',
                '-2px 2px #ff0000',
                '2px 2px #ff0000'
              ]
            } : {}}
            transition={{ duration: 0.2, repeat: 5 }}
          >
            {gameOver ? 'GAME OVER' : 'SPACE SHOOTER'}
          </motion.h3>

          {/* Menu Tabs */}
          <div className="flex gap-2 mb-6">
            {['play', 'characters', 'scores'].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setMenuTab(tab)}
                className={`pixel-button px-4 py-2 ${
                  menuTab === tab ? 'bg-red-600' : 'bg-red-800'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-sm">
                  {tab === 'play' ? 'Jugar' : 
                   tab === 'characters' ? 'Personajes' : 
                   'Puntuaciones'}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Play Tab */}
          {menuTab === 'play' && (
            <div className="text-center">
              {gameOver && (
                <div className="mb-8">
                  <p className="text-xl pixel-text text-[#ffffff] mb-2">Score: {score}</p>
                  <motion.p 
                    className="text-lg pixel-text text-[#ffd700]"
                    animate={newBestScore ? {
                      scale: [1, 1.2, 1],
                      color: ['#ffd700', '#ff3333', '#ffd700']
                    } : {}}
                    transition={{ duration: 0.5, repeat: 3 }}
                  >
                    Mejor Score: {bestScore}
                  </motion.p>
                </div>
              )}

              {showNameInput ? (
                <div className="mb-8">
                  <p className="text-lg pixel-text text-[#ffffff] mb-4">¡Nueva puntuación alta!</p>
                  <div className="flex flex-col items-center gap-4">
                    <input
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="Ingresa tu nombre"
                      className="pixel-input px-4 py-2 bg-black/50 text-white border-2 border-red-600 focus:border-red-400 outline-none"
                      maxLength={15}
                    />
                    <motion.button
                      onClick={() => {
                        handleButtonClick();
                        handleSaveScore();
                      }}
                      className="pixel-button px-6 py-2 bg-red-600"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Guardar
                    </motion.button>
                  </div>
                </div>
              ) : (
                <motion.button
                  onClick={() => {
                    handleButtonClick();
                    setGameStarted(true);
                    setGameOver(false);
                    setScore(0);
                  }}
                  className="pixel-button px-8 py-4 relative overflow-hidden text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    boxShadow: [
                      '0 0 5px #ff0000',
                      '0 0 20px #ff0000',
                      '0 0 5px #ff0000'
                    ]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <span className="relative z-10">
                    {gameOver ? 'JUGAR DE NUEVO' : 'COMENZAR'}
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-red-500/20"
                    animate={{
                      x: ['-100%', '100%'],
                      opacity: [0, 0.5, 0]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </motion.button>
              )}
              <p className="text-sm pixel-text text-[#bbbbbb] mt-6 text-center">
                Usa las flechas ← → para moverte horizontalmente<br/>
                Usa las flechas ↑ ↓ para moverte verticalmente<br/>
                Espacio para disparar
              </p>

              {/* Recent Scores Section */}
              <div className="mt-8 px-4">
                <p className="text-lg pixel-text text-[#ffffff] mb-4">Últimas Puntuaciones</p>
                <div className="bg-black/50 p-4 rounded pixel-border">
                  {highScores.length > 0 ? (
                    <div className="grid gap-2">
                      {highScores.slice(0, 3).map((score, index) => (
                        <motion.div
                          key={index}
                          className="grid grid-cols-3 text-sm pixel-text"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <span className="text-[#ffd700]">#{index + 1}</span>
                          <span className="text-[#ffffff]">{score.score}</span>
                          <span className="text-[#bbbbbb]">{characters[score.character].name}</span>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#bbbbbb] text-sm">¡Sé el primero en la tabla!</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Characters Tab */}
          {menuTab === 'characters' && (
            <div className="text-center">
              <p className="text-lg pixel-text text-[#ffffff] mb-6">Elige tu personaje:</p>
              <div className="grid grid-cols-1 gap-6">
                {Object.entries(characters).map(([key, char]) => (
                  <motion.button
                    key={key}
                    onClick={() => setSelectedCharacter(key)}
                    className={`pixel-button px-6 py-4 ${
                      selectedCharacter === key ? 'bg-red-600' : 'bg-red-800'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-lg">{char.name}</span>
                      <div className="text-sm text-[#bbbbbb]">
                        {key === 'astronaut' && '¡Experto en navegación espacial!'}
                        {key === 'alien' && '¡Maestro de la velocidad!'}
                        {key === 'robot' && '¡Resistente y poderoso!'}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Scores Tab */}
          {menuTab === 'scores' && (
            <div className="text-center w-full px-8">
              <p className="text-lg pixel-text text-[#ffffff] mb-4">Mejores Puntuaciones</p>
              <div className="bg-black/50 p-4 rounded pixel-border">
                {highScores.length > 0 ? (
                  <div className="grid gap-2">
                    {highScores.map((score, index) => (
                      <motion.div
                        key={index}
                        className="grid grid-cols-3 text-sm pixel-text"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <span className="text-[#ffd700]">#{index + 1}</span>
                        <span className="text-[#ffffff]">{score.score}</span>
                        <span className="text-[#bbbbbb]">{characters[score.character].name}</span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#bbbbbb] text-sm">¡Sé el primero en la tabla!</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SpaceGame; 