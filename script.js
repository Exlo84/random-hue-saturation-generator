const sharp = require('sharp');
const fs = require('fs').promises;

// path to the original image file
const originalFilePath = './master-image.png';

// create output directory if it does not exist
const outputDir = './output';
fs.mkdir(outputDir, { recursive: true });

// create JSON directory within output directory if it does not exist
const jsonDir = `${outputDir}/JSON`;
fs.mkdir(jsonDir, { recursive: true });

// number of variations to generate
const numVariations = 10000;

(async () => {
  try {
    // load original image
    const image = await sharp(originalFilePath);

    // create copies of original image
    const images = Array(numVariations).fill().map(() => image.clone());

    // apply hue and saturation adjustments to each copy in parallel
    const colorObjs = await Promise.all(images.map(async (img, i) => {
      const hue = Math.floor(Math.random() * 360);
      const saturation = Math.floor(Math.random() * 100);
      await img.modulate({ hue, saturation });
      return {
        hue,
        saturation,
        outputFilePath: `${outputDir}/variation_${i + 1}.png`,
        jsonFilePath: `${jsonDir}/variation_${i + 1}.json`
      };
    }));

    // save all variations and JSON files to disk at once
    const writePromises = colorObjs.map(({ outputFilePath, jsonFilePath }, i) => {
      const img = images[i];
      const writeImgPromise = img.toFile(outputFilePath);
      const writeJsonPromise = fs.writeFile(jsonFilePath, JSON.stringify(colorObjs[i]));
      return Promise.all([writeImgPromise, writeJsonPromise]);
    });

    await Promise.all(writePromises);
    console.log('All variations saved successfully!');
  } catch (err) {
    console.error('Error generating variations:', err);
  }
})();
