"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, RefreshCw, Trophy, Zap, Heart, Star } from "lucide-react";

export default function NotFound() {
  const [showParticles, setShowParticles] = useState(true);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden font-spaceGrotesk">
      {/* Animated background with particles */}
      {showParticles && <ParticleBackground />}

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>

      <div className="max-w-4xl w-full space-y-8 text-center z-10 px-4">
        <div className="animate-float">
          <h1 className="text-[12rem] font-extrabold tracking-tight bg-gradient-to-r from-primary-500 to-primary-400 bg-clip-text text-transparent animate-text leading-none">
            404
          </h1>
        </div>

        <div className="animate-fade-up">
          <h2 className="text-4xl font-bold">Oops! Page Lost in Space</h2>
          <p className="text-muted-foreground text-lg mt-2">
            The page you're looking for has drifted into another dimension.
          </p>
        </div>

        <div className="pt-4 animate-fade-in">
          <SpaceShooterGame />
        </div>

        <div className="pt-8 animate-fade-up">
          <Link href="/">
            <Button className="gap-2 bg-gradient-to-r from-primary-500 to-primary-400 hover:opacity-90 transition-all duration-300 shadow-light-100">
              <Home size={16} />
              Return to Home Base
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

    // Create stars
    const stars: {
      x: number;
      y: number;
      size: number;
      speed: number;
      color: string;
    }[] = [];

    // Create different types of stars with your color palette
    for (let i = 0; i < 200; i++) {
      const colors = ["#FF7000", "#FF8A30", "#FFFFFF", "#DCE3F1", "#7B8EC8"];
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5,
        speed: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      stars.forEach((star) => {
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Add glow to some stars
        if (star.size > 1.5) {
          ctx.shadowColor = star.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Move stars
        star.y += star.speed;

        // Reset stars when they go off screen
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 bg-gradient-to-b from-dark-200 to-dark-300"
    />
  );
}

type GameObject = {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  active: boolean;
};

type Spaceship = GameObject & {
  lives: number;
};

type Asteroid = GameObject & {
  rotation: number;
  rotationSpeed: number;
  type: number; // Different asteroid types
};

type Laser = GameObject & {
  power: number;
};

type PowerUp = GameObject & {
  type: "shield" | "multishot" | "speed";
  duration: number;
};

function SpaceShooterGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [powerUpActive, setPowerUpActive] = useState<string | null>(null);
  const [powerUpTimer, setPowerUpTimer] = useState(0);

  const spaceshipRef = useRef<Spaceship>({
    x: 0,
    y: 0,
    width: 40,
    height: 40,
    speed: 5,
    active: true,
    lives: 3,
  });

  const asteroidsRef = useRef<Asteroid[]>([]);
  const lasersRef = useRef<Laser[]>([]);
  const powerUpsRef = useRef<PowerUp[]>([]);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const animationFrameRef = useRef<number>(0);
  const lastAsteroidTimeRef = useRef<number>(0);
  const lastPowerUpTimeRef = useRef<number>(0);
  const shieldActiveRef = useRef<boolean>(false);

  // Initialize game
  const initGame = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const spaceship = spaceshipRef.current;

    // Reset game state
    setScore(0);
    setGameOver(false);
    setLevel(1);
    setPowerUpActive(null);
    setPowerUpTimer(0);
    asteroidsRef.current = [];
    lasersRef.current = [];
    powerUpsRef.current = [];
    shieldActiveRef.current = false;

    // Position spaceship at the bottom center
    spaceship.x = canvas.width / 2 - spaceship.width / 2;
    spaceship.y = canvas.height - spaceship.height - 20;
    spaceship.lives = 3;
    spaceship.active = true;
    spaceship.speed = 5;

    // Start game loop
    setGameActive(true);
    lastAsteroidTimeRef.current = Date.now();
    lastPowerUpTimeRef.current = Date.now();

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    gameLoop();
  };

  // Game loop
  const gameLoop = () => {
    if (!canvasRef.current || !gameActive) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update power-up timer
    if (powerUpActive) {
      setPowerUpTimer((prev) => {
        if (prev <= 0) {
          // Power-up expired
          setPowerUpActive(null);

          // Reset effects
          if (powerUpActive === "speed") {
            spaceshipRef.current.speed = 5;
          } else if (powerUpActive === "shield") {
            shieldActiveRef.current = false;
          }

          return 0;
        }
        return prev - 1 / 60; // Decrease by 1 second (assuming 60fps)
      });
    }

    // Update and draw game objects
    updateSpaceship();
    updateLasers();
    updateAsteroids();
    updatePowerUps();
    checkCollisions();

    // Draw game objects
    drawSpaceship(ctx);
    drawLasers(ctx);
    drawAsteroids(ctx);
    drawPowerUps(ctx);
    drawHUD(ctx);

    // Continue game loop
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  };

  // Update spaceship position based on key presses
  const updateSpaceship = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const spaceship = spaceshipRef.current;

    if (keysRef.current["ArrowLeft"] || keysRef.current["a"]) {
      spaceship.x = Math.max(0, spaceship.x - spaceship.speed);
    }

    if (keysRef.current["ArrowRight"] || keysRef.current["d"]) {
      spaceship.x = Math.min(
        canvas.width - spaceship.width,
        spaceship.x + spaceship.speed
      );
    }
  };

  // Update lasers position
  const updateLasers = () => {
    const lasers = lasersRef.current;

    // Move lasers up
    lasers.forEach((laser) => {
      laser.y -= laser.speed;
    });

    // Remove lasers that are off screen
    lasersRef.current = lasers.filter((laser) => laser.y + laser.height > 0);
  };

  // Update asteroids position and spawn new ones
  const updateAsteroids = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const asteroids = asteroidsRef.current;

    // Move asteroids down
    asteroids.forEach((asteroid) => {
      asteroid.y += asteroid.speed;
      asteroid.rotation += asteroid.rotationSpeed;
    });

    // Remove asteroids that are off screen
    asteroidsRef.current = asteroids.filter(
      (asteroid) => asteroid.y < canvas.height
    );

    // Spawn new asteroids
    const now = Date.now();
    const spawnInterval = Math.max(800 - level * 50, 300); // Decrease spawn time as level increases

    if (now - lastAsteroidTimeRef.current > spawnInterval) {
      spawnAsteroid();
      lastAsteroidTimeRef.current = now;
    }
  };

  // Update power-ups
  const updatePowerUps = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const powerUps = powerUpsRef.current;

    // Move power-ups down
    powerUps.forEach((powerUp) => {
      powerUp.y += powerUp.speed;
    });

    // Remove power-ups that are off screen
    powerUpsRef.current = powerUps.filter(
      (powerUp) => powerUp.y < canvas.height
    );

    // Spawn new power-ups occasionally
    const now = Date.now();
    const spawnInterval = 15000; // Every 15 seconds

    if (now - lastPowerUpTimeRef.current > spawnInterval) {
      spawnPowerUp();
      lastPowerUpTimeRef.current = now;
    }
  };

  // Spawn a new asteroid
  const spawnAsteroid = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const size = Math.random() * 20 + 20; // Random size between 20 and 40

    const asteroid: Asteroid = {
      x: Math.random() * (canvas.width - size),
      y: -size,
      width: size,
      height: size,
      speed: Math.random() * 2 + 1 + level * 0.2, // Increase speed with level
      active: true,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      type: Math.floor(Math.random() * 3), // 3 types of asteroids
    };

    asteroidsRef.current.push(asteroid);
  };

  // Spawn a power-up
  const spawnPowerUp = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const size = 25;

    const types: ("shield" | "multishot" | "speed")[] = [
      "shield",
      "multishot",
      "speed",
    ];
    const type = types[Math.floor(Math.random() * types.length)];

    const powerUp: PowerUp = {
      x: Math.random() * (canvas.width - size),
      y: -size,
      width: size,
      height: size,
      speed: 1.5,
      active: true,
      type: type,
      duration: 10, // 10 seconds
    };

    powerUpsRef.current.push(powerUp);
  };

  // Check for collisions between game objects
  const checkCollisions = () => {
    const spaceship = spaceshipRef.current;
    const asteroids = asteroidsRef.current;
    const lasers = lasersRef.current;
    const powerUps = powerUpsRef.current;

    // Check laser-asteroid collisions
    lasers.forEach((laser, laserIndex) => {
      asteroids.forEach((asteroid, asteroidIndex) => {
        if (
          laser.x < asteroid.x + asteroid.width &&
          laser.x + laser.width > asteroid.x &&
          laser.y < asteroid.y + asteroid.height &&
          laser.y + laser.height > asteroid.y
        ) {
          // Collision detected - remove both laser and asteroid
          lasers.splice(laserIndex, 1);
          asteroids.splice(asteroidIndex, 1);

          // Increase score
          setScore((prevScore) => {
            const newScore = prevScore + 10;

            // Level up every 100 points
            if (Math.floor(newScore / 100) > Math.floor(prevScore / 100)) {
              setLevel((prevLevel) => prevLevel + 1);
            }

            // Update high score if needed
            if (newScore > highScore) {
              setHighScore(newScore);
            }

            return newScore;
          });
        }
      });
    });

    // Check spaceship-asteroid collisions
    if (spaceship.active) {
      for (let i = asteroids.length - 1; i >= 0; i--) {
        const asteroid = asteroids[i];

        if (
          spaceship.x < asteroid.x + asteroid.width &&
          spaceship.x + spaceship.width > asteroid.x &&
          spaceship.y < asteroid.y + asteroid.height &&
          spaceship.y + spaceship.height > asteroid.y
        ) {
          // Collision detected - remove asteroid
          asteroids.splice(i, 1);

          // If shield is active, don't lose a life
          if (!shieldActiveRef.current) {
            spaceship.lives--;

            if (spaceship.lives <= 0) {
              // Game over
              setGameOver(true);
              setGameActive(false);

              // Update high score if needed
              if (score > highScore) {
                setHighScore(score);
              }
            }
          } else {
            // Deactivate shield after one hit
            shieldActiveRef.current = false;
            setPowerUpActive(null);
            setPowerUpTimer(0);
          }

          // Only handle one collision at a time
          break;
        }
      }
    }

    // Check spaceship-powerup collisions
    for (let i = powerUps.length - 1; i >= 0; i--) {
      const powerUp = powerUps[i];

      if (
        spaceship.x < powerUp.x + powerUp.width &&
        spaceship.x + spaceship.width > powerUp.x &&
        spaceship.y < powerUp.y + powerUp.height &&
        spaceship.y + powerUp.height > powerUp.y
      ) {
        // Collision detected - activate power-up
        powerUps.splice(i, 1);

        // Apply power-up effect
        setPowerUpActive(powerUp.type);
        setPowerUpTimer(powerUp.duration);

        if (powerUp.type === "shield") {
          shieldActiveRef.current = true;
        } else if (powerUp.type === "speed") {
          spaceshipRef.current.speed = 8; // Increase speed
        }

        break;
      }
    }
  };

  // Draw spaceship
  const drawSpaceship = (ctx: CanvasRenderingContext2D) => {
    const spaceship = spaceshipRef.current;

    if (!spaceship.active) return;

    // Draw spaceship (triangle shape)
    ctx.save();
    ctx.translate(
      spaceship.x + spaceship.width / 2,
      spaceship.y + spaceship.height / 2
    );

    // Draw ship body
    ctx.fillStyle = "#FF7000";
    ctx.beginPath();
    ctx.moveTo(0, -spaceship.height / 2);
    ctx.lineTo(-spaceship.width / 2, spaceship.height / 2);
    ctx.lineTo(spaceship.width / 2, spaceship.height / 2);
    ctx.closePath();
    ctx.fill();

    // Draw ship details
    ctx.fillStyle = "#FF8A30";
    ctx.beginPath();
    ctx.moveTo(0, -spaceship.height / 2);
    ctx.lineTo(-spaceship.width / 4, 0);
    ctx.lineTo(spaceship.width / 4, 0);
    ctx.closePath();
    ctx.fill();

    // Draw engine flames (animated)
    ctx.fillStyle = Math.random() > 0.5 ? "#FF7000" : "#FF8A30";
    ctx.beginPath();
    ctx.moveTo(-spaceship.width / 4, spaceship.height / 2);
    ctx.lineTo(0, spaceship.height / 2 + Math.random() * 15 + 5);
    ctx.lineTo(spaceship.width / 4, spaceship.height / 2);
    ctx.closePath();
    ctx.fill();

    // Draw shield if active
    if (shieldActiveRef.current) {
      ctx.strokeStyle = "#7B8EC8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, spaceship.width / 1.5, 0, Math.PI * 2);
      ctx.stroke();

      // Add glow effect
      ctx.shadowColor = "#7B8EC8";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(0, 0, spaceship.width / 1.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    ctx.restore();
  };

  // Draw lasers
  const drawLasers = (ctx: CanvasRenderingContext2D) => {
    const lasers = lasersRef.current;

    lasers.forEach((laser) => {
      // Create gradient for laser beam
      const gradient = ctx.createLinearGradient(
        laser.x,
        laser.y,
        laser.x,
        laser.y + laser.height
      );
      gradient.addColorStop(0, "#FF7000");
      gradient.addColorStop(1, "#FF8A30");

      ctx.fillStyle = gradient;
      ctx.fillRect(laser.x, laser.y, laser.width, laser.height);

      // Add glow effect
      ctx.shadowColor = "#FF7000";
      ctx.shadowBlur = 10;
      ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
      ctx.shadowBlur = 0;
    });
  };

  // Draw asteroids
  const drawAsteroids = (ctx: CanvasRenderingContext2D) => {
    const asteroids = asteroidsRef.current;

    asteroids.forEach((asteroid) => {
      ctx.save();
      ctx.translate(
        asteroid.x + asteroid.width / 2,
        asteroid.y + asteroid.height / 2
      );
      ctx.rotate(asteroid.rotation);

      // Different asteroid colors based on type
      const colors = ["#858EAD", "#7B8EC8", "#DCE3F1"];
      const detailColors = ["#656D8A", "#5A6DA7", "#BCC2D0"];

      // Draw asteroid (irregular shape)
      ctx.fillStyle = colors[asteroid.type];
      ctx.beginPath();

      // Create irregular polygon
      const vertices = 8;
      const radius = asteroid.width / 2;

      for (let i = 0; i < vertices; i++) {
        const angle = (i / vertices) * Math.PI * 2;
        const vertexRadius = radius * (0.8 + Math.sin(i * 5) * 0.2);
        const x = Math.cos(angle) * vertexRadius;
        const y = Math.sin(angle) * vertexRadius;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.closePath();
      ctx.fill();

      // Add details to asteroid
      ctx.fillStyle = detailColors[asteroid.type];
      ctx.beginPath();
      ctx.arc(radius * 0.3, -radius * 0.2, radius * 0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(-radius * 0.2, radius * 0.3, radius * 0.15, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  };

  // Draw power-ups
  const drawPowerUps = (ctx: CanvasRenderingContext2D) => {
    const powerUps = powerUpsRef.current;

    powerUps.forEach((powerUp) => {
      ctx.save();
      ctx.translate(
        powerUp.x + powerUp.width / 2,
        powerUp.y + powerUp.height / 2
      );

      // Rotate slowly
      ctx.rotate(Date.now() / 1000);

      // Different colors and shapes based on power-up type
      if (powerUp.type === "shield") {
        // Shield - blue circle
        ctx.fillStyle = "#7B8EC8";
        ctx.beginPath();
        ctx.arc(0, 0, powerUp.width / 2, 0, Math.PI * 2);
        ctx.fill();

        // Shield icon
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(0, 0, powerUp.width / 4, 0, Math.PI * 2);
        ctx.fill();
      } else if (powerUp.type === "multishot") {
        // Multishot - orange square
        ctx.fillStyle = "#FF8A30";
        ctx.fillRect(
          -powerUp.width / 2,
          -powerUp.height / 2,
          powerUp.width,
          powerUp.height
        );

        // Multishot icon
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(
          -powerUp.width / 4,
          -powerUp.height / 4,
          powerUp.width / 2,
          powerUp.height / 2
        );
      } else if (powerUp.type === "speed") {
        // Speed - yellow triangle
        ctx.fillStyle = "#FFD700";
        ctx.beginPath();
        ctx.moveTo(0, -powerUp.height / 2);
        ctx.lineTo(-powerUp.width / 2, powerUp.height / 2);
        ctx.lineTo(powerUp.width / 2, powerUp.height / 2);
        ctx.closePath();
        ctx.fill();

        // Speed icon
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.moveTo(0, -powerUp.height / 4);
        ctx.lineTo(-powerUp.width / 4, powerUp.height / 4);
        ctx.lineTo(powerUp.width / 4, powerUp.height / 4);
        ctx.closePath();
        ctx.fill();
      }

      // Add glow effect
      ctx.shadowColor =
        powerUp.type === "shield"
          ? "#7B8EC8"
          : powerUp.type === "multishot"
          ? "#FF8A30"
          : "#FFD700";
      ctx.shadowBlur = 15;

      if (powerUp.type === "shield") {
        ctx.beginPath();
        ctx.arc(0, 0, powerUp.width / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (powerUp.type === "multishot") {
        ctx.fillRect(
          -powerUp.width / 2,
          -powerUp.height / 2,
          powerUp.width,
          powerUp.height
        );
      } else if (powerUp.type === "speed") {
        ctx.beginPath();
        ctx.moveTo(0, -powerUp.height / 2);
        ctx.lineTo(-powerUp.width / 2, powerUp.height / 2);
        ctx.lineTo(powerUp.width / 2, powerUp.height / 2);
        ctx.closePath();
        ctx.fill();
      }

      ctx.shadowBlur = 0;

      ctx.restore();
    });
  };

  // Draw HUD (Heads Up Display)
  const drawHUD = (ctx: CanvasRenderingContext2D) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const spaceship = spaceshipRef.current;

    // Draw score
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 20px Inter";
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${score}`, 20, 30);

    // Draw level
    ctx.textAlign = "center";
    ctx.fillText(`Level: ${level}`, canvas.width / 2, 30);

    // Draw lives
    ctx.textAlign = "right";
    ctx.fillText("Lives:", canvas.width - 100, 30);

    // Draw life icons
    for (let i = 0; i < spaceship.lives; i++) {
      ctx.fillStyle = "#FF7000";
      ctx.beginPath();
      ctx.moveTo(canvas.width - 80 + i * 25, 25);
      ctx.lineTo(canvas.width - 90 + i * 25, 35);
      ctx.lineTo(canvas.width - 70 + i * 25, 35);
      ctx.closePath();
      ctx.fill();
    }

    // Draw active power-up
    if (powerUpActive) {
      ctx.textAlign = "left";
      ctx.fillStyle =
        powerUpActive === "shield"
          ? "#7B8EC8"
          : powerUpActive === "multishot"
          ? "#FF8A30"
          : "#FFD700";
      ctx.fillText(
        `${
          powerUpActive.charAt(0).toUpperCase() + powerUpActive.slice(1)
        }: ${Math.ceil(powerUpTimer)}s`,
        20,
        60
      );
    }
  };

  // Fire laser
  const fireLaser = () => {
    if (!gameActive || gameOver) return;

    const spaceship = spaceshipRef.current;

    // Regular laser
    const laser: Laser = {
      x: spaceship.x + spaceship.width / 2 - 2,
      y: spaceship.y,
      width: 4,
      height: 15,
      speed: 10,
      active: true,
      power: 1,
    };

    lasersRef.current.push(laser);

    // If multishot is active, fire additional lasers
    if (powerUpActive === "multishot") {
      const laser2: Laser = {
        x: spaceship.x + 10,
        y: spaceship.y + 5,
        width: 3,
        height: 12,
        speed: 9,
        active: true,
        power: 1,
      };

      const laser3: Laser = {
        x: spaceship.x + spaceship.width - 13,
        y: spaceship.y + 5,
        width: 3,
        height: 12,
        speed: 9,
        active: true,
        power: 1,
      };

      lasersRef.current.push(laser2, laser3);
    }
  };

  // Set up event listeners
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = Math.min(500, window.innerWidth - 40);
      canvas.height = 400;

      // Reposition spaceship when canvas is resized
      const spaceship = spaceshipRef.current;
      spaceship.x = canvas.width / 2 - spaceship.width / 2;
      spaceship.y = canvas.height - spaceship.height - 20;
    };

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

    // Key event listeners
    const handleKeyDownInput = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;

      // Fire laser on space
      if (e.key === " " || e.key === "Space") {
        fireLaser();
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDownInput);
    window.addEventListener("keyup", handleKeyUp);

    // Touch controls for mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (!canvasRef.current || !gameActive) return;

      const canvas = canvasRef.current;
      const spaceship = spaceshipRef.current;
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;

      // Move spaceship to touch position
      spaceship.x = Math.max(
        0,
        Math.min(canvas.width - spaceship.width, touchX - spaceship.width / 2)
      );
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!gameActive) return;

      // Fire laser on touch
      fireLaser();

      // Also handle movement
      handleTouchMove(e);
    };

    canvas.addEventListener("touchmove", handleTouchMove);
    canvas.addEventListener("touchstart", handleTouchStart);

    // Clean up event listeners
    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
      window.removeEventListener("keydown", handleKeyDownInput);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchStart);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameActive]);

  return (
    <div className="space-y-4 max-w-lg mx-auto font-inter">
      <div className="space-y-2">
        <h3 className="text-xl font-bold animate-fade-up">Space Defender</h3>
        <p className="text-muted-foreground animate-fade-up">
          Destroy asteroids to earn points!
        </p>
      </div>

      <div className="relative bg-dark-300 rounded-lg overflow-hidden border border-dark-400 shadow-dark-100 animate-fade-in">
        <canvas
          ref={canvasRef}
          className="w-full h-[400px]"
          style={{ touchAction: "none" }}
        />

        {!gameActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="text-center space-y-4 p-6 rounded-lg">
              {gameOver ? (
                <>
                  <div className="text-4xl font-bold text-primary-500 animate-pulse-slow">
                    Game Over
                  </div>
                  <div className="text-2xl">Score: {score}</div>
                  <div className="flex items-center justify-center gap-2">
                    <Trophy className="text-primary-400" />
                    <span>High Score: {highScore}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-primary-400 bg-clip-text text-transparent animate-text">
                    Space Defender
                  </div>
                  <div className="text-lg text-light-700">
                    Protect the galaxy from asteroids!
                  </div>
                </>
              )}

              <Button
                onClick={initGame}
                className="mt-4 bg-gradient-to-r from-primary-500 to-primary-400 hover:opacity-90 transition-all duration-300 animate-pulse-slow shadow-light-100"
              >
                {gameOver ? "Play Again" : "Start Game"}
              </Button>

              <div className="mt-4 text-sm text-light-400 grid grid-cols-2 gap-4">
                <div>
                  <div className="font-bold">Desktop:</div>
                  <div>← → to move</div>
                  <div>Space to shoot</div>
                </div>
                <div>
                  <div className="font-bold">Mobile:</div>
                  <div>Touch to move</div>
                  <div>Tap to shoot</div>
                </div>
              </div>

              <div className="mt-6 text-sm text-light-400 border-t border-dark-400 pt-4">
                <div className="font-bold mb-2">Power-ups:</div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-accent-blue mb-1"></div>
                    <span>Shield</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 bg-primary-400 mb-1"></div>
                    <span>Multishot</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 bg-yellow-400 transform rotate-45 mb-1"></div>
                    <span>Speed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center animate-fade-up">
        <div className="flex items-center gap-1">
          <Heart className="text-primary-500" size={16} />
          <span className="text-sm">Lives: {spaceshipRef.current.lives}</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="text-primary-400" size={16} />
          <span className="text-sm">Level: {level}</span>
        </div>
        {powerUpActive && (
          <div className="flex items-center gap-1">
            <Star
              className={
                powerUpActive === "shield"
                  ? "text-accent-blue"
                  : powerUpActive === "multishot"
                  ? "text-primary-400"
                  : "text-yellow-400"
              }
              size={16}
            />
            <span className="text-sm">
              {powerUpActive}: {Math.ceil(powerUpTimer)}s
            </span>
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={initGame}
          className="gap-1 border-dark-400 hover:bg-dark-300"
        >
          <RefreshCw size={14} />
          Reset
        </Button>
      </div>
    </div>
  );
}
