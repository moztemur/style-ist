# Style-ist

A powerful TypeScript library for applying real-time facial styling effects using TensorFlow.js for face detection and Three.js for rendering. Perfect for creating virtual makeup and facial styling applications.

## Features

- Real-time face detection and tracking
- Built-in styling tools:
  - Lipstick
  - Eyeliner
  - Custom tools support (e.g., blush, mustache)
- Customizable colors and styles
- Modular architecture with pluggable engines
- Browser-based, no server required
- Written in TypeScript with full type support


## Demo

Check out the [live demo](https://moztemur.github.io/style-ist) to see Style-ist in action!

## Installation

Using npm:
```bash
npm install style-ist
```

Using yarn:
```bash
yarn add style-ist
```

### Using CDN

You can also include Style-ist directly in your HTML file using a CDN:

```html
<!-- Add Style-ist -->
<script src="https://cdn.jsdelivr.net/npm/style-ist/dist/index.js"></script>
```

## Engines

There are two types of engines that are provided by Style-ist:
- Locators
- Painters

### Locators

The term locator refers to the component that locates the face features for the styling tool. There are two types of built-in locators that are provided by MediaPipe:
- [MediaPipe Tasks Vision](https://www.npmjs.com/package/@mediapipe/tasks-vision)
- [MediaPipe Face Mesh (Legacy)](https://www.npmjs.com/package/@mediapipe/face_mesh)

### Painters

The term painter refers to the component that paints the face features for the styling tool. There is one built-in painter:
- [Three.js](https://www.npmjs.com/package/three)

You need to initialize the locator and painter before you can use the styling tool.

```JavaScript
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');

let stylist = null;

// Initialize Style-ist
async function initializeStylist() {
    const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' }, 
        audio: false 
    });
    video.srcObject = stream;
    await video.play();

    // Create engines
    const locatorEngine = new Stylist.MediaPipeTaskVisionLocatorEngine(video);
    const painterEngine = new Stylist.ThreePainterEngine(video, canvas);

    // Initialize stylist
    stylist = new Stylist.Stylist(locatorEngine, painterEngine);
    await stylist.initialize();
}
```

In this example, we are using the MediaPipe TaskVision locator and Three.js painter.

## Quick Start

### Prerequisites

- If you will use Tasks Vision as locator engine, you need to add the following dependencies:

```html
<!-- MediaPipe TaskVision -->
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/dist/tasks-vision.js"></script>
```

or

```bash
npm install @mediapipe/tasks-vision
```

- If you will use Face Mesh (Legacy) as locator engine, you need to add the following dependencies:

```html
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl@4.22.0/dist/tf-backend-webgl.min.js"></script>
<!-- MediaPipe Face Mesh -->
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.min.js"></script>
<!-- Face Landmarks Detection -->
<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/face-landmarks-detection@1.0.6/dist/face-landmarks-detection.js"></script>
```


- For using Three.js as painter engine, you need to add the following dependencies:

```html
<script src="https://cdn.jsdelivr.net/npm/three"></script>
```

or

```bash
npm install three
```

### Using Pure JavaScript

```html
<!DOCTYPE html>
<html>
<head>
    <title>Style-ist Demo</title>
    <style>
        video, canvas { width: 100%; max-width: 720px; }
        canvas { position: absolute; top: 0; left: 0; }
    </style>
</head>
<body>
    <div>
        <button id="startCamera">Start Camera</button>
        <button id="lipstick">Apply Lipstick</button>
        <input type="color" id="lipColor" value="#FF0000"/>
    </div>
    <div style="position: relative;">
        <video id="video" playsinline muted></video>
        <canvas id="canvas"></canvas>
    </div>

    <!-- Add required dependencies -->
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision"></script>
    <script src="https://cdn.jsdelivr.net/npm/three"></script>
    <script src="https://cdn.jsdelivr.net/npm/style-ist/dist/index.js"></script>

    <script>
        // Get DOM elements
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const startBtn = document.getElementById('startCamera');
        const lipstickBtn = document.getElementById('lipstick');
        const lipColorInput = document.getElementById('lipColor');
        
        let stylist = null;
        let lipstick = null;
        
        // Initialize Style-ist
        async function initializeStylist() {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'user' }, 
                audio: false 
            });
            video.srcObject = stream;
            await video.play();

            // Create engines
            const locatorEngine = new Stylist.MediaPipeTaskVisionLocatorEngine(video);
            const painterEngine = new Stylist.ThreePainterEngine(video, canvas);

            // Initialize stylist
            stylist = new Stylist.Stylist(locatorEngine, painterEngine);
            await stylist.initialize();

            // Add lipstick tool
            lipstick = stylist.addPredefinedStylingTool(
                Stylist.PredefinedStylingTools.LIPSTICK
            );
        }

        // Event handlers
        startBtn.addEventListener('click', async () => {
            if (!stylist) {
                await initializeStylist();
                startBtn.textContent = 'Stop Camera';
            } else {
                stylist.stop();
                video.srcObject.getTracks().forEach(track => track.stop());
                video.srcObject = null;
                stylist = null;
                lipstick = null;
                startBtn.textContent = 'Start Camera';
            }
        });

        lipstickBtn.addEventListener('click', () => {
            if (!lipstick) return;
            if (lipstick.active) {
                lipstick.stop();
                lipstickBtn.textContent = 'Apply Lipstick';
            } else {
                lipstick.start();
                lipstickBtn.textContent = 'Remove Lipstick';
            }
        });

        lipColorInput.addEventListener('input', () => {
            if (lipstick) {
                lipstick.stylingPainter.setColor(lipColorInput.value);
            }
        });
    </script>
</body>
</html>
```

This example shows a simple implementation with lipstick effect. The library is exposed globally as `Stylist` when using the CDN version.

### Using TypeScript/ES Modules

```typescript
import { 
  Stylist,
  PredefinedStylingTools, 
  MediaPipeTaskVisionLocatorEngine, 
  ThreePainterEngine 
} from 'style-ist';

// HTML elements
const video = document.getElementById('video') as HTMLVideoElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;

// Initialize engines
const locatorEngine = new MediaPipeTaskVisionLocatorEngine(video);
const painterEngine = new ThreePainterEngine(video, canvas);

// Create stylist instance
const stylist = new Stylist(locatorEngine, painterEngine);
await stylist.initialize();

// Add predefined styling tools
const lipstick = stylist.addPredefinedStylingTool(PredefinedStylingTools.LIPSTICK);
const eyeliner = stylist.addPredefinedStylingTool(PredefinedStylingTools.EYELINER);

// Start/stop tools
lipstick.start();
eyeliner.start();

// Change colors
lipstick.stylingPainter.setColor('#FF0000');  // Red lipstick
eyeliner.stylingPainter.setColor('#000000');  // Black eyeliner

// Clean up
stylist.stop();
```

## Custom Styling Tools

You can create custom styling tools by implementing your own locators and painters:

```typescript
import { MediaPipeTaskVisionLocator, ThreePainter } from 'style-ist';

// Create custom blush tool
class BlushLocator extends MediaPipeTaskVisionLocator {
  // Implement face feature location logic
}

class BlushPainter extends ThreePainter {
  // Implement painting logic
}

// Add custom tool
const blush = stylist.addCustomStylingTool(
  'blush',
  new BlushLocator(locatorEngine),
  new BlushPainter(painterEngine)
);
```

## Examples

You can find various implementation examples in the `examples` directory

TBD

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## References

### MediaPipe Face Mesh

https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection
https://storage.googleapis.com/tfjs-models/demos/face-landmarks-detection/index.html?model=mediapipe_face_mesh

### MediaPipe Task Vision

https://www.npmjs.com/package/@mediapipe/tasks-vision
https://codepen.io/mediapipe-preview/pen/OJBVQJm
https://ai.google.dev/edge/api/mediapipe/js/tasks-vision