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
import time

# VARIABLES ******************************************************************
# general things
version = 'v4.16'
author = 'Martin A. Koch, PhD'
copyright = '(c) 2025, CatSalut. Servei Català de la Salut'
license = 'License: Apache 2.0'
# Set headless to True if you do not need the GUI (or False if you want to use the GUI
headless = True
# Variables for running script headless (without GUI)
URL = 'https://ckm.openehr.org/ckm/retrieveResources?resourceType=archetype&format=ADL&state1=INITIAL&state2=DRAFT&state3=TEAMREVIEW&state4=REVIEWSUSPENDED&state5=PUBLISHED&state6=REASSESS_DRAFT&state7=REASSESS_TEAMREVIEW&state8=REASSESS_REVIEWSUSPENDED'
zipFileName = 'TempZipFile.zip'
CKMorGitHub = 'CKM'  # "GITHUB" or "CKM", depending on source
provenance = 'ckm.openehr.org'

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
def sort_tuple_list(data, index, AtoZ):
		return sorted(data, key=lambda tup: tup[index], reverse=AtoZ)

def list_files(dir,ext):
	#temp_dir = "temp"
	# Get a list of all files in the "temp" folder
	file_list = [f for f in os.listdir(dir) if f.endswith((ext))]
	return file_list

# Read the file content
def read_file(file_path):
	with open(file_path, 'r', encoding='utf-8-sig') as file:
		data = file.read()
	return data
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

def control_data_type(variable, data_type, name):
	if data_type == 'list':
		if isinstance(variable,list):
			#look at every item in the list
			for i in range(len(variable)):
				if isinstance(variable[i],list):
					#print(name + '-listitem')
					#print('should be string before', variable[i])
					variable[i] = ' '.join(variable[i])
					#print('should be string after', variable[i])
					#input()
		else:
			#convert to list
			#print(name)
			#print('should be list before', variable)
			variable = variable.split(',')
			#variable = list(variable)# or is it variable = [variable] ?
			#print('should be list after', variable)
			#input()
	elif data_type == 'str':
		if isinstance(variable,str):
			pass
		else:
			#print(name)
			#print('should be string before', variable)
			variable = ' '.join(variable)
			#print('should be string after', variable)
			#input()
	return variable

def check_node_attribute_data_types(node):
	node['id'] = control_data_type(node['id'], 'str', 'id')
	node['archetype_id'] = control_data_type(node['archetype_id'], 'str', 'archetype_id')
	node['class'] = control_data_type(node['class'], 'str', 'class')
	node['lifecycle_state'] = control_data_type(node['lifecycle_state'], 'str', 'lifecycle_state')
	node['original_language'] = control_data_type(node['original_language'], 'str', 'orig_lang')
	node['date'] = control_data_type(node['date'], 'str', 'date')
	node['author_name'] = control_data_type(node['author_name'], 'str', 'author_name')
	node['author_organisation'] = control_data_type(node['author_organisation'], 'str', 'author_organisation')
	node['author_email'] = control_data_type(node['author_email'], 'str', 'author_email')
	node['translation_languages'] = control_data_type(node['translation_languages'], 'list', 'trans_lang')
	node['purpose'] = control_data_type(node['purpose'], 'str', 'purpose')
	node['copyright'] = control_data_type(node['copyright'], 'str', 'copyright')
	node['use'] = control_data_type(node['use'], 'str', 'use')
	node['keywords'] = control_data_type(node['keywords'], 'list', 'keywords')
	for i in range(len(node['include'])):
		node['include'][i]['code'] = control_data_type(node['include'][i]['code'], 'str', 'include-code')
		node['include'][i]['label'] = control_data_type(node['include'][i]['label'], 'str', 'include-label')
		node['include'][i]['type'] = control_data_type(node['include'][i]['type'], 'str', 'include-type')
		node['include'][i]['archetypes'] = control_data_type(node['include'][i]['archetypes'], 'list', 'include-archetypes')
	for i in range(len(node['exclude'])):
		node['exclude'][i]['code'] = control_data_type(node['exclude'][i]['code'], 'str', 'exclude-code')
		node['exclude'][i]['label'] = control_data_type(node['exclude'][i]['label'], 'str', 'exclude-label')
		node['exclude'][i]['type'] = control_data_type(node['exclude'][i]['type'], 'str', 'exclude-type')
		node['exclude'][i]['archetypes'] = control_data_type(node['exclude'][i]['archetypes'], 'list', 'exclude-archetypes')
	node['concept_name'] = control_data_type(node['concept_name'], 'str', 'concept_name')
	node['concept_description'] = control_data_type(node['concept_description'], 'str', 'concept_description')
	for i in range(len(node['items'])):
		node['items'][i]['code'] = control_data_type(node['items'][i]['code'], 'str', 'item-code')
		node['items'][i]['label'] = control_data_type(node['items'][i]['label'], 'str', 'item-label')
		node['items'][i]['type'] = control_data_type(node['items'][i]['type'], 'str', 'item-type')
		node['items'][i]['description'] = control_data_type(node['items'][i]['description'], 'str', 'item-type')
	node['parent'] = control_data_type(node['parent'], 'str', 'parent')
	pass


import shutil
import time
import os

def remove_folder_with_retries(folder, retries=5, delay=1):
    for attempt in range(retries):
        try:
            shutil.rmtree(folder)
            print(f"Deleted folder: {folder}")
            return
        except PermissionError as e:
            print(f"Attempt {attempt+1}: PermissionError - {e}")
            time.sleep(delay)
        except FileNotFoundError:
            print(f"Folder not found: {folder}")
            return
    print(f"Failed to delete folder after {retries} attempts.")

# Usage
remove_folder_with_retries('temp')

