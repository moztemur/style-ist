import {Stylist, PredefinedStylingTools, MediaPipeFaceMeshLocatorEngine, ThreePainterEngine, StylingTool, MediaPipeTaskVisionLocatorEngine } from 'style-ist'
import MediaPipeTaskVisionBlushLocator from './blush/MediaPipeTaskVisionBlushLocator'
import MediaPipeTaskVisionMustacheLocator from './mustache/MediaPipeTaskVisionMustacheLocator'
import ThreeBlushPainter from './blush/ThreeBlushPainter'
import ThreeMustachePainter from './mustache/ThreeMustachePainter'
import MediaPipeFaceMeshBlushLocator from './blush/MediaPipeFaceMeshBlushLocator'
import MediaPipeFaceMeshMustacheLocator from './mustache/MediaPipeFaceMeshMustacheLocator'

// Interface for managing a single video stream
interface VideoStream {
  video: HTMLVideoElement
  canvas: HTMLCanvasElement
  stylist: Stylist | null
  lip: StylingTool<any, any> | null
  eye: StylingTool<any, any> | null
  blush: StylingTool<any, any> | null
  mustache: StylingTool<any, any> | null
}

// Get DOM elements
const btnCamera = document.getElementById('btnCamera') as HTMLButtonElement
const btnLip = document.getElementById('btnLip') as HTMLButtonElement
const btnEyeliner = document.getElementById('btnEyeliner') as HTMLButtonElement
const btnBlush = document.getElementById('btnBlush') as HTMLButtonElement
const btnMustache = document.getElementById('btnMustache') as HTMLButtonElement
const colorLip = document.getElementById('colorLip') as HTMLInputElement
const colorEyeliner = document.getElementById('colorEyeliner') as HTMLInputElement
const colorBlush = document.getElementById('colorBlush') as HTMLInputElement
const colorMustache = document.getElementById('colorMustache') as HTMLInputElement

// Setup FaceMesh stream
const faceMeshStream: VideoStream = {
  video: document.getElementById('video1') as HTMLVideoElement,
  canvas: document.getElementById('canvas1') as HTMLCanvasElement,
  stylist: null,
  lip: null,
  eye: null,
  blush: null,
  mustache: null,
}

// Setup TaskVision stream
const taskVisionStream: VideoStream = {
  video: document.getElementById('video2') as HTMLVideoElement,
  canvas: document.getElementById('canvas2') as HTMLCanvasElement,
  stylist: null,
  lip: null,
  eye: null,
  blush: null,
  mustache: null,
}

let cameraOn = false

function getBlushLocator(locatorEngine: MediaPipeTaskVisionLocatorEngine | MediaPipeFaceMeshLocatorEngine) {
  if (locatorEngine instanceof MediaPipeTaskVisionLocatorEngine) {
    return new MediaPipeTaskVisionBlushLocator(locatorEngine)
  } else {
    return new MediaPipeFaceMeshBlushLocator(locatorEngine)
  }
}

function getMustacheLocator(locatorEngine: MediaPipeTaskVisionLocatorEngine | MediaPipeFaceMeshLocatorEngine) {
  if (locatorEngine instanceof MediaPipeTaskVisionLocatorEngine) {
    return new MediaPipeTaskVisionMustacheLocator(locatorEngine)
  } else {
    return new MediaPipeFaceMeshMustacheLocator(locatorEngine)
  }
}

async function initializeStream(stream: VideoStream, LocatorEngineClass: typeof MediaPipeFaceMeshLocatorEngine | typeof MediaPipeTaskVisionLocatorEngine) {
  try {
    const locatorEngine = new LocatorEngineClass(stream.video)
    const painterEngine = new ThreePainterEngine(stream.video, stream.canvas)
    stream.stylist = new Stylist(locatorEngine, painterEngine)
    await stream.stylist.initialize()
    stream.lip = stream.stylist.addPredefinedStylingTool(PredefinedStylingTools.LIPSTICK)
    stream.eye = stream.stylist.addPredefinedStylingTool(PredefinedStylingTools.EYELINER)
    stream.blush = stream.stylist.addCustomStylingTool('blush', getBlushLocator(locatorEngine), new ThreeBlushPainter(painterEngine))
    stream.mustache = stream.stylist.addCustomStylingTool('mustache', getMustacheLocator(locatorEngine), new ThreeMustachePainter(painterEngine))
    return true
  } catch (error) {
    console.error(`Failed to initialize ${LocatorEngineClass.name}:`, error)
    return false
  }
}

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })

    // Setup TaskVision stream
    taskVisionStream.video.srcObject = stream.clone()
    await taskVisionStream.video.play()
    const taskVisionSuccess = await initializeStream(taskVisionStream, MediaPipeTaskVisionLocatorEngine)
    
    // Setup FaceMesh stream
    faceMeshStream.video.srcObject = stream.clone()
    await faceMeshStream.video.play()
    const faceMeshSuccess = await initializeStream(faceMeshStream, MediaPipeFaceMeshLocatorEngine)

    if (!faceMeshSuccess || !taskVisionSuccess) {
      throw new Error('Failed to initialize both engines')
    }

    cameraOn = true
    btnCamera.textContent = 'Stop Camera'
  } catch (error) {
    console.error('Failed to start camera:', error)
    stopCamera()
    alert('Failed to start camera. Please check console for details.')
  }
}

