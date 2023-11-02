import nibabel as nib
import numpy as np
from mpl_toolkits.mplot3d.art3d import Poly3DCollection
import matplotlib.pyplot as plt
from scipy import ndimage

import os
import cv2

def process_nifti_file(nifti_file_location, target_file_location):
    # Load the NIfTI file
    img = nib.load(nifti_file_location)
    # Get the data as float32 to preserve the original data type
    data = img.get_fdata(dtype=np.float32)

    def transform_slice(data_slice):
        # Apply Sobel filter to find edges
        edge_sobel_x = ndimage.sobel(data_slice, axis=0)
        edge_sobel_y = ndimage.sobel(data_slice, axis=1)
        # Combine the two edges to get the final edge magnitude
        edges = np.hypot(edge_sobel_x, edge_sobel_y)

        return edges.astype(np.float32)  # Make sure to cast back to float32 if needed

    transformed_slices = []

    for slice_idx in range(data.shape[-1]):
        slice_data = data[:, :, slice_idx]
        # Apply edge detection to the slice
        edge_slice = transform_slice(slice_data)
        # Append the transformed slice to the list
        transformed_slices.append(edge_slice)

    # Stack the transformed slices back into a 3D array
    transformed_data = np.stack(transformed_slices, axis=-1)
    # Create a new NIfTI image with the transformed data
    transformed_img = nib.Nifti1Image(transformed_data, img.affine)
    # Save the transformed NIfTI image to a different file
    nib.save(transformed_img, target_file_location)

    print(f"Transformed slices with edge detection saved to {target_file_location}")
