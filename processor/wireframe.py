import nibabel as nib
import numpy as np
from mpl_toolkits.mplot3d.art3d import Poly3DCollection
import matplotlib.pyplot as plt
from skimage import measure
import os

nifti_file_name = 'gubra_ano_combined_25um_boundary.nii.gz'

# Get the current directory
data_directory = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data')

# Define the NIfTI file name (assuming it's in the current directory)
nifti_file = os.path.join(data_directory, nifti_file_name)
img = nib.load(nifti_file)
data = img.get_fdata()

# Determine the image orientation
orientation = nib.aff2axcodes(img.affine)

# Define transformations based on orientation
transformation = None

if orientation == ('R', 'A', 'S'):
    # Axial orientation (Right-to-Left, Anterior-to-Posterior, Superior-to-Inferior)
    transformation = lambda data: np.rot90(data, 2)  # Rotate 180 degrees
elif orientation == ('P', 'I', 'S'):
    # Coronal orientation (Posterior-to-Anterior, Inferior-to-Superior)
    transformation = lambda data: np.rot90(np.fliplr(data), 1)  # Rotate 90 degrees and flip horizontally
elif orientation == ('R', 'S', 'I'):
    # Sagittal orientation (Right-to-Left, Superior-to-Inferior)
    transformation = lambda data: np.rot90(data, 2)  # Rotate 180 degrees
else:
    print("Unknown orientation")

# Define a custom color transformation function to create a wireframe
def transform_slice(data_slice, transformation, wireframe):
  slice = data_slice
  
  if transformation is not None:
    # Apply the transformation if needed
    slice = transformation(data_slice[:, :, slice_number])

  if wireframe:
    # Find contours to identify edges
    contours = measure.find_contours(data_slice, 0.5)  # 0.5 threshold for binary values
    
    # Create a black canvas
    wireframe_slice = np.zeros_like(data_slice)
    
    # Draw the wireframe lines on the canvas
    for contour in contours:
        wireframe_slice[np.round(contour[:, 0]).astype(int), np.round(contour[:, 1]).astype(int)] = 1
    
    slice = wireframe_slice

  return slice

transformed_slices = []

# Transform each slice and store it in the list
for slice_idx in range(data.shape[-1]):
    slice_data = data[:, :, slice_idx]
    
    # Apply the custom color transformation to the slice
    colorized_slice = transform_slice(slice_data, transformation, True)
    
    # Append the transformed slice to the list
    transformed_slices.append(colorized_slice)

# Stack the transformed slices back into a 3D array
transformed_data = np.stack(transformed_slices, axis=-1)

# Create a new NIfTI image with the transformed data
transformed_img = nib.Nifti1Image(transformed_data, img.affine)


# Save the transformed NIfTI image to a different file
output_nifti_file = os.path.join(data_directory, 'output_transformed.nii.gz')
nib.save(transformed_img, output_nifti_file)

# Render a certain slice at the end (change slice_idx_to_render)
slice_idx_to_render = 120  # Change this to the slice index you want to render
if 0 <= slice_idx_to_render < transformed_data.shape[-1]:
    plt.figure()
    plt.imshow(transformed_data[:, :, slice_idx_to_render])  # Adjust the colormap as needed
    plt.title(f'Wireframe of Slice {slice_idx_to_render + 1}')
    plt.xlabel('X')
    plt.ylabel('Y')
    plt.grid(False)
    plt.show()
else:
    print("Invalid slice index for rendering.")

print(f"Transformed slices saved to {output_nifti_file}")
