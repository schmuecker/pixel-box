const rpio = require("rpio")
const WS2801 = require("ws2801-connect")
const config = require('../../config');

const setColor = (row, column, color) => {
    // gerade: (leds - (ri+1)) * (ci + 1)
    // Ungerade Reihen:
    // (rows - (ri+1)) * 10 + ci
 
    let ledIndex;
 
    if (row % 2 === 0) {
       // even row
       ledIndex = (config.leds.gridHeight * config.leds.gridWidth) - (row * config.leds.gridWidth) - (column + 1);
    }
    if (row % 2 === 1) {
       // odd row
       ledIndex = (config.leds.gridHeight - (row+1)) * config.leds.gridWidth + column;
    }
    const colorArray = [color.r, color.g, color.b];
    console.log('row', row)
    console.log('column', column)
    console.log('index', ledIndex)
    console.log(colorArray);
    leds.setLight(ledIndex, '#FF0000').show();
    rpio.sleep(0.05)
 }

// initiate SPI and begin communication
rpio.spiBegin()
// max. 25 MHz
rpio.spiSetClockDivider(128)
rpio.spiSetDataMode(0)

// the led stripe has 32 lights; supply callback as lambda
var leds = new WS2801({
   count: 50, 
   spiWrite: (data) => { 
                           let buf = Buffer.from(data)
                           rpio.spiWrite(buf, buf.length)
                        }
})

// first make all lights black
leds.clear().show()
// rpio.sleep(1) // wait a second

// for(let i=0; i<50; i++) {
// 	leds.setLight(i, "#FF0000").show()
// 	rpio.sleep(0.1)
// }
// rpio.sleep(1)
// leds.clear().show()
// rpio.sleep(1)
// // next fill red
leds.fill("#FA8072").show()
rpio.sleep(1)
// // fill green
// leds.fill(0, 255, 0).show()
// rpio.sleep(1)
// // fill blue
// leds.fill([0x00, 0x00, 0xff]).show()
// rpio.sleep(1)
// // and black again
// leds.clear().show()
// leds.fill("#000000").show()

// release SPI
rpio.spiEnd()

module.exports = {
    setColor
}