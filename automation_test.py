import datetime
import requests
import os
import zipfile
import re
import json
import pandas as pd
import tkinter
import customtkinter
from customtkinter import filedialog
import shutil

# VARIABLES ******************************************************************
# Set headless to True if you do not need the GUI (or False if you want to use the GUI
headless = True
# Variables for running script headless (without GUI)
URL = 'https://ckm.openehr.org/ckm/retrieveResources?resourceType=archetype&format=ADL&state1=INITIAL&state2=DRAFT&state3=TEAMREVIEW&state4=REVIEWSUSPENDED&state5=PUBLISHED&state6=REASSESS_DRAFT&state7=REASSESS_TEAMREVIEW&state8=REASSESS_REVIEWSUSPENDED'
zipFileName = 'MyTestZipFile.zip'
CKMorGitHub = 'CKM'  # "GITHUB" or "CKM", depending on source
provenance = 'CKM International'

# URLs for the GUI ***********************************************************
#URLs for gitHub files
apperta_url_github = 'https://github.com/AppertaFoundation/apperta-uk-ckm-mirror/archive/refs/heads/master.zip'
#highmed_url
international_url_github = 'https://github.com/openEHR/CKM-mirror/archive/refs/heads/master.zip'
catsalut_url_github = 'https://github.com/CKMCatSalut/CKM-mirror/archive/refs/heads/master.zip'
arketyper_url_github = 'https://github.com/Arketyper-no/ckm/archive/refs/heads/master.zip'

#URLs for CKM files
#apperta_url_CKM
highmed_url_CKM = 'https://ckm.highmed.org/ckm/retrieveResources?resourceType=archetype&format=ADL&state1=INITIAL&state2=DRAFT&state3=TEAMREVIEW&state4=REVIEWSUSPENDED&state5=PUBLISHED&state6=REASSESS_DRAFT&state7=REASSESS_TEAMREVIEW&state8=REASSESS_REVIEWSUSPENDED'
international_url_CKM = 'https://ckm.openehr.org/ckm/retrieveResources?resourceType=archetype&format=ADL&state1=INITIAL&state2=DRAFT&state3=TEAMREVIEW&state4=REVIEWSUSPENDED&state5=PUBLISHED&state6=REASSESS_DRAFT&state7=REASSESS_TEAMREVIEW&state8=REASSESS_REVIEWSUSPENDED'
catsalut_url_CKM = 'https://ckm.salut.gencat.cat/ckm/retrieveResources?resourceType=archetype&format=ADL&state1=INITIAL&state2=DRAFT&state3=TEAMREVIEW&state4=REVIEWSUSPENDED&state5=PUBLISHED&state6=REASSESS_DRAFT&state7=REASSESS_TEAMREVIEW&state8=REASSESS_REVIEWSUSPENDED'
arketyper_url_CKM = 'https://arketyper.no/ckm/retrieveResources?resourceType=archetype&format=ADL&state1=INITIAL&state2=DRAFT&state3=TEAMREVIEW&state4=REVIEWSUSPENDED&state5=PUBLISHED&state6=REASSESS_DRAFT&state7=REASSESS_TEAMREVIEW&state8=REASSESS_REVIEWSUSPENDED'


# FUNCTIONS ******************************************************************
def list_files(dir,ext):
	#temp_dir = "temp"
	# Get a list of all files in the "temp" folder
	file_list = [f for f in os.listdir(dir) if f.endswith((ext))]
	return file_list

# Read the file content
def read_file(file_path):
    with open(file_path, 'r', encoding='utf-8-sig') as file:
        return file.read()
#convert ADL file to sections
def section_ADL(file_content):
	archetype_index = 0
	specialise_index = None
	concept_index = None
	language_index = None
	description_index = None
	definition_index = None
	invariant_index = None
	ontology_index = None
	revisionHistory_index = None


	lines = file_content.splitlines()
	archetype_id = ''
	for i in range(len(lines)):
		line = lines[i]
		pattern = re.compile(r'.*(openEHR-.+-.+\..*\.v[0-9]+)')
		matches = pattern.match(line.strip())
		if matches:
			#print('Archetype ID pattern')
			archetype_id = matches.groups()[0]
			break

	for i in range(len(lines)):
		line = lines[i]
		match line:
			case 'specialise':
				specialise_index = i
			case 'concept':
				concept_index = i
			case 'language':
				language_index = i
			case 'description':
				description_index = i
			case 'definition':
				definition_index = i
			case 'invariant':
				invariant_index = i
			case 'ontology':
				ontology_index = i
			case 'revision_history':
				revisionHistory_index = i

	#divide by index
	#get archetype info
	if specialise_index:
		archetype_section = lines[archetype_index+1:specialise_index]
	else:
		archetype_section = lines[archetype_index+1:concept_index]
	#get specialise info
	if specialise_index:
		specialise_section = lines[specialise_index+1:concept_index]
	else:
		specialise_section = []
	#get concept info
	concept_section = lines[concept_index+1:language_index]
	concept_section.append('')
	#get language info
	if description_index:
		language_section = lines[language_index+1:description_index]
		language_section.append('')
	else:
		language_section = lines[language_index+1:definition_index]
		language_section.append('')
	#get description
	if description_index:
		description_section = lines[description_index+1:definition_index]
		description_section.append('')
	else:
		description_section = []
	#get definition
	if invariant_index:
		definition_section = lines[definition_index+1:invariant_index]
		definition_section.append('')
	else:
		definition_section = lines[definition_index+1:ontology_index]
		definition_section.append('')
	#get invariant
	if invariant_index:
		invariant_section = lines[invariant_index+1:ontology_index]
		invariant_section.append('')
	else:
		invariant_section = []
	#get ontology
	if revisionHistory_index:
		ontology_section = lines[ontology_index+1:revisionHistory_index]
		ontology_section.append('')
	else:
		ontology_section = lines[ontology_index+1:]
		ontology_section.append('')
	#get revision history
	if revisionHistory_index:
		revisionHistory_section = lines[revisionHistory_index+1:]
		revisionHistory_section.append('')
	else:
		revisionHistory_section = []

	return archetype_id, concept_section, language_section, description_section, definition_section, ontology_section, revisionHistory_section

