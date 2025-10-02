import '@mediapipe/face_mesh';
import '@tensorflow/tfjs';
// Register WebGL backend.
import '@tensorflow/tfjs-backend-webgl';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

import {Stylist, PredefinedStylingTools, MediaPipeTaskVisionLocatorEngine, MediaPipeFaceMeshLocatorEngine, ThreePainterEngine, StylingTool} from '../../src'

// Interface for managing a single video stream
interface VideoStream {
  video: HTMLVideoElement
  canvas: HTMLCanvasElement
  stylist: Stylist | null
  lip: StylingTool<any, any> | null
  eye: StylingTool<any, any> | null
}

// Get DOM elements
const btnCamera = document.getElementById('btnCamera') as HTMLButtonElement
const btnLip = document.getElementById('btnLip') as HTMLButtonElement
const btnEyeliner = document.getElementById('btnEyeliner') as HTMLButtonElement
const colorLip = document.getElementById('colorLip') as HTMLInputElement
const colorEyeliner = document.getElementById('colorEyeliner') as HTMLInputElement

// Setup FaceMesh stream
const faceMeshStream: VideoStream = {
  video: document.getElementById('video1') as HTMLVideoElement,
  canvas: document.getElementById('canvas1') as HTMLCanvasElement,
  stylist: null,
  lip: null,
  eye: null,
}

// Setup TaskVision stream
const taskVisionStream: VideoStream = {
  video: document.getElementById('video2') as HTMLVideoElement,
  canvas: document.getElementById('canvas2') as HTMLCanvasElement,
  stylist: null,
  lip: null,
  eye: null,
}

let cameraOn = false

async function initializeStream(stream: VideoStream, LocatorEngineClass: typeof MediaPipeFaceMeshLocatorEngine | typeof MediaPipeTaskVisionLocatorEngine) {
  try {
    const locatorEngine = new LocatorEngineClass(stream.video)
    const painterEngine = new ThreePainterEngine(stream.video, stream.canvas)
    stream.stylist = new Stylist(locatorEngine, painterEngine)
    await stream.stylist.initialize()
    stream.lip = stream.stylist.addPredefinedStylingTool(PredefinedStylingTools.LIPSTICK)
    stream.eye = stream.stylist.addPredefinedStylingTool(PredefinedStylingTools.EYELINER)
    return true
  } catch (error) {
    console.error(`Failed to initialize ${LocatorEngineClass.name}:`, error)
    return false
  }
}

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
    
    // Setup FaceMesh stream
    // faceMeshStream.video.srcObject = stream.clone()
    // await faceMeshStream.video.play()
    // const faceMeshSuccess = await initializeStream(faceMeshStream, MediaPipeFaceMeshLocatorEngine)

    // Setup TaskVision stream
    taskVisionStream.video.srcObject = stream.clone()
    await taskVisionStream.video.play()
    const taskVisionSuccess = await initializeStream(taskVisionStream, MediaPipeTaskVisionLocatorEngine)

    if (!taskVisionSuccess) {
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

// Camera control
btnCamera.addEventListener('click', () => {
  if (!cameraOn) startCamera()
  else stopCamera()
})

// Cleanup
window.addEventListener('beforeunload', () => {
  stopCamera()
})