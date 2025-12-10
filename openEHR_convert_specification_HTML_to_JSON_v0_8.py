#import xmltojson
import json
import os
import re
import pandas as pd
import requests
import tkinter
import customtkinter
from customtkinter import filedialog
try:
	from BeautifulSoup import BeautifulSoup
except ImportError:
	from bs4 import BeautifulSoup

headlessMode = True   #set to False for GUI

def list_files(temp_dir,extension):
	#temp_dir = "temp"
	# Get a list of all files in the "temp" folder
	ALL_files = [f for f in os.listdir(temp_dir) if f.endswith((extension))]
	return ALL_files

def download_RM(outputdir):
	#outputdir = entry_box.get()

	RM = {}
	RM['RM']={}

	URL_list = [
	'https://specifications.openehr.org/releases/BASE/latest/base_types.html',
	'https://specifications.openehr.org/releases/RM/latest/common.html',
	'https://specifications.openehr.org/releases/RM/latest/data_structures.html',
	'https://specifications.openehr.org/releases/RM/latest/data_types.html',
	'https://specifications.openehr.org/releases/RM/latest/demographic.html',
	'https://specifications.openehr.org/releases/RM/latest/ehr_extract.html',
	'https://specifications.openehr.org/releases/RM/latest/ehr.html',
	'https://specifications.openehr.org/releases/RM/latest/integration.html',
	'https://specifications.openehr.org/releases/RM/latest/support.html'
	]

	#for h in html_list:
	for url in URL_list:
		print('Looking at', url)
		add_message('Opening ' + url)
		html = requests.get(url).text

		soup = BeautifulSoup(html, "html.parser")
		results = soup.find_all('tbody')

		add_message('Extracting tables...')
		for table in results:
			#table = results[14]
			table_rows = table.find_all('tr')
			RM_class = ''
			for i in range(0,len(table_rows)):
				row = table_rows[i]
				header_cells = row.find_all('th')
				table_cells = row.find_all('td')
				if len(header_cells) == 1 and header_cells[0].text == "Inherit":
					RM['RM'][RM_class]['inherit']=table_cells[0].text.strip()
				if len(header_cells) == 1 and header_cells[0].text == "Description":
					RM['RM'][RM_class]['description']=table_cells[0].text.strip()
				if len(header_cells) == 2 and (header_cells[0].text == "Class" or header_cells[0].text == "Interface" or header_cells[0].text == "Enumeration"):
					RM_class = header_cells[1].text
					raw_title = RM_class
					RM_class = RM_class.replace('(abstract)','')
					RM_class = RM_class.strip()
					RM['RM'][RM_class]={}
					RM['RM'][RM_class]['type'] = header_cells[0].text
					if raw_title.find('(abstract)')>-1:
						RM['RM'][RM_class]['abstract']='true'
				if len(header_cells) == 3 and header_cells[0].text == "Attributes":
					RM['RM'][RM_class]['attributes']={}
					for j in range(i+1,len(table_rows)):
						row = table_rows[j]
						header_cells = row.find_all('th')
						table_cells = row.find_all('td')
						if len(header_cells)==1:
							#if header_cells[0].text == '1..1' or header_cells[0].text == '0..1':
							if 	header_cells[0].text.find('1..1')>-1 or header_cells[0].text.find('0..1')>-1:
								name_type = table_cells[0].text.split(':')
								name = name_type[0].strip()
								types = name_type[1].strip().split('\n')
								type = types[0].strip()
								type = type.replace('>','')
								type = type.replace('<',',')
								types = type.split(',')
								existence = ''
								if header_cells[0].text.find('1..1')>-1:
									existence = '1..1'
								elif header_cells[0].text.find('0..1')>-1:
									existence = '0..1'
								RM['RM'][RM_class]['attributes'][name]={}
								RM['RM'][RM_class]['attributes'][name]['existence']= existence
								RM['RM'][RM_class]['attributes'][name]['type'] = types
								RM['RM'][RM_class]['attributes'][name]['description'] = table_cells[1].text.strip()
							else:
								break
						else:
							break

				if len(header_cells) == 3 and header_cells[0].text == "Functions":
					RM['RM'][RM_class]['functions']={}
					for j in range(i+1,len(table_rows)):
						row = table_rows[j]
						header_cells = row.find_all('th')
						table_cells = row.find_all('td')
						if len(header_cells)==1:
							#if header_cells[0].text == '1..1' or header_cells[0].text == '0..1':
							if 	header_cells[0].text.find('1..1')>-1 or header_cells[0].text.find('0..1')>-1:
								name_type = table_cells[0].text.split(':')

								pattern = re.compile(r'(?m)^(.*\([^)]*\)).*:.(.*)(?:\s*\nPre:\s*(.+))?')
								matches = pattern.finditer(table_cells[0].text.strip())
								name = ''
								types = ['']
								prerequisite = ''
								if matches:
									for match in matches:
										if match.group(1):
											name = match.group(1).strip()
											name = name.replace('\n','')
										if match.group(2):
											types  = match.group(2).strip().split('\n')
										if match.group(3):
											prerequisite  = match.group(3).strip()
											prerequisite  = prerequisite.replace('\n','')

										break
								"""
								name = name_type[0].strip()
								types = name_type[1].strip().split('\n')
								"""
								type = types[0].strip()
								type = type.replace('>','')
								type = type.replace('<',',')
								types = type.split(',')
								existence = ''
								if header_cells[0].text.find('1..1')>-1:
									existence = '1..1'
								elif header_cells[0].text.find('0..1')>-1:
									existence = '0..1'

								if name!='':
									RM['RM'][RM_class]['functions'][name]={}
									RM['RM'][RM_class]['functions'][name]['existence']= existence
									RM['RM'][RM_class]['functions'][name]['return_type'] = types
									RM['RM'][RM_class]['functions'][name]['description'] = table_cells[1].text.strip()
									RM['RM'][RM_class]['functions'][name]['prerequisite'] = prerequisite
							else:
								break
						else:
							break

	#go through all RM classes
	classList = list(RM['RM'].keys())


	for i in range(len(classList)):
		RM_class = classList[i]
		if 'abstract' in RM['RM'][RM_class].keys():
			print('Abstract class detected:' + RM_class)
			#look at the next elements
			for j in range(i+1,len(classList)):
				next_RM_class = classList[j]
				print('Looking at', next_RM_class)
				if 'inherit' in RM['RM'][next_RM_class].keys():
					if RM['RM'][next_RM_class]['inherit']==RM_class:
						print('Specialized class:', next_RM_class)
						if not 'specialization' in  RM['RM'][RM_class].keys():
							RM['RM'][RM_class]['specialization']=[]
						RM['RM'][RM_class]['specialization'].append(next_RM_class)
					else:
						break



	#get URL for every class....
	url = 'https://specifications.openehr.org/classes'
	add_message('Getting URLs for every class from ' + url)

	page = requests.get(url)
	soup = BeautifulSoup(page.content, 'html.parser')

	results = soup.find_all('a')

	df_out = pd.DataFrame(columns=['URL','class'])
	add_message('Adding URLs to the JSON.')
	for r in results:
		class_url = r['href']
		item = r.text
		if class_url[:10] == '/releases/':
			#print(r['href'], r.text)
			df_out.loc[len(df_out)] = ['https://specifications.openehr.org'+class_url, item]

	#add url to data class in dictionary
	#for every class key...
	listOfClasses = list(RM['RM'].keys())
	for c in listOfClasses:
		#search in the dataframe
		df_search = df_out[df_out['class'] == c]
		if len(df_search)>0:
			#add url to dictionary
			RM['RM'][c]['url']=list(df_search['URL'])[0]
	#print(RM)

	from datetime import datetime
	date = datetime.today().strftime('%Y%m%d')

	add_message('Writing to '+outputdir + date +"_openEHR_RM.json")
	if not headlessMode:
		with open(outputdir + date +"_openEHR_RM.json", "w") as outfile:
			json.dump(RM, outfile, indent=4, sort_keys=True)
		add_message('Done!')
	else:
		glossary_data = ''
		glossary_data += 'const glossary_extraction_date = "' + datetime.today().strftime('%Y-%m-%d %H:%M:%S') + '";\n\n'
		glossary_data += 'const glossary_extraction_source = ' + str(URL_list) + ';\n\n'

		glossary_data += 'const glossary_data = ' + json.dumps(RM['RM'], indent=4, sort_keys=True) + ';\n\n'
		with open("glossary_data.js", "w") as f:
  			f.write(glossary_data)

