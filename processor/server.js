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


function drawToCanvas(slice, niftiHeader, niftiImage) {
  // get nifti dimensions
  var cols = niftiHeader.dims[1];
  var rows = niftiHeader.dims[2];

  const canvas = createCanvas(cols, rows);

  // set canvas dimensions to nifti slice dimensions
  canvas.width = cols;
  canvas.height = rows;

  // make canvas image data
  var ctx = canvas.getContext("2d");
  var canvasImageData = ctx.createImageData(canvas.width, canvas.height);

  // convert raw data to typed array based on nifti datatype
  var typedData;

  if (niftiHeader.datatypeCode === nifti.NIFTI1.TYPE_UINT8) {
      typedData = new Uint8Array(niftiImage);
  } else if (niftiHeader.datatypeCode === nifti.NIFTI1.TYPE_INT16) {
      typedData = new Int16Array(niftiImage);
  } else if (niftiHeader.datatypeCode === nifti.NIFTI1.TYPE_INT32) {
      typedData = new Int32Array(niftiImage);
  } else if (niftiHeader.datatypeCode === nifti.NIFTI1.TYPE_FLOAT32) {
      typedData = new Float32Array(niftiImage);
  } else if (niftiHeader.datatypeCode === nifti.NIFTI1.TYPE_FLOAT64) {
      typedData = new Float64Array(niftiImage);
  } else if (niftiHeader.datatypeCode === nifti.NIFTI1.TYPE_INT8) {
      typedData = new Int8Array(niftiImage);
  } else if (niftiHeader.datatypeCode === nifti.NIFTI1.TYPE_UINT16) {
      typedData = new Uint16Array(niftiImage);
  } else if (niftiHeader.datatypeCode === nifti.NIFTI1.TYPE_UINT32) {
      typedData = new Uint32Array(niftiImage);
  } else {
      return;
  }

  // offset to specified slice
  var sliceSize = cols * rows;
  var sliceOffset = sliceSize * slice;

  // draw pixels
  for (var row = 0; row < rows; row++) {
      var rowOffset = row * cols;

      for (var col = 0; col < cols; col++) {
          var offset = sliceOffset + rowOffset + col;
          var value = typedData[offset];

          /* 
             Assumes data is 8-bit, otherwise you would need to first convert 
             to 0-255 range based on datatype range, data range (iterate through
             data to find), or display range (cal_min/max).
             
             Other things to take into consideration:
               - data scale: scl_slope and scl_inter, apply to raw value before 
                 applying display range
               - orientation: displays in raw orientation, see nifti orientation 
                 info for how to orient data
               - assumes voxel shape (pixDims) is isometric, if not, you'll need 
                 to apply transform to the canvas
               - byte order: see littleEndian flag
          */
          canvasImageData.data[(rowOffset + col) * 4] = value & 0xFF;
          canvasImageData.data[(rowOffset + col) * 4 + 1] = value & 0xFF;
          canvasImageData.data[(rowOffset + col) * 4 + 2] = value & 0xFF;
          canvasImageData.data[(rowOffset + col) * 4 + 3] = 0xFF;
      }
  }

  ctx.putImageData(canvasImageData, 0, 0);
  
  return canvas ;
}

async function processWireFrame(niftiFileUrl) {
  try {
    const filePath = path.join(__dirname, 'public', niftiFileUrl);

    // Load the NIfTI file
    let data = readFileAsArrayBuffer(filePath);

    var niftiHeader, niftiImage;

    // parse nifti
    if (nifti.isCompressed(data)) {
        data = nifti.decompress(data);
    }

    if (nifti.isNIFTI(data)) {
        niftiHeader = nifti.readHeader(data);
        niftiImage = nifti.readImage(niftiHeader, data);
    }

    const slices = niftiHeader.dims[3];

    const canvas = drawToCanvas(parseInt(slices/2), niftiHeader, niftiImage);

  } catch (error) {
    console.error('An error occurred:', error);
  }
}
// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Define a route to serve the index.html file
app.get('/process', async (req, res) => {
  const file = 'glm_ANOVA_Psi_cFos_rb4_z_vox_p_fstat1.nii.gz'
  await processWireFrame(file);
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});