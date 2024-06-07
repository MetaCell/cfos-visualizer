import nibabel as nib
import numpy as np
from mpl_toolkits.mplot3d.art3d import Poly3DCollection
import matplotlib.pyplot as plt
from scipy import ndimage
from skimage import morphology, filters

import os
import cv2

def process_nifti_file(nifti_file_location, target_file_location):
    # Load the NIfTI file
    img = nib.load(nifti_file_location)
    # Get the data as float32 to preserve the original data type
    data = img.get_fdata(dtype=np.float32)

    def transform_slice(data_slice, sobel=True):
        # Optionally apply a slight Gaussian blur to smooth the image before edge detection
        data_slice_smoothed = data_slice #ndimage.gaussian_filter(data_slice, sigma=1)
        
        if sobel:
            # Apply Sobel filter to find edges on the smoothed image
            edge_sobel_x = ndimage.sobel(data_slice_smoothed, axis=0)
            edge_sobel_y = ndimage.sobel(data_slice_smoothed, axis=1)
            # Combine the two edges to get the final edge magnitude
            edges = np.hypot(edge_sobel_x, edge_sobel_y)
        else:
            # Placeholder for alternative edge detection
            edges = data_slice_smoothed  # This line is just a placeholder

        # Normalize edge magnitudes to range 0-1 for consistent thresholding
        #edges_normalized = (edges - np.min(edges)) / (np.max(edges) - np.min(edges))
        
        # Apply a dynamic threshold to keep stronger edges
        #threshold = np.mean(edges_normalized) + np.std(edges_normalized)  # Adjust this threshold as needed
        #edges_thresholded = np.where(edges_normalized > threshold, edges_normalized, 0)

        return edges.astype(np.float32)
    
    transformed_slices = []

    for slice_idx in range(data.shape[-1]):
        slice_data = data[:, :, slice_idx]
        # Apply edge detection to the slice
        edge_slice = transform_slice(slice_data, True)
        # Append the transformed slice to the list
        transformed_slices.append(edge_slice)

    # Stack the transformed slices back into a 3D array
    transformed_data = np.stack(transformed_slices, axis=-1)
    transformed_data_1bit = np.where(transformed_data > 0, 1, 0)

    # Apply Gaussian blur for anti-aliasing
    transformed_data_aa = ndimage.gaussian_filter(transformed_data_1bit.astype(np.float32), sigma=1)

    # Optional: Convert back to 1-bit by re-thresholding if a strictly binary image is desired
    # This step might not be necessary if you're satisfied with the smoother grayscale result
    # threshold_value = 0.5  # Typical threshold for midpoint after blurring
    # transformed_data_aa = np.where(transformed_data_aa > threshold_value, 1, 0)

    # Ensure data is back in an appropriate format for NIfTI
    transformed_data_final = transformed_data_aa.astype(np.float32)
    transformed_img = nib.Nifti1Image(transformed_data_final, img.affine, img.header)
    nib.save(transformed_img, target_file_location)

    print(f"Transformed slices with edge detection saved to {target_file_location}")