def eliminate_forbidden_characters(value):
	characters=['\n','\t']
	for c in characters:
		value=value.replace(c,' ')
	return value.strip()
# the transformation motor (MIGHT BE CAHNGED FOR ANTLR4 APPROACH IN THE FUTURE)
def convert_section_to_JSON(section):
	#NEW MOTOR
	# join section lines
	file_content = '\n'.join(section)

	#save the input into a temp file
	#with open("temp_before_transformation.txt", "w", encoding='utf-8') as f:
		#f.write(file_content)

	# TRANSFORMATION MOTOR FOR ADL SECTIONS

	# SINLGLE LINES *******************************************************************************
	# SINGLE LINE LIST : key = <"ABC", "DEF"> <---- DO THIS BEFORE SINGLE LINES WITHOUT LISTS!!!!!!
	#pattern = re.compile(r'(([A-Za-z_]+)\s=\s<("[^"]+",\s".*?")>\n)')
	#pattern = re.compile(r'(([A-Za-z_]+)\s=\s<("[^"]+".+?,.+?".*?")>\n)')
	#pattern = re.compile(r'(([A-Za-z_]+)\s=\s<("[^"]+".*,.+?".*?")>\n)')
	pattern = re.compile(r'(([A-Za-z_]+)\s=\s<("[^"]+".*,?".*?")>\n)')

	matches = pattern.finditer(file_content)
	if matches:
		for match in matches:
			whole_sentence = match.group(1)
			key = match.group(2)
			value = match.group(3)
			value = eliminate_forbidden_characters(value)
			new_sentence = '"'+key+'": [' + value + ']\n'
			file_content=file_content.replace(whole_sentence,new_sentence)

	# SINGLE LINE VALUES: key = <"ABC">
	pattern = re.compile(r'(([\t]+)([A-Za-z_0-9]+)\s=\s<"(.*)">\n)')  # <---- needs the tabs before the label, because there can be problems when replacing "use" before "misuse" for example. Also has to include numbers, thanks to "hl7v2_mapping"
	matches = pattern.finditer(file_content)
	if matches:
		for match in matches:
			whole_sentence = match.group(1)
			indent = match.group(2)
			key = match.group(3)
			value = match.group(4)
			value = eliminate_forbidden_characters(value)
			new_sentence = indent + '"'+key+'": "' + value + '"\n'
			file_content=file_content.replace(whole_sentence,new_sentence)

	# SINGLE LINE VALUES with brackets: ["key"] = <"ABC">
	pattern = re.compile(r'(\["([A-Za-z_0-9.,@-]+)"\]\s=\s<"(.*)">\n)') # <---- had to add @ and , thanks to ["pablo,pazos@cabolabs.com"] = <"pablo,pazos@cabolabs.com">
	matches = pattern.finditer(file_content)
	if matches:
		for match in matches:
			whole_sentence = match.group(1)
			key = match.group(2)
			value = match.group(3)
			value = eliminate_forbidden_characters(value)
			new_sentence = '"'+key+'": "' + value + '"\n'
			file_content=file_content.replace(whole_sentence,new_sentence)

	# SINGLE LINE VALUES special keywords: key = <"ABC, DEF",...>
	pattern = re.compile(r'(([A-Za-z_0-9]+)\s=\s<"(.*)",\s\.\.\.>\n)')
	matches = pattern.finditer(file_content)
	if matches:
		for match in matches:
			whole_sentence = match.group(1)
			key = match.group(2)
			value = match.group(3)
			temp_list = value.split(',')
			temp_list = [s.strip() for s in temp_list]

			if key == 'keywords':
				new_sentence = '"'+key+'": ' + str(temp_list).replace("'",'"')
			else:
				value = eliminate_forbidden_characters(value)
				new_sentence = '"'+key+'": ["' + value + '"]\n'
			#print(new_sentence)

			file_content=file_content.replace(whole_sentence,new_sentence)

	# SINGLE LINE VALUE special language: key = <[ISO_1234::en]>
	pattern = re.compile(r'(([A-Za-z_0-9]+)\s=\s<\[(.*)\]>\n)')
	matches = pattern.finditer(file_content)
	if matches:
		for match in matches:
			whole_sentence = match.group(1)
			key = match.group(2)
			value = match.group(3)
			value = eliminate_forbidden_characters(value)
			new_sentence = '"'+key+'": "' + value + '"\n'
			file_content=file_content.replace(whole_sentence,new_sentence)

	# SINGLE LINE VALUE special language: ["key"] = <[ISO_1234::en]>
	pattern = re.compile(r'(\["([A-Za-z_0-9.\/\[\]-]+)"\]\s=\s<\[(.*)\]>\n)')  #<----- had to add / [ ] , because sometimes the label is ["/items[at0001]"] = <[SNOMED-CT::59276001]>
	matches = pattern.finditer(file_content)
	if matches:
		for match in matches:
			whole_sentence = match.group(1)
			key = match.group(2)
			value = match.group(3)
			value = eliminate_forbidden_characters(value)
			new_sentence = '"'+key+'": "' + value + '"\n'
			file_content=file_content.replace(whole_sentence,new_sentence)

	# SINGLE LINE VALUE special terminology: ["key"] = <terminology://fh>
	pattern = re.compile(r'(\["([A-Za-z_0-9.-]+)"\]\s=\s<[^"](.*)>\n)')
	matches = pattern.finditer(file_content)
	if matches:
		for match in matches:
			whole_sentence = match.group(1)
			key = match.group(2)
			value = match.group(3)
			value = eliminate_forbidden_characters(value)
			new_sentence = '"'+key+'": "' + value + '"\n'
			file_content=file_content.replace(whole_sentence,new_sentence)

	# SINGLE LINE empty: key = <>
	pattern = re.compile(r'(([A-Za-z_0-9]+)\s=\s<>\n)')
	matches = pattern.finditer(file_content)
	if matches:
		for match in matches:
			whole_sentence = match.group(1)
			key = match.group(2)
			value = eliminate_forbidden_characters(value)
			new_sentence = '"'+key+'": ""\n'
			file_content=file_content.replace(whole_sentence,new_sentence)



	# MULTIPLE LINES **********************************************************************************
	# MULTIPLE LINES empty: key = <
	# 	>
	pattern = re.compile(r'(([A-Za-z_0-9]+)\s=\s<[\t\s\n]+>\n)')
	matches = pattern.finditer(file_content)
	if matches:
		for match in matches:
			whole_sentence = match.group(1)
			key = match.group(2)
			new_sentence = '"'+key+'": ""\n'
			file_content=file_content.replace(whole_sentence,new_sentence)

	"""# Multiple LINEs LIST : key = <"ABC",
	# "DEF">                                             <---- DO THIS BEFORE MULTIPLE LINES WITHOUT LISTS!!!!!!
	pattern = re.compile(r'(([A-Za-z_]+)\s=\s<("[\s\S][^"]+",\s".*?")>\n)')
	matches = pattern.finditer(file_content)
	if matches:
		for match in matches:
			whole_sentence = match.group(1)
			key = match.group(2)
			value = match.group(3)
			value = eliminate_forbidden_characters(value)
			new_sentence = '"'+key+'": [' + value + ']\n'
			file_content=file_content.replace(whole_sentence,new_sentence)"""

	# MULTIPLE LINES VARIABLE: key = <"ABC
	# DEF
	#
	# GHI">
	pattern = re.compile(r'(([A-Za-z_]+)\s=\s<("[\s\S]*?")>\n)')
	matches = pattern.finditer(file_content)
	if matches:
		for match in matches:
			whole_sentence = match.group(1)
			key = match.group(2)
			value = match.group(3)
			#value = value.replace('\n',' ')
			value = eliminate_forbidden_characters(value)

			#check if this value is a list:
			if value.find('", "')>-1 or value.find('" ,"')>-1 or value.find('","')>-1:
				value = "["+value+"]"

			new_sentence = '"'+key+'": ' + value + '\n'
			file_content=file_content.replace(whole_sentence,new_sentence)

	# MULTIPLE LINES VARIABLE: ["key"] = <"ABC
	# DEF
	#
	# GHI">
	pattern = re.compile(r'(\["([A-Za-z_0-9.-]+)"\]\s=\s<"([\s\S]*?)">\n)')
	matches = pattern.finditer(file_content)
	if matches:
		for match in matches:
			whole_sentence = match.group(1)
			key = match.group(2)
			value = match.group(3)
			value = eliminate_forbidden_characters(value)
			#value = value.replace('\n',' ')
			new_sentence = '"'+key+'": "' + value + '"\n'
			file_content=file_content.replace(whole_sentence,new_sentence)

	# NESTED STRUCTURES *************************************************************
	# LEVEL 4 STRUCTURE: ["key"] = <
	# ...
	# >
	# (\t{4}\["([a-zA-Z0-9-._]+)"\]\s=\s<(\n[\S\s]+?[^"])\t{4}>\n)
	#

	# LEVEL 2 STRUCTURE: ["key"] = <
	# ...
	# >

	for level in range(10,0,-1):
		#print(level)
		indent = ''
		for i in range(level):
			indent+='\t'
		#print('.'+indent+'.')

		#pattern_text= r'(\t{'+str(level)+'}\["([a-zA-Z0-9-._]+)"\]\s=\s<(\n[\S\s]+?[^"])\t{'+str(level)+'}>)\n'
		pattern_text= r'(\t{'+str(level)+'}\["([A-zÀ-ú0-9-._\s]+)"\]\s=\s<(\n[\S\s]+?[^"])\t{'+str(level)+'}>)\n'
		#pattern = re.compile(r'(\t{2}\["([a-zA-Z0-9-._]+)"\]\s=\s<(\n[\S\s]+?[^"])\t{2}>)\n')
		pattern = re.compile(pattern_text)
		matches = pattern.finditer(file_content)
		if matches:
			for match in matches:
				whole_sentence = match.group(1)
				key = match.group(2)
				value = match.group(3)
				#value = eliminate_forbidden_characters(value)
				new_sentence = indent + '"'+key+'": {' + value + indent + '}'
				file_content=file_content.replace(whole_sentence,new_sentence)

		pattern_text= r'(\t{'+str(level)+'}([a-zA-Z0-9-._]+)\s=\s<(\n[\S\s]+?[^"])\t{'+str(level)+'}>)\n'
		#pattern = re.compile(r'(\t{2}\["([a-zA-Z0-9-._]+)"\]\s=\s<(\n[\S\s]+?[^"])\t{2}>)\n')
		pattern = re.compile(pattern_text)
		matches = pattern.finditer(file_content)
		if matches:
			for match in matches:
				whole_sentence = match.group(1)
				key = match.group(2)
				value = match.group(3)
				#value = eliminate_forbidden_characters(value)
				new_sentence = indent + '"'+key+'": {' + value + indent + '}'
				file_content=file_content.replace(whole_sentence,new_sentence)

	#ADDING COMMAS ************************************************************

	#comma between " and "
	pattern = re.compile(r'((".*?")([\n\t\s]+)(".*?"))')
	matches = pattern.finditer(file_content)
	if matches:
		for match in matches:
			whole_sentence = match.group(1)
			key = match.group(2)
			separation = match.group(3)
			value = match.group(4)
			new_sentence = key+','+separation+value
			file_content=file_content.replace(whole_sentence,new_sentence)

	#comma between } and "
	pattern = re.compile(r'((})([\n\t\s]+)(".*?"))')
	matches = pattern.finditer(file_content)
	if matches:
		for match in matches:
			whole_sentence = match.group(1)
			key = match.group(2)
			separation = match.group(3)
			value = match.group(4)
			new_sentence = key+','+separation+value
			file_content=file_content.replace(whole_sentence,new_sentence)

	#comma between ] and "
	pattern = re.compile(r'((\])([\n\t\s]+)(".*?"))')
	matches = pattern.finditer(file_content)
	if matches:
		for match in matches:
			whole_sentence = match.group(1)
			key = match.group(2)
			separation = match.group(3)
			value = match.group(4)
			new_sentence = key+','+separation+value
			file_content=file_content.replace(whole_sentence,new_sentence)


	file_content = '{' + str(file_content) +'\n}'

	#with open("temp_after_transformation.txt", "w", encoding='utf-8') as f:
		#f.write(file_content)


	#print('\n****************************** JSON ********************************\n')
	#print(file_content)
	return json.loads(file_content)

