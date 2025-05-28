import datetime
import requests
import os
import zipfile

x = datetime.datetime.now()
print(x)

"""with open("dataset.js", "w") as f:
  f.write(str(x))"""


URL = 'https://ckm.salut.gencat.cat/ckm/retrieveResources?resourceType=archetype&format=ADL&state1=INITIAL&state2=DRAFT&state3=TEAMREVIEW&state4=REVIEWSUSPENDED&state5=PUBLISHED&state6=REASSESS_DRAFT&state7=REASSESS_TEAMREVIEW&state8=REASSESS_REVIEWSUSPENDED'
zipFileName = 'MyTestZipFile.zip'
def download_url(url, zipFileName, chunk_size=128):
	try:
		r = requests.get(url, stream=True)
		with open(zipFileName, 'wb') as fd:
			for chunk in r.iter_content(chunk_size=chunk_size):
				fd.write(chunk)
	except OSError:
		print('No connection to the server!')
		return None

download_url(URL, zipFileName)

def extract_zip_to_flat_temp(zip_path):
	# Create the "temp" directory if it doesn't exist
	temp_dir = "temp"
	os.makedirs(temp_dir, exist_ok=True)

	# Open the zip file
	with zipfile.ZipFile(zip_path, 'r') as zip_ref:
		# Iterate through each file in the zip
		for member in zip_ref.namelist():
			# Get the file name only, ignoring any subfolder structure
			filename = os.path.basename(member)

			# Only extract if it's a file (skip directories)
			if filename:
				# Define the full path for the extracted file
				dest_path = os.path.join(temp_dir, filename)

				# Open the file from the zip and write it to the "temp" folder
				with zip_ref.open(member) as source, open(dest_path, "wb") as target:
					target.write(source.read())

	print(f"All files extracted to '{temp_dir}' without subfolders.")

extract_zip_to_flat_temp(zipFileName)

def list_ADL_files(temp_dir):
	#temp_dir = "temp"
	# Get a list of all files in the "temp" folder
	ADL_files = [f for f in os.listdir(temp_dir) if f.endswith(('.adl', '.ADL'))]
	return ADL_files


with open("dataset.js", "w") as f:
  f.write(str(list_ADL_files('temp')))
