# TERRA DE NINGUÉM — Documentação Técnica e de Produto (Redesign v2)

> **Identidade Definitiva:** FPS cinematográfico e tático de guerra (ambientado principalmente na Segunda Guerra Mundial), no qual o jogador lidera em primeira pessoa um pequeno pelotão de 6–10 soldados dentro de um campo de batalha vivo e independente.

---

## Direção Aprovada

- **Estilo:** FPS cinematográfico e tático (`realismo perceptível`, comportamento militar convincente e diversão consistente).
- **Comando:** pequeno pelotão de aproximadamente 6–10 soldados (composição inicial padrão: **8 integrantes**, incluindo o jogador).
- **Campo de batalha:** ecossistema dinâmico de setores, confrontos independentes, reforços por rotas coerentes, recuos e eventos imprevisíveis com semente reproduzível.
- **Arquitetura:** redesign modular em **5 camadas** com regra absoluta: **a lógica militar não depende da renderização do Three.js**.
- **Stack atual verificada no repositório:** TypeScript `^5.7.2` (`strict: true`), Three.js `^0.170.0`, Vite `^6.0.3`, idioma `pt-BR`. *(Ferramental adicional planejado no M0: Vitest + ESLint + IndexedDB para campanha.)*
- **Plataforma:** desktop prioritário com compatibilidade mobile progressiva (preservando os controles multi-touch já estabilizados).

---

## Índice da Documentação

| Documento | Escopo Principal | Leitura Indicada Para |
|---|---|---|
| **[01-GDD-VISAO-E-JOGABILIDADE.md](./01-GDD-VISAO-E-JOGABILIDADE.md)** | Visão definitiva, pilares, narrativa e persistência, pelotão/comandos, combate (`DamageContext`, supressão, ferimentos), IA inimiga, `BattlefieldDirector`, veículos, artilharia, rádio, destruição/clima e critérios de aprovação. | Game Design, IA, Narrativa, Áudio/VFX |
| **[02-ARQUITETURA-E-CONTRATOS.md](./02-ARQUITETURA-E-CONTRATOS.md)** | Arquitetura em 5 camadas, estrutura de diretórios `src/`, contratos TypeScript (`EventBus`, `GameEvent`, `SquadCommand`, `SoldierProfile`, `BattlefieldSector`, `MissionDefinition`), `GameLoop` em 9 etapas, frequências do `SimulationScheduler`, algoritmos de IA, LOD em 3 níveis, performance, persistência e política de assets. | Arquitetura, Engenharia Core, Simulação |
| **[03-AUDITORIA-E-PLANO-DE-MIGRACAO.md](./03-AUDITORIA-E-PLANO-DE-MIGRACAO.md)** | Auditoria completa dos **20 arquivos existentes em `src/`** (contagem real de linhas e acoplamentos), decisão de preservar/refatorar/substituir, inventário reutilizável das Fases 1–5 (casas entráveis, `InstancedMesh` 6 draw calls, controles touch, clima/fumaça/pós-FX) e estratégia de migração em 6 etapas. | Engenharia de Migração & Refatoração |
| **[04-ROADMAP-VERTICAL-SLICE-E-TESTES.md](./04-ROADMAP-VERTICAL-SLICE-E-TESTES.md)** | Escopo fechado da **Vertical Slice**, especificação executável do pacote **`REDESIGN-001`**, roadmap completo **M0–M7**, entregáveis e testes de aceitação por sistema, plano `tests/` (unit/integration/performance), matriz de riscos e Regra de Ouro. | Planejamento, QA, Execução de Sprints |

---

## Mapa Resumido dos Marcos (`M0`–`M7`)

| Marco | Entrega Principal | Prioridade |
|---|---|---|
| **M0** | Auditoria, arquitetura modular (`core/` + `simulation/`) e pacote `REDESIGN-001` | Crítica (`P0`) |
| **M1** | Jogador, combate centralizado (`DamageSystem`), colisões, cobertura, supressão e destruição básica | Crítica (`P0`) |
| **M2** | Soldados, pelotões (8 integrantes), formações, `SquadCommandSystem` e estados individuais | Crítica (`P0`) |
| **M3** | IA tática em 3 níveis, percepção limitada, cobertura pontuada, flanqueamento e moral | Crítica (`P0`) |
| **M4** | `BattlefieldDirector`, setores, simulação abstrata distante, reforços e eventos dinâmicos | Crítica (`P0`) |
| **M5** | Tanques por subsistemas, artilharia limitada, rádio dinâmico em 4 canais e ataques aéreos | Alta (`P1`) |
| **M6** | Campanha conectada (`OP-01`–`OP-06`), persistência narrativa em `IndexedDB` e relatórios | Alta (`P1`) |
| **M7** | Polimento cinematográfico, áudio em 6 camadas, VFX sequencial, otimização e testes finais | Alta (`P2`) |