def parse_inclusion_exclusion_elements(definition_section, archetypeIdList):
	elements=[]
	for line in definition_section:
		pattern = re.compile(r'([A-Z_]+)\[(at[0-9]+)\]')
		matches = pattern.match(line.strip())
		if matches:
			elements.append((matches.groups()[0],matches.groups()[1]))

	definition_text = '\n'.join(definition_section)

	# get rid of comments
	pattern = re.compile(r'(.*(--\s.*)\n)')
	matches = pattern.finditer(definition_text)
	if matches:
		for match in matches:
			whole_sentence = match.group(1)
			key = match.group(2)
			new_sentence = ''
			definition_text=definition_text.replace(whole_sentence, new_sentence)

	#replace all 4 spaces with tabs
	definition_text = definition_text.replace('    ', '\t')


	#for this archetype, create an empty structure
	inclusionAndExclusion = {
		"include":[],
		"exclude":[]
	}

	#go by levels to detect allow_archetype in nested structures
	for level in range(10,0,-1):
		#print(level)
		indent = ''
		for i in range(level):
			indent+='\t'
		#print('.'+indent+'.')

		pattern_text= r'\t{'+str(level)+'}allow_archetype\s(.*)\soccurrences\smatches\s{(.*)}\smatches\s{([\s\S]+?\t+)}\n'
		pattern = re.compile(pattern_text)
		matches = pattern.finditer(definition_text)
		if matches:
			for match in matches:
				#print(match.group(1),match.group(3))
				whole_structure = match.group(0)
				#-> extract the ACTION[at0001] part "1"
				structure_name = match.group(1)
				#-> from the include/exclude part ("3") get the inclusion and/or exclusions
				inclusionExclusionPart = match.group(3)

				#search inclusions patterns
				inclusions = []
				exclusions = []

				patternList = []
				#get the whole include statements
				pattern = re.compile(r'[\t]+include\n([\t\s]+[\s\S]*?)(?=exclude\n|\Z)')
				matches2 = pattern.finditer(inclusionExclusionPart)
				if matches2:
					for match2 in matches2:
						all_include_statements = match2.group(1)
						pattern3 = re.compile(r'[\n\t\s]+archetype_id\/value\smatches\s{\/(.*)\/}')
						matches3 = pattern3.finditer(all_include_statements )
						if matches3:
							for match3 in matches3:
								patternList +=match3.group(1).split('|')
				#convert patterns to list of archetypes
				#creata a list of existing archetypes from the archetypes lsit that match the patterns
				for pattern in patternList:
					if pattern != '.*':		#HERE WE LIMIT OURSELVES TO DISCRETE INCLUSIONS. IF THE INCLUSION IS GENERIC, THE ARCHETYPE GETS CONNECTED TO EVERYTHING...
						for id in archetypeIdList:
							p = re.compile(pattern)
							x = re.match(p, id)
							if x:
								inclusions.append(id)
					else:
						inclusions.append('any_archetype')
				#add inclusions under "include">"ACTION[at0001]">list of inclusions
				if len(inclusions)>0:

					#inclusionAndExclusion['include'][structure_name]=inclusions
					inclusionAndExclusion['include'].append({'structure':structure_name, 'archetypes':inclusions})


				#search exclusions patterns
				patternList = []
				#get the whole ecclude statements
				pattern = re.compile(r'[\t]+exclude\n([\t\s]+[\s\S]*?)(?=[\t]+}\n|\Z)')
				matches2 = pattern.finditer(inclusionExclusionPart)
				if matches2:
					for match2 in matches2:
						all_include_statements = match2.group(1)
						pattern3 = re.compile(r'[\n\t\s]+archetype_id\/value\smatches\s{\/(.*)\/}')
						matches3 = pattern3.finditer(all_include_statements )
						if matches3:
							for match3 in matches3:
								patternList +=match3.group(1).split('|')
				#convert patterns to list of archetypes
				#creata a list of existing archetypes from the archetypes lsit that match the patterns
				for pattern in patternList:
					if pattern != '.*':		#HERE WE LIMIT OURSELVES TO DISCRETE INCLUSIONS. IF THE INCLUSION IS GENERIC, THE ARCHETYPE GETS CONNECTED TO EVERYTHING...
						for id in archetypes:
							p = re.compile(pattern)
							x = re.match(p, id)
							if x:
								exclusions.append(id)
					else:
						exclusions.append('any_archetype')

				#add exclusions under "exclude">"ACTION[at0001]">list of inclusions
				if len(exclusions)>0:
					inclusionAndExclusion['exclude'].append({'structure':structure_name, 'archetypes':exclusions})

				#delete the structure, so it is not added into other lower level structures
				definition_text=definition_text.replace(whole_structure, '\n\n')

	#print(inclusionAndExclusion)


	return inclusionAndExclusion['include'], inclusionAndExclusion['exclude'], elements

