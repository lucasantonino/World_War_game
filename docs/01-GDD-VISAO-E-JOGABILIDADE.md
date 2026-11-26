# 01 — Visão Definitiva do Produto e Game Design (GDD)

> Baseado na especificação definitiva de **TERRA DE NINGUÉM** (*Partes I, II, III e VII*). Define a experiência, as mecânicas centrais, os sistemas militares complementares e os critérios de aprovação do produto.

---

## 1. Conceito Central e Identidade

**TERRA DE NINGUÉM** é um **FPS tático cinematográfico** ambientado em uma guerra de grande escala inspirada principalmente na Segunda Guerra Mundial. O jogador atua em primeira pessoa como soldado integrante e líder operacional de um pequeno pelotão (6–10 soldados), inserido em operações militares vivas que continuam acontecendo fora do seu campo imediato de visão.

O jogador **não é um exército de um homem só**:
- Possui companheiros com funções complementares, superiores e restrições reais (munição, cobertura, ferimentos, comunicação).
- Seu pelotão é parte de uma força militar maior: outros pelotões avançam, recuam, pedem apoio e disputam setores simultaneamente.
- O resultado tático das ações do jogador interfere diretamente no andamento da operação atual e alimenta a operação seguinte.

> **Princípio de realismo:** não buscar realismo simulacionista absoluto em todas as mecânicas, mas **realismo perceptível**, **comportamento militar convincente** e **diversão consistente**.

### 1.1. Os Cinco Pilares Fundamentais

1. **Combate cinematográfico:** armas com peso e resposta crível, explosões em cadeia, supressão sensorial, destruição tática, animações e áudio espacial em camadas.
2. **Guerra tática:** pelotões organizados, flanqueamentos calculados, uso inteligente de cobertura, fogo de supressão, moral e decisões sob pressão.
3. **Campo de batalha dinâmico:** confrontos independentes em outros setores, reforços deslocando-se por rotas coerentes, ataques, recuos e disputas territoriais.
4. **Participação e comando:** controle direto do próprio soldado combinado com ordens simples, rápidas e contextualizadas ao pelotão.
5. **Imersão ambiental:** iluminação, clima gradual, destruição em camadas, som e movimentação de tropas comunicando a história da batalha.

### 1.2. Limites de Identidade (O que NUNCA queremos vs. O que queremos)

| Não queremos | Queremos |
|---|---|
| Inimigos aparecendo em ondas artificiais | Unidades militares chegando por rotas coerentes |
| Soldados atacando exclusivamente o jogador | Soldados enfrentando ameaças e objetivos |
| Aliados funcionando como figurantes | Pelotões com autonomia e utilidade real |
| Explosões apenas decorativas | Explosões que alteram cobertura, rotas e combate |
| Missões baseadas apenas em eliminações | Operações com objetivos militares claros |
| HUD cobrindo a tela | Interface discreta, tática e funcional |
| Dificuldade baseada em inimigos infinitos | Dificuldade baseada em estratégia e contexto |
| Cenários estáticos | Ambientes que evoluem durante a batalha |

---

## 2. Identidade Narrativa e Campanha Conectada

### 2.1. Quatro Níveis Narrativos
1. **O conflito:** contexto geral da guerra.
2. **A campanha:** região onde as operações ocorrem.
3. **A operação:** objetivo militar específico e tático.
4. **O pelotão:** os companheiros recorrentes com quem o jogador luta, sobrevive ou perde.

### 2.2. Estrutura das Seis Operações Base (`OP-01` a `OP-06`)

As seis operações temáticas existentes serão preservadas, porém com **objetivos, setores e estrutura reconstruídos**:

| Operação | Identidade | Mecânica Principal |
|---|---|---|
| **OP-01 — Alvorada de Aço** | Defesa de trincheiras | Defesa e contra-ataque |
| **OP-02 — Mandíbulas de Ferro** | Ofensiva mecanizada | Combate antitanque |
| **OP-03 — Céu de Chumbo** | Ataque aéreo | Defesa e comunicação |
| **OP-04 — Vilarejo em Ruínas** | Combate urbano | Coordenação de pelotão |
| **OP-05 — Floresta Devastada** | Guerra de reconhecimento | Emboscadas e logística |
| **OP-06 — Ofensiva Final** | Ataque combinado | Infantaria e blindados |

