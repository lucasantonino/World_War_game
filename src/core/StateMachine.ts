/**
 * Máquina de estados genérica com guardas de transição e callbacks de entrada.
 */
export class StateMachine<S extends string> {
  private _current: S;
  private readonly enterCallbacks = new Map<S, Set<() => void>>();

  constructor(initialState: S) {
    this._current = initialState;
  }

  public get current(): S {
    return this._current;
  }

  public transition(next: S, guard?: () => boolean): boolean {
    if (next === this._current) {
      return false;
    }
    if (guard && !guard()) {
      return false;
    }

    this._current = next;
    const callbacks = this.enterCallbacks.get(next);
    if (callbacks) {
      for (const cb of Array.from(callbacks)) {
        cb();
      }
    }
    return true;
  }

  public onEnter(state: S, cb: () => void): void {
    let set = this.enterCallbacks.get(state);
    if (!set) {
      set = new Set();
      this.enterCallbacks.set(state, set);
    }
    set.add(cb);
  }
}
