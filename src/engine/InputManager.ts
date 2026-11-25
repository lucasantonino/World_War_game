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

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
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
    return this.mouseLeftDown;
  }

  public consumeLeftMouseClick(): boolean {
    if (this.mouseLeftClicked) {
      this.mouseLeftClicked = false;
      return true;
    }
    return false;
  }

  public isRightMouseDown(): boolean {
    return this.mouseRightDown;
  }

  public consumeMouseDelta(): { dx: number; dy: number } {
    const dx = this.deltaX;
    const dy = this.deltaY;
    this.deltaX = 0;
    this.deltaY = 0;
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
  }

  private bindListeners(): void {
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
      if (!this.activeGameplay) return;
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
      if (e.button === 0) {
        this.mouseLeftDown = false;
      } else if (e.button === 2) {
        this.mouseRightDown = false;
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.activeGameplay) return;
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
