import nibabel as nib
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.art3d import Poly3DCollection
from matplotlib.widgets import CheckButtons
from nibabel import Nifti1Image
import os

# Load the NIfTI file

nifti_file_name = 'glm_ANOVA_Psi_cFos_rb4_z_vox_p_fstat1.nii.gz'

# Get the current directory
current_directory = os.getcwd()

# Define the NIfTI file name (assuming it's in the current directory)
nifti_file = os.path.join(current_directory, nifti_file_name)
img = nib.load(nifti_file)
data = img.get_fdata()

# Visualize a slice from the NIfTI file
slice_idx_to_visualize = 120  # Change this to the slice index you want to visualize
slice_data = data[:, :, slice_idx_to_visualize]

plt.figure()
plt.imshow(slice_data, cmap='gray')
plt.title(f'Slice {slice_idx_to_visualize + 1} Visualization')
plt.colorbar()

# Convert each slice to wireframes
wireframe_slices = []

for slice_idx in range(data.shape[-1]):
    slice_data = data[:, :, slice_idx]
    
    # Create a meshgrid for the wireframe
    x, y = np.meshgrid(np.arange(slice_data.shape[0]), np.arange(slice_data.shape[1]))
    z = np.zeros_like(x)
    
    # Append the wireframe slice to the list
    wireframe_slices.append(z)

# Stack the wireframe slices back into a 3D array
wireframe_data = np.stack(wireframe_slices, axis=-1)

# Convert data to an appropriate data type (e.g., float32)
wireframe_data = wireframe_data.astype(np.float32)

# Create a new NIfTI image with the wireframe data
wireframe_img = Nifti1Image(wireframe_data, img.affine)

# Save the wireframe NIfTI image to a different file
output_nifti_file = 'output_wireframes.nii.gz'
nib.save(wireframe_img, output_nifti_file)

# Visualize a slice from the NIfTI file
slice_idx_to_visualize = 120  # Change this to the slice index you want to visualize
slice_data = wireframe_data[:, :, slice_idx_to_visualize]

plt.figure()
plt.imshow(slice_data, cmap='gray')
plt.title(f'Slice {slice_idx_to_visualize + 1} Visualization')
plt.colorbar()

print(f"Wireframes saved to {output_nifti_file}")