#download zip from CKM
def download_url(url, zipFileName, chunk_size=128):
	try:
		r = requests.get(url, stream=True)
		with open(zipFileName, 'wb') as fd:
			for chunk in r.iter_content(chunk_size=chunk_size):
				fd.write(chunk)
	except OSError:
		print('No connection to the server!')
		return None

#download for github zip files
def fetch_zip_file(url, zipFileName):
	# Try to get the ZIP file
	try:
		response = requests.get(url)
	except OSError:
		print('No connection to the server!')
		return None

	# check if the request is succesful
	if response.status_code == 200:
		# Save dataset to file
		print('Status 200, OK')
		open(zipFileName, 'wb').write(response.content)
	else:
		print('ZIP file request not successful!.')
		return None

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

def count_matches(a, b):
	  return sum(x == y for x, y in zip(a, b))

# THE BIG MAIN FUNCTION THAT CONTROLS THE TRANSFORMATION WORKFLOW
def transformWorkflow(zipFileName):
	now = datetime.datetime.now()
	download_time = now.strftime("%Y-%m-%d %H:%M:%S")

	extract_zip_to_flat_temp(zipFileName)

	# ADD THE WHOLE FILE TREATMENT HERE
	#list all files
	fileList = list_files('temp','.adl')

	#get a complete list of archetype names
	archetypeIdList = []
	for file in fileList:
		archetypeIdList.append(file.replace('.adl',''))

	existing_archetypes=[]
	for file in fileList:
		print('**********************************')
		print(file)
		print('**********************************')
		file_path = 'temp/' + file
		file_content = read_file(file_path)

		node = {}

		#Section the file
		archetype_id, concept_section, language_section, description_section, definition_section, ontology_section, revisionHistory_section = section_ADL(file_content)

		#convert sections
		#concept_JSON = convert_section_to_JSON(concept_section)
		print('Creating language JSON')
		language_JSON = convert_section_to_JSON(language_section)
		print('Creating description JSON')
		description_JSON = convert_section_to_JSON(description_section)
		print('Creating ontology JSON')
		ontology_JSON = convert_section_to_JSON(ontology_section)
		#revisionHistory_JSON = convert_section_to_JSON(revisionHistory_section)

		# definition_section has to be parsed separately
		inclusions, exclusions, elements = parse_inclusion_exclusion_elements(definition_section, archetypeIdList)

		node = {}
		#print(ontology_JSON)
		#gather information that we need
		# id
		node['id'] = archetype_id
		node['archetype_id'] = archetype_id

		# class
		pattern = re.compile(r'openEHR-.+-(.+)\..*\.v[0-9]+')
		matches = pattern.match(archetype_id.strip())
		if matches:
			#print('Class pattern')
			node['class'] = matches.groups()[0]
		else:
			node['class'] = ''

		# publication state
		if 'lifecycle_state' in description_JSON.keys():
			node['lifecycle_state'] = description_JSON['lifecycle_state']
		else:
			node['lifecycle_state'] = ''
		# orginal language
		if 'original_language' in language_JSON.keys():
			full_language = language_JSON['original_language']
			pattern = re.compile(r'.+::(.+)')
			matches = pattern.match(full_language.strip())
			if matches:
				node['original_language'] = matches.groups()[0]
			else:
				node['original_language'] = ''
		else:
			node['original_language'] = ''

		# WATCH OUT! IF ORIGINAL LANGUAGE IS NOT "EN", we are going to try to get english information, if available...
		default_language = 'en'

		# translation languages
		if 'translations' in language_JSON.keys():
			node['translation_languages'] = list(language_JSON['translations'].keys())
		else:
			node['translation_languages'] = []

		# purpose
		if default_language in description_JSON['details'].keys():
			current_language = default_language
		elif node['original_language'] in description_JSON['details'].keys():
			current_language = node['original_language']
		else:
			if len(description_JSON['details'].keys())>0:
				current_language = list(description_JSON['details'].keys())[0]
			else:
				current_language = ''
		if current_language!='':
			if 'purpose' in description_JSON['details'][current_language].keys():
				node['purpose'] = description_JSON['details'][current_language]['purpose']
			else:
				node['purpose'] = ''
			# keywords
			if 'keywords' in description_JSON['details'][current_language].keys():
				node['keywords'] = description_JSON['details'][current_language]['keywords']
			else:
				node['keywords'] = ''
		else:
				node['purpose'] = ''
				node['keywords'] = ''

		# included archetypes
		node['include']=inclusions

		# excluded archetypes
		node['exclude']=exclusions

		# concept (from at0000)
		if default_language in ontology_JSON['term_definitions'].keys():
			current_language = default_language
		else:
			current_language = node['original_language']
		#print(archetype_id)
		#does at0000 exist?
		if 'at0000' in ontology_JSON['term_definitions'][current_language]['items'].keys():
			node['concept_name']=ontology_JSON['term_definitions'][current_language]['items']['at0000']['text']
			node['concept_description']=ontology_JSON['term_definitions'][current_language]['items']['at0000']['description']
		elif 'at0000.1' in ontology_JSON['term_definitions'][current_language]['items'].keys():
			node['concept_name']=ontology_JSON['term_definitions'][current_language]['items']['at0000.1']['text']
			node['concept_description']=ontology_JSON['term_definitions'][current_language]['items']['at0000.1']['description']
		else:
			node['concept_name']=''
			node['concept_description']=''

		#elements
		#print(elements)
		node['items']=[]
		if default_language in ontology_JSON['term_definitions'].keys():
			current_language = default_language
		else:
			current_language = node['original_language']
		for element in elements:
			#datatype = element[0]
			label = ontology_JSON['term_definitions'][current_language]['items'][element[1]]['text']
			#node['items'].append(label + ' (' + datatype + ')')
			node['items'].append(label)

		#parent archetype
		node['parent']=''
		pattern = re.compile(r'specialise[\t\n]+(openEHR-.+-.+\.v[0-9]+)')
		matches = pattern.finditer(file_content)
		if matches:
			for match in matches:
				node['parent']= match.group(1)
				break
		#print(node)
		#print('\n')
		existing_archetypes.append(node)

	#children
	for ex_arch in existing_archetypes:
		children = []
		current_id = ex_arch['archetype_id']
		for possible_child in existing_archetypes:
			parent = possible_child['parent']
			if parent == current_id:
				children.append(possible_child['archetype_id'])
		ex_arch['children'] = children

	#review keywords (every one has to be a list)
	for ex_arch in existing_archetypes:
		if not isinstance(ex_arch['keywords'], list):
			if ex_arch['keywords']=="":
				ex_arch['keywords']=[]
			else:
				ex_arch['keywords']=[ex_arch['keywords']]

	#review all items. If the item is a list, it cannot contain another list
	for i in range(len(existing_archetypes)):
		for key in existing_archetypes[i].keys():
			if isinstance(existing_archetypes[i][key],list):
				for j in range(len(existing_archetypes[i][key])):
					if isinstance(existing_archetypes[i][key][j],list):
						existing_archetypes[i][key][j] = ' '.join(existing_archetypes[i][key][j])


	"""f = open("dataset.json", "w", encoding='utf-8')
	f.write(json.dumps(existing_archetypes, ensure_ascii=False))
	f.close()"""

	#add similar archetypes
	for ex_arch in existing_archetypes:
		currentKeywords = [kw.lower() for kw in ex_arch['keywords']]
		currentItems = list(set([kw.lower() for kw in ex_arch['items']]))
		#create dataframe
		df_out = pd.DataFrame(columns=['id','N_kw','N_it','score'])
		for other_arch in existing_archetypes:
			if other_arch['id']!=ex_arch['id']:
				tempId =  other_arch['id']
				tempKeywords = [kw.lower() for kw in  other_arch['keywords']]
				#print(other_arch['items'])
				tempItems = list(set([kw.lower() for kw in  other_arch['items']]))
				commonItems = ['any event', 'tree', 'comment', 'itemtree', 'item tree', 'event series', 'history']
				for ci in commonItems:
					if ci in tempItems:
						tempItems.remove(ci)
				N_kw = count_matches(currentKeywords, tempKeywords)
				N_it = count_matches(currentItems, tempItems)
				w1 = 2
				w2 = 1
				score = w1 * N_kw + w2 * N_it
				threshold = 0
				if score > threshold and (N_kw>0 or N_it>1):
					df_out.loc[len(df_out)]=[tempId, N_kw, N_it, score]
		df_out = df_out.sort_values(by=['score'], ascending=False).reset_index(drop=True)
		recommendationList = list(df_out['id'])
		if ex_arch['parent'] in recommendationList:
			recommendationList.remove(ex_arch['parent'])
		for child in ex_arch['children']:
			if child in recommendationList:
				recommendationList.remove(child)
		for inc in ex_arch['include']:
			for a in inc['archetypes']:
				if a in recommendationList:
					recommendationList.remove(a)
		for exc in ex_arch['include']:
			for a in exc['archetypes']:
				if a in recommendationList:
					recommendationList.remove(a)

		ex_arch['similar'] = recommendationList

	#prepare and save our edges and nodes
	nodeText = 'const provenance = "' + provenance + '";\nconst extraction_date = "' + download_time + '";\n'
	nodeText += "const allNodes = " + json.dumps(existing_archetypes, ensure_ascii=False) + ";\n"
	#edgeText = "const allLinks = " + json.dumps(edgeList, ensure_ascii=False)+ ";"
	emptyarrays = "let nodes = [];\n let links = [];"

	f = open("dataset.js", "w", encoding='utf-8')
	f.write(nodeText + emptyarrays)
	f.close()

	# CLEAN UP TEMP FILES *****************************************************************************
	#get list of remaining files in temp folder
	remaining_files = os.listdir('temp/')
	#delete remaining files
	for rem in remaining_files:
		os.remove('temp/' + rem)

	#delete temp folder
	os.rmdir('temp')
	#delete zip file
	os.remove(zipFileName)

