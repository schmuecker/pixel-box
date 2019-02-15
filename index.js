const rpio = require("rpio")
const WS2801 = require("ws2801-connect")

// initiate SPI and begin communication
rpio.spiBegin()
// max. 25 MHz
rpio.spiSetClockDivider(128)
rpio.spiSetDataMode(0)

// the led stripe has 32 lights; supply callback as lambda
const leds = new WS2801({
   count: 50, 
   spiWrite: (data) => { 
                           let buf = Buffer.from(data)
                           rpio.spiWrite(buf, buf.length)
                        }
})

// first make all lights black
leds.clear().show()
rpio.sleep(1) // wait a second
// next fill red
leds.fill("#FF0000").show()
rpio.sleep(1)
// fill green
leds.fill(0, 255, 0).show()
rpio.sleep(1)
// fill blue
leds.fill([0x00, 0x00, 0xff]).show()
rpio.sleep(1)
// and black again
leds.clear().show()

// release SPI
rpio.spiEnd()

