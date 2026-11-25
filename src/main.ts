import './styles.css';
import { GameEngine } from './engine/GameEngine';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement | null;
const uiRoot = document.getElementById('ui-layer');

if (!canvas || !uiRoot) {
  throw new Error('Elementos base #game-canvas ou #ui-layer não encontrados.');
}

new GameEngine(canvas, uiRoot);
