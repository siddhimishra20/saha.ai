const Jimp = require("jimp");

async function removeBackground() {
  const image = await Jimp.read("/Users/aarishsyed/Downloads/Sahaailogo_whitebg.png");
  
  // Tolerance for what is considered "white"
  const tolerance = 230;

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    
    // If pixel is mostly white, make it transparent
    if (r > tolerance && g > tolerance && b > tolerance) {
      this.bitmap.data[idx + 3] = 0;
    } else {
      // Lighten the purple slightly so it pops on a dark background
      this.bitmap.data[idx + 0] = Math.min(255, r + 50);
      this.bitmap.data[idx + 1] = Math.min(255, g + 50);
      this.bitmap.data[idx + 2] = Math.min(255, b + 50);
    }
  });

  await image.writeAsync("/Users/aarishsyed/Downloads/saha-ai/public/logo.png");
  console.log("Image processed successfully!");
}

removeBackground().catch(console.error);
