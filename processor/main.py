import sys
import requests
from bs4 import BeautifulSoup
import os

# Function to download a file from a URL
def download_file(url, destination_folder):
    response = requests.get(url)
    if response.status_code == 200:
        # Extract the filename from the URL
        filename = url.split("/")[-1]
        file_path = os.path.join(destination_folder, filename)

        # Save the file to the destination folder
        with open(file_path, "wb") as file:
            file.write(response.content)
        print(f"File '{filename}' downloaded to '{file_path}'")
    else:
        print(f"Failed to download file. Status code: {response.status_code}")

# Function to parse the HTML page and extract the file URL
def extract_file_url(html_path):
    with open(html_path, "r", encoding="utf-8") as html_file:
        soup = BeautifulSoup(html_file, "html.parser")
        # Replace this with the actual tag and attribute containing the file URL
        file_tag = soup.find("a", href=True)
        if file_tag:
            file_url = file_tag["href"]
            return file_url
        else:
            return None

if __name__ == "__main__":
    # Check if the number of arguments is correct
    if len(sys.argv) != 1:
        print("Usage: python script.py arg1 arg2 arg3")
        sys.exit(1)

    file_name = sys.argv[1]

    # Replace with the path to your local HTML file
    html_file_path = "website/index.html?filename=" + file_name
    destination_folder = "processed"
    os.makedirs(destination_folder, exist_ok=True)

    # Extract the file URL from the HTML page
    file_url = extract_file_url(html_file_path)

    if file_url:
        # Download the file
        download_file(file_url, destination_folder)

        # Now do the wireframe processing

        #Finally upload to bucket
    else:
        print("File URL not found in the HTML page.")