# THE GUI FUNCTIONS
def add_message(phrase):
	phrase += '\n'
	message_box.insert('end',phrase)
	message_box.see("end")
	root.update()

def select_URL_pre_source():
	global provenance
	match radio_var.get():
		case 1:
			URL = international_url_CKM
			base_URL = 'https://ckm.openehr.org/ckm/'
			prefix = 'CKM_INT'
			source = '2'
			provenance = 'CKM International'
		case 2:
			URL = catsalut_url_CKM
			base_URL = 'https://ckm.salut.gencat.cat/ckm/'
			prefix = 'CKM_CAT'
			source = '2'
			provenance = 'CKM CatSalut'
		case 3:
			URL = arketyper_url_CKM
			base_URL = 'https://arketyper.no/ckm/'
			prefix = 'CKM_NO'
			source = '2'
			provenance = 'CKM Arketyper'
		case 4:
			URL = highmed_url_CKM
			base_URL = 'https://ckm.highmed.org/ckm/'
			prefix = 'CKM_DE'
			source = '2'
			provenance = 'CKM HighMed'
		case 5:
			URL = international_url_github
			base_URL = 'https://ckm.openehr.org/ckm/'
			prefix = 'GIT_INT'
			source = '1'
			provenance = 'GitHub International'
		case 6:
			URL = catsalut_url_github
			base_URL = 'https://ckm.salut.gencat.cat/ckm/'
			prefix = 'GIT_CAT'
			source = '1'
			provenance = 'GitHub CatSalut'
		case 7:
			URL = arketyper_url_github
			base_URL = 'https://arketyper.no/ckm/'
			prefix = 'GIT_NO'
			source = '1'
			provenance = 'GitHub Arketyper'
		case 8:
			URL = apperta_url_github
			base_URL = None
			prefix = 'GIT_UK'
			source = '1'
			provenance = 'GitHub Apperta'
		case _:
			URL = None
			base_URL = None
			prefix = None
			source = None
			provenance = ''


	return URL, base_URL, prefix, source

