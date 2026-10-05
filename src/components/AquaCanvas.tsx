import React, { useRef, useEffect, useState } from 'react';
import { BubbleParticle, Fish, Gate, KeyItem, LevelData, Pearl, Point, Wall, WaterCurrent } from '../types/game';
import { soundManager } from '../audio/soundManager';

interface AquaCanvasProps {
  level: LevelData;
  onLevelComplete: (pearlsCollected: number) => void;
  onPearlCollected: (total: number) => void;
  isPaused: boolean;
  lives: number;
  setLives: React.Dispatch<React.SetStateAction<number>>;
  onRestartTrigger: React.MutableRefObject<(() => void) | null>;
}

interface RealBackgroundCreature {
  type: 'clownfish' | 'turtle';
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  depthAlpha: number;
  wobble: number;
}

export const AquaCanvas: React.FC<AquaCanvasProps> = ({
  level,
  onLevelComplete,
  onPearlCollected,
  isPaused,
  lives,
  setLives,
  onRestartTrigger,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Real Image Asset References
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const pufferImageRef = useRef<HTMLImageElement | null>(null);
  const jellyfishImageRef = useRef<HTMLImageElement | null>(null);
  const clownfishImageRef = useRef<HTMLImageElement | null>(null);
  const turtleImageRef = useRef<HTMLImageElement | null>(null);

  const [assetsLoaded, setAssetsLoaded] = useState<boolean>(false);

  const VIRTUAL_WIDTH = 700;
  const VIRTUAL_HEIGHT = 550;
  const BALL_RADIUS = 13;

  // Ball State
  const ballPosRef = useRef<Point>({ x: level.spawn.x, y: level.spawn.y });
  const ballVelRef = useRef<Point>({ x: 0, y: 0 });
  const hasKeyRef = useRef<boolean>(false);

  // Entities state
  const wallsRef = useRef<Wall[]>([]);
  const fishesRef = useRef<Fish[]>([]);
  const pearlsRef = useRef<Pearl[]>([]);
  const gatesRef = useRef<Gate[]>([]);
  const keysRef = useRef<KeyItem[]>([]);
  const currentsRef = useRef<WaterCurrent[]>([]);
  const bubblesRef = useRef<BubbleParticle[]>([]);

  // Ambient Swimming Real Ocean Creatures
  const realCreaturesRef = useRef<RealBackgroundCreature[]>([]);

  // Input states
  const keysPressedRef = useRef<Record<string, boolean>>({});
  const touchAimRef = useRef<Point | null>(null);
  const isPointerDownRef = useRef<boolean>(false);
  const respawnCooldownRef = useRef<number>(0);

  // Load Real Photorealistic Marine Assets
  useEffect(() => {
    let loadedCount = 0;
    const totalAssets = 5;

    const onAssetLoad = () => {
      loadedCount++;
      if (loadedCount >= totalAssets) {
        setAssetsLoaded(true);
      }
    };

    const bgImg = new Image();
    bgImg.src = '/src/assets/images/deep_ocean_seabed_1791181844647.jpg';
    bgImg.onload = onAssetLoad;
    bgImageRef.current = bgImg;

    const pufferImg = new Image();
    pufferImg.src = '/src/assets/images/realistic_puffer_fish_1791181863665.jpg';
    pufferImg.onload = onAssetLoad;
    pufferImageRef.current = pufferImg;

    const jellyImg = new Image();
    jellyImg.src = '/src/assets/images/realistic_jellyfish_1791181880318.jpg';
    jellyImg.onload = onAssetLoad;
    jellyfishImageRef.current = jellyImg;

    const clownImg = new Image();
    clownImg.src = '/src/assets/images/realistic_clownfish_1791181895626.jpg';
    clownImg.onload = onAssetLoad;
    clownfishImageRef.current = clownImg;

    const turtleImg = new Image();
    turtleImg.src = '/src/assets/images/realistic_sea_turtle_1791181907782.jpg';
    turtleImg.onload = onAssetLoad;
    turtleImageRef.current = turtleImg;

    // Spawn 6 realistic ambient swimming marine creatures (school of clownfish + turtle)
    const creatures: RealBackgroundCreature[] = [
      { type: 'turtle', x: -60, y: 160, vx: 0.35, vy: 0.05, size: 48, depthAlpha: 0.65, wobble: 0 },
      { type: 'clownfish', x: 120, y: 280, vx: 0.8, vy: 0.1, size: 24, depthAlpha: 0.8, wobble: 1 },
      { type: 'clownfish', x: 160, y: 295, vx: 0.85, vy: -0.08, size: 20, depthAlpha: 0.75, wobble: 2 },
      { type: 'clownfish', x: 200, y: 275, vx: 0.75, vy: 0.05, size: 22, depthAlpha: 0.7, wobble: 3 },
      { type: 'clownfish', x: 380, y: 120, vx: -0.65, vy: 0.12, size: 22, depthAlpha: 0.65, wobble: 4 },
      { type: 'clownfish', x: 420, y: 135, vx: -0.7, vy: -0.05, size: 26, depthAlpha: 0.68, wobble: 5 },
    ];
    realCreaturesRef.current = creatures;
  }, []);

  // Reset Level Entities
  const resetToSpawn = () => {
    ballPosRef.current = { x: level.spawn.x, y: level.spawn.y };
    ballVelRef.current = { x: 0, y: 0 };
    respawnCooldownRef.current = 0.5;
  };

  const initLevel = () => {
    ballPosRef.current = { x: level.spawn.x, y: level.spawn.y };
    ballVelRef.current = { x: 0, y: 0 };
    hasKeyRef.current = false;

    wallsRef.current = level.walls.map(w => ({ ...w }));
    fishesRef.current = level.fishes.map(f => ({ ...f, puffTimer: Math.random() * 3 }));
    pearlsRef.current = level.pearls.map(p => ({ ...p, collected: false }));
    gatesRef.current = level.gates.map(g => ({ ...g, isOpen: false }));
    keysRef.current = level.keys.map(k => ({ ...k, collected: false }));
    currentsRef.current = level.currents.map(c => ({ ...c }));
    bubblesRef.current = [];
  };

  useEffect(() => {
    initLevel();
  }, [level]);

  useEffect(() => {
    onRestartTrigger.current = () => {
      initLevel();
    };
  }, [level, onRestartTrigger]);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressedRef.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Pointer / Touch Handlers for Direct Swimming
  const getVirtualCoords = (clientX: number, clientY: number): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = VIRTUAL_WIDTH / rect.width;
    const scaleY = VIRTUAL_HEIGHT / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    isPointerDownRef.current = true;
    touchAimRef.current = getVirtualCoords(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    touchAimRef.current = getVirtualCoords(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (canvas && canvas.hasPointerCapture(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId);
    }
    isPointerDownRef.current = false;
    touchAimRef.current = null;
  };

  // Main Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();

    const gameLoop = (time: number) => {
      const dt = Math.min(1.5, (time - lastTime) / (1000 / 60));
      lastTime = time;

      if (!isPaused) {
        updatePhysics(dt);
      }

      renderScene(ctx, time);
      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, level, assetsLoaded]);

  // Physics Step
  const updatePhysics = (dt: number) => {
    if (respawnCooldownRef.current > 0) {
      respawnCooldownRef.current -= dt * (1 / 60);
    }

    const ball = ballPosRef.current;
    const vel = ballVelRef.current;

    // 1. Swimming Thrust Input
    let thrustX = 0;
    let thrustY = 0;
    const thrustPower = 0.45;

    const keys = keysPressedRef.current;
    if (keys['arrowup'] || keys['w']) thrustY -= thrustPower;
    if (keys['arrowdown'] || keys['s']) thrustY += thrustPower;
    if (keys['arrowleft'] || keys['a']) thrustX -= thrustPower;
    if (keys['arrowright'] || keys['d']) thrustX += thrustPower;

    // Pointer / Touch thrust
    if (isPointerDownRef.current && touchAimRef.current) {
      const dx = touchAimRef.current.x - ball.x;
      const dy = touchAimRef.current.y - ball.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 15) {
        thrustX += (dx / dist) * thrustPower;
        thrustY += (dy / dist) * thrustPower;
      }
    }

    vel.x += thrustX * dt;
    vel.y += thrustY * dt;

    if (Math.hypot(thrustX, thrustY) > 0.1 && Math.random() < 0.24) {
      soundManager.playSwim();
      bubblesRef.current.push({
        x: ball.x + (Math.random() - 0.5) * 6,
        y: ball.y + (Math.random() - 0.5) * 6,
        vx: -vel.x * 0.2 + (Math.random() - 0.5) * 0.4,
        vy: -vel.y * 0.2 - 0.5,
        radius: 2 + Math.random() * 3,
        alpha: 0.85,
        life: 0,
        maxLife: 32,
      });
    }

    // 2. Fluid Drag & Natural Buoyancy
    const waterDrag = 0.94;
    vel.x *= Math.pow(waterDrag, dt);
    vel.y *= Math.pow(waterDrag, dt);
    vel.y -= 0.02 * dt;

    // 3. Water Current forces
    for (const cur of currentsRef.current) {
      if (ball.x >= cur.x && ball.x <= cur.x + cur.width && ball.y >= cur.y && ball.y <= cur.y + cur.height) {
        vel.x += cur.forceX * dt;
        vel.y += cur.forceY * dt;
      }
    }

    ball.x += vel.x * dt;
    ball.y += vel.y * dt;

    // 4. Collision with Cavern Walls
    for (const wall of wallsRef.current) {
      resolveCircleRectCollision(ball, vel, wall.x, wall.y, wall.width, wall.height);
    }

    // 5. Collision with Sunken Gates
    for (const gate of gatesRef.current) {
      if (!gate.isOpen) {
        resolveCircleRectCollision(ball, vel, gate.x, gate.y, gate.width, gate.height);
      }
    }

    // 6. Keys Collection
    for (const key of keysRef.current) {
      if (!key.collected) {
        const dist = Math.hypot(ball.x - key.x, ball.y - key.y);
        if (dist < BALL_RADIUS + 12) {
          key.collected = true;
          hasKeyRef.current = true;
          soundManager.playKey();

          gatesRef.current.forEach(g => {
            if (g.color === key.color) {
              g.isOpen = true;
              soundManager.playGateOpen();
            }
          });
        }
      }
    }

    // 7. Pearls Collection
    pearlsRef.current.forEach((pearl, idx) => {
      if (!pearl.collected) {
        const dist = Math.hypot(ball.x - pearl.x, ball.y - pearl.y);
        if (dist < BALL_RADIUS + pearl.radius) {
          pearl.collected = true;
          soundManager.playPearl(idx);

          const totalCollected = pearlsRef.current.filter(p => p.collected).length;
          onPearlCollected(totalCollected);

          for (let i = 0; i < 14; i++) {
            bubblesRef.current.push({
              x: pearl.x,
              y: pearl.y,
              vx: (Math.random() - 0.5) * 2.8,
              vy: -0.6 - Math.random() * 2,
              radius: 2 + Math.random() * 2.5,
              alpha: 1,
              life: 0,
              maxLife: 26,
            });
          }
        }
      }
    });

    // 8. Fishes AI Patrol & Hazard Collision
    for (const fish of fishesRef.current) {
      fish.patrolProgress += (fish.speed / 100) * fish.direction * dt;
      if (fish.patrolProgress >= 1) {
        fish.patrolProgress = 1;
        fish.direction = -1;
      } else if (fish.patrolProgress <= 0) {
        fish.patrolProgress = 0;
        fish.direction = 1;
      }

      fish.x = fish.startX + (fish.targetX - fish.startX) * fish.patrolProgress;
      fish.y = fish.startY + (fish.targetY - fish.startY) * fish.patrolProgress;

      fish.tailAngle = Math.sin(performance.now() * 0.012) * 0.45;

      if (fish.type === 'puffer') {
        fish.puffTimer = (fish.puffTimer || 0) + dt * (1 / 60);
        fish.isPuffed = Math.sin((fish.puffTimer || 0) * 1.8) > 0.15;
      }

      if (respawnCooldownRef.current <= 0) {
        const effectiveRadius = fish.radius * (fish.isPuffed ? 1.4 : 1.0);
        const dist = Math.hypot(ball.x - fish.x, ball.y - fish.y);
        if (dist < BALL_RADIUS + effectiveRadius) {
          soundManager.playSting();
          setLives(prev => Math.max(0, prev - 1));

          for (let i = 0; i < 20; i++) {
            bubblesRef.current.push({
              x: ball.x,
              y: ball.y,
              vx: (Math.random() - 0.5) * 4,
              vy: (Math.random() - 0.5) * 4,
              radius: 3 + Math.random() * 3,
              alpha: 1,
              life: 0,
              maxLife: 26,
            });
          }

          resetToSpawn();
          break;
        }
      }
    }

    // 9. Update Ambient Real Ocean Creatures
    for (const cr of realCreaturesRef.current) {
      cr.x += cr.vx * dt;
      cr.y += cr.vy * dt;
      if (cr.vx > 0 && cr.x > VIRTUAL_WIDTH + 60) {
        cr.x = -60;
        cr.y = 80 + Math.random() * (VIRTUAL_HEIGHT - 160);
      } else if (cr.vx < 0 && cr.x < -60) {
        cr.x = VIRTUAL_WIDTH + 60;
        cr.y = 80 + Math.random() * (VIRTUAL_HEIGHT - 160);
      }
    }

    // 10. Exit Shrine Detection (Goal)
    const exitDist = Math.hypot(ball.x - level.exit.x, ball.y - level.exit.y);
    if (exitDist < BALL_RADIUS + 20) {
      soundManager.playWin();
      const totalPearls = pearlsRef.current.filter(p => p.collected).length;
      onLevelComplete(totalPearls);
    }

    // 11. Rising Water Bubbles
    if (Math.random() < 0.3) {
      bubblesRef.current.push({
        x: Math.random() * VIRTUAL_WIDTH,
        y: VIRTUAL_HEIGHT + 10,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.9 - Math.random() * 1.3,
        radius: 1.5 + Math.random() * 3,
        alpha: 0.6,
        life: 0,
        maxLife: 180,
      });
    }

    for (let i = bubblesRef.current.length - 1; i >= 0; i--) {
      const b = bubblesRef.current[i];
      b.x += b.vx;
      b.y += b.vy;
      b.life++;
      b.alpha = 1 - b.life / b.maxLife;
      if (b.life >= b.maxLife || b.y < -10) {
        bubblesRef.current.splice(i, 1);
      }
    }
  };

  // Continuous Circle vs Rect Collision
  const resolveCircleRectCollision = (
    ball: Point,
    vel: Point,
    rx: number,
    ry: number,
    rw: number,
    rh: number
  ) => {
    const closestX = Math.max(rx, Math.min(ball.x, rx + rw));
    const closestY = Math.max(ry, Math.min(ball.y, ry + rh));
    const distX = ball.x - closestX;
    const distY = ball.y - closestY;
    const dist = Math.hypot(distX, distY);

    if (dist < BALL_RADIUS && dist > 0.0001) {
      const nx = distX / dist;
      const ny = distY / dist;
      const penetration = BALL_RADIUS - dist;

      ball.x += nx * penetration;
      ball.y += ny * penetration;

      const dot = vel.x * nx + vel.y * ny;
      if (dot < 0) {
        vel.x -= 1.4 * dot * nx;
        vel.y -= 1.4 * dot * ny;
        if (Math.abs(dot) > 1.2) {
          soundManager.playBump();
        }
      }
    }
  };

  // Master Render Function
  const renderScene = (ctx: CanvasRenderingContext2D, time: number) => {
    // 1. Realistic Deep Ocean Seabed Photographic Backdrop
    if (bgImageRef.current && bgImageRef.current.complete) {
      ctx.drawImage(bgImageRef.current, 0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

      // Deep water tint overlay for crystal clear contrast & depth feel
      ctx.fillStyle = 'rgba(2, 28, 58, 0.4)';
      ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
    } else {
      // Atmospheric aquatic gradient fallback
      const oceanGrad = ctx.createLinearGradient(0, 0, 0, VIRTUAL_HEIGHT);
      oceanGrad.addColorStop(0, '#032042');
      oceanGrad.addColorStop(0.5, '#021834');
      oceanGrad.addColorStop(1, '#010c1c');
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
    }

    // 2. Sunlight Caustic Ripples Shimmering
    ctx.save();
    ctx.fillStyle = 'rgba(125, 211, 252, 0.07)';
    for (let i = 0; i < 7; i++) {
      const rayX = ((time * 0.02 + i * 110) % (VIRTUAL_WIDTH + 140)) - 70;
      ctx.beginPath();
      ctx.moveTo(rayX, 0);
      ctx.lineTo(rayX + 85, 0);
      ctx.lineTo(rayX + 160, VIRTUAL_HEIGHT);
      ctx.lineTo(rayX + 35, VIRTUAL_HEIGHT);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // 3. Real Swimming Ocean Creatures in Background (Sea Turtle & Clownfish Schools)
    for (const cr of realCreaturesRef.current) {
      ctx.save();
      ctx.globalAlpha = cr.depthAlpha;
      ctx.translate(cr.x, cr.y + Math.sin(time * 0.003 + cr.wobble) * 8);

      const isLeft = cr.vx < 0;
      if (isLeft) {
        ctx.scale(-1, 1);
      }

      if (cr.type === 'turtle' && turtleImageRef.current && turtleImageRef.current.complete) {
        // Draw real green sea turtle
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, cr.size * 0.5, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(turtleImageRef.current, -cr.size * 0.5, -cr.size * 0.5, cr.size, cr.size);
        ctx.restore();
      } else if (cr.type === 'clownfish' && clownfishImageRef.current && clownfishImageRef.current.complete) {
        // Draw real clownfish with swimming wave
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, cr.size * 0.45, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(clownfishImageRef.current, -cr.size * 0.5, -cr.size * 0.5, cr.size, cr.size);
        ctx.restore();
      }
      ctx.restore();
    }

    // 4. Water Current Streams
    for (const cur of currentsRef.current) {
      ctx.save();
      ctx.fillStyle = 'rgba(56, 189, 248, 0.14)';
      ctx.beginPath();
      ctx.roundRect(cur.x, cur.y, cur.width, cur.height, 8);
      ctx.fill();

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
      ctx.lineWidth = 1.5;
      const offset = (time * 0.0035) % 1;
      for (let i = 0; i < 3; i++) {
        const cx = cur.x + ((offset + i * 0.33) % 1) * cur.width;
        ctx.beginPath();
        ctx.moveTo(cx, cur.y + 10);
        ctx.lineTo(cx + (cur.direction === 'right' ? 22 : -22), cur.y + cur.height / 2);
        ctx.lineTo(cx, cur.y + cur.height - 10);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 5. Coral Reef Cavern Walls with Organic Textures & Swaying Sea Kelp
    for (const wall of wallsRef.current) {
      ctx.save();
      const wallGrad = ctx.createLinearGradient(wall.x, wall.y, wall.x + wall.width, wall.y + wall.height);
      if (wall.type === 'coral') {
        wallGrad.addColorStop(0, '#0f766e');
        wallGrad.addColorStop(0.5, '#064e3b');
        wallGrad.addColorStop(1, '#022c22');
      } else {
        wallGrad.addColorStop(0, '#1e293b');
        wallGrad.addColorStop(0.5, '#0f172a');
        wallGrad.addColorStop(1, '#090d16');
      }

      ctx.fillStyle = wallGrad;
      ctx.beginPath();
      ctx.roundRect(wall.x, wall.y, wall.width, wall.height, 8);
      ctx.fill();

      ctx.strokeStyle = wall.type === 'coral' ? 'rgba(45, 212, 191, 0.7)' : 'rgba(56, 189, 248, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Swaying Seaweed / Sea grass fronds
      if (wall.width > 50) {
        ctx.fillStyle = '#10b981';
        for (let sx = wall.x + 16; sx < wall.x + wall.width - 16; sx += 30) {
          const sway = Math.sin(time * 0.003 + sx) * 7;
          ctx.beginPath();
          ctx.moveTo(sx, wall.y);
          ctx.quadraticCurveTo(sx + sway, wall.y - 14, sx + sway * 0.5, wall.y - 22);
          ctx.lineTo(sx + 3, wall.y);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    // 6. Sunken Coral Gates
    for (const gate of gatesRef.current) {
      if (gate.isOpen) continue;
      ctx.save();
      ctx.fillStyle = gate.color;
      ctx.shadowColor = gate.color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.roundRect(gate.x, gate.y, gate.width, gate.height, 6);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🔒', gate.x + gate.width / 2, gate.y + gate.height / 2);
      ctx.restore();
    }

    // 7. Keys (Glowing Starfish Keys)
    for (const key of keysRef.current) {
      if (key.collected) continue;
      ctx.save();
      ctx.shadowColor = key.color;
      ctx.shadowBlur = 14;
      ctx.fillStyle = key.color;
      const pulse = 1 + Math.sin(time * 0.006) * 0.12;

      ctx.translate(key.x, key.y);
      ctx.scale(pulse, pulse);
      ctx.font = '18px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🗝️', 0, 0);
      ctx.restore();
    }

    // 8. Luminous Ocean Pearls
    for (const pearl of pearlsRef.current) {
      if (pearl.collected) continue;
      ctx.save();
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 16;

      const pearlGrad = ctx.createRadialGradient(
        pearl.x - 3,
        pearl.y - 3,
        1,
        pearl.x,
        pearl.y,
        pearl.radius
      );
      pearlGrad.addColorStop(0, '#ffffff');
      pearlGrad.addColorStop(0.5, '#e0f2fe');
      pearlGrad.addColorStop(1, '#38bdf8');

      ctx.fillStyle = pearlGrad;
      ctx.beginPath();
      ctx.arc(pearl.x, pearl.y, pearl.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(pearl.x - 3, pearl.y - 3, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 9. Exit Pearl Shrine (Goal Portal)
    const exit = level.exit;
    ctx.save();
    ctx.shadowColor = '#34d399';
    ctx.shadowBlur = 24;

    const rot = time * 0.003;
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(exit.x, exit.y, 25, rot, rot + Math.PI * 1.5);
    ctx.stroke();

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(exit.x, exit.y, 17, -rot, -rot + Math.PI * 1.4);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(exit.x, exit.y, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#6ee7b7';
    ctx.font = 'bold 11px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('EXIT', exit.x, exit.y - 32);
    ctx.restore();

    // 10. Real Swimming Marine Predators (Realistic Pufferfish, Jellyfish, Barracuda)
    for (const fish of fishesRef.current) {
      ctx.save();
      ctx.translate(fish.x, fish.y);
      const isFacingLeft = fish.direction < 0;
      if (isFacingLeft) {
        ctx.scale(-1, 1);
      }

      if (fish.type === 'puffer') {
        const isPuffed = fish.isPuffed;
        const bodyRadius = fish.radius * (isPuffed ? 1.35 : 1.0);

        ctx.shadowColor = isPuffed ? '#ef4444' : '#f59e0b';
        ctx.shadowBlur = isPuffed ? 16 : 8;

        if (pufferImageRef.current && pufferImageRef.current.complete) {
          // Render real photorealistic pufferfish inside circular mask
          ctx.save();
          ctx.beginPath();
          ctx.arc(0, 0, bodyRadius, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(
            pufferImageRef.current,
            -bodyRadius * 1.05,
            -bodyRadius * 1.05,
            bodyRadius * 2.1,
            bodyRadius * 2.1
          );
          ctx.restore();
        } else {
          // Gradient fallback
          const fishGrad = ctx.createRadialGradient(-2, -2, 1, 0, 0, bodyRadius);
          fishGrad.addColorStop(0, '#ffffff');
          fishGrad.addColorStop(0.4, isPuffed ? '#f87171' : '#fde047');
          fishGrad.addColorStop(1, isPuffed ? '#dc2626' : '#d97706');
          ctx.fillStyle = fishGrad;
          ctx.beginPath();
          ctx.arc(0, 0, bodyRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Sharp defensive spikes when puffed
        if (isPuffed) {
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 2.5;
          for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
            ctx.beginPath();
            ctx.moveTo(Math.cos(a) * bodyRadius, Math.sin(a) * bodyRadius);
            ctx.lineTo(Math.cos(a) * (bodyRadius + 8), Math.sin(a) * (bodyRadius + 8));
            ctx.stroke();
          }
        }
      } else if (fish.type === 'jellyfish') {
        ctx.shadowColor = '#c084fc';
        ctx.shadowBlur = 16;

        if (jellyfishImageRef.current && jellyfishImageRef.current.complete) {
          // Render real photorealistic bioluminescent jellyfish
          ctx.save();
          ctx.beginPath();
          ctx.arc(0, 0, fish.radius * 1.1, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(
            jellyfishImageRef.current,
            -fish.radius * 1.1,
            -fish.radius * 1.1,
            fish.radius * 2.2,
            fish.radius * 2.2
          );
          ctx.restore();
        } else {
          const bellGrad = ctx.createLinearGradient(0, -fish.radius, 0, 0);
          bellGrad.addColorStop(0, '#ffffff');
          bellGrad.addColorStop(1, fish.color);
          ctx.fillStyle = bellGrad;
          ctx.beginPath();
          ctx.arc(0, 0, fish.radius, Math.PI, 0);
          ctx.closePath();
          ctx.fill();
        }

        // Stinging undulating tentacles
        ctx.strokeStyle = '#e879f9';
        ctx.lineWidth = 2;
        for (let tx = -fish.radius * 0.6; tx <= fish.radius * 0.6; tx += fish.radius * 0.4) {
          const wave = Math.sin(time * 0.008 + tx) * 5;
          ctx.beginPath();
          ctx.moveTo(tx, 0);
          ctx.quadraticCurveTo(tx + wave, fish.radius * 0.8, tx, fish.radius * 1.6);
          ctx.stroke();
        }
      } else {
        // Barracuda / Hunter
        ctx.shadowColor = '#00f5ff';
        ctx.shadowBlur = 12;

        const hunterGrad = ctx.createLinearGradient(-fish.radius, 0, fish.radius, 0);
        hunterGrad.addColorStop(0, '#0284c7');
        hunterGrad.addColorStop(0.6, '#38bdf8');
        hunterGrad.addColorStop(1, '#ffffff');

        ctx.fillStyle = hunterGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, fish.radius * 1.6, fish.radius * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(fish.radius * 1.2, -3);
        ctx.lineTo(fish.radius * 2.1, 0);
        ctx.lineTo(fish.radius * 1.2, 3);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(fish.radius * 0.9, -2, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(fish.radius * 0.95, -2, 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-fish.radius * 1.4, 0);
        ctx.lineTo(-fish.radius * 2.2, -fish.radius + fish.tailAngle * 6);
        ctx.lineTo(-fish.radius * 2.2, fish.radius + fish.tailAngle * 6);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    // 11. Rising Translucent Water Bubbles
    for (const b of bubblesRef.current) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.lineWidth = 1;
      ctx.globalAlpha = Math.max(0, Math.min(1, b.alpha));
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(b.x - b.radius * 0.35, b.y - b.radius * 0.35, b.radius * 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 12. The Nokia Underwater Ball (Aquatic Bubble Sphere)
    const ball = ballPosRef.current;
    ctx.save();
    ctx.shadowColor = '#00f5ff';
    ctx.shadowBlur = 22;

    const sphereGrad = ctx.createRadialGradient(
      ball.x - 4,
      ball.y - 4,
      1,
      ball.x,
      ball.y,
      BALL_RADIUS
    );
    sphereGrad.addColorStop(0, '#ffffff');
    sphereGrad.addColorStop(0.35, 'rgba(56, 189, 248, 0.95)');
    sphereGrad.addColorStop(0.75, 'rgba(6, 182, 212, 0.8)');
    sphereGrad.addColorStop(1, 'rgba(2, 132, 199, 0.95)');

    ctx.fillStyle = sphereGrad;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.beginPath();
    ctx.arc(ball.x - 4, ball.y - 4, 3.5, 0, Math.PI * 2);
    ctx.fill();

    if (respawnCooldownRef.current > 0) {
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BALL_RADIUS + 4, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  };

  return (
    <div className="relative w-full aspect-[7/5.5] max-h-[72vh] rounded-3xl overflow-hidden shadow-2xl border border-cyan-500/40 bg-slate-950 flex items-center justify-center touch-none select-none">
      <canvas
        ref={canvasRef}
        width={VIRTUAL_WIDTH}
        height={VIRTUAL_HEIGHT}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full h-full object-contain cursor-pointer"
      />
    </div>
  );
};
