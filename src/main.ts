import './style.css'
import { renderRadar } from './util'

const canvas = document.querySelector<HTMLCanvasElement>('#canvas-radar')!
const ctx = canvas.getContext('2d')!;

const data = [
  { name: '羁绊', value: 99, color: '#fff', bgColor: '#E0684E' },
  { name: '玩乐', value: 63, color: '#fff', bgColor: '#2F6EEB' },
  { name: '默契', value: 55, color: '#fff', bgColor: '#FFB400' },
  { name: '承诺', value: 50, color: '#fff', bgColor: '#00A4B8' },
  { name: '亲密', value: 64, color: '#fff', bgColor: '#00985F' },
  { name: '激情', value: 45, color: '#fff', bgColor: '#FF782D' },
];

renderRadar(canvas, ctx, {
  data,
  maxBoundaryValue: 100,
  width: 375,
  height: 300
})
