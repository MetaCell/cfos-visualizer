const express = require('express');
const path = require('path');

const app = express();
const port = 3000; // You can change this to any port you prefer

const fs = require('fs');
const nifti = require('nifti-reader-js');
const { createCanvas } = require('canvas');

function readFileAsArrayBuffer(filePath) {
  try {
    // Read the file synchronously to get a Buffer
    const buffer = fs.readFileSync(filePath);

    // Convert the Buffer to an ArrayBuffer
    const arrayBuffer = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength
    );

    return arrayBuffer;
  } catch (err) {
    console.error('Error reading the file:', err);
    return null;
  }
}
// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Define a route to serve the index.html file
app.get('/process', async (req, res) => {
  const file = 'glm_ANOVA_Psi_cFos_rb4_z_vox_p_fstat1.nii.gz'
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});