def download():
	global provenance
	#input_folder_path = filedialog.askdirectory()
	#if input_folder_path:
	generate_btn.configure(state="disabled")
	radiobutton_1.configure(state="disabled")
	radiobutton_2.configure(state="disabled")
	radiobutton_3.configure(state="disabled")
	radiobutton_4.configure(state="disabled")
	radiobutton_5.configure(state="disabled")
	radiobutton_6.configure(state="disabled")
	radiobutton_7.configure(state="disabled")
	radiobutton_8.configure(state="disabled")
	radiobutton_9.configure(state="disabled")
	file_btn.configure(state="disabled")
	file_box.configure(state="disabled")

	#clean temp folder, if exists
	if os.path.exists('temp'):
		#get list of remaining files in temp folder
		remaining_files = os.listdir('temp/')
		#delete remaining files
		add_message('Deleting temp files...')
		for rem in remaining_files:
			os.remove('temp/' + rem)
		#delete temp folder
		add_message('Deleting temp folder...')
		os.rmdir('temp')

	if radio_var.get()!=9:
		URL, base_URL, prefix, source = select_URL_pre_source()
		#input_folder_path
		#add_message('Output path' + input_folder_path)
		if URL:
			#download zip file
			print('Connecting to', URL)
			add_message('Connecting to ' +URL)
			# zipFileName = input_folder_path + '/source_'+prefix+'.zip'
			zipFileName = 'MyTestZipFile.zip'
			add_message('Saving ZIP to ' + zipFileName)
			if source == '1':
				# Get the ZIP file if is GitHub
				fetch_zip_file(URL, zipFileName)
			else:
				#Get zip file if CMK
				download_url(URL, zipFileName)
	else:
		#copy the local zip file to 'MyTestZipFile.zip'
		zipFileName = 'MyTestZipFile.zip'
		shutil.copyfile(file_box.get(), zipFileName)
		provenance = 'Local zip file'
	# Execute the transformation
	print('Creating dataset.js file...')
	add_message('Creating dataset.js file...')
	transformWorkflow(zipFileName)
	print('Saved dataset.js file!')
	add_message('Saved dataset.js file!')
	print('Done!')
	add_message('Done!')
	generate_btn.configure(state="normal")
	radiobutton_1.configure(state="normal")
	radiobutton_2.configure(state="normal")
	radiobutton_4.configure(state="normal")
	radiobutton_3.configure(state="normal")
	radiobutton_5.configure(state="normal")
	radiobutton_6.configure(state="normal")
	radiobutton_7.configure(state="normal")
	radiobutton_8.configure(state="normal")
	radiobutton_9.configure(state="normal")

