# 04 — Vertical Slice, Pacote `REDESIGN-001`, Roadmap (`M0`–`M7`) e Plano de Testes

> Baseado nas *Partes V, VI e VII* da especificação definitiva. Este documento orienta a execução prática passo a passo, começando pela fundação (`REDESIGN-001`) e pela **Vertical Slice** antes de reconstruir todas as 6 operações.

---

## 1. Regra de Execução: Vertical Slice Primeiro

Não reconstruir inicialmente os 6 mapas nem multiplicar armas/efeitos. A prioridade é validar toda a nova arquitetura ponta a ponta em **uma cena jogável completa**.

### 1.1. Escopo Fechado da Vertical Slice
- **Mapa:** setor misto de trincheiras, terreno aberto e posição defendida.
- **Forças:** 1 jogador em 1ª pessoa + 1 pelotão aliado de **7 soldados** (total 8) + 2 pelotões inimigos + 1 equipe de metralhadora fixa + 1 unidade antitanque + 1 veículo inimigo + 1 veículo aliado de apoio.
- **Sistemas ativos:** cobertura (`CoverEvaluator`), supressão, moral, 4 comandos de pelotão (`Avançar`, `Manter posição`, `Flanquear`, `Reagrupar`), IA tática de pelotão com percepção limitada, `BattlefieldDirector` simplificado com setores, artilharia limitada, rádio contextual, objetivos, vitória/derrota, HUD discreto e áudio/VFX básicos.

### 1.2. Cenário de Aceitação Ponta a Ponta (Cena Teste)
1. O jogador recebe a ordem de conquistar uma posição inimiga defendida por uma trincheira.
2. Ordena que o pelotão mantenha posição (`[Z] → [2]`), identifica a metralhadora inimiga e emite flanqueamento (`[Z] → [3]`).
3. Durante o confronto, um veículo inimigo entra no setor por rota terrestre coerente; o apoio aliado engaja e precisa recuar sob dano.
4. O jogador solicita artilharia, avança com seu pelotão e conquista o setor (alterando o controle territorial).
5. Simultaneamente, o `BattlefieldDirector` simula um ataque em outro setor e o rádio informa que reforços serão necessários.

---

## 2. Primeiro Pacote de Trabalho: `REDESIGN-001`

**Objetivo:** construir o núcleo modular desacoplado (`core/` + `simulation/` + base `presentation/`) capaz de iniciar uma cena Three.js controlada pelo novo `GameLoop` sem alterar o jogo legado até validação.

### 2.1. Entregáveis Obrigatórios de `REDESIGN-001`
- [ ] Criar estrutura inicial de diretórios (`src/core/`, `src/simulation/`, `src/gameplay/`, `src/ai/`, `src/world/`, `src/missions/`, `src/presentation/`, `src/ui/`, `src/data/`, `src/infrastructure/`, `tests/`).
- [ ] Implementar `src/core/EventBus.ts` (publish/subscribe tipado com `GameEvent`).
- [ ] Implementar `src/core/GameClock.ts` e `src/core/GameLoop.ts` (9 etapas + `dt` protegido).
- [ ] Implementar `src/core/GameApplication.ts` (composição de serviços sem lógica militar inline).
- [ ] Implementar `src/simulation/SimulationWorld.ts` e `src/simulation/SimulationScheduler.ts`.
- [ ] Definir contratos base de soldados (`SoldierProfile`), pelotões (`SquadState`, `SquadCommand`), facções, eventos e estado do campo de batalha (`BattlefieldSector`).
- [ ] Integrar mapa inicial de testes na camada `presentation/` (Three.js) consumindo o estado da simulação.
- [ ] Configurar `vitest` e `eslint` e garantir `tsc --noEmit` + `vite build` passando sem erros.
- [ ] Registrar decisões arquiteturais e resultado de aceitação.

**Critério de aprovação do `REDESIGN-001`:** o novo núcleo inicia a cena Three.js, executa o ciclo de simulação escalonado, despacha/recebe eventos tipados via `EventBus` e permite acoplar ou testar módulos da `simulation/` em Node sem dependência de DOM ou `THREE.WebGLRenderer`.

---

## 3. Roadmap Completo de Desenvolvimento (`M0`–`M7`)

| Marco | Nome | Prioridade | Critérios Objetivos de Conclusão |
|---|---|---|---|
| **M0** | Auditoria e arquitetura-base (`REDESIGN-001`) | `P0` | Estrutura modular criada; `GameLoop`, `EventBus` e `SimulationScheduler` ativos; tipos centrais definidos; diagnóstico/test runner ativo; build verde. |
| **M1** | Jogador, combate e mundo | `P0` | Movimento e armas funcionais; colisões integradas; `DamageSystem` centralizado por `DamageContext`; avaliação de cobertura; supressão; destruição básica em camadas. |
| **M2** | Soldados, pelotões e comandos | `P0` | Composição de 8 integrantes; formações abertas; 4 comandos principais (`Z` + `1–4` + touch) funcionando; reagrupamento; `SoldierProfile` e máquinas de estado. |
| **M3** | IA tática e moral | `P0` | Percepção limitada (`unaware → lost_contact`); `CoverEvaluator`; fogo de supressão; planejamento de flanqueamento; cálculo progressivo de moral; retirada tática. |
| **M4** | `BattlefieldDirector` e guerra dinâmica | `P0` | Setores disputados; `DistantBattleSimulator` resolvendo combates fora de cena; reforços chegando por rotas; eventos em 4 categorias; mudanças territoriais afetando a batalha. |
| **M5** | Veículos, artilharia, rádio e aéreo | `P1` | Tanques com subsistemas/estados; artilharia com cooldown, dispersão e fogo amigo; rádio em 4 canais sujeito a interferência; ataques aéreos integrados a defesa AA. |
| **M6** | Missões e campanha | `P1` | `OP-01` a `OP-06` em `MissionDefinition` orientado a dados; briefings e relatórios; persistência narrativa e de campanha em `IndexedDB`; consequências entre operações. |
| **M7** | Imersão, otimização e lançamento | `P2` | Animações refinadas; áudio em 6 camadas (procedural + gravado); VFX sequencial; HUD discreto final; compatibilidade desktop/mobile validada (60/30 FPS); QA completo. |

