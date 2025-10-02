import { useEffect, useRef, useState } from 'react'
import { 
  Stylist, 
  PredefinedStylingTools, 
  MediaPipeFaceMeshLocatorEngine, 
  ThreePainterEngine,
  MediaPipeFaceMeshLocator,
  ThreePainter
} from 'style-ist'

import * as THREE from 'three'

// Access global variables from script tags
const faceLandmarksDetection = window.faceLandmarksDetection
const tf = window.tf

// Blush implementation
class MediaPipeBlushLocator extends MediaPipeFaceMeshLocator {
  constructor(mediaPipeLocatorEngine) {
    super(mediaPipeLocatorEngine)
    this.CHEEKS_LEFT = [205, 36, 101, 118, 123, 147, 187]
    this.CHEEKS_RIGHT = [330, 347, 352, 376, 411, 425, 266]
  }

  locateForTool() {
    const locations = this.getLocations()
    if (!locations) {
      throw new Error('No locations found')
    }

    const leftCheek = this.CHEEKS_LEFT.map((idx) => {
      const kp = locations[0].keypoints[idx]
      return { x: kp.x, y: kp.y }
    })
    const rightCheek = this.CHEEKS_RIGHT.map((idx) => {
      const kp = locations[0].keypoints[idx]
      return { x: kp.x, y: kp.y }
    })

    return { leftCheek, rightCheek }
  }
}

class ThreeBlushPainter extends ThreePainter {
  constructor(threePainterEngine) {
    super(threePainterEngine)

    this.blushMaterial = new THREE.MeshBasicMaterial({
      color: "#ff6699",
      transparent: true,
      opacity: 0.35,
      depthTest: false,
      depthWrite: false,
      side: THREE.DoubleSide,
    })

    this.leftBlushMesh = new THREE.Mesh(new THREE.BufferGeometry(), this.blushMaterial)
    this.rightBlushMesh = new THREE.Mesh(new THREE.BufferGeometry(), this.blushMaterial)
    this.leftBlushMesh.frustumCulled = false
    this.rightBlushMesh.frustumCulled = false

    this.painterEngine.scene.add(this.leftBlushMesh)
    this.painterEngine.scene.add(this.rightBlushMesh)
  }

  setColor(hexColor) {
    this.blushMaterial.color = new THREE.Color(hexColor)
  }

  paint(stylingLocations) {
    const { leftCheek, rightCheek } = stylingLocations

    if (leftCheek && leftCheek.length >= 5) {
      const lShape = this.buildFillShape(leftCheek)
      if (this.leftBlushMesh.geometry) this.leftBlushMesh.geometry.dispose()
      this.leftBlushMesh.geometry = new THREE.ShapeGeometry(lShape)
      this.leftBlushMesh.visible = true
    } else {
      this.leftBlushMesh.visible = false
    }

    if (rightCheek && rightCheek.length >= 5) {
      const rShape = this.buildFillShape(rightCheek)
      if (this.rightBlushMesh.geometry) this.rightBlushMesh.geometry.dispose()
      this.rightBlushMesh.geometry = new THREE.ShapeGeometry(rShape)
      this.rightBlushMesh.visible = true
    } else {
      this.rightBlushMesh.visible = false
    }
  }

  buildFillShape(points) {
    const shape = new THREE.Shape()
    const { videoWidth, videoHeight } = this.painterEngine.video
    
    if (points.length > 0) {
      const firstPoint = points[0]
      shape.moveTo(
        (firstPoint.x / videoWidth) * 2 - 1,
        -(firstPoint.y / videoHeight) * 2 + 1
      )
      
      for (let i = 1; i < points.length; i++) {
        const point = points[i]
        shape.lineTo(
          (point.x / videoWidth) * 2 - 1,
          -(point.y / videoHeight) * 2 + 1
        )
      }
      
      shape.closePath()
    }
    
    return shape
  }

  erase() {
    this.leftBlushMesh.visible = false
    this.rightBlushMesh.visible = false
  }
}

// // Mustache implementation
// class MediaPipeMustacheLocator extends MediaPipeTaskVisionLocator {
//   constructor(mediaPipeLocatorEngine) {
//     super(mediaPipeLocatorEngine)
//     const contours = faceLandmarksDetection.util.getKeypointIndexByContour(
//       faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh
//     )
//     this.NOSE_BOTTOM_LINE = [432, 410, 322, 391, 393, 164, 167, 165, 92, 186, 57]
//     this.LIPS_TOP_OUTER = contours.lips.slice(11, 20)
//   }