**Fluxo padrão de cada operação:**
1. Briefing tático → 2. Preparação do equipamento → 3. Inserção no campo de batalha → 4. Objetivos principais + secundários → 5. Eventos dinâmicos + apoio militar → 6. Condições de vitória/derrota → 7. Relatório de operação → 8. Persistência e consequências para a campanha.

### 2.3. Persistência Narrativa Entre Operações
O sistema de campanha registra entre missões:
- Soldados aliados sobreviventes e sua experiência acumulada.
- Baixas do pelotão.
- Equipamentos preservados e desbloqueios.
- Objetivos secundários concluídos e recursos obtidos.
- Posições conquistadas/perdidas e apoios militares disponíveis.

*Exemplo:* proteger um comboio de munições na `OP-05` aumenta a disponibilidade de suprimentos e munição para a `OP-06`.

---

## 3. O Jogador e Seu Pelotão

### 3.1. Composição Inicial Padrão (8 Integrantes)

| Integrante | Função | Papel em Combate |
|---|---|---|
| **Jogador** | Combatente e líder operacional | Ação direta em 1ª pessoa e emissão de ordens |
| **Soldado 01** | Fuzileiro | Linha de frente, ocupação de cobertura e flanqueamento |
| **Soldado 02** | Fuzileiro | Linha de frente e proteção de flancos |
| **Soldado 03** | Metralhador | Fogo de supressão contínuo para fixar inimigos |
| **Soldado 04** | Especialista Antitanque | Engajamento de blindados e posições fortificadas |
| **Soldado 05** | Médico | Atendimento de feridos em condições táticas seguras |
| **Soldado 06** | Granadeiro | Limpeza de trincheiras/casas e granadas de fumaça/frag |
| **Soldado 07** | Rádio e Apoio | Manutenção do canal de comando/artilharia e suporte |

*Regra de comportamento:* o pelotão **não** acompanha o jogador em fila rígida; mantém espaçamento tático, busca cobertura independente, protege flancos e reagrupa quando ordenado ou após o combate.

### 3.2. Sistema de Comando do Pelotão

**Quatro comandos principais:**
1. **Avançar:** deslocar o pelotão até um ponto ou objetivo marcado no terreno.
2. **Manter posição:** estabelecer defesa e sustentar fogo de cobertura.
3. **Flanquear:** procurar rota lateral coberta para atacar o inimigo pelo flanco.
4. **Reagrupar:** retornar ao jogador ou a uma zona segura.

**Comandos contextuais:** focar alvo, atacar veículo, cobrir entrada, defender posição, resgatar ferido e solicitar munição.

**Interface sem interromper o combate:**
- **Tecla `Z`:** abre/fecha menu rápido de comando.
- **Teclas `1–4` (com menu aberto) ou Mouse:** selecionam ordem rapidamente; indicação discreta no terreno para destino sem transformar o FPS em RTS.
- **`Z` novamente ou `ESC`:** fecha sem bloquear ação.
- **Mobile:** painel compacto contextual acoplado ao HUD touch.

### 3.3. Hierarquia de Decisão do Pelotão (Autonomia + Obediência)
1. **Sobrevivência imediata** (buscar abrigo se sob fogo pesado antes de executar cegamente uma ordem).
2. **Resposta a ameaças próximas**.
3. **Cumprimento da ordem recebida** (mantida ativa enquanto buscam oportunidade/apoio do metralhador).
4. **Proteção dos companheiros**.
5. **Reorganização do grupo**.

---

## 4. Sistema de Combate