---

## 4. Plano de Testes e Critérios de Aceitação por Sistema

### 4.1. Matriz de Aceitação Técnica

| Sistema | Entregáveis-Chave | Teste de Aceitação |
|---|---|---|
| **`SquadSystem`** | Formação aberta, composição e `SquadState` | Soldados mantêm espaçamento, coesão e respondem a baixas |
| **`SquadCommandSystem`** | 4 ordens principais + contextuais | Ordens são emitidas via `EventBus` e respeitam hierarquia de sobrevivência |
| **`TacticalAI`** | Percepção limitada e `TacticalPlanner` | Inimigos não atiram sem conhecimento prévio e reagem a flancos/supressão |
| **`MoraleSystem`** | Moral contínua (`M`) e estados | Baixas e isolamento reduzem moral gradualmente e disparam reorganização/retirada |
| **`SectorSystem`** | `BattlefieldSector` e captura | Controle territorial muda conforme presença de forças e altera suprimentos/rotas |
| **`BattlefieldDirector`** | Coordenação autônoma da batalha | Eventos e reforços ocorrem de forma coerente sem intervenção do jogador |
| **`DistantBattleSimulator`** | Resolução abstrata + materialização | Confrontos distantes alteram posse de setores e preservam estado ao se aproximar |
| **`DamageSystem`** | Cálculo único via `DamageContext` | Hit zones, materiais, proteção e explosões resolvem consistentemente |
| **`ObjectiveSystem`** | `ObjectiveEvaluator` e condições | Operações vencem ou falham apenas nas condições militares corretas |
| **`CampaignManager`** | Persistência `IndexedDB` entre ops | Sobreviventes, recursos e secundários influenciam a operação seguinte |

### 4.2. Estrutura Alvo da Suíte Automatizada (`tests/`)

```text
tests/
├── unit/
│   ├── DamageSystem.test.ts
│   ├── MoraleSystem.test.ts
│   ├── SectorSystem.test.ts
│   ├── ObjectiveSystem.test.ts
│   ├── SquadCommandSystem.test.ts
│   └── ReinforcementSystem.test.ts
├── integration/
│   ├── SquadCombat.test.ts
│   ├── BattlefieldSimulation.test.ts
│   ├── CampaignProgression.test.ts
│   └── VehicleCombat.test.ts
└── performance/
    ├── SoldierSimulation.test.ts
    ├── BattlefieldLoad.test.ts
    └── MemoryUsage.test.ts
```

*Testes manuais obrigatórios:* além da suíte Vitest, cada marco exige validação em combate real no navegador para garantir que IA, ritmo de pressão, supressão e comando do pelotão pareçam críveis e divertidos.

---

## 5. Matriz de Riscos e Regra de Ouro

### 5.1. Riscos Mapeados e Mitigações

| Risco | Impacto | Mitigação Direta |
|---|---|---|
| IA excessivamente complexa | Gargalo de CPU / queda de FPS | Hierarquia em 3 níveis + frequências escalonadas no `SimulationScheduler` |
| `GameEngine` monolítico | Acoplamento e manutenção cara | Arquitetura em 5 camadas + `EventBus` tipado |
| Excesso de soldados ativos | Sobrecarga de render/memória | LOD em 3 níveis + simulação abstrata distante (sem meta fixa de 650) |
| Eventos aleatórios demais | Batalhas sem coerência militar | Semente reproduzível + eventos obrigatórios + gatilhos contextuais |
| IA com conhecimento global | Inimigos "oniscientes" irreais | `PerceptionEngine` limitado por LoS, som, luz e memória temporária |
| Comandos ignorados pelo pelotão | Frustração do jogador | Hierarquia clara (sobrevivência + retomada da ordem) + feedback claro no rádio/HUD |
| Campanha grande demais cedo | Atraso na validação do núcleo | **Vertical Slice** jogável antes de expandir para 6 operações |
| Excesso de VFX / áudio | Queda de FPS ou estouro no WebAudio | Pools limitados, orçamento de luzes, presets adaptativos e limite de vozes |
| Assets externos não controlados | Problemas de licença/peso | Biblioteca controlada (própria ou licenciada) combinada ao procedural |

### 5.2. Regra de Ouro para Qualquer Nova Funcionalidade
Toda entrega ou feature proposta deve responder positivamente às **3 perguntas** abaixo; caso contrário, não é prioridade:
1. **Ela melhora a experiência de guerra?**
2. **Ela acrescenta algo interessante à jogabilidade?**
3. **Seu custo técnico é justificável?**