def activateFilePath():
	if radio_var.get() == 9:
		file_btn.configure(state="normal")
		file_box.configure(state="normal")
		pass
	else:
		file_btn.configure(state="disabled")
		file_box.configure(state="disabled")
		pass

def select_file1():
		input_file_path1 = filedialog.askopenfilename(filetypes=(("Zip file",'*.zip'),("All files",'*.*')))
		if input_file_path1:
			file_box.delete(0, "end")
			file_box.insert(0,input_file_path1)

def my_gui():
	global file_btn, file_box, radio_var, url, header, message_box, root, generate_btn, radiobutton_1, radiobutton_2, radiobutton_3, radiobutton_4, radiobutton_5, radiobutton_6, radiobutton_7, radiobutton_8, radiobutton_9

	customtkinter.set_appearance_mode("dark")   #dark, system or light
	customtkinter.set_default_color_theme("green") #blue, green or dark-blue

	root = customtkinter.CTk()
	root.geometry("420x450")
	root.title('Archetype dataset from source')
	root.minsize(420,650)
	root.maxsize(420,650)


	customtkinter.CTkLabel(root, text = "Create archetype dataset from zip", font = ("Roboto", 24)).pack(pady = 10)


	ckm_frame = customtkinter.CTkFrame(root)
	ckm_frame.pack(pady=10, padx=10, fill = "both", expand = True)

	radio_var = tkinter.IntVar()

	radiobutton_1 = customtkinter.CTkRadioButton(ckm_frame, text="CKM International",
												  command=activateFilePath,variable= radio_var, value=1)
	radiobutton_2 = customtkinter.CTkRadioButton(ckm_frame, text="CKM CatSalut",
												  command=activateFilePath,variable= radio_var, value=2)
	radiobutton_3 = customtkinter.CTkRadioButton(ckm_frame, text="CKM Arketyper",
												  command=activateFilePath,variable= radio_var, value=3)
	radiobutton_4 = customtkinter.CTkRadioButton(ckm_frame, text="CKM HighMED",
												  command=activateFilePath,variable= radio_var, value=4)
	radiobutton_5 = customtkinter.CTkRadioButton(ckm_frame, text="GitHub International",
											  command=activateFilePath,variable= radio_var, value=5)
	radiobutton_6 = customtkinter.CTkRadioButton(ckm_frame, text="GitHub Catsalut",
											  command=activateFilePath,variable= radio_var, value=6)
	radiobutton_7 = customtkinter.CTkRadioButton(ckm_frame, text="GitHub Arketyper",
											  command=activateFilePath,variable= radio_var, value=7)
	radiobutton_8 = customtkinter.CTkRadioButton(ckm_frame, text="GitHub Apperta",
											  command=activateFilePath,variable= radio_var, value=8)
	radiobutton_9 = customtkinter.CTkRadioButton(ckm_frame, text="Local Zip file",
											  command=activateFilePath, variable= radio_var, value=9)



	customtkinter.CTkLabel(ckm_frame, text = "Select archetype source:", font = ("Roboto", 12)).grid(row = 0, column = 0, sticky='W', pady=3, padx=10)
	radiobutton_1.grid(row = 1, column = 0, sticky='W', pady=3, padx=10)
	radiobutton_2.grid(row = 2, column = 0, sticky='W', pady=3, padx=10)
	radiobutton_3.grid(row = 3, column = 0, sticky='W', pady=3, padx=10)
	radiobutton_4.grid(row = 4, column = 0, sticky='W', pady=3, padx=10)
	radiobutton_5.grid(row = 5, column = 0, sticky='W', pady=3, padx=10)
	radiobutton_6.grid(row = 6, column = 0, sticky='W', pady=3, padx=10)
	radiobutton_7.grid(row = 7, column = 0, sticky='W', pady=3, padx=10)
	radiobutton_8.grid(row = 8, column = 0, sticky='W', pady=3, padx=10)
	radiobutton_9.grid(row = 9, column = 0, sticky='W', pady=3, padx=10)


	radio_var.set(5)

	file_frame = customtkinter.CTkFrame(root)
	file_frame.pack(pady=10, padx=10, fill = "both", expand = True)

	#customtkinter.CTkLabel(file_frame, text = "Zip file:", font = ("Roboto", 12)).grid(row = 0, column = 0, sticky='W', pady=3, padx=10)
	file_box = customtkinter.CTkEntry(file_frame, width=280)
	file_box.grid(row = 0, column = 0, sticky='W', pady=3, padx=10, columnspan=2)

	file_btn = customtkinter.CTkButton(file_frame, text="Select file...", command=select_file1, width=50)
	file_btn.grid(row = 0, column = 2, sticky='W', pady=3, padx=10)
	#file_btn.pack(pady=10)
	file_btn.configure(state="disabled")
	file_box.configure(state="disabled")



	generate_btn = customtkinter.CTkButton(root, text="Download and create dataset.js", command=download)
	#generate_btn.configure(state="disabled")
	generate_btn.pack(pady = 10)

	message_box = customtkinter.CTkTextbox(root, width=400, height=180)
	message_box.pack(pady = 10)

	root.mainloop()

# WORKFLOW ***************************************************

if headless:
	if CKMorGitHub == 'CKM':
		download_url(URL, zipFileName)
	else:
		fetch_zip_file(URL, zipFileName)
	transformWorkflow(zipFileName)
else:
	my_gui()

