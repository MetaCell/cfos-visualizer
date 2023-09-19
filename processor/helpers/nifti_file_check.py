import nibabel as nib
import numpy as np
import matplotlib.pyplot as plt
import os

# Define the NIfTI file name
nifti_file_name = 'output_transformed.nii.gz'

# Get the current directory
data_directory = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data')

# Define the full path to the NIfTI file
nifti_file_path = os.path.join(current_directory, nifti_file_name)

# Load the NIfTI file
nifti_data = nib.load(nifti_file_path)

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