# the transformation motor (MIGHT BE CHANGED FOR ANTLR4 APPROACH IN THE FUTURE)
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
	pattern = re.compile(r'(\["([A-Za-z_0-9. - +]+)"\]\s=\s<"([\s\S]*?)">\n)')
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

	for level in range(15,0,-1):
		#print(level)
		indent = ''
		for i in range(level):
			indent+='\t'
		#print('.'+indent+'.')

		#pattern_text= r'(\t{'+str(level)+'}\["([a-zA-Z0-9-._]+)"\]\s=\s<(\n[\S\s]+?[^"])\t{'+str(level)+'}>)\n'
		pattern_text= r'(\t{'+str(level)+'}\["([A-zÀ-ú0-9-._\s+]+)"\]\s=\s<(\n[\S\s]+?[^"])\t{'+str(level)+'}>)\n'
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


# NEW JSON TRANSFORM AND PARSER FOR DEFINITION SECTION ***

def deleteEmptyLines(definition_text):
	lines = definition_text.split('\n')
	new_lines = []
	for i in range(len(lines)):
		line = lines[i].strip()
		if line!='':
			new_lines.append(lines[i])
	return '\n'.join(new_lines)

def transform_definition_to_JSON(definition_text):
	# VARIABLES ********************************************************************************
	MAXLEVEL = 100
	# PRE-PROCESSING **********************************************************************************

	#delete all comments
	# get rid of comments per line
	lines = definition_text.split('\n')
	for i in range(len(lines)):
		pattern = re.compile(r'(.*([\s\t]+--\s.*))')
		matches = pattern.finditer(lines[i])
		if matches:
			for match in matches:
				whole_sentence = match.group(1)
				comment = match.group(2)
				new_sentence = ''
				lines[i] = lines[i].replace(comment, new_sentence)
	definition_text = '\n'.join(lines)

	while definition_text.find(' \n')>-1:
		definition_text = definition_text.replace(' \n','\n')
	while definition_text.find('\t\n')>-1:
		definition_text = definition_text.replace('\t\n','\n')


	# handle rogue ordinal values
	#							0.0|[local::at0030],
	#							1.0|[local::at0031],
	#							2.0|[local::at0032],
	#							3.0|[local::at0033]
	lines = definition_text.split('\n')
	for i in range(len(lines)):
		pattern = re.compile(r'(([-]*[0-9.]*?)\|(\[.*\])[,;]*)')
		matches = pattern.finditer(lines[i])
		if matches:
			for match in matches:
				whole_sentence = match.group(1)
				key = match.group(2)
				value = match.group(3)
				#end_symbol = match.group(4)
				new_sentence = '"'+key+'": "'+value+'"'

				lines[i]=lines[i].replace(whole_sentence, new_sentence)
	definition_text = '\n'.join(lines)

	#look for single numbers in every line
	lines = definition_text.split('\n')
	for i in range(len(lines)):
		pattern = re.compile(r'([0-9.]+?$)')
		matches = pattern.finditer(lines[i])
		if matches:
			for match in matches:
				whole_sentence = match.group(1)
				lines[i]=lines[i].replace(whole_sentence, '')

	definition_text = '\n'.join(lines)

	#C_DV_QUANTITY
	#C_DV_QUANTITY - Single lines
	lines = definition_text.split('\n')
	for i in range(len(lines)):
		# units = <"mL">
		pattern = re.compile(r'(([A-Z_a-z]+)\s=\s<"(.*)">)')
		matches = pattern.finditer(lines[i])
		if matches:
			for match in matches:
				whole_sentence = match.group(1)
				key = match.group(2)
				value = match.group(3)
				if value == ' ':
					value = ''
				value = value.replace('{','').replace('}','')
				new_sentence = '"'+key+'": "'+value+'"'
				lines[i]=lines[i].replace(whole_sentence, new_sentence)


		# precision = <|0|>
		pattern = re.compile(r'(([A-Z_a-z]+)\s=\s<\|(.*)\|>)\n')
		matches = pattern.finditer(lines[i])
		if matches:
			for match in matches:
				whole_sentence = match.group(1)
				key = match.group(2)
				value = match.group(3)
				new_sentence = '"'+key+'": "'+value+'"'
				lines[i]=lines[i].replace(whole_sentence, new_sentence)

		# property = <[openehr::122]>
		pattern = re.compile(r'(([A-Z_a-z]+)\s=\s<\[(.*)\]>)')
		matches = pattern.finditer(lines[i])
		if matches:
			for match in matches:
				whole_sentence = match.group(1)
				key = match.group(2)
				value = match.group(3)
				new_sentence = '"'+key+'": "'+value+'"'
				lines[i]=lines[i].replace(whole_sentence, new_sentence)

		# precision = <1>
		pattern = re.compile(r'(([A-Z_a-z]+)\s=\s<(.*)>)')
		matches = pattern.finditer(lines[i])
		if matches:
			for match in matches:
				whole_sentence = match.group(1)
				key = match.group(2)
				value = match.group(3)
				new_sentence = '"'+key+'": "'+value+'"'
				lines[i]=lines[i].replace(whole_sentence, new_sentence)

	definition_text = '\n'.join(lines)

	#C_DV_QUANTITY - Multiple lines
	#list elements
	# ["1"] = <
	# ...
	# >
	pattern = re.compile(r'(\["(.*)"\]\s=\s<([\s\S]+?)>)\n')
	matches = pattern.finditer(definition_text)
	if matches:
		for match in matches:
			whole_sentence = match.group(1)
			key = match.group(2)
			value = match.group(3)
			new_sentence = '"'+key+'": {'+value+'}'
			definition_text=definition_text.replace(whole_sentence, new_sentence)

	#list
	# list = <
	# ...
	# >
	pattern = re.compile(r'(([\t]*)(.*)\s=\s<([\s\S]+?)>)\n')
	matches = pattern.finditer(definition_text)
	if matches:
		for match in matches:
			whole_sentence = match.group(1)
			tabs = match.group(2)
			key = match.group(3)
			value = match.group(4)
			new_sentence = tabs + '"'+key+'": {'+value+'}'
			definition_text=definition_text.replace(whole_sentence, new_sentence)


	# C_DV_QUANTITY
	# C_DV_QUANTITY <
	# ...
	# >
	pattern = re.compile(r'(([\t]*)(.*)\s<([\s\S]+?)>)\n')
	matches = pattern.finditer(definition_text)
	if matches:
		for match in matches:
			whole_sentence = match.group(1)
			tabs = match.group(2)
			key = match.group(3)
			value = match.group(4)
			new_sentence = tabs + '"'+key+'": {'+value+'}'
			definition_text=definition_text.replace(whole_sentence, new_sentence)

	#get rid of ELEMENTS with a space between ELEMENT and [atNNNN] LINE
	lines = definition_text.split('\n')
	for i in range(len(lines)):
		pattern = re.compile(r'(([A-Z_]+)\s(\[at.*\]))')
		matches = pattern.finditer(lines[i])
		if matches:
			for match in matches:
				whole_sentence = match.group(1)
				key = match.group(2)
				value = match.group(3)
				new_sentence = key+value
				lines[i]=lines[i].replace(whole_sentence, new_sentence)

	definition_text = '\n'.join(lines)

	#delete all cardinality, occurrences and exostence LINE
	lines = definition_text.split('\n')
	for i in range(len(lines)):
		pattern = re.compile(r'(cardinality\smatches\s\{.*?\})')
		matches = pattern.finditer(lines[i])
		if matches:
			for match in matches:
				whole_sentence = match.group(1)
				lines[i]=lines[i].replace(whole_sentence, '')

		pattern = re.compile(r'(occurrences\smatches\s\{.*?\})')
		matches = pattern.finditer(lines[i])
		if matches:
			for match in matches:
				whole_sentence = match.group(1)
				lines[i]=lines[i].replace(whole_sentence, '')

		pattern = re.compile(r'(existence\smatches\s\{.*?\})')
		matches = pattern.finditer(lines[i])
		if matches:
			for match in matches:
				whole_sentence = match.group(1)
				lines[i]=lines[i].replace(whole_sentence, '')
	definition_text = '\n'.join(lines)

	#delete lines of use_node	SINGLE LINE
	lines = definition_text.split('\n')
	for i in range(len(lines)):
		pattern = re.compile(r'(([\t]*)use_node.*)')
		matches = pattern.finditer(lines[i])
		if matches:
			for match in matches:
				whole_sentence = match.group(1)
				tabs = match.group(2)
				lines[i]=lines[i].replace(whole_sentence, tabs)

	definition_text = '\n'.join(lines)


	#delete allow_archetype CLUSTER[at0003] matches
	definition_text=definition_text.replace('allow_archetype ', '')

	definition_text = deleteEmptyLines(definition_text)

	#Remember where we hava series of variables (from C_DV_QUANTITY sections)
	pattern = re.compile(r'("\n[\t]*")')
	matches = pattern.finditer(definition_text)
	if matches:
		for match in matches:
			whole_sentence = match.group(1)
			definition_text=definition_text.replace(whole_sentence, '"REMEMBERLINEBREAKHERE"')


	# make one line
	definition_text = definition_text.replace('\n',' ')
	definition_text = definition_text.replace('\t',' ')
	while definition_text.find('  ')>-1:
		definition_text = definition_text.replace('  ',' ')


	#add line breaks before { and after }
	definition_text = definition_text.replace('{','\n{\n')
	definition_text = definition_text.replace('}','\n}\n')
	definition_text = definition_text.replace('\n ','\n')
	definition_text = definition_text.replace('REMEMBERLINEBREAKHERE','\n')

	#add levels to lines
	lines = definition_text.split('\n')
	level = 0
	separator = '\t'
	new_lines = []
	highscore = 0
	for i in range(len(lines)):
		line = lines[i].strip()
		if line!='':
			if line.find('{')>-1:
				level+=1
				if level > highscore: #get the highest level of tabs
					highscore = level
			s=''
			for j in range(level):
				s+=separator
			new_lines.append(s + line)
			if line.find('}')>-1:
				level-=1
	definition_text = '\n'.join(new_lines)
	MAXLEVEL = highscore + 1

	#adjust include (going down levels)
	for level in range(MAXLEVEL,-1,-1):
		indent = ''
		for i in range(level+1):
			indent+='\t'
		pattern = re.compile(r'((\t{'+str(level)+'})include\sarchetype_id/value\smatches\n)')
		matches = pattern.finditer(definition_text)
		if matches:
			for match in matches:
				whole_sentence = match.group(1)
				tabs = match.group(2)
				new_sentence = tabs + 'include\n' + tabs + 'archetype_id/value matches\n'
				definition_text=definition_text.replace(whole_sentence,new_sentence)
				break

	#adjust exclude (going down levels)
	for level in range(MAXLEVEL,-1,-1):

		indent = ''
		for i in range(level+1):
			indent+='\t'

		pattern = re.compile(r'((\t{'+str(level)+'})exclude\sarchetype_id/value\smatches\n)')
		matches = pattern.finditer(definition_text)
		if matches:
			for match in matches:
				whole_sentence = match.group(1)
				tabs = match.group(2)
				new_sentence = tabs + 'exclude\n' + tabs + 'archetype_id/value matches\n'
				definition_text=definition_text.replace(whole_sentence,new_sentence)
				break


	#add tab to archetype_id/value matches
	definition_text = definition_text.replace('archetype_id/value','\tarchetype_id/value')

	#save the input into a temp file
	"""with open("temp_before_transformation.txt", "w", encoding='utf-8') as f:
		f.write(definition_text)"""

	#input('I wrote the BEFORE TRANSFORMATION file!!!! Press ENTER if you want to continue....')

	#PROCESSING ****************************************************************************************
	# NESTED STRUCTURES *************************************************************
	# LEVEL 4 STRUCTURE: ["key"] = <
	# ...
	# >
	# (\t{4}\["([a-zA-Z0-9-._]+)"\]\s=\s<(\n[\S\s]+?[^"])\t{4}>\n)
	#

	# LEVEL 2 STRUCTURE: ["key"] = <
	# ...
	# >

	for level in range(MAXLEVEL,-1,-1):
		indent = ''
		for i in range(level+1):
			indent+='\t'

		#add  * to empty
		#								{
		#								}
		pattern = re.compile(r'(([\t]+){'+str(level)+'}\{\n\t{'+str(level)+'}\})')
		matches = pattern.finditer(definition_text)
		if matches:
			for match in matches:
				whole_sentence = match.group(1)
				tabs = indent[:-1]
				new_sentence = tabs + '{\n' + tabs + '"dummy_value": ""\n' + tabs + '}\n'
				definition_text=definition_text.replace(whole_sentence,new_sentence)


		#only one item in the structure
		#DV_TEXT matches
		#								{
		#								*
		#								}
		#pattern_text = r'(([A-Za-z_0-9.-<>\[\]]+)\smatches\n\t{'+str(level)+'}[^t]\{\n\t{'+str(level)+'}[^t](.*?)\n\t{'+str(level)+'}[^t]\})'
		pattern_text = r'(([\t]*)([A-Za-z_0-9.-<>\[\]]+)\smatches\n\t{'+str(level)+'}\{\n\t{'+str(level)+'}(.*?)\n\t{'+str(level)+'}\})'
		pattern = re.compile(pattern_text)
		matches = pattern.finditer(definition_text)
		if matches:
			for match in matches:
				whole_sentence = match.group(1)
				tabs = match.group(2)
				key = match.group(3)
				value = match.group(4)
				value  = value.replace('"','').replace('\\','\\\\')
				new_sentence = indent + '"'+key+'": "' + value + '"\n'
				definition_text=definition_text.replace(whole_sentence,new_sentence)



		#structure
		pattern_text = r'(([\t]*)([A-Za-z_0-9.-<>\[\]]+)\smatches\n\t{'+str(level)+'}\{\n([\s\S]+?)\n\t{'+str(level)+'}\})'
		pattern = re.compile(pattern_text)
		matches = pattern.finditer(definition_text)
		if matches:
			for match in matches:
				whole_sentence = match.group(1)
				tabs = match.group(2)
				key = match.group(3)
				#key = key.replace('.','')
				#key = key.replace('[','').replace(']','')
				value = match.group(4)
				new_sentence = tabs + '"'+key+'":\n'+ indent + '{\n' + value + '\n' +indent+'}\n'
				definition_text=definition_text.replace(whole_sentence,new_sentence)

	definition_text = deleteEmptyLines(definition_text)

	# going down levels, replace the include statements
	for level in range(MAXLEVEL,-1,-1):
		indent = ''
		for i in range(level+1):
			indent+='\t'
		pattern = re.compile(r'(([\t]+)include\n\t{'+str(level)+'}[\s\S]+?)(\}|exclude)')
		matches = pattern.finditer(definition_text)
		if matches:
			for match in matches:
				whole_sentence = match.group(1)
				tabs = match.group(2)
				if match.group(3) == 'exclude':
					new_sentence = whole_sentence.replace('include','"include": {') + '}\n' + tabs
				else:
					new_sentence = whole_sentence.replace('include','"include": {') + '}\n'
				definition_text=definition_text.replace(whole_sentence,new_sentence)

	# going doen levels, replace the exclude statements
	for level in range(MAXLEVEL,-1,-1):
		indent = ''
		for i in range(level+1):
			indent+='\t'
		pattern = re.compile(r'(([\t]+exclude\n\t{'+str(level)+'}[\s\S]+?))(\}|include)')
		matches = pattern.finditer(definition_text)
		if matches:
			for match in matches:
				whole_sentence = match.group(1)
				new_sentence = whole_sentence.replace('exclude','"exclude": {') + '}'
				definition_text=definition_text.replace(whole_sentence,new_sentence)

	#POST-PROCESSING ************************************************************************************
	#ADDING COMMAS ************************************************************

	#comma between " and "
	pattern = re.compile(r'((".*?")([\n\t\s]+)(".*?"))')
	matches = pattern.finditer(definition_text)
	if matches:
		for match in matches:
			whole_sentence = match.group(1)
			key = match.group(2)
			separation = match.group(3)
			value = match.group(4)
			new_sentence = key+','+separation+value
			definition_text=definition_text.replace(whole_sentence,new_sentence)

	#comma between } and "
	pattern = re.compile(r'((})([\n\t\s]+)(".*?"))')
	matches = pattern.finditer(definition_text)
	if matches:
		for match in matches:
			whole_sentence = match.group(1)
			key = match.group(2)
			separation = match.group(3)
			value = match.group(4)
			new_sentence = key+','+separation+value
			definition_text=definition_text.replace(whole_sentence,new_sentence)

	#comma between ] and "
	pattern = re.compile(r'((\])([\n\t\s]+)(".*?"))')
	matches = pattern.finditer(definition_text)
	if matches:
		for match in matches:
			whole_sentence = match.group(1)
			key = match.group(2)
			separation = match.group(3)
			value = match.group(4)
			new_sentence = key+','+separation+value
			definition_text=definition_text.replace(whole_sentence,new_sentence)

	definition_text = '{\n' + definition_text + '\n}'

	# change inclusion/exclusion names, so they do not get overwritten
	lines = definition_text.split('\n')
	flag = 0
	for i in range(len(lines)):
		if lines[i].find('"archetype_id/value": "')>-1:
			if flag>0:
				lines[i] = lines[i].replace('"archetype_id/value": "','"archetype_id/value'+'_'+str(flag)+'": "')
			flag+=1
		else:
			flag=0
		pass

	definition_text = '\n'.join(lines)

	"""with open("temp_after_transformation.txt", "w", encoding='utf-8') as f:
		f.write(definition_text)"""

	return json.loads(definition_text)


