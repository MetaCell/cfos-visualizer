import nibabel as nib
import numpy as np
import matplotlib.pyplot as plt
import os
from wireframe import process_nifti_file

# Define the NIfTI file name
nifti_file_name = 'gubra_ano_combined_25um_boundary.nii.gz'

# Get the current directory
base_dir = os.path.dirname(os.path.abspath(__file__))

data_directory = os.path.join(base_dir, '..', 'data')
process_directory = os.path.join(base_dir, '..', 'process')

# Define the full path to the NIfTI file
nifti_file_path = os.path.join(data_directory, nifti_file_name)

wireframe_file_name  = nifti_file_name.replace(".nii.gz", "-wireframe.nii.gz")

wireframe_file_path = os.path.join(process_directory, wireframe_file_name)

process_nifti_file(nifti_file_path, wireframe_file_path)

# Load the NIfTI file
nifti_data = nib.load(wireframe_file_path)

# Specify the slice you want to display (e.g., slice 50 along the axial plane)
slice_number = 120

# Get the actual dimensions of the NIfTI image
width, height, depth = nifti_data.shape

# Get the data from the specified slice using the actual dimensions
if 0 <= slice_number < depth:
    slice_data = nifti_data.get_fdata()[..., slice_number]  # Use ellipsis to specify all dimensions
else:
    raise ValueError("Invalid slice number")

# Create a matplotlib figure and axis
fig, ax = plt.subplots()

# Display the slice
ax.imshow(slice_data, origin='lower')
ax.set_title(f"Slice {slice_number}")
ax.axis('off')  # Turn off axis labels and ticks

# Show the plot
plt.show()