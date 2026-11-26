import type { GameEvent } from './types.ts';

type EventListener<T extends GameEvent['type']> = (
  event: Extract<GameEvent, { type: T }>
) => void;

/**
 * Barramento pub/sub tipado e desacoplado para eventos de domínio do jogo.
 * Mantém um histórico limitado de eventos recentes para diagnóstico e auditoria.
 */
export class EventBus {
  private readonly listeners = new Map<
    GameEvent['type'],
    Set<(event: GameEvent) => void>
  >();
  private readonly recentEvents: GameEvent[] = [];
  private readonly maxHistory: number;

  constructor(maxHistory = 256) {
    this.maxHistory = Math.max(1, maxHistory);
  }

  public on<T extends GameEvent['type']>(
    type: T,
    listener: (event: Extract<GameEvent, { type: T }>) => void
  ): () => void {
    let set = this.listeners.get(type);
    if (!set) {
      set = new Set();
      this.listeners.set(type, set);
    }
    const wrapped = listener as unknown as (event: GameEvent) => void;
    set.add(wrapped);
    return () => {
      this.off(type, listener);
    };
  }

  public once<T extends GameEvent['type']>(
    type: T,
    listener: (event: Extract<GameEvent, { type: T }>) => void
  ): () => void {
    const onceWrapper: EventListener<T> = (event) => {
      this.off(type, onceWrapper);
      listener(event);
    };
    return this.on(type, onceWrapper);
  }

  public off<T extends GameEvent['type']>(
    type: T,
    listener: (event: Extract<GameEvent, { type: T }>) => void
  ): void {
    const set = this.listeners.get(type);
    if (!set) return;
    set.delete(listener as unknown as (event: GameEvent) => void);
    if (set.size === 0) {
      this.listeners.delete(type);
    }
  }

  public emit<T extends GameEvent['type']>(
    type: T,
    payload: Extract<GameEvent, { type: T }>['payload']
  ): void {
    const event = { type, payload } as Extract<GameEvent, { type: T }>;

    this.recentEvents.push(event);
    if (this.recentEvents.length > this.maxHistory) {
      this.recentEvents.shift();
    }

    const set = this.listeners.get(type);
    if (!set || set.size === 0) return;

    // Copia os ouvintes para permitir off/once seguro durante a emissão.
    const snapshot = Array.from(set);
    for (const listener of snapshot) {
      listener(event);
    }
  }

  public getRecentEvents(limit = 32): readonly GameEvent[] {
    if (limit <= 0) return [];
    if (limit >= this.recentEvents.length) {
      return this.recentEvents.slice();
    }
    return this.recentEvents.slice(this.recentEvents.length - limit);
  }

  public clear(): void {
    this.listeners.clear();
    this.recentEvents.length = 0;
  }
}
