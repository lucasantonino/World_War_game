import type { CampaignState } from '../core/types.ts';

export interface GameSettings {
  masterVolume: number;
  sfxVolume: number;
  radioVolume: number;
  mouseSensitivity: number;
  quality: 'low' | 'medium' | 'high';
  touchControls: 'auto' | 'on' | 'off';
  difficulty: 'recruit' | 'veteran' | 'infernal';
}

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  masterVolume: 0.8,
  sfxVolume: 0.85,
  radioVolume: 0.9,
  mouseSensitivity: 1.0,
  quality: 'medium',
  touchControls: 'auto',
  difficulty: 'veteran',
};

const SETTINGS_STORAGE_KEY = 'tdn_settings_v1';
const CAMPAIGN_STORAGE_KEY = 'tdn_campaign_v1';
const IDB_NAME = 'terra_de_ninguem_db';
const IDB_STORE = 'campaign_store';
const IDB_RECORD_KEY = 'active_campaign';

function cloneCampaign(state: CampaignState): CampaignState {
  return JSON.parse(JSON.stringify(state)) as CampaignState;
}

function getSafeLocalStorage(): Storage | null {
  try {
    if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis && globalThis.localStorage) {
      return globalThis.localStorage;
    }
  } catch {
    // Acesso bloqueado em alguns ambientes privados/SSR.
  }
  return null;
}

function getSafeIndexedDb(): IDBFactory | null {
  try {
    if (typeof globalThis !== 'undefined' && 'indexedDB' in globalThis && globalThis.indexedDB) {
      return globalThis.indexedDB;
    }
  } catch {
    // IndexedDB indisponível em Node/SSR.
  }
  return null;
}

/**
 * Gerencia persistência híbrida de configurações (localStorage) e campanha (IndexedDB),
 * com fallback transparente para memória em ambientes Node/Vitest ou SSR.
 */
export class SaveManager {
  private readonly memoryStore = new Map<string, string>();
  private memoryCampaign: CampaignState | null = null;

  public saveSettings(settings: GameSettings): void {
    const serialized = JSON.stringify(settings);
    this.memoryStore.set(SETTINGS_STORAGE_KEY, serialized);

    const storage = getSafeLocalStorage();
    if (storage) {
      try {
        storage.setItem(SETTINGS_STORAGE_KEY, serialized);
      } catch {
        // Ignora falha de cota mantendo cópia em memória.
      }
    }
  }

  public loadSettings(): GameSettings {
    const storage = getSafeLocalStorage();
    let raw: string | null = null;

    if (storage) {
      try {
        raw = storage.getItem(SETTINGS_STORAGE_KEY);
      } catch {
        raw = null;
      }
    }
    if (!raw) {
      raw = this.memoryStore.get(SETTINGS_STORAGE_KEY) ?? null;
    }
    if (!raw) {
      return { ...DEFAULT_GAME_SETTINGS };
    }

    try {
      const parsed = JSON.parse(raw) as Partial<GameSettings>;
      return { ...DEFAULT_GAME_SETTINGS, ...parsed };
    } catch {
      return { ...DEFAULT_GAME_SETTINGS };
    }
  }

  public saveCampaignSync(state: CampaignState): void {
    const copy = cloneCampaign(state);
    this.memoryCampaign = copy;
    const serialized = JSON.stringify(copy);
    this.memoryStore.set(CAMPAIGN_STORAGE_KEY, serialized);

    const storage = getSafeLocalStorage();
    if (storage) {
      try {
        storage.setItem(CAMPAIGN_STORAGE_KEY, serialized);
      } catch {
        // Fallback em memória já atualizado.
      }
    }
  }

  public loadCampaignSync(): CampaignState | null {
    const storage = getSafeLocalStorage();
    let raw: string | null = null;

    if (storage) {
      try {
        raw = storage.getItem(CAMPAIGN_STORAGE_KEY);
      } catch {
        raw = null;
      }
    }
    if (!raw) {
      raw = this.memoryStore.get(CAMPAIGN_STORAGE_KEY) ?? null;
    }

    if (raw) {
      try {
        return JSON.parse(raw) as CampaignState;
      } catch {
        return this.memoryCampaign ? cloneCampaign(this.memoryCampaign) : null;
      }
    }

    return this.memoryCampaign ? cloneCampaign(this.memoryCampaign) : null;
  }

  public async saveCampaign(state: CampaignState): Promise<void> {
    this.saveCampaignSync(state);

    const idb = getSafeIndexedDb();
    if (!idb) return;

    const copy = cloneCampaign(state);
    try {
      const db = await this.openDb(idb);
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        const store = tx.objectStore(IDB_STORE);
        const req = store.put(copy, IDB_RECORD_KEY);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
      db.close();
    } catch {
      // Fallback síncrono já persistido com segurança.
    }
  }

  public async loadCampaign(): Promise<CampaignState | null> {
    const idb = getSafeIndexedDb();
    if (idb) {
      try {
        const db = await this.openDb(idb);
        const result = await new Promise<CampaignState | null>((resolve, reject) => {
          const tx = db.transaction(IDB_STORE, 'readonly');
          const store = tx.objectStore(IDB_STORE);
          const req = store.get(IDB_RECORD_KEY);
          req.onsuccess = () =>
            resolve((req.result as CampaignState | undefined) ?? null);
          req.onerror = () => reject(req.error);
        });
        db.close();
        if (result) {
          this.memoryCampaign = cloneCampaign(result);
          return cloneCampaign(result);
        }
      } catch {
        // Recorre ao fallback síncrono.
      }
    }

    return this.loadCampaignSync();
  }

  private openDb(idb: IDBFactory): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = idb.open(IDB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}
