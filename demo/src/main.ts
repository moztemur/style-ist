import Stylist, { PredefinedStylingTools, TensorflowLocatorEngine, ThreePainterEngine } from 'style-ist'
import TensorflowBlushLocator from './blush/TensorflowBlushLocator'
import ThreeBlushPainter from './blush/ThreeBlushPainter'
import TensorflowMustacheLocator from './mustache/TensorflowMustacheLocator'
import ThreeMustachePainter from './mustache/ThreeMustachePainter'

const video = document.getElementById('video') as HTMLVideoElement
const canvas = document.getElementById('canvas') as HTMLCanvasElement
const btnCamera = document.getElementById('btnCamera') as HTMLButtonElement
const btnLip = document.getElementById('btnLip') as HTMLButtonElement
const btnEyeliner = document.getElementById('btnEyeliner') as HTMLButtonElement
const btnBlush = document.getElementById('btnBlush') as HTMLButtonElement
const btnMustache = document.getElementById('btnMustache') as HTMLButtonElement
const colorLip = document.getElementById('colorLip') as HTMLInputElement
const colorEyeliner = document.getElementById('colorEyeliner') as HTMLInputElement
const colorBlush = document.getElementById('colorBlush') as HTMLInputElement
const colorMustache = document.getElementById('colorMustache') as HTMLInputElement
let stylist: Stylist | null = null
let lip: any | null = null
let eye: any | null = null
let blush: any | null = null
let mustache: any | null = null
let cameraOn = false

async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
  video.srcObject = stream
  await video.play()

  const locatorEngine = new TensorflowLocatorEngine(video);
  const painterEngine = new ThreePainterEngine(video, canvas);

  if (!stylist) stylist = new Stylist(locatorEngine, painterEngine)
  await stylist.initialize()
  if (!lip) { lip = stylist?.addPredefinedStylingTool(PredefinedStylingTools.LIPSTICK) }
  if (!eye) { eye = stylist?.addPredefinedStylingTool(PredefinedStylingTools.EYELINER) }
  if (!blush) { blush = stylist?.addCustomStylingTool('blush', new TensorflowBlushLocator(locatorEngine), new ThreeBlushPainter(painterEngine)) }
  if (!mustache) { mustache = stylist?.addCustomStylingTool('mustache', new TensorflowMustacheLocator(locatorEngine), new ThreeMustachePainter(painterEngine)) }

  cameraOn = true
  btnCamera.textContent = 'Stop Camera'
}

function stopCamera() {
  stylist?.stop()
  const tracks = (video.srcObject as MediaStream | null)?.getTracks()
  tracks?.forEach(t => t.stop())
  video.srcObject = null
  cameraOn = false
  btnCamera.textContent = 'Start Camera'
}

btnCamera.addEventListener('click', () => {
  if (!cameraOn) startCamera(); else stopCamera()
})

btnLip.addEventListener('click', () => {
  if (!lip) return
  if (lip.active) { lip.stop(); btnLip.textContent = 'Apply Lipstick' } else { lip.start(); btnLip.textContent = 'Remove Lipstick' }
})
btnEyeliner.addEventListener('click', () => {
  if (!eye) return
  if (eye.active) { eye.stop(); btnEyeliner.textContent = 'Apply Eyeliner' } else { eye.start(); btnEyeliner.textContent = 'Remove Eyeliner' }
})
btnBlush.addEventListener('click', () => {
  if (!blush) return
  if (blush.active) { blush.stop(); btnBlush.textContent = 'Apply Blush' } else { blush.start(); btnBlush.textContent = 'Remove Blush' }
})
btnMustache.addEventListener('click', () => {
  if (!mustache) return
  if (mustache.active) { mustache.stop(); btnMustache.textContent = 'Apply Mustache' } else { mustache.start(); btnMustache.textContent = 'Remove Mustache' }
})

colorLip.addEventListener('input', () => { if (lip) lip.stylingPainter.setColor(colorLip.value) })
colorEyeliner.addEventListener('input', () => { if (eye) eye.stylingPainter.setColor(colorEyeliner.value) })
colorBlush.addEventListener('input', () => { if (blush) blush.stylingPainter.setColor(colorBlush.value) })
colorMustache.addEventListener('input', () => { if (mustache) mustache.stylingPainter.setColor(colorMustache.value) })

window.addEventListener('beforeunload', () => { stopCamera() })


