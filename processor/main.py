import sys
import requests
from bs4 import BeautifulSoup
import os
import http.server
import socketserver
import threading
import time 

from helpers.wireframe import process_nifti_file

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys

server_started_event = threading.Event()

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

if __name__ == "__main__":
    # Check if the number of arguments is correct
    if len(sys.argv) != 2:
        sys.argv.append("gubra_ano_combined_25um_boundary.nii.gz")
        sys.argv.append("False")
        #print("Usage: python script.py arg1 arg2 arg3")
        #sys.exit(1)

    file_name = sys.argv[1]
    process_wireframe = not (sys.argv[2] == "False")

    wireframe_file_name  = file_name.replace(".nii.gz", "-wireframe.nii.gz")
    compressed_file_name = file_name.replace(".nii.gz", "-compressed.msgpack")

    if process_wireframe:
        process_nifti_file(file_name, wireframe_file_name)

    port = 8888
    web_directory = os.path.dirname(os.path.abspath(__file__))
    download_dir = web_directory + "/process"

    # Create a thread for the HTTP server
    http_server_thread = threading.Thread(target=start_http_server, args=(web_directory, port))
    http_server_thread.start()
  
    #wait for the server to start
    server_started_event.wait()

    options = Options()
    options.add_argument("--window-size=1920x1080")
    options.add_argument("--verbose")
    #options.add_argument("--headless")

    options.add_experimental_option("prefs", {
        "download.default_directory": download_dir,
        "download.prompt_for_download": False,
        "download.directory_upgrade": True,
        "safebrowsing_for_trusted_sources_enabled": False,
        "safebrowsing.enabled": False
    })

    driver = webdriver.Chrome(options=options)

    #start the server
    files_directory = os.path.dirname(os.path.abspath(__file__)) + "/data/sample_dataset/Atlas"

    # List all files in the folder
    files = [f for f in os.listdir(files_directory) if os.path.isfile(os.path.join(files_directory, f))]

    prev_file = None 

    def wait_for_new_files(directory_path, timeout=None):
      start_time = time.time()
      prev_file_list = [] 

      while True:
          files = os.listdir(directory_path)
          if len(files) > len(prev_file_list):
              print("New file(s) detected:")
              for file in files:
                  print(os.path.join(directory_path, file))
              prev_file_list = files
              return  # Return when new files are found
          else:
              print("Waiting for new files...")
              time.sleep(1)  # Wait for 1 second before checking again

          # Check for timeout (optional)
          if timeout is not None and time.time() - start_time >= timeout:
              print("Timeout reached. No new files found.")
              return

    for file in files:
      #driver.send_keys(Keys.CONTROL + 't')
      #if prev_file: 
        #wait_for_new_files(download_dir)

      http_file_path = "http://localhost:8888/website/index.html?file=/sample_dataset/Atlas/" + file
      driver.get(http_file_path)
      prev_file = file 

    print()

