const Jimp = require('jimp');
const fs = require('fs');

// path to the original image file
const originalFilePath = './master-image.png';

// create output directory if it does not exist
const outputDir = './output';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// number of variations to generate
const numVariations = 10000;

// loop through and generate variations
for (let i = 1; i <= numVariations; i++) {
  // load original image
  Jimp.read(originalFilePath, (err, image) => {
    if (err) throw err;

    // randomly adjust hue and saturation
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 100);
    image.color([{ apply: 'hue', params: [hue] }, { apply: 'saturate', params: [saturation] }]);

    // save variation to output directory
    const outputFilePath = `${outputDir}/variation_${i}.png`;
    image.write(outputFilePath);
  });
}