def get_occurrences_from_definition(definition_text):
	# get all occurrences, if defined
	lines = definition_text.split('\n')

	occurr_dict = {}

	for i in range(len(lines)):
		pattern = re.compile(r'\[(at[0-9]+)\].*occurrences.*matches.*\{([0-9*]+..[0-9*]+)\}')
		matches = pattern.finditer(lines[i])
		element_pattern = re.compile(r'ELEMENT\[(at[0-9]+)\](?!.*occurrences matches).*matches \{')
		element_matches = element_pattern.finditer(lines[i])
		cluster_pattern = re.compile(r'CLUSTER\[(at[0-9]+)\](?!.*occurrences matches).*matches \{')
		cluster_matches = cluster_pattern.finditer(lines[i])

		if matches:
			for match in matches:
				occurr_dict[match.group(1)] = match.group(2)
		if element_matches:
			for element_match in element_matches:
				occurr_dict[element_match.group(1)] = '1..1'
		if cluster_matches:
			for cluster_match in cluster_matches:
				occurr_dict[cluster_match.group(1)] = '1..1'

	return occurr_dict



def parse_definition_for_elements(temp_JSON, element_list):
	for key in temp_JSON.keys():
		if isinstance(temp_JSON[key], dict):
			if key.find('[at')>-1:
				code_index = key.find('[at')
				code = key[code_index+1:-1]
				type = key[:code_index]
				if type == 'ELEMENT':
					if 'value' in temp_JSON[key].keys():
						if isinstance(temp_JSON[key]['value'],dict):
							datatypes = str(list(temp_JSON[key]['value'].keys()))
							pattern = re.compile(r'\[\'[0-9]+\',*')
							matches = pattern.finditer(datatypes)
							if matches:
								datatypes = "['DV_ORDINAL']"
							element_list.append((datatypes,code))
						else:
							element_list.append((type,code))
					else:
						element_list.append((type,code))
				else:
					element_list.append((type,code))
			parse_definition_for_elements(temp_JSON[key],element_list)
	return element_list