//   locateForTool() {
//     const locations = this.getLocations()
//     if (!locations) {
//       throw new Error('No locations found')
//     }

//     const upperLip = this.LIPS_TOP_OUTER.map((idx) => {
//       const kp = locations[0].keypoints[idx]
//       return { x: kp.x, y: kp.y }
//     })
//     const noseBottomLine = this.NOSE_BOTTOM_LINE.map((idx) => {
//       const kp = locations[0].keypoints[idx]
//       return { x: kp.x, y: kp.y }
//     })

//     return { upperLip, noseBottomLine }
//   }
// }

// class ThreeMustachePainter extends ThreePainter {
//   constructor(threePainterEngine) {
//     super(threePainterEngine)
//     this.thickness = 1.0
//     this.opacity = 0.8

//     this.mustacheMaterial = new THREE.MeshBasicMaterial({
//       color: "#4a2f1b",
//       transparent: true,
//       opacity: this.opacity,
//       depthTest: false,
//       depthWrite: false,
//       side: THREE.DoubleSide,
//     })

//     this.mustacheMesh = new THREE.Mesh(new THREE.BufferGeometry(), this.mustacheMaterial)
//     this.mustacheMesh.frustumCulled = false

//     this.painterEngine.scene.add(this.mustacheMesh)
//   }

//   setColor(hexColor) {
//     this.mustacheMaterial.color = new THREE.Color(hexColor)
//   }

//   paint(stylingLocations) {
//     const { upperLip, noseBottomLine } = stylingLocations

//     if (upperLip && upperLip.length >= 5 && noseBottomLine && noseBottomLine.length > 0) {
//       const points = []
//       points.push(...upperLip)

//       const midY = (upperLip[Math.floor(upperLip.length / 2)].y + noseBottomLine[Math.floor(noseBottomLine.length / 2)].y) / 2
//       const thicknessOffset = (midY - upperLip[Math.floor(upperLip.length / 2)].y) * this.thickness

//       const leftControlPoint = {
//         x: (upperLip[0].x + noseBottomLine[0].x) / 2,
//         y: (upperLip[0].y + noseBottomLine[0].y) / 2 + thicknessOffset
//       }
//       const rightControlPoint = {
//         x: (upperLip[upperLip.length - 1].x + noseBottomLine[noseBottomLine.length - 1].x) / 2,
//         y: (upperLip[upperLip.length - 1].y + noseBottomLine[noseBottomLine.length - 1].y) / 2 + thicknessOffset
//       }

//       points.push(rightControlPoint)
//       points.push(...noseBottomLine.slice().reverse())
//       points.push(leftControlPoint)

//       const shape = this.buildFillShape(points)
//       if (this.mustacheMesh.geometry) this.mustacheMesh.geometry.dispose()
//       this.mustacheMesh.geometry = new THREE.ShapeGeometry(shape)
//       this.mustacheMesh.visible = true
//     } else {
//       this.mustacheMesh.visible = false
//     }
//   }

//   buildFillShape(points) {
//     const shape = new THREE.Shape()
//     const { videoWidth, videoHeight } = this.painterEngine.video
    
//     if (points.length > 0) {
//       const firstPoint = points[0]
//       shape.moveTo(
//         (firstPoint.x / videoWidth) * 2 - 1,
//         -(firstPoint.y / videoHeight) * 2 + 1
//       )
      
//       for (let i = 1; i < points.length; i++) {
//         const point = points[i]
//         shape.lineTo(
//           (point.x / videoWidth) * 2 - 1,
//           -(point.y / videoHeight) * 2 + 1
//         )
//       }
      
//       shape.closePath()
//     }
    
//     return shape
//   }

//   erase() {
//     this.mustacheMesh.visible = false
//   }
// }

