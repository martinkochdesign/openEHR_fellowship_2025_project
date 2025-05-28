import datetime
import requests

x = datetime.datetime.now()
print(x)

with open("dataset.js", "w") as f:
  f.write(str(x))


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
