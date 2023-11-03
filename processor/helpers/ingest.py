from google.cloud import storage
from tqdm import tqdm

import os
import sys

def upload_file_to_bucket_root(bucket_name, local_file_path):
    # Initialize a client using Application Default Credentials
    client = storage.Client()

    # Get a reference to the bucket
    bucket = client.bucket(bucket_name)

    # Extract the base name of the file to use as the blob name
    blob_name = os.path.basename(local_file_path)
    blob = bucket.blob(blob_name)

    # Check if the file already exists in the bucket
    if blob.exists():
        print(f"File '{blob_name}' already exists in the bucket. Deleting.")
        blob.delete()

    # Get the file size for progress tracking
    file_size = os.path.getsize(local_file_path)
    
    # Create a callback function that will update the tqdm progress bar
    def upload_progress(chunk, total_size):
        pbar.update(chunk)

    with tqdm(total=file_size, unit='B', unit_scale=True, desc=blob_name, unit_divisor=1024) as pbar:
        # Upload the file in chunks with progress
        with open(local_file_path, 'rb') as file:
            try:
                blob.upload_from_file(file)
            except Exception as e:
                print(f"Failed to upload {local_file_path}: {e}", file=sys.stderr)
            finally:
                pbar.close()

def upload_local_folder_to_bucket(bucket_name, local_folder_path):
    # Initialize a client using Application Default Credentials
    client = storage.Client()

    # Get a reference to the bucket
    bucket = client.bucket(bucket_name)

    # Iterate through the local folder and upload files
    for root, dirs, files in os.walk(local_folder_path):
        for file in files:
            local_file_path = os.path.join(root, file)
            remote_file_path = os.path.join(os.path.relpath(local_file_path, local_folder_path))

            blob = bucket.blob(remote_file_path)

            # Check if the file already exists in the bucket
            if blob.exists():
                print(f"File '{remote_file_path}' already exists in the bucket. Deleting remote file.")
                blob.delete()  # Delete the remote file if it already exists


            # Get the file size for progress tracking
            file_size = os.path.getsize(local_file_path)

            with tqdm(total=file_size, unit='B', unit_scale=True, unit_divisor=1024) as pbar:
                # Upload the file in chunks
                with open(local_file_path, 'rb') as file:
                    blob.upload_from_file(file)
                    pbar.update(file_size)

                pbar.close()

def list_bucket_files(bucket_name, prefix=None):
  # Initialize a client using Application Default Credentials
  client = storage.Client()

  # Get a reference to the bucket
  bucket = client.bucket(bucket_name)

  # List the blobs (files) in the bucket with an optional prefix
  blobs = bucket.list_blobs(prefix=prefix)

  file_list = []
  for blob in blobs:
      file_list.append(blob.name)

  return file_list


def process_bucket_upload(bucket_name, local_folder_path):
    upload_local_folder_to_bucket(bucket_name, local_folder_path)
    #handle wireframe conversion
    files = list_bucket_files(bucket_name)
    print(f"Processed ${len(files)} files in bucket...")

    #store to file so the client can access it
    print("Folder structure replicated to the bucket.")