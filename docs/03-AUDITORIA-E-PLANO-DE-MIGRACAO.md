# 03 — Auditoria do Código Existente e Plano de Migração

> Confronto técnico entre a especificação definitiva (Seção 18 do documento de visão) e os **20 arquivos reais atualmente em `src/`** (total verificado: **`17.794` linhas**).

---

## 1. Diagnóstico Estrutural do Repositório Atual

O jogo atual já entrega integralmente o ciclo de 5 fases construído anteriormente (balanceamento por dificuldade/checkpoints, enxame em `InstancedMesh` até 650 instâncias, destruição progressiva e colapso de trincheiras/abrigos, modelos procedurais com desmembramento, fumaça bloqueando LoS, mapa `170×190m` com construções entráveis, IA cover-to-cover, carros de reforço, tanque aliado pilotável, 6 operações + Sobrevivência e experiência mobile touch completa).

Entretanto, do ponto de vista de arquitetura para o redesign com pelotão comandável e `BattlefieldDirector`, existem **4 gargalos principais**:
1. **`GameEngine.ts` monolítico (`1.892` linhas):** acopla loop `requestAnimationFrame`, criação de `WebGLRenderer`/`EffectComposer`, máquina de estados de fases de missão, spawn de reforços/carros/aéreos, lógica de morteiros anti-camping, persistência de `localStorage` e disparo de callbacks da UI.
2. **Simulação acoplada ao Three.js:** `SoldierSystem.ts` (`1.738` linhas) mistura matrizes de `InstancedMesh`, grade espacial e toda a lógica tática/fogo/percepção global no mesmo módulo.
3. **`EnvironmentBuilder.ts` (`2.320` linhas):** reúne geração visual de malhas, registro de colisores, construção de casas entráveis, nós táticos e atualização de clima dinâmico.
4. **Ausência de `DamageSystem`, `EventBus` e `SquadCommandSystem`:** o dano está distribuído entre `PlayerController`, `ProjectileSystem`, `SoldierSystem`, `TankSystem` e `CoverSystem`, e aliados ainda atuam de forma independente sem pelotão estruturado nem comandos do jogador.

---

## 2. Inventário Completo dos 20 Arquivos Atuais e Decisão de Migração

| Arquivo Atual | Linhas | Papel Atual | Decisão (Seção 18) | Destino na Nova Arquitetura |
|---|---|---|---|---|
| `src/main.ts` | 11 | Ponto de entrada e boot no `<canvas>` | **Preservar / Adaptar** | `src/main.ts` inicializando `GameApplication` |
| `src/types.ts` | 433 | Contratos globais únicos do projeto atual | **Dividir por domínio** | `src/core/`, `src/simulation/`, `src/gameplay/`, `src/missions/` |
| `src/engine/GameEngine.ts` | 1.892 | Monólito de render, loop, fases, clima, drops e saves | **Substituir por camada de composição** | Dividir em `GameApplication`, `GameLoop`, `MissionDirector`, `RendererManager`, `SaveManager` |
| `src/engine/InputManager.ts` | 283 | Teclado, PointerLock, touch look/accel/mantle | **Preservar e expandir** | `src/core/` / `gameplay/player/` mantendo ganho e bloqueios mobile |
| `src/engine/AudioEngine.ts` | 826 | Síntese WebAudio procedural de armas, vento e zumbido | **Reestruturar e ampliar** | `src/presentation/audio/` (camadas + suporte a áudio gravado + limites de vozes) |
| `src/engine/DifficultyConfig.ts` | 76 | Modificadores de Recruta/Veterano/Infernal | **Reaproveitar em `data/`** | `src/data/` / `GameConfig.ts` |
| `src/engine/Textures.ts` | 240 | Texturas procedurais via Canvas 2D | **Reaproveitar** | `src/presentation/` / `AssetManager` |
| `src/entities/PlayerController.ts` | 1.314 | Movimento, armas (8 tipos), mira, baioneta, binóculo, tanque | **Reaproveitar e refatorar** | Dividir em `gameplay/player/*` + `WeaponSystem` + `DamageSystem` |
| `src/entities/WeaponViewModel.ts` | 460 | Viewmodels 3D procedurais, recuo, baioneta e flash | **Reaproveitar e melhorar** | `src/presentation/` sincronizado por estado de arma |
| `src/entities/ProjectileSystem.ts` | 555 | Balas, traçantes, foguetes, granadas frag/fumaça, bombas | **Refatorar** | `src/gameplay/combat/ProjectileSystem` + `BallisticsSystem` + `DamageSystem` |
| `src/entities/SoldierSystem.ts` | 1.738 | 6 `InstancedMesh` + LOD 2 níveis + IA cover-to-cover + gore | **Reaproveitar renderização, reconstruir IA** | Separar IA (`ai/`, `gameplay/soldiers/`, `gameplay/squads/`) da camada `presentation/` |
| `src/entities/TankSystem.ts` | 1.500 | Tanques inimigos, `TroopCar` destrutível e tanque aliado pilotável | **Refatorar profundamente** | `src/gameplay/vehicles/*` com dano por subsistemas e estados formais |
| `src/entities/BomberSystem.ts` | 520 | Formação de bombardeiros e caças em voo rasante | **Reaproveitar e integrar aos eventos** | `src/presentation/` + `BattlefieldEventSystem` |
| `src/entities/VFXSystem.ts` | 902 | Pool de 320 partículas, 4 `PointLight`, sangue, fogo, fumaça | **Reestruturar** | `src/presentation/effects/` (`VFXSystem`, `ParticleManager`, `DecalSystem`) |
| `src/world/Terrain.ts` | 421 | Malha `170×190m` com trincheiras, crateras e colapso | **Reaproveitar geometria, reconstruir integrações** | `src/world/TerrainSystem.ts` + consultas de altura para `WorldNavigation` |
| `src/world/CoverSystem.ts` | 1.035 | AABB/OBB, raycast, fumaça bloqueando LoS e `TacticalCoverNode` | **Reaproveitar e expandir** | `src/world/CoverSystem`, `CollisionSystem`, `DestructionSystem` e `ai/CoverEvaluator` |
| `src/world/EnvironmentBuilder.ts` | 2.320 | Trincheiras com pranchas, casas entráveis, clima e clarões | **Aproveitar componentes, modularizar** | `WorldBuilder`, `EnvironmentSystem`, `WeatherSystem` |
| `src/world/MissionData.ts` | 1.699 | Definições de OP-01..OP-06 e Sobrevivência | **Redesenhar modelo de dados** | `src/data/missions/` + `MissionDefinition` com setores e regras |
| `src/ui/UIManager.ts` | 1.573 | Menu, Loadout, Briefing, HUD, Overlays e Multi-touch | **Reconstruir organização da interface** | `UIManager`, `HUDManager`, `SquadCommandUI`, `RadioUI`, `BriefingUI`, `PauseUI` |
| `src/styles.css` | 2.036 | Estilos completos desktop + mobile retrato/paisagem | **Aproveitar base visual e modularizar** | `src/ui/styles.css` preservando responsividade mobile validada |