### 4.1. Categorias de Armamento
Fuzis (semiautomáticos e de ferrolho), Submetralhadoras, Metralhadoras de apoio, Pistolas secundárias, Antitanque (bazucas e equivalentes), Explosivos (granadas e cargas), Fuzis de precisão com luneta e Armas fixas (MGs em tripé/casamatas). *Nota de auditoria:* nomenclatura, atributos e modelos atuais devem passar por revisão de coerência histórica.

### 4.2. Modelo de Dano Centralizado (`DamageSystem`)
Todo dano do jogo deixa de ser ad-hoc e passa pelo contrato `DamageContext`, considerando região atingida (`HitZone`), tipo de munição (`DamageType`), distância, material atingido (`MaterialType`), proteção do alvo, estado do alvo e características de explosão.

### 4.3. Supressão Sensorial e Tática
Disparos próximos ao jogador ou soldados geram supressão proporcional à distância, cadência, calibre e proteção:
- Reduz precisão e altera discretamente visão/foco.
- Abafa áudio ambiente/combate.
- Força cautela e procura ativa por cobertura nos NPCs (e recarga de postura no jogador).

### 4.4. Sistema de Ferimentos em 4 Graus

| Grau | Consequência Direta |
|---|---|
| **Leve** | Redução temporária de desempenho (firmeza/movimento) |
| **Moderado** | Sangramento contínuo e necessidade de curativo |
| **Grave** | Movimentação prejudicada e risco iminente de incapacitação |
| **Incapacitação** | Soldado cai e exige atendimento/resgate pelo médico ou jogador |

---

## 5. Sistema de Inimigos

### 5.1. Inteligência em Três Níveis
- **Nível estratégico:** defender setores, reforçar posições, atacar objetivos, recuar, solicitar apoio.
- **Nível tático (pelotão):** estabelecer cobertura, suprimir adversários, flanquear, avançar em saltos, reagrupar.
- **Nível individual:** movimentação, mira, disparo, recarga, reação a impactos e procura de abrigo.

### 5.2. Seis Personalidades Táticas (Doutrinas Parametrizadas)
`Defensivo` • `Agressivo` • `Cauteloso` • `Coordenado` • `Desorganizado` • `Reserva` — implementadas via pesos compartilhados de decisão (não via IAs separadas).

### 5.3. Percepção e Conhecimento Imperfeito
Inimigos **não** conhecem a posição real do jogador automaticamente. Utilizam linha de visão, distância, iluminação, ruído, disparos, movimentação, comunicação entre soldados e **última posição conhecida**, transitando por:

`unaware → suspicious → investigating → detected → engaging → lost_contact`

Ao entrar em `lost_contact`, o inimigo investiga a última posição conhecida, protege rotas ou pede reconhecimento em vez de mirar através de paredes/fumaça.

---

## 6. Campo de Batalha Dinâmico (`BattlefieldDirector`)

O diferencial central do redesign é transformar o mapa em um **ecossistema militar dividido em setores** (ex.: `A — Trincheira`, `B — Estrada`, `C — Vilarejo`, `D — Floresta`, `E — Colina`, `F — Posto avançado`).

- **`BattlefieldDirector`:** monitora controle de setores (`BattlefieldSector`), registra confrontos, identifica posições ameaçadas, gerencia reservas, dispara eventos e coordena progressão/rádio sem microgerenciar passos individuais.
- **Simulação distante → Materialização coerente:** batalhas fora da área do jogador são resolvidas abstratamente (efetivo, armamento, moral, cobertura, apoio, terreno, suprimentos). Quando o jogador se aproxima, convertem-se em unidades físicas que chegam por **rotas coerentes com tempo de deslocamento**, jamais surgindo abruptamente no ar.
- **Quatro categorias de eventos dinâmicos:** `Combate` (emboscadas, contra-ataques, recuos), `Logística` (comboios, escassez, reforços), `Emergência` (feridos, posições sob colapso, veículos avariados) e `Ambiente` (bombardeios, incêndios, mudanças climáticas), com controle anti-repetição.
- **Controle de território:** capturar um setor habilita reforços, cria ponto de suprimento, alivia setores vizinhos e abre rotas/objetivos.
- **Aleatoriedade híbrida:** eventos narrativos obrigatórios + decisões dinâmicas + eventos opcionais regidos por **semente reproduzível**.

