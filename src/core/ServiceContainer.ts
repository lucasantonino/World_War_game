/**
 * Container leve de serviços para injeção desacoplada entre camadas.
 */
export class ServiceContainer {
  private readonly services = new Map<string, unknown>();

  public register<T>(key: string, instance: T): void {
    this.services.set(key, instance);
  }

  public get<T>(key: string): T {
    if (!this.services.has(key)) {
      throw new Error(`Serviço não registrado no container: "${key}".`);
    }
    return this.services.get(key) as T;
  }

  public has(key: string): boolean {
    return this.services.has(key);
  }

  public clear(): void {
    this.services.clear();
  }
}
