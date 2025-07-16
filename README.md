# ADL Extraction Tool

## Overview

The ADL Extraction Tool automates the extraction of key metadata from openEHR archetype files (ADL 1.4), supporting both manual and automated workflows. It can process archetypes from local collections or directly from online sources such as the Clinical Knowledge Manager (CKM). The tool supports both GUI and headless (automation-friendly) modes.

---

## 1. Requirements

### Software Requirements

- Python 3.11 (or compatible version)
- Required Python libraries:
  - `requests`
  - `datetime`
  - `pandas`
  - `customtkinter`
  - *(Other libraries such as `os`, `zipfile`, `re`, `json`, `tkinter`, `shutil`, and `time` are part of the Python standard library.)*

### Installation

1. Clone or download the repository:  
   [https://github.com/martinkochdesign/openEHR_fellowship_2025_project](https://github.com/martinkochdesign/openEHR_fellowship_2025_project)
2. Install dependencies:
   ```sh
   pip install -r requirements.txt