const { GifUtil } = require('gifwrap');

const getColorArrayFromGif = async (gifPath) => {
    const frames = [];
    const gif = await GifUtil.read(path.join(__dirname, 'scenes', '3frames.gif'));
    gif.frames.forEach(gifFrame => {

        const pixelColors = JSON.parse(JSON.stringify(gifFrame.bitmap.data)).data;
        const colorArray = []
        for (let i = 0; i < pixelColors.length; i += 4) {
            colorArray.push({
                r: pixelColors[i],
                g: pixelColors[i + 1],
                b: pixelColors[i + 2],
                a: pixelColors[i + 3]
            })
        }

        const frameWidth = gifFrame.bitmap.width;
        const frameHeight = gifFrame.bitmap.height;

        const grid = [];

        // Create grid with image size
        for (let i = 0; i < frameHeight; i++) {
            const row = [];
            for (let j = 0; j < frameWidth; j++) {
                row.push(undefined);
            }
            grid.push(row);
        }

        // Set colors from image
        colorArray.forEach((colorValue, index) => {
            const row = Math.floor(index / frameWidth);
            const column = index % frameWidth;
            grid[row][column] = colorValue;
        })

        frames.push({width: frameWidth, height: frameHeight, grid});
    })
    return frames;
}

module.exports = {
    getColorArrayFromGif
}