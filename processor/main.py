import sys
import requests
from bs4 import BeautifulSoup
import os
import http.server
import socketserver
import threading

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.common.by import By

from selenium import webdriver
from selenium.webdriver.chrome.options import Options

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
        #print("Usage: python script.py arg1 arg2 arg3")
        #sys.exit(1)

    file_name = sys.argv[1]

    #start the server
    http_file_path = "http://localhost:8888/website/index.html?file=" + file_name
    directory = os.path.dirname(os.path.abspath(__file__))
    website_dir = directory + "/website"
    download_dir = directory + "/process"
    port = 8888

    # Create a thread for the HTTP server
    http_server_thread = threading.Thread(target=start_http_server, args=(directory, port))
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
    driver.get(http_file_path)

    print()

