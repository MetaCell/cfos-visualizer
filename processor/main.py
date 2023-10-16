import sys
import os
import http.server
import socketserver
import threading
import time 

from dotenv import load_dotenv

from helpers.wireframe import process_nifti_file
from helpers.ingest import process_bucket_upload

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys

load_dotenv()

bucket_name = os.environ.get("GCLOUD_PROJECT")

server_started_event = threading.Event()

driver = None

web_directory = os.path.dirname(os.path.abspath(__file__))
download_dir = web_directory + "/process"
data_dir = web_directory + "/data/"

def wait_for_file(filename, directory_path):
    """
    Wait for a specific file to appear in a directory.
    
    Args:
        filename (str): The name of the file to wait for.
        directory_path (str): The path to the directory to watch.
    """
    while not os.path.exists(os.path.join(directory_path, filename)):
        print(f"Waiting for {filename} to appear in {directory_path}...")
        time.sleep(1)  # Wait for 1 second before checking again

    print(f"{filename} has appeared in {directory_path}.")

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

    wireframe_file_name  = file_name.replace(".nii.gz", "-wireframe.nii.gz")

    if process_wireframe:
        process_nifti_file(target_dir + file_name, target_dir + wireframe_file_name)

    http_file_path = "http://localhost:8888/website/index.html?file="+file_name
    driver.get(http_file_path)

    if process_wireframe:
        http_file_path = "http://localhost:8888/website/index.html?file="+wireframe_file_name
        driver.get(http_file_path)

    print(f"Process completed for { file_name }")

if __name__ == "__main__":
    port = 8888
    # Create a thread for the HTTP server
    http_server_thread = threading.Thread(target=start_http_server, args=(web_directory, port))
    http_server_thread.start()
  
    #wait for the server to start
    server_started_event.wait()

    options = Options()
    options.add_argument("--window-size=1920x1080")
    options.add_argument("--verbose")
    options.add_argument("--headless")

    options.add_experimental_option("prefs", {
        "download.default_directory": download_dir,
        "download.prompt_for_download": False,
        "download.directory_upgrade": True,
        "safebrowsing_for_trusted_sources_enabled": False,
        "safebrowsing.enabled": False
    })

    driver = webdriver.Chrome(options=options)
    # Get the current directory using os.getcwd()
    current_directory = os.getcwd()

    target_dir = current_directory + "/data/"

    sub_folders = ["atlas", "activityMap"]

    for sub_folder in sub_folders:
        target_sub_dir = target_dir + sub_folder + "/"
        # Use os.listdir() to get a list of all files and directories in the current directory
        files = os.listdir(target_sub_dir)

        # Filter out only the files (excluding directories)
        files = [file for file in files if os.path.isfile(os.path.join(target_sub_dir, file))]

        # Print the list of files
        for file in files:
            print(f"Processing ${file}...")
            full_name = sub_folder + "/" + file
            process(target_dir, full_name, True)
            wait_for_file(file.replace("nii.gz", "msgpack"), download_dir)

        process_bucket_upload(bucket_name, target_sub_dir, sub_folder)

