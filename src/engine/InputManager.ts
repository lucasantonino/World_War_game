import { TouchControlMode } from '../types';

const TOUCH_LOOK_GAIN = 3.25;

export class InputManager {
  private canvas: HTMLCanvasElement;
  private keysDown = new Set<string>();
  private keysPressed = new Set<string>();
  private mouseLeftDown = false;
  private mouseLeftClicked = false;
  private mouseRightDown = false;
  private deltaX = 0;
  private deltaY = 0;
  private pointerLocked = false;
  private activeGameplay = false;
  private onPauseCallback: (() => void) | null = null;

  private touchDetected = false;
  private touchMode: TouchControlMode = 'auto';
  private touchMoveX = 0;
  private touchMoveY = 0;
  private touchSprinting = false;
  private touchLookDx = 0;
  private touchLookDy = 0;
  private touchFiring = false;
  private touchFiringClicked = false;
  private touchAds = false;
  private touchMantleTimer = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.touchDetected =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0));
    this.bindListeners();
  }

  public setOnPauseRequested(cb: () => void): void {
    this.onPauseCallback = cb;
  }

  public setGameplayActive(active: boolean): void {
    this.activeGameplay = active;
    if (!active) {
      this.clearAll();
      if (document.pointerLockElement === this.canvas) {
        document.exitPointerLock();
      }
    }
  }

  public requestLock(): void {
    if (this.isTouchActive()) return;
    if (document.pointerLockElement !== this.canvas) {
      try {
        const res = this.canvas.requestPointerLock() as unknown as Promise<void> | undefined;
        if (res && typeof res.catch === 'function') {
          res.catch(() => {
            // Pointer lock may fail if not triggered by direct gesture or in headless tests
          });
        }
      } catch {
        // Ignore gracefully
      }
    }
  }

  public setTouchModeOverride(mode: TouchControlMode): void {
    this.touchMode = mode;
  }

  public isTouchActive(): boolean {
    if (this.touchMode === 'on') return true;
    if (this.touchMode === 'off') return false;
    return this.touchDetected;
  }

  public setTouchMove(x: number, y: number, sprinting = false): void {
    this.touchMoveX = Math.max(-1, Math.min(1, x));
    this.touchMoveY = Math.max(-1, Math.min(1, y));
    this.touchSprinting = sprinting;
  }

  public addTouchLookDelta(dx: number, dy: number): void {
    const speed = Math.hypot(dx, dy);
    const accel = 1.0 + Math.min(1.15, speed * 0.028);
    const clampedX = Math.max(-90, Math.min(90, dx));
    const clampedY = Math.max(-90, Math.min(90, dy));
    this.touchLookDx += clampedX * TOUCH_LOOK_GAIN * accel;
    this.touchLookDy += clampedY * TOUCH_LOOK_GAIN * accel;
  }

  public triggerTouchMantle(duration = 0.85): void {
    this.touchMantleTimer = Math.max(this.touchMantleTimer, duration);
  }

  public consumeTouchMantle(dt: number): boolean {
    if (this.touchMantleTimer > 0) {
      this.touchMantleTimer = Math.max(0, this.touchMantleTimer - dt);
      return true;
    }
    return false;
  }

  public setTouchFiring(firing: boolean): void {
    if (firing && !this.touchFiring) {
      this.touchFiringClicked = true;
    }
    this.touchFiring = firing;
  }

  public toggleTouchAds(): void {
    this.touchAds = !this.touchAds;
  }

  public setTouchAds(active: boolean): void {
    this.touchAds = active;
  }

  public triggerVirtualKeyPress(code: string): void {
    this.keysPressed.add(code);
  }

  public setVirtualKeyHold(code: string, held: boolean): void {
    if (held) {
      this.keysDown.add(code);
    } else {
      this.keysDown.delete(code);
    }
  }

  public getMovementInput(): { forward: number; strafe: number; sprinting: boolean } {
    const kbForward = (this.keysDown.has('KeyW') ? 1 : 0) - (this.keysDown.has('KeyS') ? 1 : 0);
    const kbStrafe = (this.keysDown.has('KeyD') ? 1 : 0) - (this.keysDown.has('KeyA') ? 1 : 0);
    const forward = Math.max(-1, Math.min(1, kbForward + this.touchMoveY));
    const strafe = Math.max(-1, Math.min(1, kbStrafe + this.touchMoveX));
    const sprinting = this.keysDown.has('ShiftLeft') || this.touchSprinting;
    return { forward, strafe, sprinting };
  }

  public isPointerLocked(): boolean {
    return this.pointerLocked;
  }

  public isKeyDown(code: string): boolean {
    return this.keysDown.has(code);
  }

  public consumeKeyPress(code: string): boolean {
    if (this.keysPressed.has(code)) {
      this.keysPressed.delete(code);
      return true;
    }
    return false;
  }

  public isLeftMouseDown(): boolean {
    return this.mouseLeftDown || this.touchFiring;
  }

  public consumeLeftMouseClick(): boolean {
    if (this.mouseLeftClicked || this.touchFiringClicked) {
      this.mouseLeftClicked = false;
      this.touchFiringClicked = false;
      return true;
    }
    return false;
  }

  public isRightMouseDown(): boolean {
    return this.mouseRightDown || this.touchAds;
  }

  public consumeMouseDelta(): { dx: number; dy: number } {
    const dx = this.deltaX + this.touchLookDx;
    const dy = this.deltaY + this.touchLookDy;
    this.deltaX = 0;
    this.deltaY = 0;
    this.touchLookDx = 0;
    this.touchLookDy = 0;
    return { dx, dy };
  }

  public clearAll(): void {
    this.keysDown.clear();
    this.keysPressed.clear();
    this.mouseLeftDown = false;
    this.mouseLeftClicked = false;
    this.mouseRightDown = false;
    this.deltaX = 0;
    this.deltaY = 0;
    this.touchMoveX = 0;
    this.touchMoveY = 0;
    this.touchSprinting = false;
    this.touchLookDx = 0;
    this.touchLookDy = 0;
    this.touchFiring = false;
    this.touchFiringClicked = false;
    this.touchAds = false;
    this.touchMantleTimer = 0;
  }

  private bindListeners(): void {
    window.addEventListener(
      'touchstart',
      () => {
        this.touchDetected = true;
      },
      { passive: true }
    );

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'Tab') {
        if (this.activeGameplay) {
          e.preventDefault();
        }
      }
      if (e.code === 'Escape' && this.activeGameplay) {
        e.preventDefault();
        this.clearAll();
        this.onPauseCallback?.();
        return;
      }
      if (!this.keysDown.has(e.code)) {
        this.keysPressed.add(e.code);
      }
      this.keysDown.add(e.code);
    });

    window.addEventListener('keyup', (e) => {
      this.keysDown.delete(e.code);
    });

    window.addEventListener('blur', () => {
      this.clearAll();
    });

    this.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    this.canvas.addEventListener('mousedown', (e) => {
      if (!this.activeGameplay || this.isTouchActive()) return;
      if (!this.pointerLocked) {
        this.requestLock();
      }
      if (e.button === 0) {
        this.mouseLeftDown = true;
        this.mouseLeftClicked = true;
      } else if (e.button === 2) {
        this.mouseRightDown = true;
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (this.isTouchActive()) return;
      if (e.button === 0) {
        this.mouseLeftDown = false;
      } else if (e.button === 2) {
        this.mouseRightDown = false;
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.activeGameplay || this.isTouchActive()) return;
      if (this.pointerLocked || this.mouseLeftDown) {
        const clampedX = Math.max(-120, Math.min(120, e.movementX || 0));
        const clampedY = Math.max(-120, Math.min(120, e.movementY || 0));
        this.deltaX += clampedX;
        this.deltaY += clampedY;
      }
    });

    document.addEventListener('pointerlockchange', () => {
      const wasLocked = this.pointerLocked;
      this.pointerLocked = document.pointerLockElement === this.canvas;
      if (wasLocked && !this.pointerLocked && this.activeGameplay) {
        this.clearAll();
        this.onPauseCallback?.();
      }
    });
  }
}
