const fs = require('fs');
const path = require('path');
const getPixels = require('get-pixels');
const jimp = require('jimp');
const express = require('express')();
const config = require('./config');
const leds = require('./lib/hardware/leds');
const gif = require('./lib/parser/gif');
const telegram = require('./lib/communication/telegram');

// telegram.start();

const scenes = [
   {
      name: 'kaminfeuer',
      script: path.join(__dirname, 'scenes', 'kaminfeuer.js')
   }
]

console.log('Starting server...')
express.listen(config.server.port, () => {
   console.log(`Server started on port ${config.server.port}.`);
});

scenes.forEach(scene => {
   express.get(`/scene/${scene.name}`, (req, res) => {
      res.send(scene.script)
   });
})

express.get('/test', async (req, res) => {
   leds.startLEDControl()
   const gifPath = path.join(__dirname, 'scenes', '3frames.gif');
   const gifFrames = await gif.getColorArrayFromGif(gifPath);
   const resolutionFactorWidth = Math.floor(gifFrames[0].width / config.leds.gridWidth);
   const resolutionFactorHeight = Math.floor(gifFrames[0].height / config.leds.gridHeight);

   // Set LED colors
   gifFrames.forEach((gifFrame, frameIndex) => {
      setTimeout(() => {
         
         for (let j = 0; j < config.leds.gridHeight; j++) {
            const rowIndex = j * resolutionFactorHeight;
            for (let i = 0; i < config.leds.gridWidth; i++) {
               const columnIndex = i * resolutionFactorWidth;
               if (process.env.PI === "true") {
                  leds.setColor(j, i, gifFrame.grid[rowIndex][columnIndex]);
               }
            }
         }
      }, frameIndex * 1000);
   });
   setTimeout(() => {
      leds.finishLEDControl();
   }, 2000);
   res.send('OK');
});


// GifUtil.read(path.join(__dirname, 'scenes', '3frames.gif')).then(gif => {
//    gif.frames.forEach(gifFrame => {

//       const pixelColors = JSON.parse(JSON.stringify(gifFrame.bitmap.data)).data;
//       const colorArray = []
//       for (let i = 0; i < pixelColors.length; i += 4) {
//          colorArray.push({
//             r: pixelColors[i],
//             g: pixelColors[i + 1],
//             b: pixelColors[i + 2],
//             a: pixelColors[i + 3]
//          })
//       }

//       const frameWidth = gifFrame.bitmap.width;
//       const frameHeight = gifFrame.bitmap.height;

//       const grid = [];

//       // Create grid with image size
//       for (let i = 0; i < frameHeight; i++) {
//          const row = [];
//          for (let j = 0; j < frameWidth; j++) {
//             row.push(undefined);
//          }
//          grid.push(row);
//       }

//       // Set colors from image
//       colorArray.forEach((colorValue, index) => {
//          const row = Math.floor(index / frameWidth);
//          const column = index % frameWidth;
//          grid[row][column] = colorValue;
//       })

//       const resolutionFactorWidth = Math.floor(frameWidth / config.leds.gridWidth);
//       const resolutionFactorHeight = Math.floor(frameHeight / config.leds.gridHeight);

//       // Set LED colors
//       for (let j = 0; j < config.leds.gridHeight; j++) {
//          const rowIndex = j * resolutionFactorHeight;
//          for (let i = 0; i < config.leds.gridWidth; i++) {
//             const columnIndex = i * resolutionFactorWidth;
//             leds.setColor(rowIndex, columnIndex, grid[rowIndex][columnIndex]);
//          }
//       }

//    })
// });