function stopCamera() {
  // Stop FaceMesh stream
  faceMeshStream.stylist?.stop()
  const faceMeshTracks = (faceMeshStream.video.srcObject as MediaStream | null)?.getTracks()
  faceMeshTracks?.forEach(t => t.stop())
  faceMeshStream.video.srcObject = null

  // Stop TaskVision stream
  taskVisionStream.stylist?.stop()
  const taskVisionTracks = (taskVisionStream.video.srcObject as MediaStream | null)?.getTracks()
  taskVisionTracks?.forEach(t => t.stop())
  taskVisionStream.video.srcObject = null

  cameraOn = false
  btnCamera.textContent = 'Start Camera'
}

// Setup event listeners for both streams
btnLip.addEventListener('click', () => {
  const streams = [faceMeshStream, taskVisionStream]
  const isActive = faceMeshStream.lip?.active || taskVisionStream.lip?.active

  streams.forEach(stream => {
    if (!stream.lip) return
    if (isActive) {
      stream.lip.stop()
    } else {
      stream.lip.start()
    }
  })

  btnLip.textContent = isActive ? 'Apply Lipstick' : 'Remove Lipstick'
})

btnEyeliner.addEventListener('click', () => {
  const streams = [faceMeshStream, taskVisionStream]
  const isActive = faceMeshStream.eye?.active || taskVisionStream.eye?.active

  streams.forEach(stream => {
    if (!stream.eye) return
    if (isActive) {
      stream.eye.stop()
    } else {
      stream.eye.start()
    }
  })

  btnEyeliner.textContent = isActive ? 'Apply Eyeliner' : 'Remove Eyeliner'
})

colorLip.addEventListener('input', () => {
  const streams = [faceMeshStream, taskVisionStream]
  streams.forEach(stream => {
    if (stream.lip) stream.lip.stylingPainter.setColor(colorLip.value)
  })
})

colorEyeliner.addEventListener('input', () => {
  const streams = [faceMeshStream, taskVisionStream]
  streams.forEach(stream => {
    if (stream.eye) stream.eye.stylingPainter.setColor(colorEyeliner.value)
  })
})

btnBlush.addEventListener('click', () => {
  const streams = [faceMeshStream, taskVisionStream]
  const isActive = faceMeshStream.blush?.active || taskVisionStream.blush?.active

  streams.forEach(stream => {
    if (!stream.blush) return
    if (isActive) {
      stream.blush.stop()
    } else {
      stream.blush.start()
    }
  })

  btnBlush.textContent = isActive ? 'Apply Blush' : 'Remove Blush'
})

btnMustache.addEventListener('click', () => {
  const streams = [faceMeshStream, taskVisionStream]
  const isActive = faceMeshStream.mustache?.active || taskVisionStream.mustache?.active

  streams.forEach(stream => {
    if (!stream.mustache) return
    if (isActive) {
      stream.mustache.stop()
    } else {
      stream.mustache.start()
    }
  })

  btnMustache.textContent = isActive ? 'Apply Mustache' : 'Remove Mustache'
})

colorBlush.addEventListener('input', () => {
  const streams = [faceMeshStream, taskVisionStream]
  streams.forEach(stream => {
    if (stream.blush) stream.blush.stylingPainter.setColor(colorBlush.value)
  })
})

colorMustache.addEventListener('input', () => {
  const streams = [faceMeshStream, taskVisionStream]
  streams.forEach(stream => {
    if (stream.mustache) stream.mustache.stylingPainter.setColor(colorMustache.value)
  })
})

// Camera control
btnCamera.addEventListener('click', () => {
  if (!cameraOn) startCamera()
  else stopCamera()
})

// Cleanup
window.addEventListener('beforeunload', () => {
  stopCamera()
})