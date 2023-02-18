import { renderRadar } from './canvas'

const generateData = (length: number) => {
  return Array.from({ length }).map((_, index) => ({
    name: `Name-${index + 1}`,
    value: ~~(Math.random() * 100),
    color: `#${(~~(Math.random() * 256 * 256 * 256 - 1)).toString(16)}`
  }))
}

const scaleNum = (n: number) => n * Math.min(600, document.documentElement.clientWidth || document.body.clientWidth) / 375;

let preData = generateData(6)

const canvas = document.querySelector<HTMLCanvasElement>('#canvas-radar')!
const ctx = canvas.getContext('2d')!;

export const render = (isNewChart: boolean) => {
  const width = scaleNum(375)
  const height = scaleNum(375)

  const newData = isNewChart ? generateData(~~(Math.random() * 15 + 3)) : preData

  preData = newData

  renderRadar(canvas, ctx, {
    data: newData,
    maxBoundaryValue: 100,
    width,
    height
  })

  console.log('current radar data is ', newData)
}

render(false)

window.addEventListener('resize', render.bind(this, false))

document.querySelector('#btn')?.addEventListener('click', render.bind(this, true))