> **Observação da Seção 18 (inspeção prévia obrigatória):** antes de remover qualquer código de `EnvironmentBuilder.ts`, `UIManager.ts`, `VFXSystem.ts` ou `styles.css`, seus blocos reutilizáveis (ex.: casas entráveis, partículas/pools, controles multi-touch flutuantes e estilos de overlays/warning `+18`) devem ser extraídos ou adaptados diretamente para os novos módulos.

---

## 3. Componentes das Fases 1–5 que Devem Ser Preservados no Redesign

- **Construções entráveis com portas, peitoris de `1,04m` e colapso em estágios** (`EnvironmentBuilder.ts` + `CoverSystem.ts`).
- **Oclusão real de linha de visão por nuvens de fumaça** (`CoverSystem.isSegmentBlockedBySmoke`).
- **Renderização instanciada zero-alocação** de soldados em 6 draw calls (`SoldierSystem.ts`) como base visual da camada `presentation/`.
- **Controles multi-touch validados** (`index.html`, `InputManager.ts`, joystick flutuante com `setPointerCapture`, auto-escalada, tiro contínuo, `tap-to-heal`, layout sem sobreposição em `844×390` e `390×844` e banner `+18`).
- **Fallback automático de pós-processamento** para mobile e qualidade Baixa (`GameEngine.ts`).

---

## 4. Estratégia de Migração Segura em 6 Etapas (*Strangler Fig*)

Não desenvolver o novo motor diretamente sobre o antigo `GameEngine.ts`, nem apagar o jogo funcional antes da validação:

1. **Criar a nova estrutura de aplicação:** `src/core/` (`EventBus`, `GameLoop`, `GameClock`, `GameApplication`) e `src/simulation/` (`SimulationWorld`, `SimulationScheduler`), coexistindo em paralelo com o código atual.
2. **Definir e congelar contratos de sistemas:** tipos puros de `SoldierProfile`, `SquadCommand`, `DamageContext`, `BattlefieldSector`, `GameEvent` e `MissionDefinition`.
3. **Migrar módulos independentes primeiro:** `InputManager`, geometria de `Terrain`, `CoverSystem` (separando colisão/LoS da avaliação tática) e `Textures`/`VFXSystem`.
4. **Integrar um sistema por vez na Vertical Slice:** jogador + `DamageSystem` → pelotão aliado com 4 comandos → IA inimiga com percepção → `BattlefieldDirector` + setores → veículos/artilharia/rádio.
5. **Validar com suíte automatizada e regressão:** testes unitários/integração em Vitest (`tests/`) garantindo comportamento antes de desativar sistemas legados.
6. **Remover implementação antiga somente após validação ponta a ponta:** aposentar `GameEngine.ts` e o fluxo legado apenas quando a Vertical Slice e a campanha migrada estiverem estáveis e aprovadas.
