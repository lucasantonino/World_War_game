import { SquadCommandType, Vec3 } from '../../core/types';

function rotateOffset(localX: number, localZ: number, yaw: number): Vec3 {
  const cos = Math.cos(yaw);
  const sin = Math.sin(yaw);
  return {
    x: Math.round((localX * cos - localZ * sin) * 1000) / 1000,
    y: 0,
    z: Math.round((localX * sin + localZ * cos) * 1000) / 1000
  };
}

/**
 * Gera deslocamentos táticos espaçados para os membros do pelotão conforme o comando ativo.
 * - advance: cunha aberta
 * - hold / defend_position / cover_entry: linha de tiro escalonada
 * - flank: coluna/escalão deslocado lateralmente (+/- 10m)
 * - regroup / rescue_wounded / request_ammo: perímetro próximo (3–5m)
 */
export function getFormationOffsets(
  command: SquadCommandType,
  memberCount: number,
  forwardYaw = 0
): Vec3[] {
  if (memberCount <= 0) {
    return [];
  }

  const offsets: Vec3[] = [];

  for (let i = 0; i < memberCount; i++) {
    let lx = 0;
    let lz = 0;

    switch (command) {
      case 'advance':
      case 'focus_target':
      case 'attack_vehicle': {
        // Cunha aberta: ponta à frente (z negativo) e asas abrindo lateralmente
        if (i === 0) {
          lx = 0;
          lz = -3.0;
        } else {
          const rank = Math.ceil(i / 2);
          const side = i % 2 === 1 ? -1 : 1;
          lx = side * rank * 3.6;
          lz = -3.0 + rank * 3.2;
        }
        break;
      }

      case 'hold':
      case 'defend_position':
      case 'cover_entry': {
        // Linha de tiro com espaçamento de ~3.5m e leve profundidade alternada
        const centerIndex = (memberCount - 1) / 2;
        const slot = i - centerIndex;
        lx = slot * 3.5;
        lz = i % 2 === 0 ? 0 : 1.4;
        break;
      }

      case 'flank': {
        // Deslocamento lateral pronunciado (+10m) em escalão aberto
        const rank = Math.floor(i / 2);
        lx = 10.0 + (i % 2 === 0 ? -1.8 : 2.2);
        lz = -2.0 + rank * 3.5;
        break;
      }

      case 'regroup':
      case 'rescue_wounded':
      case 'request_ammo': {
        // Perímetro defensivo próximo entre 3m e 5m
        const angle = (i / memberCount) * Math.PI * 2;
        const radius = i % 2 === 0 ? 3.4 : 4.6;
        lx = Math.cos(angle) * radius;
        lz = Math.sin(angle) * radius;
        break;
      }
    }

    offsets.push(rotateOffset(lx, lz, forwardYaw));
  }

  return offsets;
}
