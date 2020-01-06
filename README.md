# Dessin

## Background and Overview 

Dessin is a showcase of visual proofs for infinite series (sums of infinitely many numbers, like 1/2 + 1/4 + 1/8 + ...). These proofs rely on recursive arguments, which can be represented with nested shapes, like so: ![Example figures](https://whymystudentsdidnt.files.wordpress.com/2013/08/2vproofs_sum1_4thtontheq1_3rd2.png)

To make things more visually interesting/interactive, the display will support infinitely zooming into the self-similar shape to emphasize the recursive nature.

## Functionality and MVPs 
Users will be able to 
* Navigate between different showcases 
* Pause/Play automatic zooming of the current showcase
* Manually zoom in/out with scrolling
* Adjust parameters of parameterized equations (bonus)

## Wireframes 
https://wireframe.cc/8bMzjv

## Architecture and Technology 
The app will use the following technologies:
* HTML canvas to display the main showcase
* anime.js to simplify rendering and animation effects.

Possible scripts:
* `showcase.js` - handles the canvas view and UI control responses
* `proof.js` - class for a particular visual proof, as described by a shape with divisions into multiple regions, including the "recursive" region

## Implementation Timeline 
Part 1: Setup Node modules, and get webpack running with the entry file. Display a basic shape in canvas. Research proofs to showcase.

Part 2: Figure out encoding to store proofs. Get a single proof rendered with automatic scrolling.

Part 3: Implement user controls for zooming, as well as navigation between proofs. If time is available, refactor proofs for parameterized proofs, and add controls for it.