def parse_definition_for_inclusions(temp_JSON, inclusion_list, includeorexclude):
	global archetypeIdList
	for key in temp_JSON.keys():
		if isinstance(temp_JSON[key], dict):
			if key.find('[at')>-1:
				if isinstance(temp_JSON[key], dict):
					if includeorexclude in temp_JSON[key].keys():
						temp_list=[]
						for key2 in temp_JSON[key][includeorexclude].keys():
							clusion = temp_JSON[key][includeorexclude][key2]
							if clusion[0]=='/':
								clusion = clusion[1:]
							if clusion[-1]=='/':
								clusion = clusion[:-1]
							clusion = clusion.replace('\\\\','\\')
							temp_list+=clusion.split('|')
						#SEARCH FOR ARCHETYPES USING TEMP_LIST PATTERNS....
						if len(temp_list)>0:
							a_list = []
							for pattern in temp_list:
								a_list += get_archetypes_from_pattern(pattern, archetypeIdList)
						code_index = key.find('[at')
						code = key[code_index+1:-1]
						type = key[:code_index]
						if len(a_list)>0:
							inclusion_list.append((a_list, type, code))
			parse_definition_for_inclusions(temp_JSON[key],inclusion_list,includeorexclude)
	return inclusion_list

def dict_to_html(d, indent=0):
	css = """
		<style>
		.dict-level {
			list-style-type: none;
			margin-left: 1.5em;
			padding-left: 1em;
			border-left: 2px solid #b3c6ff;
			background: #f8faff;
			font-family: 'Segoe UI', Arial, sans-serif;
			font-size: 15px;
		}
		.dict-key {
			font-weight: bold;
			color: #2a3b8f;
		}
		.dict-value {
			color: #1a7f37;
			font-family: 'Fira Mono', 'Consolas', monospace;
		}
		.dict-level > li {
			margin-bottom: 0.3em;
			padding: 0.2em 0.5em;
			border-radius: 4px;
			transition: background 0.2s;
		}
		.dict-level > li:hover {
			background: #e6f0ff;
		}
		</style>
		"""
	html = ""
	indent_str = "  " * indent
	if isinstance(d, dict):
		html += f"{indent_str}<ul class='dict-level'>\n"
		for key, value in d.items():
			html += f"{indent_str}  <li><span class='dict-key'>{key}</span>: "
			if isinstance(value, (dict, list)):
				html += "\n" + dict_to_html(value, indent + 2) + f"{indent_str}  "
			else:
				html += f"<span class='dict-value'>{value}</span>"
			html += "</li>\n"
		html += f"{indent_str}</ul>\n"
	elif isinstance(d, list):
		html += f"{indent_str}<ul class='dict-level'>\n"
		for item in d:
			html += f"{indent_str}  <li>"
			html += dict_to_html(item, indent + 2)
			html += f"{indent_str}  </li>\n"
		html += f"{indent_str}</ul>\n"
	else:
		html += f"<span class='dict-value'>{d}</span>"
	return html