def main():
	if headlessMode:
		download_RM('')
	else:
		my_gui()

def add_message(phrase):
	phrase += '\n'
	if not headlessMode:
		message_box.insert('end',phrase)
		message_box.see("end")
		root.update()

def select_folder():
	input_folder_path = filedialog.askdirectory()
	if input_folder_path:
		entry_box.delete("0.0", "end")
		entry_box.insert("0.0",input_folder_path)
		generate_btn.configure(state="normal")
		
def my_gui():
	#my gui
	global entry_box, radio_var, url, header, message_box, root, generate_btn, radiobutton_1, radiobutton_2, radiobutton_3, radiobutton_4, radiobutton_5, radiobutton_6, radiobutton_7, radiobutton_8

	customtkinter.set_appearance_mode("dark")   #dark, system or light
	customtkinter.set_default_color_theme("blue") #blue, green or dark-blue

	root = customtkinter.CTk()
	root.geometry("420x450")
	root.title('openEHR Reference Model')
	root.minsize(420,500)
	root.maxsize(420,500)

	customtkinter.CTkLabel(root, text = "openEHR Reference Model\nDownloader", font = ("Roboto", 24)).pack(pady = 10)

	frame = customtkinter.CTkFrame(root)
	frame.pack(pady=10, padx=10, fill = "both", expand = True)

	customtkinter.CTkLabel(frame, text = "Destination folder", font = ("Roboto", 12)).pack()
	entry_box = customtkinter.CTkTextbox(frame, width=380, height=80)
	entry_box.pack(pady = (0,10))

	folder_btn = customtkinter.CTkButton(frame, text="Select folder for the result file...", command= select_folder)
	folder_btn.pack(pady = 10)


	generate_btn = customtkinter.CTkButton(frame, text="Generate RM from internet", command =lambda: download_RM(entry_box.get("0.0", "end").strip()+"/"))
	generate_btn.configure(state="disabled")
	generate_btn.pack(pady = 10)

	message_box = customtkinter.CTkTextbox(frame, width=380, height=180)
	message_box.pack(pady = 10)
	about = "(c) 2025, CatSalut. Servei Català de la Salut\nLicense: Apache 2.0\n"
	message_box.insert('end',about)
	root.mainloop()


if __name__ == '__main__':
	main()