---

## 7. Sistemas Militares Complementares, Ambiente e Audiovisual

### 7.1. Veículos, Artilharia e Ataque Aéreo
- **Tanques por subsistemas:** motor, esteiras, torre, canhão principal, metralhadora, blindagem direcional por região, tripulação e munição; estados `idle → moving → engaging → repositioning → damaged → disabled → destroyed`. Exemplo: dano nas esteiras imobiliza o chassi, mas permite continuar atirando com a torre. Operam apoiando a infantaria e recuam quando gravemente comprometidos.
- **Artilharia limitada:** dividida em artilharia aliada, inimiga, morteiros, apoio indireto e bombardeio aéreo; cada pedido possui disponibilidade, tempo de resposta, dispersão, recarga, **risco de fogo amigo** e dependência do estado da comunicação.
- **Sistema aéreo:** aviso prévio, aproximação, reação de cobertura das tropas, passagem de ataque, impactos no cenário e interferência por **defesa antiaérea**.

### 7.2. Comunicação Militar em Quatro Canais
`Comando` (ordens superiores) • `Pelotão` (membros próximos) • `Operacional` (outros setores) • `Emergência` (socorro/crítico). O rádio dinâmico reage a distância, interferência, destruição de equipamentos, clima e sobrevivência do operador de rádio — sem travar a progressão quando cair. Todas as falas refletem eventos reais em curso.

### 7.3. Cenário, Destruição em 4 Camadas e Clima Gradual
- **5 categorias de ambiente:** trincheiras/fortificações, vilarejos/cidades destruídas, florestas naturais, campos/estradas e complexos/bunkers.
- **4 estados estruturais:** `Intacto` → `Danificado` (rachaduras, proteção menor) → `Parcialmente destruído` (novas linhas de visão) → `Destruído` (escombros alterando rotas/cobertura), priorizando destruição relevante ao combate.
- **Clima gradual:** `Chuva`, `Neblina`, `Noite`, `Tempestade` (interferência de rádio/percepção), `Fumaça` e `Poeira` evoluindo progressivamente.

### 7.4. Audiovisual Cinematográfico
- **Câmera física controlada:** balanço de caminhada/corrida, recuo, choque de explosões, inclinação e vinheta discreta de ferimentos sem causar enjoo.
- **VFX em sequência física:** clarão → expansão → partículas → fumaça → detritos no solo → consequências no terreno/cobertura.
- **Áudio em 6 camadas:** `Próxima`, `Média`, `Distante`, `Ambiental`, `Narrativa` e `Cinemática`, com limite de vozes simultâneas, prioridade e separação entre **WebAudio espacial/filtros** e **gravações próprias/licenciadas** para armas, motores, vozes e explosões.

---

## 8. Critérios de Aprovação e Priorização Definitiva

**TERRA DE NINGUÉM só será considerado pronto quando atender aos 8 critérios:**
1. Combate convincente de aliados e inimigos.
2. Pelotão responsivo onde ordens produzem impacto tático visível.
3. Campo de batalha independente com confrontos fora da ação direta do jogador.
4. Decisões táticas que alteram o desenrolar da operação.
5. Imersão audiovisual clara (som, iluminação, clima, destruição).
6. Progressão conectada entre operações.
7. Taxa de quadros estável nos dispositivos-alvo.
8. Fator diversão e rejogabilidade estratégica.

| Prioridade | Bloco |
|---|---|
| **`P0` (Crítica)** | Arquitetura & Combate • Pelotões & IA • Campo de Batalha Dinâmico |
| **`P1` (Alta)** | Guerra Combinada (Tanques, Artilharia, Rádio, Aéreo) • Campanha Conectada |
| **`P2` (Alta após núcleo, contínua desde VS)** | Polimento Cinematográfico (Áudio completo, animações dedicadas, VFX e acabamento visual) |