def dict_to_collapsible_html(d):
    html = ""
    if isinstance(d, dict):
        for key, value in d.items():
            if isinstance(value, (dict, list)):
                html += f"<details><summary>{key}</summary>{dict_to_collapsible_html(value)}</details>\n"
            else:
                html += f"<div><span class='dict-key'>{key}</span>: <span class='dict-value'>{value}</span></div>\n"
    elif isinstance(d, list):
        html += "<ul>"
        for item in d:
            html += "<li>" + dict_to_collapsible_html(item) + "</li>"
        html += "</ul>"
    else:
        html += f"<span class='dict-value'>{d}</span>"
    return html

def convert_and_parse_definition_section(definition_section):
	definition_text = '\n'.join(definition_section)
	definition_JSON = transform_definition_to_JSON(definition_text)
	#structure_html = dict_to_html(definition_JSON)
	structure_html = dict_to_collapsible_html(definition_JSON)


	element_list = []
	element_list = parse_definition_for_elements(definition_JSON, element_list)
	inclusion_list = []
	inclusion_list = parse_definition_for_inclusions(definition_JSON, inclusion_list, 'include')
	exclusion_list = []
	exclusion_list = parse_definition_for_inclusions(definition_JSON, exclusion_list, 'exclude')
	occurr_dic = get_occurrences_from_definition(definition_text)

	return element_list, inclusion_list, exclusion_list, occurr_dic, structure_html

