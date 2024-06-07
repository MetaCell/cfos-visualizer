import sys
import os
from pathlib import Path
import http.server
import socketserver
import threading
import time
from datetime import datetime  # Import the datetime module
import shutil

from dotenv import load_dotenv

from helpers.wireframe import process_nifti_file
from helpers.ingest import process_bucket_upload, upload_file_to_bucket_root

from selenium import webdriver
from selenium.webdriver.chrome.options import Options

load_dotenv()

bucket_name = os.environ.get("GCLOUD_PROJECT")

server_started_event = threading.Event()

driver = None
wireframe = True
headless = True
wipe_storage = True

web_directory = os.path.dirname(os.path.abspath(__file__))
download_dir = os.path.join(web_directory, "process")
data_dir = os.path.join(web_directory, "data")

timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")  # Generate timestamp
output_folder = os.path.normpath(os.path.join("output", timestamp))  # Create a new folder with the timestamp
output_directory = os.path.join(web_directory, output_folder)  # Full path to the output folder
os.makedirs(output_directory, exist_ok=True)
os.makedirs(download_dir, exist_ok=True)

sub_folders = ["Atlas", "ActivityMap"]
sub_folders_process_wireframe = ["Atlas"]

def wait_for_file(filename, directory_path, timeout_seconds=300):
    """
    Wait for a specific file to appear in a directory or until the timeout is reached.

    Args:
        filename (str): The name of the file to wait for.
        directory_path (str): The path to the directory to watch.
        timeout_seconds (int): The maximum number of seconds to wait.
    """
    deadline = time.time() + timeout_seconds  # Set the deadline based on current time and timeout

    while time.time() < deadline:  # Check if the current time is past the deadline
        if os.path.exists(os.path.join(directory_path, filename)):
            print(f"{filename} has appeared in {directory_path}.")
            return True
        print(f"Waiting for {filename} to appear in {directory_path}...")
        time.sleep(1)  # Wait for 1 second before checking again

    print(f"Timeout reached. {filename} did not appear in {directory_path} within {timeout_seconds} seconds.")
    return False  # Return False if the timeout is reached and the file did not appear

def start_http_server(directory, port):
    try:
        os.chdir(directory)
    except FileNotFoundError:
        print(f"Error: The directory '{directory}' does not exist.")
        return

    handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", port), handler) as httpd:
        print(f"Serving HTTP on port {port} from {directory}...")
        server_started_event.set()
        httpd.serve_forever()

def process(target_dir, file_name, process_wireframe):

    processed_file_names = []
    wireframe_file_name  = file_name.replace(".nii.gz", "W.nii.gz")

    if process_wireframe:
        target_file_path = os.path.join(target_dir, file_name)
        wireframe_file_path = os.path.join(target_dir, wireframe_file_name)
        process_nifti_file(target_file_path, wireframe_file_path)

    http_file_path = "http://localhost:8888/website/index.html?file="+file_name
    driver.get(http_file_path)

    processed_file_name = os.path.basename(file_name).replace("nii.gz", "msgpack")
    processed = wait_for_file(processed_file_name, download_dir) #we could do something with this flag at this point like attempting a retry
    processed_file_names.append(processed_file_name)

    if process_wireframe:
        http_file_path = "http://localhost:8888/website/index.html?file="+wireframe_file_name
        driver.get(http_file_path)

        processed_file_name = os.path.basename(wireframe_file_name).replace("nii.gz", "msgpack")
        processed = wait_for_file(processed_file_name, download_dir)
        processed_file_names.append(processed_file_name)

    print(f"Process completed for { file_name }")
    return processed_file_names


def remove_hiddenfiles(dir: Path):
    for file in dir.rglob("[.]*"):
        if file.is_dir():
            print(f"Removing hidden directory {file}")
            try:
                shutil.rmtree(file)
            except Exception as e:
                print(f"Could not remove {file}, skipping it (reasons: {e.args})")
        else:
            print(f"Removing hidden file {file}")
            file.unlink(missing_ok=True)


if __name__ == "__main__":

    port = 8888
    # Create a thread for the HTTP server
    http_server_thread = threading.Thread(target=start_http_server, args=(web_directory, port), daemon=True)
    http_server_thread.start()

    # wait for the server to start
    server_started_event.wait()

    options = Options()
    options.add_argument("--window-size=1920x1080")
    options.add_argument("--verbose")
    if headless:
        options.add_argument("--headless")

    options.add_experimental_option("prefs", {
        "download.default_directory": download_dir,
        "download.prompt_for_download": False,
        "download.directory_upgrade": True,
        "safebrowsing_for_trusted_sources_enabled": False,
        "safebrowsing.enabled": False
    })

    driver = webdriver.Chrome(options=options)

    # Remove hidden files from data_dir and output_directory
    remove_hiddenfiles(Path(data_dir))
    # remove_hiddenfiles(Path(output_directory))

    for sub_folder in sub_folders:
        source_sub_dir = os.path.normpath(os.path.join(data_dir, sub_folder))
        target_sub_dir = os.path.normpath(os.path.join(output_directory, sub_folder))
        os.makedirs(target_sub_dir, exist_ok=True)
        # Use os.listdir() to get a list of all files and directories in the current directory
        files = os.listdir(source_sub_dir)

        # Filter out only the files (excluding directories)
        files = [file for file in files if os.path.isfile(os.path.join(source_sub_dir, file))]

        # should_sub_folders_process_wireframe = sub_folder in sub_folders_process_wireframe
        should_sub_folders_process_wireframe = False

        # Print the list of files
        for file in files:
            print(f"Processing ${file}...")
            full_name = os.path.normpath(os.path.join(sub_folder, file))
            processed_file_names = process(data_dir, full_name, process_wireframe=should_sub_folders_process_wireframe)

            #copy file back to the target location
            source_original_file = os.path.join(source_sub_dir, file)
            target_original_file = os.path.join(target_sub_dir, file)

            shutil.copy(source_original_file, target_original_file)

            if should_sub_folders_process_wireframe:
                wireframe_file_name = file.replace(".nii.gz", "W.nii.gz")
                source_wireframe_file = os.path.join(source_sub_dir, wireframe_file_name)
                target_wireframe_file = os.path.join(target_sub_dir, wireframe_file_name)
                shutil.copy(source_wireframe_file, target_wireframe_file)
                os.remove(source_wireframe_file)

            #finally the message packed files
            for processed_file in processed_file_names:
                source_path = os.path.join(download_dir, processed_file)
                target_path = os.path.join(target_sub_dir, processed_file)
                os.rename(source_path, target_path)

    process_bucket_upload(bucket_name, output_directory)

    # Upload index.json file to the bucket root
    index_location = os.path.join(data_dir, "index.json")
    upload_file_to_bucket_root(bucket_name, index_location)

    # Upload metadata.json file to the bucket root
    metadata_location = os.path.join(data_dir, "metadata.json")
    upload_file_to_bucket_root(bucket_name, metadata_location)

    driver.quit()
    print("Process completed. Now exiting...")
    sys.exit(0)
