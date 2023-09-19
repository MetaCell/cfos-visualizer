from google.cloud import storage
from tqdm import tqdm

import os

def upload_local_folder_to_bucket(bucket_name, local_folder_path, remote_folder_path):
    # Initialize a client using Application Default Credentials
    client = storage.Client()

    # Get a reference to the bucket
    bucket = client.bucket(bucket_name)

    # Iterate through the local folder and upload files
    for root, dirs, files in os.walk(local_folder_path):
        for file in files:
            local_file_path = os.path.join(root, file)
            remote_file_path = os.path.join(remote_folder_path, os.path.relpath(local_file_path, local_folder_path))

            blob = bucket.blob(remote_file_path)

            # Upload the file in chunks with a progress bar
            with tqdm(total=os.path.getsize(local_file_path), unit='B', unit_scale=True, unit_divisor=1024) as pbar:
                def progress_callback(bytes_uploaded):
                    pbar.update(bytes_uploaded - pbar.n)

                blob.resumable_upload_from_filename(local_file_path, callback=progress_callback)
                
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

if __name__ == "__main__":
    bucket_name = "your_bucket_name"
    local_folder_path = "/path/to/local/folder"
    remote_folder_path = "path/on/bucket"

    upload_local_folder_to_bucket(bucket_name, local_folder_path, remote_folder_path)
    #handle wireframe conversion
    files = list_bucket_files(bucket_name)

    #store to file so the client can access it
    print("Folder structure replicated to the bucket.")