def get_archetypes_from_pattern(pattern, archetypeIdList):
	outputList = []
	#convert patterns to list of archetypes
	#creata a list of existing archetypes from the archetypes lsit that match the patterns
	if pattern != '.*':		#HERE WE LIMIT OURSELVES TO DISCRETE INCLUSIONS. IF THE INCLUSION IS GENERIC, THE ARCHETYPE GETS CONNECTED TO EVERYTHING...
		for id in archetypeIdList:
			p = re.compile(pattern)
			x = re.match(p, id)
			if x:
				outputList.append(id)
	else:
		outputList.append('any_archetype')
	return outputList



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

"""def count_matches(a, b):
	  return sum(x == y for x, y in zip(a, b))"""

def count_matches(a, b):
	sum = 0
	for item_a in a:
		for item_b in b:
			if item_a == item_b:
				sum+=1
	return sum

# THE BIG MAIN FUNCTION THAT CONTROLS THE TRANSFORMATION WORKFLOW
def transformWorkflow(zipFileName):
	global archetypeIdList
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
		if not headless:
			add_message(file)
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
		print('Creating definition JSON')
		#inclusions, exclusions, elements = parse_inclusion_exclusion_elements(definition_section, archetypeIdList)
		element_list, inclusion_list, exclusion_list, occurr_dic, structure_html = convert_and_parse_definition_section(definition_section)

		print('Creating node...')
		node = {}
		#print(ontology_JSON)
		#gather information that we need
		# id
		node['id'] = archetype_id
		node['archetype_id'] = archetype_id
		# class
		pattern = re.compile(r'openEHR-(.+-.+)\..*\.v[0-9]+')
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


		#license
		node['licence'] = ''
		if 'other_details' in description_JSON.keys():
			if isinstance(description_JSON['other_details'], dict):
				if 'licence' in description_JSON['other_details'].keys():
					node['licence'] = str(description_JSON['other_details']['licence'])

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

		"""
		#author
		if 'original_author' in description_JSON.keys():
			node['original_author'] = description_JSON['original_author']
		else:
			node['original_author'] = ''
		"""


		#original author date, name, organisation, email
		node['date'] = ''
		node['author_name'] = ''
		node['author_organisation'] = ''
		node['author_email'] = ''

		if 'original_author' in description_JSON.keys():
			if isinstance(description_JSON['original_author'],dict):
				if 'date' in description_JSON['original_author'].keys():
					node['date'] = str(description_JSON['original_author']['date'])
				if 'name' in description_JSON['original_author'].keys():
					node['author_name'] = str(description_JSON['original_author']['name'])
				if 'organisation' in description_JSON['original_author'].keys():
					node['author_organisation'] = str(description_JSON['original_author']['organisation'])
				if 'email' in description_JSON['original_author'].keys():
					node['author_email'] = str(description_JSON['original_author']['email'])

		# WATCH OUT! IF ORIGINAL LANGUAGE IS NOT "EN", we are going to try to get english information, if available...
		default_language = 'en'

		# translation languages
		if 'translations' in language_JSON.keys():
			node['translation_languages'] = list(language_JSON['translations'].keys())
		else:
			node['translation_languages'] = []

		print('Adding purpose...')
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
				node['purpose'] = str(description_JSON['details'][current_language]['purpose'])
			else:
				node['purpose'] = ''
			# use
			if 'use' in description_JSON['details'][current_language].keys():
				node['use'] = str(description_JSON['details'][current_language]['use'])
			else:
				node['use'] = ''
			# misuse
			if 'misuse' in description_JSON['details'][current_language].keys():
				node['misuse'] = str(description_JSON['details'][current_language]['misuse'])
			else:
				node['misuse'] = ''
			# keywords
			if 'keywords' in description_JSON['details'][current_language].keys():
				node['keywords'] = description_JSON['details'][current_language]['keywords']
			else:
				node['keywords'] = []
			#copyright
			if 'copyright' in description_JSON['details'][current_language].keys():
				node['copyright'] = str(description_JSON['details'][current_language]['copyright'])
			else:
				node['copyright'] = ''
		else:
				node['copyright'] = ''
				node['purpose'] = ''
				node['use'] = ''
				node['keywords'] = []


		print('Adding included archetypes...')
		# included archetypes
		node['include']=[]
		if default_language in ontology_JSON['term_definitions'].keys():
			current_language = default_language
		else:
			current_language = node['original_language']
		for inclusion in inclusion_list:
			incl_list = inclusion[0]
			datatype = inclusion[1]
			code = inclusion[2]
			label = ontology_JSON['term_definitions'][current_language]['items'][inclusion[2]]['text']
			inclusion_dict = {'code': code, 'label':label, 'type': datatype, 'archetypes': incl_list}
			node['include'].append(inclusion_dict)

		print('Adding excluded archetypes...')
		# excluded archetypes
		node['exclude']=[]
		if default_language in ontology_JSON['term_definitions'].keys():
			current_language = default_language
		else:
			current_language = node['original_language']
		for exclusion in exclusion_list:
			excl_list = exclusion[0]
			datatype = exclusion[1]
			code = exclusion[2]
			label = ontology_JSON['term_definitions'][current_language]['items'][exclusion[2]]['text']
			exclusion_dict = {'code': code, 'label':label, 'type': datatype, 'archetypes': excl_list}
			node['exclude'].append(exclusion_dict)

		# concept (from at0000)
		if default_language in ontology_JSON['term_definitions'].keys():
			current_language = default_language
		else:
			current_language = node['original_language']
		#print(archetype_id)
		#does at0000 exist?
		if 'at0000' in ontology_JSON['term_definitions'][current_language]['items'].keys():
			node['concept_name']=ontology_JSON['term_definitions'][current_language]['items']['at0000']['text']
			node['concept_description']=str(ontology_JSON['term_definitions'][current_language]['items']['at0000']['description'])
		elif 'at0000.1' in ontology_JSON['term_definitions'][current_language]['items'].keys():
			node['concept_name']=ontology_JSON['term_definitions'][current_language]['items']['at0000.1']['text']
			node['concept_description']=str(ontology_JSON['term_definitions'][current_language]['items']['at0000.1']['description'])
		else:
			node['concept_name']=''
			node['concept_description']=''

		print('Adding elements...')
		#elements
		node['items']=[]
		if default_language in ontology_JSON['term_definitions'].keys():
			current_language = default_language
		else:
			current_language = node['original_language']
		for element in element_list:
			datatype = element[0]
			code = element[1]
			label = ontology_JSON['term_definitions'][current_language]['items'][element[1]]['text']
			description = ontology_JSON['term_definitions'][current_language]['items'][element[1]]['description']
			if isinstance(label,list):
				label = str(label).replace(']','').replace('[','')
			if isinstance(description,list):
				description = str(description).replace(']','').replace('[','')
					#occurrence
			occurrence = ''
			if code in occurr_dic.keys():
				occurrence = occurr_dic[code]
			element_dict = {'code': code, 'label':label, 'type': datatype, 'description' : description, 'occurrence': occurrence}
			node['items'].append(element_dict)

		# change structure_html
		node['structure'] = ''
		for item in node['items']:
			if item['occurrence']!='':
				structure_html = structure_html.replace('['+item['code']+']','['+item['code']+'] '+'<span class="dict-label">'+item['label']+'</span> '+'<span class="dict-occurrences">'+item['occurrence']+'</span>')
			else:
				structure_html = structure_html.replace('['+item['code']+']','['+item['code']+'] '+'<span class="dict-label">'+item['label']+'</span>')
		while structure_html.find('  ')>-1:
			structure_html = structure_html.replace('  ',' ')
		structure_html = structure_html.replace('\n','')
		node['structure'] = structure_html

		#parent archetype
		node['parent']=''
		pattern = re.compile(r'specialise[\t\n]+(openEHR-.+-.+\.v[0-9]+)')
		matches = pattern.finditer(file_content)
		if matches:
			for match in matches:
				node['parent']= match.group(1)
				break

		check_node_attribute_data_types(node)
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

	#review purpose (every one has to NOT be a list)
	for ex_arch in existing_archetypes:
		if isinstance(ex_arch['purpose'], list):
			ex_arch['purpose'] = ' '.join(ex_arch['purpose'])

	#review all items. If the item is a list, it cannot contain another list
	for i in range(len(existing_archetypes)):
		for key in existing_archetypes[i].keys():
			if isinstance(existing_archetypes[i][key],list):
				for j in range(len(existing_archetypes[i][key])):
					if isinstance(existing_archetypes[i][key][j],list):
						existing_archetypes[i][key][j] = ' '.join(existing_archetypes[i][key][j])
	


	print('Creating auto-keywords...')
	#get all keywords
	all_keywords = []
	for a in existing_archetypes:
		all_keywords+=a['keywords']
	for i in range(len(all_keywords)):
		all_keywords[i] = all_keywords[i].lower()
	while '' in all_keywords:
		all_keywords.remove('')
	while ' ' in all_keywords:
		all_keywords.remove(' ')
	unique_keywords = list(set(all_keywords))
	# for every archetype, see if any keyword is its use, description or purpose
	for ex_arch in existing_archetypes:
		if ex_arch['keywords']==[]:
			ex_arch['auto-keywords']=[]
			for kw in unique_keywords:
				#if ex_arch['use'].lower().find(' '+kw)>-1 or ex_arch['purpose'].lower().find(' '+kw)>-1 or ex_arch['concept_description'].lower().find(' '+kw)>-1:
				if ex_arch['purpose'].lower().find(' '+kw+' ')>-1 or ex_arch['concept_description'].lower().find(' '+kw+' ')>-1  or ex_arch['use'].lower().find(' '+kw+' ')>-1:
					ex_arch['auto-keywords'].append(kw)
			# add existing keywords to auto keywords
			ex_arch['auto-keywords']=list(set(ex_arch['auto-keywords']+ex_arch['keywords']))
		else: 
			ex_arch['auto-keywords']=ex_arch['keywords']


	"""#add synonyms for the keywords

	print('Adding keyword synonyms...')
	for ex_arch in existing_archetypes:
		thesaurus_rex = []
		for kw in ex_arch['auto-keywords']:
			current_kw = kw.replace(' ', '_')
			if current_kw in synonyms.keys():
				thesaurus_rex += synonyms[current_kw]
		thesaurus_rex=list(set(thesaurus_rex))
		ex_arch['keyword_synonyms']=thesaurus_rex"""


	print('Adding similar archetypes...')

	#add similar archetypes
	wv = [0, 0.9, 0.1, 1]
	for ex_arch in existing_archetypes:
		#print(ex_arch['id'])
		currentKeywords = [kw.lower() for kw in ex_arch['keywords']]
		currentAutoKeywords = [kw.lower() for kw in ex_arch['auto-keywords']]
		#delete keywords from auto-keywords
		currentItems = list(set([kw['label'].lower() for kw in ex_arch['items']]))
		#create dataframe
		#df_out = pd.DataFrame(columns=['id','score'])
		similar_archetypes_list = []
		for other_arch in existing_archetypes:
			if other_arch['id']!=ex_arch['id']:
				tempId =  other_arch['id']
				tempKeywords = [kw.lower() for kw in  other_arch['keywords']]
				tempAutoKeywords = [kw.lower() for kw in  other_arch['auto-keywords']]
				tempItems = list(set([kw['label'].lower() for kw in other_arch['items']]))
				commonItems = ["tree", "comment", "extension", "item tree", "any event", "description", "event series", "additional details", "itemtree"]
				for ci in commonItems:
					if ci in tempItems:
						tempItems.remove(ci)
				N_kw = count_matches(currentKeywords, tempKeywords)
				N_akw = count_matches(currentAutoKeywords, tempAutoKeywords)
				N_it = count_matches(currentItems, tempItems)
				w1 = wv[0]
				w2 = wv[1]
				w3 = wv[2]
				score = w1 * N_kw + w2 * N_akw + w3 * N_it
				threshold = wv[3]
				if score >= threshold:
					#df_out.loc[len(df_out)]=[tempId, score]
					similar_archetypes_list.append((tempId,score))
		#df_out = df_out.sort_values(by=['score'], ascending=False).reset_index(drop=True)
		#recommendationList = list(df_out['id'])
		similar_archetypes_list = sort_tuple_list(similar_archetypes_list,1,True)

		recommendationList = []
		for sal in similar_archetypes_list:
			recommendationList.append(sal[0])

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
		#only allow ten reccomendations
		if len(recommendationList) > 10:
			recommendationList = recommendationList[0:10]
		ex_arch['similar'] = recommendationList

	print('Saving to file...')
	#prepare and save our edges and nodes
	nodeText = 'const provenance = "' + provenance + '";\nconst extraction_date = "' + download_time + '";\n'
	nodeText += "const allNodes = " + json.dumps(existing_archetypes, ensure_ascii=False) + ";\n"

	f = open("dataset.js", "w", encoding='utf-8')
	f.write(nodeText)
	f.close()

	print('Cleaning up!')
	# CLEAN UP TEMP FILES *****************************************************************************
	"""#get list of remaining files in temp folder
	remaining_files = os.listdir('temp/')
	#delete remaining files
	for rem in remaining_files:
		os.remove('temp/' + rem)

	#delete temp folder
	os.rmdir('temp')"""

	#delete temp folder
	remove_folder_with_retries('temp')

	#delete zip file
	os.remove(zipFileName)
	print('Done!')

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
			#base_URL = 'https://ckm.openehr.org/ckm/'
			prefix = 'CKM_INT'
			source = '2'
			provenance = 'CKM International (ckm.openehr.org)'
		case 2:
			URL = catsalut_url_CKM
			#base_URL = 'https://ckm.salut.gencat.cat/ckm/'
			prefix = 'CKM_CAT'
			source = '2'
			provenance = 'CKM CatSalut (ckm.salut.gencat.cat)'
		case 3:
			URL = arketyper_url_CKM
			#base_URL = 'https://arketyper.no/ckm/'
			prefix = 'CKM_NO'
			source = '2'
			provenance = 'CKM Arketyper (arketyper.no)'
		case 4:
			URL = highmed_url_CKM
			#base_URL = 'https://ckm.highmed.org/ckm/'
			prefix = 'CKM_DE'
			source = '2'
			provenance = 'CKM HighMed (ckm.highmed.org)'
		case 5:
			URL = international_url_github
			#base_URL = 'https://ckm.openehr.org/ckm/'
			prefix = 'GIT_INT'
			source = '1'
			provenance = 'GitHub International'
		case 6:
			URL = catsalut_url_github
			#base_URL = 'https://ckm.salut.gencat.cat/ckm/'
			prefix = 'GIT_CAT'
			source = '1'
			provenance = 'GitHub CatSalut'
		case 7:
			URL = arketyper_url_github
			#base_URL = 'https://arketyper.no/ckm/'
			prefix = 'GIT_NO'
			source = '1'
			provenance = 'GitHub Arketyper'
		case 8:
			URL = apperta_url_github
			#base_URL = None
			prefix = 'GIT_UK'
			source = '1'
			provenance = 'GitHub Apperta'
		case _:
			URL = None
			#base_URL = None
			prefix = None
			source = None
			provenance = ''


	return URL, prefix, source

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
		"""#get list of remaining files in temp folder
		remaining_files = os.listdir('temp/')
		#delete remaining files
		add_message('Deleting temp files...')
		for rem in remaining_files:
			os.remove('temp/' + rem)
		#delete temp folder
		add_message('Deleting temp folder...')
		os.rmdir('temp')"""
		#delete temp folder
		remove_folder_with_retries('temp')

	if radio_var.get()!=9:
		URL, prefix, source = select_URL_pre_source()
		#input_folder_path
		#add_message('Output path' + input_folder_path)
		if URL:
			#download zip file
			print('Connecting to', URL)
			add_message('Connecting to ' +URL)
			# zipFileName = input_folder_path + '/source_'+prefix+'.zip'
			zipFileName = 'TempZipFile.zip'
			add_message('Saving ZIP to ' + zipFileName)
			if source == '1':
				# Get the ZIP file if is GitHub
				fetch_zip_file(URL, zipFileName)
			else:
				#Get zip file if CMK
				download_url(URL, zipFileName)
	else:
		if os.path.isfile(file_box.get()):
			#copy the local zip file to 'TempZipFile.zip'
			zipFileName = 'TempZipFile.zip'
			shutil.copyfile(file_box.get(), zipFileName)
			# provenance = 'Local zip file'
			provenance = os.path.basename(file_box.get())
		else:
			add_message('Select valid ZIP file!')
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
			activateFilePath()
			return
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
	activateFilePath()

def activateFilePath():
	if radio_var.get() == 9:
		file_btn.configure(state="normal")
		file_box.configure(state="normal")
		pass
	else:
		file_box.delete(0, "end")
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


	customtkinter.CTkLabel(root, text = "Create archetype ADL 1.4 dataset", font = ("Roboto", 24)).pack(pady = 10)


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


	radio_var.set(1)

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

	add_message(version)
	add_message(copyright)
	add_message(license)
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