function App() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [stylist, setStylist] = useState(null)
  const [lip, setLip] = useState(null)
  const [eye, setEye] = useState(null)
  const [blush, setBlush] = useState(null)
  const [mustache, setMustache] = useState(null)
  const [cameraOn, setCameraOn] = useState(false)
  const [lipColor, setLipColor] = useState('#ff3366')
  const [eyelinerColor, setEyelinerColor] = useState('#000000')
  const [blushColor, setBlushColor] = useState('#ff6699')
  const [mustacheColor, setMustacheColor] = useState('#4a2f1b')

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' },
      audio: false
    })
    videoRef.current.srcObject = stream
    await videoRef.current.play()

    const locatorEngine = new MediaPipeFaceMeshLocatorEngine(videoRef.current)
    const painterEngine = new ThreePainterEngine(videoRef.current, canvasRef.current)

    const newStylist = new Stylist(locatorEngine, painterEngine)
    await newStylist.initialize()

    const newLip = newStylist.addPredefinedStylingTool(PredefinedStylingTools.LIPSTICK)
    const newEye = newStylist.addPredefinedStylingTool(PredefinedStylingTools.EYELINER)
    const newBlush = newStylist.addCustomStylingTool(
      'blush',
      new MediaPipeBlushLocator(locatorEngine),
      new ThreeBlushPainter(painterEngine)
    )
    // const newMustache = newStylist.addCustomStylingTool(
    //   'mustache',
    //   new MediaPipeMustacheLocator(locatorEngine),
    //   new ThreeMustachePainter(painterEngine)
    // )

    setStylist(newStylist)
    setLip(newLip)
    setEye(newEye)
    setBlush(newBlush)
    // setMustache(newMustache)
    setCameraOn(true)
  }

  const stopCamera = () => {
    if (stylist) {
      stylist.stop()
    }
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    setCameraOn(false)
  }

  const toggleLipstick = () => {
    if (!lip) return
    if (lip.active) {
      lip.stop()
    } else {
      lip.start()
    }
  }

  const toggleEyeliner = () => {
    if (!eye) return
    if (eye.active) {
      eye.stop()
    } else {
      eye.start()
    }
  }

  const toggleBlush = () => {
    if (!blush) return
    if (blush.active) {
      blush.stop()
    } else {
      blush.start()
    }
  }

  // const toggleMustache = () => {
  //   if (!mustache) return
  //   if (mustache.active) {
  //     mustache.stop()
  //   } else {
  //     mustache.start()
  //   }
  // }

  useEffect(() => {
    if (lip) {
      lip.stylingPainter.setColor(lipColor)
    }
  }, [lip, lipColor])

  useEffect(() => {
    if (eye) {
      eye.stylingPainter.setColor(eyelinerColor)
    }
  }, [eye, eyelinerColor])

  useEffect(() => {
    if (blush) {
      blush.stylingPainter.setColor(blushColor)
    }
  }, [blush, blushColor])

  // useEffect(() => {
  //   if (mustache) {
  //     mustache.stylingPainter.setColor(mustacheColor)
  //   }
  // }, [mustache, mustacheColor])

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="col" style={{ gap: '16px' }}>
      <div className="row">
        <button onClick={() => cameraOn ? stopCamera() : startCamera()}>
          {cameraOn ? 'Stop Camera' : 'Start Camera'}
        </button>
      </div>
      <div className="row">
        <div className="row">
          <button onClick={toggleLipstick}>
            {lip?.active ? 'Remove Lipstick' : 'Apply Lipstick'}
          </button>
          <input
            type="color"
            value={lipColor}
            onChange={(e) => setLipColor(e.target.value)}
          />
        </div>
        <div className="row">
          <button onClick={toggleEyeliner}>
            {eye?.active ? 'Remove Eyeliner' : 'Apply Eyeliner'}
          </button>
          <input
            type="color"
            value={eyelinerColor}
            onChange={(e) => setEyelinerColor(e.target.value)}
          />
        </div>
        <div className="row">
          <button onClick={toggleBlush}>
            {blush?.active ? 'Remove Blush' : 'Apply Blush'}
          </button>
          <input
            type="color"
            value={blushColor}
            onChange={(e) => setBlushColor(e.target.value)}
          />
        </div>
        {/* <div className="row">
          <button onClick={toggleMustache}>
            {mustache?.active ? 'Remove Mustache' : 'Apply Mustache'}
          </button>
          <input
            type="color"
            value={mustacheColor}
            onChange={(e) => setMustacheColor(e.target.value)}
          />
        </div> */}
      </div>
      <div className="stage">
        <video ref={videoRef} playsInline muted />
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}

export default App