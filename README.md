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

## Installation

### Using npm

```bash
npm install style-ist
```

### Using CDN

You can also include Style-ist directly in your HTML file using a CDN:

```html
<!-- Add required dependencies -->
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh"></script>
<script src="https://cdn.jsdelivr.net/npm/three"></script>

<!-- Add Style-ist -->
<script src="https://cdn.jsdelivr.net/npm/style-ist/dist/index.js"></script>
```

## Quick Start

### Using TypeScript/ES Modules

```typescript
import Stylist, { 
  PredefinedStylingTools, 
  TensorflowLocatorEngine, 
  ThreePainterEngine 
} from 'style-ist';

// HTML elements
const video = document.getElementById('video') as HTMLVideoElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;

// Initialize engines
const locatorEngine = new TensorflowLocatorEngine(video);
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
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh"></script>
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
            const locatorEngine = new styleist.TensorflowLocatorEngine(video);
            const painterEngine = new styleist.ThreePainterEngine(video, canvas);

            // Initialize stylist
            stylist = new styleist.Stylist(locatorEngine, painterEngine);
            await stylist.initialize();

            // Add lipstick tool
            lipstick = stylist.addPredefinedStylingTool(
                styleist.PredefinedStylingTools.LIPSTICK
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

This example shows a simple implementation with lipstick effect. The library is exposed globally as `styleist` when using the CDN version.

## Custom Styling Tools

You can create custom styling tools by implementing your own locators and painters:

```typescript
import { TensorflowLocator, ThreePainter } from 'style-ist';

// Create custom blush tool
class BlushLocator extends TensorflowLocator {
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

## API Reference

### Main Exports

- `Stylist`: Main class for managing styling tools
- `TensorflowLocatorEngine`: Face detection engine using TensorFlow.js
- `ThreePainterEngine`: Rendering engine using Three.js
- `PredefinedStylingTools`: Enum of built-in styling tools

### Stylist Class

```typescript
class Stylist {
  constructor(locatorEngine: LocatorEngine, painterEngine: PainterEngine);
  
  initialize(): Promise<void>;
  addPredefinedStylingTool(tool: PredefinedStylingTools): PredefinedStylingTool;
  addCustomStylingTool(name: string, locator: Locator, painter: Painter): StylingTool;
  stop(): void;
}
```

### Styling Tools

Each styling tool (predefined or custom) provides:

- `start()`: Activate the tool
- `stop()`: Deactivate the tool
- `stylingPainter.setColor(color: string)`: Change tool color

## Requirements

- Modern browser with WebGL support
- Camera access for real-time effects
- Dependencies:
  - TensorFlow.js
  - Three.js
  - MediaPipe Face Mesh

## Demo

Check out the [live demo](https://moztemur.github.io/style-ist) to see Style-ist in action!

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.