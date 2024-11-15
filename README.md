<p align="center">
  <!-- <img src="assets/readme_banner.png"/> -->
</p>

# Installation and Usage

This repository is a work-in-progress p5.js project used for creating grid-based path designs in your web browser. The current setup is for curved segments using arcs and circles, but can be adapted to other segment shapes. Currently, each segment is drawn in relation to the previous segment orientation using vectors derived by start and end points. 

On the left of the page there are control buttons to start new paths, flip the orientation of the current path, and set the width/number of segment offsets. The intent is to add additional controls for more options.

To install, simply download the code files into a working directory and initiate using a localhost server (in vscode, download the Live Server extension and press 'go live' on the left side of the status bar). It is reccomended to download snippet extensions for javascript, p5/js, and CSS/HTML. 

The project uses p5.js-svg as a sketch renderer. This is an optional way to work with the svg format in order to export your drawing into an svg editor, or to plot using a cnc or pen plotter. Currently this has not been verified to work and is to be used at your own discretion. See (nkymut's fork)[https://github.com/zenozeng/p5.js-svg/pull/260] of zenozeng's p5.js repo that is updated to support p5.js 1.7.0+ if you plan to use the SVG renderer with a version of p5.js later than v1.6. This repo uses v1.9 for its beginClip() and endClip() functions and has not been fully tested, so your milage will vary.

```bash
.
├── index.html
├── jsconfig.json
├── node_modules
├── package.json
├── sketch.js
└── style.css
```

# Visual Studio Code Workflow

Included is a `.vscode/extensions.json` file, which recommends a workspace inside Visual Studio Code with the following extensions:

* [LiveServer](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
* [p5.js snippets](https://marketplace.visualstudio.com/items?itemName=acidic9.p5js-snippets)
* [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
* [htmlhint](https://marketplace.visualstudio.com/items?itemName=mkaufman.HTMLHint)

To view your sketch, start the Live Server on VS Code. It defaults to [http://127.0.0.1:5500/](http://127.0.0.1:5500/ "http://127.0.0.1:5500/"). It supportes **live reload**, so you can edit the sketch and see the changes in near realtime, like the p5 online editor.

## Intellisense

Intellisense is provided via p5.js TypeScript definition files.

Solution found on issue [#1339](https://github.com/processing/p5.js/issues/1339 "#1339").

Instead of downloading the TypeScript definitions, we can now use this NPM package: [@types/p5](https://www.npmjs.com/package/@types/p5).

# ESLint rules

There are some disabled rules on `.eslintrc.json`, but they're entirely personal choices.
