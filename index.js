//INITIATE CONSTANTS and GLOBAL VARIABLES *****************************************************************************************
const version = '0.68.0-beta';

let newNodes = []

let archetypeListItems = []
let selectedListItem = null;
let existingEdges = [];
let existingNodes = [];

let checkList = [];

let wholeProject = {};

let show_collection_items = true;

let filterSet = {};
resetfilterSet();

let nodes = [];
let links = [];
let allLinks = [];
let lastIds = []; //Array of visited IDs
let archetype_collection_data = [];

// Initial root node for archetype tree
let archetypeTree = {};
archetypeTree = initArchetypeTree();

const NODE_COMPATIBILITY = {
  "composition": [
    "action", "admin_entry", "evaluation", "instruction", "observation", "section", "cluster", "element"
  ],
  "action": ["cluster"],
  "admin_entry": ["cluster"],
  "evaluation": ["cluster"],
  "instruction": ["cluster"],
  "observation": ["cluster"],
  "section": [
    "action", "admin_entry", "evaluation", "instruction", "observation", "section"
  ],
  "cluster": ["cluster", "element"],
  "element": [],
  "": []
};

//Window width variables
let CHECKLISTWIDTH = '350px';
let ARCHETYPELISTWIDTH = '300px';
let CLEDITORWIDTH = '750px';
let EXTSEARCHWIDTH = '600px';
let TEMPLATEPLANNERWIDTH = '900px';



const visualization_element = document.getElementById("visualization");

//get a list of classes and add them as a search option
const svg = d3.select('svg g');
const uniqueClasses = [...new Set(allNodes.map(obj => obj.class))].sort();
const select = document.getElementById('filter_class');
uniqueClasses.forEach(className => {
  const option = document.createElement('option');
  option.value = className;
  option.text = className;
  select.appendChild(option);
});

let lines = svg
  .selectAll('line')
  .data(links)
  .enter()
  .append('line')
  .attr('stroke', (link) => link.color || 'black')
  .attr('marker-start', (link) => link.marker_start || 'None')
  .attr('marker-start', (link) => link.marker_end || 'None')
  .attr('stroke-width', 1)
  .attr('stroke-dasharray', (link) => link.dash);

let circles = svg
  .selectAll('circle')
  .data(nodes)
  .enter()
  .append('circle')
  .attr('fill', (node) => node.color || 'gray')
  .attr('stroke-width', 3)
  .attr('stroke', (node) => node.stroke || 'transparent')
  .attr('r', (node) => node.size || 10)
  .on("click", (event, d) => {
    focusNode(d.id);
  });


let text = svg
  .selectAll('text')
  .data(nodes)
  .enter()
  .append('text')
  .attr('text-anchor', 'middle')
  .attr('alignment-baseline', 'middle')
  .style('pointer-events', 'none')
  .text((node) => node.archetype_id);

let secondary_text = svg.selectAll('text2')
  .data(nodes)
  .enter()
  .append('text')
  .attr('text-anchor', 'middle')
  .attr('alignment-baseline', 'middle')
  .style('pointer-events', 'none')
  .text((node) => node.secondary_text);



//Simulation, circles, links, text
let simulation = d3.forceSimulation(nodes)
  .force('charge', d3.forceManyBody().strength(-1000))
  .force('link', d3.forceLink(links).id(function (d) {
    return d.id;
  }).distance(150))
  ;

let myZoom = d3.zoom()
  .on('zoom', handleZoom);


//open page with standard window configuration
set_window_configuration_1();
loadFilterData();

function updateVisAtTypeChange() {
}


// FUNCTIONS  **************************************************************************************************

// Change colors to holiday/seasonal/international theme
function updateHeaderGradientForHoliday() {
  //console.log('updateHeaderGradientForHoliday()')
  const headers = document.querySelectorAll('.header');
  const now = new Date();
  const month = now.getMonth(); // 0 = January
  const day = now.getDate();
  //let gradient = 'linear-gradient(45deg, rgb(90,155,215) 0%, rgb(180,210,235) 50%, rgb(90,155,215) 100%)'; // default
  let gradient = 'linear-gradient(45deg, rgb(240,240,255) 0%, rgb(180,210,235) 50%, rgb(90,155,215) 100%)'; // default
  let color = 'black';

  wholeProject.color_theme_changes = document.getElementById('apply_theme_changes').checked;

  if (!wholeProject.color_theme_changes) {
    //apply standard colors
  }
  // Pride Month: June (month === 5)
  else if (month === 5) {
    gradient = 'linear-gradient(-45deg, red, orange, yellow, green, blue, indigo, violet)';
    color = 'white';
  }
  // Christmas: Dec 15 - Jan 7
  else if ((month === 11 && day >= 15) || (month === 0 && day <= 7)) {
    gradient = 'linear-gradient(30deg, red, white, red, white, red, white, red, white,red, white,red, white,red)';
    color = 'green';
  }
  // Halloween: Oct 14 - Nov 2
  else if ((month === 9 && day >= 14) || (month === 10 && day <= 2)) {
    gradient = 'linear-gradient(45deg, black, orange, black, orange, black)';
    color = 'white';
  }
  // St. Patrick's Day: March 17
  else if (month === 2 && day === 17) {
    gradient = 'linear-gradient(45deg, #007f3f 0%, #b6e880 100%)'; // green shades
    color = 'white';
  }
  // Spring (Northern Hemisphere): March 20 - June 20
  else if ((month === 2 && day >= 20) || (month > 2 && month < 5) || (month === 5 && day <= 20)) {
    gradient = 'linear-gradient(90deg, #a8e063 0%, #f8ffae 100%)'; // fresh green to yellow
    color = '#2d4739';
  }
  // Summer (Northern Hemisphere): June 21 - Sep 21

  else if ((month === 5 && day >= 21) || (month > 5 && month < 8) || (month === 8 && day <= 21)) {
    gradient = 'linear-gradient(90deg, #f7971e 0%, #ffd200 100%)'; // orange to yellow
    color = '#7a4f00';
  }
  // Autumn/Fall (Northern Hemisphere): Sep 22 - Dec 19
  else if ((month === 8 && day >= 22) || (month > 8 && month < 11) || (month === 11 && day <= 19)) {
    gradient = 'linear-gradient(90deg, #ff9966 0%, #ff5e62 100%)'; // orange to red
    color = '#5a2e0c';
  }
  // Winter (Northern Hemisphere): Dec 20 - Mar 19
  else if ((month === 11 && day >= 20) || (month < 2) || (month === 2 && day <= 19)) {
    gradient = 'linear-gradient(90deg, #83a4d4 0%, #b6fbff 100%)'; // blue to icy blue
    color = '#1a2a4f';
  }
  // International Workers' Day / Labour Day: May 1
  /*else if (month === 4 && day === 1) {
      gradient = 'linear-gradient(45deg, #e52d27 0%, #b31217 100%)'; // strong red
      color = 'white';
  }*/
  // Lunar New Year (approx late Jan - mid Feb, varies by year, here: Feb 1-15)
  else if ((month === 1 && day >= 1 && day <= 15)) {
    gradient = 'linear-gradient(45deg, #ffcc29 0%, #ff5757 100%)'; // gold to red
    color = '#7a2f00';
  }
  // Earth Day: April 22
  else if (month === 3 && day === 22) {
    gradient = 'linear-gradient(45deg, #56ab2f 0%, #a8e063 100%)'; // green shades
    color = 'white';
  }
  // International Day of Peace: September 21
  else if (month === 8 && day === 21) {
    gradient = 'linear-gradient(45deg, #2193b0 0%, #6dd5ed 100%)'; // blue shades
    color = 'white';
  }

  headers.forEach(header => {
    header.style.backgroundImage = gradient;
    header.style.color = color;
  });
}

function loadFilterData() {
  const filterID = document.getElementById('filter_set_select').value;
  if (filterSet[filterID]) {
    document.getElementById('searchInput').value = filterSet[filterID].text;
    document.getElementById('includeID').checked = filterSet[filterID].id;
    document.getElementById('includeName').checked = filterSet[filterID].name;
    document.getElementById('includePurpose').checked = filterSet[filterID].purpose;
    document.getElementById('includeUse').checked = filterSet[filterID].use;
    document.getElementById('includeKeywords').checked = filterSet[filterID].keywords;
    document.getElementById('includeItems').checked = filterSet[filterID].items;
    document.getElementById('includeInclusions').checked = filterSet[filterID].inclusions;
    updateLists();
  }

}

function setFilterData() {
  const filterID = document.getElementById('filter_set_select').value;
  if (!filterSet[filterID]) {
    filterSet[filterID] = {};
  }
  filterSet[filterID].text = document.getElementById('searchInput').value;
  filterSet[filterID].id = document.getElementById('includeID').checked;
  filterSet[filterID].name = document.getElementById('includeName').checked;
  filterSet[filterID].purpose = document.getElementById('includePurpose').checked;
  filterSet[filterID].use = document.getElementById('includeUse').checked;
  filterSet[filterID].keywords = document.getElementById('includeKeywords').checked;
  filterSet[filterID].items = document.getElementById('includeItems').checked;
  filterSet[filterID].inclusions = document.getElementById('includeInclusions').checked;
}

function resetfilterSet() {
  filterSet = {
    '1':
    {
      'text': '',
      'id': true,
      'name': true,
      'purpose': false,
      'use': false,
      'keywords': false,
      'items': false,
      'inclusions': false
    },
    '2':
    {
      'text': '',
      'id': false,
      'name': false,
      'purpose': false,
      'use': false,
      'keywords': false,
      'items': false,
      'inclusions': false
    },
    '3':
    {
      'text': '',
      'id': false,
      'name': false,
      'purpose': false,
      'use': false,
      'keywords': false,
      'items': false,
      'inclusions': false
    }
  }
}

function toggleViewCollectionItems() {
  const show_collection_sidebar_button = document.getElementById('show_collection_sidebar_button');
  const hide_collection_sidebar_button = document.getElementById('hide_collection_sidebar_button');
  const show_collection_button = document.getElementById('show_collection_button');
  const hide_collection_button = document.getElementById('hide_collection_button');
  if (show_collection_items) {
    show_collection_items = false;
    show_collection_sidebar_button.style.display = 'inline';
    hide_collection_sidebar_button.style.display = 'none';
    show_collection_button.style.display = 'inline';
    hide_collection_button.style.display = 'none';
  }
  else {
    show_collection_items = true;
    show_collection_sidebar_button.style.display = 'none';
    hide_collection_sidebar_button.style.display = 'inline';
    show_collection_button.style.display = 'none';
    hide_collection_button.style.display = 'inline';
  }
  updateLists();
}

//WORKFLOW AT FIRST EXECUTION *********************************************************************************

//add version and data information to the bottom line
document.getElementById('bottom_info').innerHTML =
  '<i>Version:&nbsp;</i> ' + version + '&nbsp;&nbsp;&nbsp;&nbsp;<i>Archetype source:&nbsp;</i> ' + provenance + '&nbsp;&nbsp;&nbsp;&nbsp;<i>Extraction date:&nbsp;<\i> ' + extraction_date;

//add version and data information to the about page
document.getElementById('version_info_about').innerHTML = '<strong>Version:</strong> ' + '<dd>' + version + '</dd>'
data_date_about
data_source_about
document.getElementById('data_date_about').innerHTML = '<strong>Update:</strong> ' + '<dd>' + extraction_date + '</dd>'
document.getElementById('data_source_about').innerHTML = '<strong>Source:</strong> ' + '<dd>' + provenance + '</dd>'



// init the d3 Zoom
initZoom();

//add a dummy node to the allNodes
anyArchetype = {
  "id": "any_archetype",
  "archetype_id": "any_archetype",
  "class": "ANY",
  "lifecycle_state": "in_development",
  "original_language": "en",
  "date": "9999-01-02",
  "translation_languages": [],
  "purpose": "A dummy archetype to represent a connection to all possible archetypes.",
  "keywords": [],
  "include": [],
  "exclude": [],
  "concept_name": "Any Archetype",
  "concept_description": "",
  "items": [],
  "parent": "",
  "children": [],
  "keyword_synonyms": [],
  "similar": []
}
//allNodes.push(anyArchetype); //add a placeholder for "any archetype" inclusions or exclusions

//check if there is stored data....
const stored = localStorage.getItem('ArchetypeExplorerProject');
if (stored) {
  //load whole project variable
  wholeProject = JSON.parse(stored);
  //populate the loaded data into the project    
  populateProject();
  updateLists();
  renderEditor();
  renderViewer();
}
else {
  // reset everything and load existing archetypes into list item array
  resetAll();
  wholeProject = {
    project: {
      title: "",
      description: "",
      author: "",
      copyright: "",
      contact: ""
    },
    software_version: "",
    db_source: "",
    db_update: "",
    checklist: "",
    existing_nodes: "",
    new_nodes: "",
    show_splash_on_start: false,
    color_theme_changes: false,
    filterSet: {}
  };

  document.getElementById('project_name').value = 'My new project';
  document.getElementById('main_view_project_name').innerHTML = document.getElementById('project_name').value;
  document.getElementById('project_description').value = '';
  document.getElementById('project_author').value = '';
  document.getElementById('project_copyright').value = '';
  document.getElementById('project_contact').value = '';
  archetypeTree = initArchetypeTree();
  updateTreeView();
  createProjectFile();
  updateLists();
  renderEditor();
  renderViewer();

  //save the project data to local storage
  localStorage.setItem('ArchetypeExplorerProject', JSON.stringify(wholeProject));
}

if (!document.getElementById('dont_show_splash').checked) {
  show_splash_page();
}

if (document.getElementById('apply_theme_changes').checked) {
  //set color scheme
  updateHeaderGradientForHoliday();
}

// ONGOING UPDATES VIA OBSERVER *****************************************************************************************

function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

const debouncedUpdate = debounce(() => {
  document.getElementById('main_view_project_name').innerHTML = document.getElementById('project_name').value;
  createProjectFile();
}, 500);

const observer = new MutationObserver(debouncedUpdate);

const elementIds = ['archetype_collection_list', 'project_name', 'checklistSections', 'new_archetype_editor']; //if any of the contents of these elements is changes, we create the project file

const config = {
  childList: true,
  subtree: true,
  attributes: true,
  characterData: true
};

// Observe only the specific elements
elementIds.forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    observer.observe(el, config);
  }
});

// ON WINDOW CLOSE **********************************************************************************

// when closing the window
window.addEventListener('beforeunload', function (e) {
  //if there is project data
  if (wholeProject != {}
    && wholeProject != []) {
    //delete the "selected" list item
    if (selectedListItem)
      selectedListItem.classList.remove('selected');
    selectedListItem = null;
    //create the wholeProject variable
    createProjectFile();
    //save the project data to local storage  
    localStorage.setItem('ArchetypeExplorerProject', JSON.stringify(wholeProject));
    e.preventDefault();
    e.returnValue = ''; // Required by some browsers
  }
});

// GENERAL ***********************************************************************************************************
// GENERAL - FUNCTIONS ***********************************************************************************************

function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16));
}

function resetAll() {
  wholeProject = [];
  checkList = [];
  newNodes = [];
  archetypeListItems = [];

  createArchetypeListItems();
  addNewArchetypesListItems();
  updateLists();
  renderEditor();
  renderViewer();
}


// GENERAL - EVENT LISTNERS ******************************************************************************************

document.getElementById('clear_storage').onclick = function () {
  if (confirm("Are you sure you want to clear all project data? This cannot be undone.")) {
    localStorage.removeItem('ArchetypeExplorerProject');
    resetAll();
    alert("Local storage has been cleared.");
  }
};

// LEFT SIDE LISTS ****************************************************************************************************
// LEFT SIDE LISTS - FUNCTIONS ****************************************************************************************
// get the information of the exsting archetypes (allNodes) and create li items for  archetypeListItems
function createArchetypeListItems() {
  archetypeListItems = [];
  allNodes
    .forEach(item => {
      const li = document.createElement('li');
      li.id = item.id;
      li.textContent = item.archetype_id;
      li.classList.add('available'); //shows inwhich list this should go
      li.classList.add('existing'); //important when we are using new archetypes
      archetypeListItems.push(li);
      li.onclick = () => {
        if (selectedListItem)
          selectedListItem.classList.remove('selected');
        li.classList.add('selected');
        selectedListItem = li;
        //load the current item data
        updateLists();
        renderEditor();
        renderViewer();
        loadExistingArchetypeData(item);
      };

    });
}

//from archetypeListItems  search for an archetype and return an attribute (for example the "archetype_ID")
function getTextContentFromLiItemList(id) {
  const foundItem = archetypeListItems.find(item => item.id.toLowerCase() === id.toLowerCase());
  const value = foundItem.textContent;
  return value;
}

// from allNodes search for an archetype and return an attribute (for example the "purpose")
function getNodeAttributeById(id, attribute) {
  const foundItem = allNodes.find(item => item.id.toLowerCase() === id.toLowerCase());
  const value = foundItem ? foundItem[attribute] : undefined;
  return value;
}

//update the archetype lists (existing and collection)
function updateLists() {

  //write the current search to the filterSet
  setFilterData();
  const available_list = document.getElementById('archetype_list');
  let temp_available_list = []
  available_list.innerHTML = '';
  const collection_list = document.getElementById('archetype_collection_list');
  collection_list.innerHTML = '';

  archetypeListItems.forEach(li => {
    if (li.id != 'any_archetype') {
      if (li.classList.contains('available')) {
        li.textContent = li.id;
        available_list.appendChild(li);
        temp_available_list.push(li);

      } else if (li.classList.contains('collection') && li.classList.contains('existing') && show_collection_items) {
        const liClone = li.cloneNode(true);
        liClone.textContent = '⭐ ' + li.id;
        available_list.appendChild(liClone);
        attachLiHandler(liClone);
      }
      else if (li.classList.contains('collection') && li.classList.contains('new')) {
        collection_list.appendChild(li);
      }
    }
  })

  sortList('archetype_list');
  sortList('archetype_collection_list');
  filterList('archetype_list');

  const sourceUl = document.getElementById('archetype_list');
  const targetUl = document.getElementById('archetype_sidebar_list');
  targetUl.innerHTML = '';

  function attachLiHandler(li) {

    li.onclick = () => {
      if (selectedListItem)
        selectedListItem.classList.remove('selected');
      li.classList.add('selected');
      selectedListItem = li;
      //load the current item data
      loadExistingArchetypeData(allNodes.find(item => item.id.toLowerCase() === selectedListItem.id.toLowerCase()));
      updateLists();
      renderEditor();
      renderViewer();
    };
  }

  Array.from(sourceUl.children).forEach(li => {
    const newLi = li.cloneNode(true); // clone the <li> and its content
    attachLiHandler(newLi); // re-attach the event handler
    targetUl.appendChild(newLi);
  });

  //mark the selected item in the archetype_sidebar_list
  Array.from(targetUl.children).forEach(li => {
    if (selectedListItem) {
      if (li.id == selectedListItem.id) {
        li.classList.add('selected');
      }
    }
  });


  //add the number of found versus number in existing archetypes
  const div = document.getElementById('archetype_list');
  const visibleLis = Array.from(div.getElementsByTagName('li'))
    .filter(li => li.style.display !== 'none');
  const filteredCount = visibleLis.length;
  document.getElementById('N_of_N_found').innerHTML =
    `${filteredCount} / ${allNodes.length}`
  document.getElementById('N_of_N_found_sidebar').innerHTML =
    `${filteredCount} / ${allNodes.length}`

  //create a list of all classes
  if (selectedListItem) {
    focusNode(selectedListItem.id);
  }
  else {
    temp_available_list.sort((a, b) => a.id.localeCompare(b.id));
    selectedListItem = temp_available_list[0];
    if (selectedListItem) {
      focusNode(selectedListItem.id);
    }
  }


  if (selectedListItem) {
    if (selectedListItem.classList.contains('new')) {
      document.getElementById('delete_new_archetype_button').style.display = 'block';
      document.getElementById('remove_from_collection_button').style.display = 'none';
      document.getElementById('remove_from_collection_button_info').style.display = 'none';
      document.getElementById('remove_from_collection_sidebar_button').style.display = 'none';
      document.getElementById('new_archetype_edit_button').style.display = 'block';
      document.getElementById('add_to_collection_button').style.display = 'none';
      document.getElementById('add_to_collection_button_info').style.display = 'none';
      document.getElementById('add_to_collection_sidebar_button').style.display = 'none';
    } else if (selectedListItem.classList.contains('existing') && selectedListItem.classList.contains('collection')) {
      document.getElementById('delete_new_archetype_button').style.display = 'none';
      document.getElementById('remove_from_collection_button').style.display = 'block';
      document.getElementById('remove_from_collection_button_info').style.display = 'block';
      document.getElementById('remove_from_collection_sidebar_button').style.display = 'block';
      document.getElementById('new_archetype_edit_button').style.display = 'none';
      document.getElementById('add_to_collection_button').style.display = 'none';
      document.getElementById('add_to_collection_button_info').style.display = 'none';
      document.getElementById('add_to_collection_sidebar_button').style.display = 'none';
    } else if (selectedListItem.classList.contains('existing') && selectedListItem.classList.contains('available')) {
      document.getElementById('delete_new_archetype_button').style.display = 'none';
      document.getElementById('remove_from_collection_button').style.display = 'none';
      document.getElementById('remove_from_collection_button_info').style.display = 'none';
      document.getElementById('remove_from_collection_sidebar_button').style.display = 'none';
      document.getElementById('new_archetype_edit_button').style.display = 'none';
      document.getElementById('add_to_collection_button').style.display = 'block';
      document.getElementById('add_to_collection_button_info').style.display = 'block';
      document.getElementById('add_to_collection_sidebar_button').style.display = 'block';
    } else {
      document.getElementById('delete_new_archetype_button').style.display = 'none';
      document.getElementById('remove_from_collection_button').style.display = 'none';
      document.getElementById('remove_from_collection_button_info').style.display = 'none';
      document.getElementById('remove_from_collection_sidebar_button').style.display = 'none';
      document.getElementById('new_archetype_edit_button').style.display = 'none';
      document.getElementById('add_to_collection_button').style.display = 'none';
      document.getElementById('add_to_collection_button_info').style.display = 'none';
      document.getElementById('add_to_collection_sidebar_button').style.display = 'none';
    }
  } else {
    document.getElementById('delete_new_archetype_button').style.display = 'none';
    document.getElementById('remove_from_collection_button').style.display = 'none';
    document.getElementById('remove_from_collection_button_info').style.display = 'none';
    document.getElementById('remove_from_collection_sidebar_button').style.display = 'none';
    document.getElementById('new_archetype_edit_button').style.display = 'none';
    document.getElementById('add_to_collection_button').style.display = 'none';
    document.getElementById('add_to_collection_button_info').style.display = 'none';
    document.getElementById('add_to_collection_sidebar_button').style.display = 'none';
  }
  //are there collection items? if not, don't show the hide/show button
  const hasCollection = Array.from(archetypeListItems).some(item => item.classList.contains('collection') && item.classList.contains('existing'));
  if (!hasCollection) {
    document.getElementById('hide_collection_button').style.display = 'none';
    document.getElementById('show_collection_button').style.display = 'none';
    document.getElementById('hide_collection_sidebar_button').style.display = 'none';
    document.getElementById('show_collection_sidebar_button').style.display = 'none';
  }
  else {
    if (show_collection_items) {
      document.getElementById('hide_collection_button').style.display = 'inline';
      document.getElementById('show_collection_button').style.display = 'none';
      document.getElementById('hide_collection_sidebar_button').style.display = 'inline';
      document.getElementById('show_collection_sidebar_button').style.display = 'none';
    }
    else {
      document.getElementById('hide_collection_button').style.display = 'none';
      document.getElementById('show_collection_button').style.display = 'inline';
      document.getElementById('hide_collection_sidebar_button').style.display = 'none';
      document.getElementById('show_collection_sidebar_button').style.display = 'inline';
    }
  }

  // if the selecte item is not an existing archetype, put the hide/show higher, so there is no gap between icons
  if (selectedListItem) {
    if (selectedListItem.classList.contains('new')) {
      document.getElementById('hide_collection_sidebar_button').style.top = '75px';
      document.getElementById('show_collection_sidebar_button').style.top = '75px';
    }
    else {
      document.getElementById('hide_collection_sidebar_button').style.top = '125px';
      document.getElementById('show_collection_sidebar_button').style.top = '125px';
    }

    if (lastIds.length > 1 && (document.getElementById('select_vis_view').value=='ARCHETYPE' || document.getElementById('select_vis_view').value=='ARCHETYPEMINDMAP')) {
      document.getElementById('visualization_back_btn').style.display = 'inline';
    } else {
      document.getElementById('visualization_back_btn').style.display = 'none';
    }

  }



  let combinedFilterText = '';
  for (key in filterSet) {
    combinedFilterText += filterSet[key].text.trim();
  }

  if (document.getElementById("searchInput").value != '' || document.getElementById("filter_class").value != '' || combinedFilterText != '') {
    //show the delete filter icon
    document.getElementById('delete_filter_button').style.display = 'block';
    document.getElementById('delete_filter_sidebar_button').style.display = 'block';
  } else {
    //hide the delete filter icon
    document.getElementById('delete_filter_button').style.display = 'none';
    document.getElementById('delete_filter_sidebar_button').style.display = 'none';
  }

  //highlight the archetype_info search terms
  if (document.getElementById("searchInput").value != "" || combinedFilterText != '') {
    highlightArchetypeText();
  }

  //reset scroll of archetype_info
  var myDiv = document.getElementById('archetype_info');
  myDiv.scrollTop = 0;

  updateArchetypeSelect();

}


function updateVisitedHistory() {
  //update the lastIDs list
  document.getElementById('search_history_list').innerHTML = '';
  const ul = document.createElement('ul');
  lastIds.forEach(id => {
    const li = document.createElement('li');
    li.id = id;
    li.textContent = getTextContentFromLiItemList(id);
    li.onclick = function () {
      focusNode(li.id);
      updateLists();
    };
    ul.appendChild(li);
  });
  document.getElementById('search_history_list').appendChild(ul); // Or append to your desired container

}

function resetListFilter(ul) {
  const my_ul = document.getElementById(ul);
  const li = my_ul.getElementsByTagName('li');
  for (i = 0; i < li.length; i++) {
    li[i].style.display = "";
  }
}

function clearSearchFilter() {

  document.getElementById('filter_set_select').value = '1';
  //REMEMBER TO DELETE THE FILTERSET VARIABLE!!!
  resetfilterSet();

  document.getElementById("searchInput").value = '';
  document.getElementById('includeID').checked = true;
  document.getElementById('includeName').checked = true;
  document.getElementById('includePurpose').checked = false;
  document.getElementById('includeUse').checked = false;
  document.getElementById('includeKeywords').checked = false;
  document.getElementById('includeItems').checked = false;
  document.getElementById('includeInclusions').checked = false;
  document.getElementById("filter_class").value = '';

  resetListFilter('archetype_list');

  updateLists()
  renderEditor();
  renderViewer();
}

/*
function populateNewNodeInclSelection() {
  //get the selector
  const options = document.getElementById("new_archetype_listArchetypes");
  //clear all options
  options.innerHTML = "<option value='' selected>-- Select archetype --</option>";
  //add all options
  archetypeListItems
    .forEach(item => {
      if (item.classList.contains('collection')) {
        const option = document.createElement('option');
        option.value = item.id;
        option.text = item.textContent;
        options.appendChild(option);
      }
    });
}
    */

//sorting a ul list in alphabetical order
function sortList(ul) {
  var my_ul = document.getElementById(ul);
  const liArray = Array.from(my_ul.getElementsByTagName("li"));
  if (liArray.length > 0) {
    liArray
      .sort((a, b) => a.textContent.localeCompare(b.textContent))
      .forEach(li => my_ul.appendChild(li));
  }
}

//filters the existing archetype list by the term introduced in the search bar

function tokenize(query) {
  const regex = /"([^"]+)"|(\()|(\))|(\bAND\b|\bOR\b|\bNOT\b)|(\S+)/gi;
  const tokens = [];
  let match;
  while ((match = regex.exec(query)) !== null) {
    if (match[1]) tokens.push(match[1]); // Quoted phrase
    else if (match[2]) tokens.push('(');
    else if (match[3]) tokens.push(')');
    else if (match[4]) tokens.push(match[4].toUpperCase());
    else if (match[5]) tokens.push(match[5]);
  }
  return tokens;
}

function buildBooleanExpr(tokens) {
  return tokens.map(token => {
    if (token === 'AND') return '&&';
    if (token === 'OR') return '||';
    if (token === 'NOT') return '!';
    if (token === '(' || token === ')') return token;
    // Escape quotes in token
    const safe = token.replace(/"/g, '\\"').toLowerCase();
    return `text.includes("${safe}")`;
  }).join(' ');
}

function filterList(ul) {
  const filterText = document.getElementById("searchInput").value.trim();
  const filterClass = document.getElementById("filter_class").value;
  const my_ul = document.getElementById(ul);
  const li = my_ul.getElementsByTagName('li');

  let combinedFilterText = ''
  for (key in filterSet) {
    combinedFilterText += filterSet[key].text.trim();
  }

  // --- Parentheses & Boolean Search ---
  function tokenize(query) {
    const regex = /"([^"]+)"|(\()|(\))|(\bAND\b|\bOR\b|\bNOT\b)|(\S+)/gi;
    const tokens = [];
    let match;
    while ((match = regex.exec(query)) !== null) {
      if (match[1]) tokens.push(match[1]);
      else if (match[2]) tokens.push('(');
      else if (match[3]) tokens.push(')');
      else if (match[4]) tokens.push(match[4].toUpperCase());
      else if (match[5]) tokens.push(match[5]);
    }
    return tokens;
  }

  function buildBooleanExpr(tokens) {
    return tokens.map(token => {
      if (token === 'AND') return '&&';
      if (token === 'OR') return '||';
      if (token === 'NOT') return '!';
      if (token === '(' || token === ')') return token;
      const safe = token.replace(/"/g, '\\"').toLowerCase();
      return `text.includes("${safe}")`;
    }).join(' ');
  }

  function matchesBooleanQueryList(textList, filterText) {

    if (!filterText) return true;
    const tokens = tokenize(filterText);
    const expr = buildBooleanExpr(tokens);

    try {
      // Create a function that checks if ANY text in the list matches the boolean query
      // For each text, evaluate the boolean expression
      return textList.some(text =>
        Function('text', `return ${expr}`)(text.toLowerCase())
      );
    } catch (e) {
      // Fallback: check if any text includes the filterText
      return textList.some(text =>
        text.toLowerCase().includes(filterText.toLowerCase())
      );
    }
  }
  // --- End Boolean Search ---

  const lowerClass = filterClass.toLowerCase();
  const classRegex = lowerClass ? new RegExp('^' + lowerClass.replace(/[-\/\\^$+?.()|[\]{}]/g, '\\$&') + '$', 'i') : null;

  if (combinedFilterText !== "" || lowerClass !== "") {  //ONLY DO THIS IF THERE IS A SEARCH TERM!!
    for (let i = 0; i < li.length; i++) {
      let matchesListFilter = true;
      for (key in filterSet) {

        const filterText = filterSet[key].text;
        if (filterText.trim() !== '') {
          let ID = '';
          let name = '';
          let purpose = '';
          let keywords = '';
          let use = '';
          let inclusions = '';
          let itemStrings = [];

          if (filterSet[key].id) {
            ID = String(getNodeAttributeById(li[i].id, 'archetype_id'));
          }
          if (filterSet[key].name) {
            name = String(getNodeAttributeById(li[i].id, 'concept_name'));
          }
          if (filterSet[key].purpose) {
            purpose = JSON.stringify(getNodeAttributeById(li[i].id, 'purpose'));
          }
          if (filterSet[key].use) {
            use = JSON.stringify(getNodeAttributeById(li[i].id, 'use'));
          }
          if (filterSet[key].keywords) {
            keywords = JSON.stringify(getNodeAttributeById(li[i].id, 'keywords'));
          }
          if (filterSet[key].items) {
            const itemsArray = getNodeAttributeById(li[i].id, 'items');
            itemStrings = itemsArray.map(item => JSON.stringify(item).toLowerCase())

          }
          if (filterSet[key].inclusions) {
            inclusions = JSON.stringify(getNodeAttributeById(li[i].id, 'include'));
          }


          // Combine all searchable fields into one string    
          let searchableList = []
          searchableList.push(ID.toLowerCase());
          searchableList.push(name.toLowerCase());
          searchableList.push(purpose.toLowerCase());
          searchableList.push(use.toLowerCase());
          searchableList.push(keywords.toLowerCase());
          searchableList = searchableList.concat(itemStrings);
          searchableList.push(inclusions.toLowerCase());
          if (filterSet[key].id || filterSet[key].name || filterSet[key].purpose || filterSet[key].use || filterSet[key].keywords || filterSet[key].items || filterSet[key].inclusions) {
            // Boolean search with parentheses
            matchesListFilter = matchesListFilter && matchesBooleanQueryList(searchableList, filterText);
          }
        }

      }

      let className = '';

      if (filterClass != '') {
        className = String(getNodeAttributeById(li[i].id, 'class'));
      }

      const matchesClass = !classRegex || classRegex.test(className.toLowerCase());

      if (matchesListFilter && matchesClass) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  } else {
    for (let i = 0; i < li.length; i++) {
      li[i].style.display = "";
    }
  }
}


function link_expand_structure_button() {
  //expand archetype structure
  const btn = document.getElementById('toggle-all-btn');
  let expanded = false; // Start with all open
  btn.addEventListener('click', function () {
    const details = document.querySelectorAll('details');
    expanded = !expanded;
    details.forEach(d => d.open = expanded);
    btn.textContent = expanded ? 'Collapse All' : 'Expand All';
  });
  // Optional: Set initial state (all open)
  //document.querySelectorAll('details').forEach(d => d.open = true);
}


//This formats existing node information for HTML
function formatNodeItemAsHTML(item) {
  // Helper to format arrays of objects
  function formatItemArray(arr) {
    if (!arr || arr.length === 0)
      return '<em>None</em>';
    return '<ul>' + arr.map(obj =>
      `<li class="notselectable">
      ${obj.occurrence ? '<span style="border-radius:5px; background: darkgray; color: white; font-size:12px; font-weight:bold; padding-left:3px; padding-right:3px;">' + obj.occurrence + '</span>' : ''}
      ${obj.code} <strong>${obj.label}</strong> <small>${obj.type}</small>
      ${obj.description ? '<br><span style="font-size:10pt; color: darkblue; font-weight: 500;">' + obj.description + '</span>' : ''}
    </li>`).join('') + '</ul>';
  }

  function formatInclusionArray(arr) {
    if (!arr || arr.length === 0)
      return '<em>None</em>';
    return '<ul>' + arr.map(obj =>
      `<li class="notselectable">
      ${obj.code} <strong>${obj.label}</strong> <small>${obj.type}</small><br>
      ${obj.archetypes ? obj.archetypes.join(',<br> ') : ''}
    </li>`).join('') + '</ul>';
  }

  function formatString(value) {
    if (value == '' || !value) {
      return '<em>None</em>';
    }
    else {
      value = value.replace(/  /g, "<br>");
      return value
    }
  }

  function formatRecommendationArray(arr) {
    if (!arr || arr.length === 0)
      return '<em>None</em>';
    return '<ul>' + arr.map(obj =>
      `<li class="notselectable">
      ${obj}
    </li>`).join('') + '</ul>';
  }
  let warning = '';
  if (item.lifecycle_state.toLocaleLowerCase() != 'published') {
    warning = '<p class="warning">This archetype is not published! Use with caution!</p>';
  }

  return `
  <div id="info_header">
  <h2>${item.concept_name}</h2>
  <p>${item.id}</p>
  ` + warning + `
  </div><hr>
  <div id="info_body">
    <div id="info_body_left">      
      <p><strong>Purpose:</strong> ${formatString(item.purpose)}</p>
      <p><strong>Description:</strong> ${formatString(item.concept_description)}</p>
      <p><strong>State:</strong> ${formatString(item.lifecycle_state)}</p>
      <p><strong>Revision:</strong> ${formatString(item.revision)}</p>
      <p><strong>Date:</strong> ${formatString(item.date)}</p>
      <p><strong>Keywords:</strong> ${formatString(item.keywords.join(', '))}</p>
      <p><strong>Parent:</strong> ${formatString(item.parent)}</p>
      <p><strong>Children:</strong> ${formatRecommendationArray(item.children)}</p>
       <p style="border-radius: 10px; border-left: 2px solid #50C878; border-right: 2px solid #50C878; padding: 5px; margin-right:5px;"><strong>Use:</strong> ${formatString(item.use)}</p>
      <p style="border-radius: 10px; border-left: 2px solid red;border-right: 2px solid red; padding: 5px; margin-right:5px;"><strong>Misuse:</strong> ${formatString(item.misuse)}</p>
    </div>
    <div id="info_body_right">
      <strong>Items</strong>
      ${formatItemArray(item.items)}
     
    </div>
    
  </div>
  <div id="info_additional">
  <hr>
  <h3>Archetype Structure</h3>
 <button id="toggle-all-btn" style="margin-bottom:1em;">Expand All</button>

  ${formatString(item.structure)}


  <hr>
  <h3>Inclusion statements</h3>
  ${formatInclusionArray(item.include)}
  <hr>
  <h3>Exclusion statements</h3>
  ${formatInclusionArray(item.exclude)}
  <hr>
  <br>
  
  <h3>Recommended similar archetypes <small>(10 max.)</small></h3>
  ${formatRecommendationArray(item.similar)}


  <p style="font-size: 11px;">
   <strong>Disclaimer:</strong>
  <br>
  The information about openEHR archetypes presented in this tool has been extracted automatically from external sources (such as CKM) and is provided for convenience only. We do not guarantee the accuracy, completeness, or correctness of the extracted data, nor do we claim that it is up to date. This tool does not assert or imply any copyright ownership over the archetypes themselves. For authoritative information regarding authorship, copyright, and licensing, users are strongly advised to consult the original archetype source as stated within the tool.
  </p>

  <p style="font-size: 11px;">
  <strong>Original author:</strong>
  <br>
  ${formatString(item.author_name)}
  <br>
  ${formatString(item.author_organisation)}
  <!--<br>
  ${formatString(item.author_email)} -->
  <br><br>
  <strong>Original copyright and license:</strong>
  <br>
  ${formatString(item.copyright)}
  <br>
  ${formatString(item.licence)}
  </p>

  </div>
`;
}

//if you click on an existing archetype, node information gets displayed
function loadExistingArchetypeData(item) {
  //get the info field and display the raw node data
  const list = document.getElementById('archetype_info');
  list.innerText = '';
  list.innerHTML = formatNodeItemAsHTML(item);
  link_expand_structure_button();
}



function highlightArchetypeText() {
  let searchTerm = '';

  for (key in filterSet) {
    searchTerm += filterSet[key].text.trim();
  }

  // --- Boolean Search Parsing ---
  function parseBooleanQuery(query) {
    // Split by spaces, but keep quoted phrases together
    const tokens = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < query.length; i++) {
      const c = query[i];
      if (c === '"') {
        inQuotes = !inQuotes;
        continue;
      }
      if (!inQuotes && c === ' ') {
        if (current) tokens.push(current);
        current = '';
      } else {
        current += c;
      }
    }
    if (current) tokens.push(current);

    // Parse tokens into terms and operators
    const terms = [];
    let lastOp = 'AND';
    for (let t of tokens) {
      const upper = t.toUpperCase();
      if (upper === 'AND' || upper === 'OR' || upper === 'NOT') {
        lastOp = upper;
      } else {
        terms.push({ op: lastOp, term: t });
        lastOp = 'AND';
      }
    }
    return terms;
  }

  function getHighlightTerms(terms) {
    // Only terms, not operators, and ignore NOT terms for highlighting
    return terms.filter(t => t.op !== 'NOT').map(t => t.term).filter(Boolean);
  }

  const archetypeDiv = document.getElementById('archetype_info');
  let filterText = '';

  for (key in filterSet) {
    filterText += filterSet[key].text.trim();
    filterText += ' AND '
  }

  const booleanTerms = filterText ? parseBooleanQuery(filterText) : [];
  const highlightTerms = getHighlightTerms(booleanTerms);

  // Remove previous highlights
  function removeHighlights(node) {
    if (node.nodeType === 1) { // Element
      Array.from(node.querySelectorAll('span.texthighlight')).forEach(span => {
        span.replaceWith(...span.childNodes);
      });
      node.childNodes.forEach(removeHighlights);
    }
  }
  removeHighlights(archetypeDiv);

  if (!searchTerm) return;

  // Escape regex special characters except *
  function escapeRegex(str) {
    return str.replace(/[-\/\\^$+?.()|[\]{}]/g, '\\$&').replace(/\*/g, '.*');
  }

  function generateLightColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
      // Evenly distribute hues, keep saturation and lightness high for pastel colors
      const hue = Math.round((360 * i) / count);
      colors.push(`hsl(${hue}, 80%, 85%)`);
    }
    return colors;
  }

  const highlightColors = generateLightColors(highlightTerms.length);

  const termColorMap = {};
  highlightTerms.forEach((term, i) => {
    termColorMap[term.toLowerCase()] = highlightColors[i];
  });


  function highlightBoolean(node) {
    if (node.nodeType === 3) { // Text node
      const regex = new RegExp('(' + highlightTerms.map(escapeRegex).join('|') + ')', 'gi');
      const parts = node.data.split(regex);
      if (parts.length > 1) {
        const frag = document.createDocumentFragment();
        parts.forEach(part => {
          if (highlightTerms.some(term => part.toLowerCase() === term.toLowerCase())) {
            const span = document.createElement('span');
            span.className = 'texthighlight';
            const matchedTerm = highlightTerms.find(term => part.toLowerCase() === term.toLowerCase());
            span.style.backgroundColor = termColorMap[matchedTerm.toLowerCase()];;
            span.textContent = part;
            frag.appendChild(span);
          } else {
            frag.appendChild(document.createTextNode(part));
          }
        });
        node.replaceWith(frag);
      }
    } else if (node.nodeType === 1 && node.childNodes) {
      // Convert NodeList to Array to avoid issues when replacing nodes
      Array.from(node.childNodes).forEach(highlightBoolean);
    }
  }

  highlightBoolean(archetypeDiv);

}

// LEFT SIDE LISTS - EVENT HANDLERS ***********************************************************************************

function debounceSearchInput(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
// Usage with your event listener:
const debouncedUpdateLists = debounceSearchInput(updateLists, 200); // 300ms delay

//look for search input
document.getElementById('searchInput').addEventListener('input', debouncedUpdateLists);

//listen to search options
document.getElementById('includePurpose').addEventListener('change', function () {
  updateLists();
});
document.getElementById('includeKeywords').addEventListener('change', function () {
  updateLists();
});
document.getElementById('includeUse').addEventListener('change', function () {
  updateLists();
});
document.getElementById('includeItems').addEventListener('change', function () {
  updateLists();
});
document.getElementById('includeName').addEventListener('change', function () {
  updateLists();
});

document.getElementById('includeID').addEventListener('change', function () {
  updateLists();
});

document.getElementById('includeInclusions').addEventListener('change', function () {
  updateLists();
});

//listen for add to collection
function addArchetypeToCollection() {
  if (selectedListItem) {
    selectedListItem.classList.remove('available');
    selectedListItem.classList.add('collection');
    updateLists();
    renderEditor();
    renderViewer();
  }
}

function removeArchetypeFromChecklist(identifier, name) {
  checkList.forEach(section => {
    section.elements.forEach(element => {
      if (element.archetype == identifier) {
        element.archetype = '';
        element.archetype_id = '';
      }
    });
  });
}

function removeArchetypeFromTree(identifier, name) {
  function parseTree(node) {

    if (node.id == identifier) {
      node.id = '';
      node.archetype_id = '';
    }
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        parseTree(child);
      });
    }
  }
  parseTree(archetypeTree);
}



//listen to delete from collection
function removeArchetypeFromCollection() {
  if (selectedListItem) {
    if (selectedListItem.classList.contains('existing')) {
      selectedListItem.classList.add('available');
      selectedListItem.classList.remove('collection');
      //remove from checklist
      const name = selectedListItem.textContent;
      const identifier = selectedListItem.id;
      removeArchetypeFromChecklist(identifier, name);
      removeArchetypeFromTree(identifier, name);
      updateLists();
      renderEditor();
      renderViewer();
      updateTreeView();
    }
  }
}

// CHECKLIST **************************************************************************************************
// CHECKLIST - FUNCTIONS **************************************************************************************

function createDataLists() {
  //data list of collection archetypes
  if (document.getElementById('myArchetypeCollectionOptions')) {
    document.getElementById('myArchetypeCollectionOptions')?.remove();
  }
  let collectionDatalist = document.createElement('datalist');
  collectionDatalist.id = 'myArchetypeCollectionOptions';
  collectionDatalist.innerHTML = ''; // Clear previous options
  archetypeListItems.forEach(item => {
    if (item.classList.contains('collection')) {
      const option = document.createElement('option');
      option.code = item.id;
      option.value = item.id;
      option.textContent = item.textContent;
      collectionDatalist.appendChild(option);
    }
  });
  document.body.append(collectionDatalist);
}

function updateArchetypeSelect() {
  // use archetypeListItems
  //const selectFields = document.getElementsByClassName('mySelect');

  createDataLists();

  /*
  Array.from(selectFields)
    .forEach(select => {
      const selectValue = select.value;
      select.innerHTML = '<option value="">Select archetype from collection</option>';

      archetypeListItems
        .forEach(item => {
          if (item.classList.contains('collection')) {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.textContent;
            select.appendChild(option);
          }
        });

      let exists = false;
      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].value === selectValue) {
          exists = true;
          break;
        }
      }
      if (exists) {
        select.value = selectValue;
      } else {
        select.value = "";
        select.dispatchEvent(new Event('change'));
      }
    })
  */

}

//FUNCTIONS FOR THE CHECKLIST EDITOR
function addSection() {
  checkList.push({
    name: `Section ${checkList.length + 1}`,
    elements: []
  });
  renderEditor();
  renderViewer();
}

function addElement(sectionIndex) {
  checkList[sectionIndex].elements.push({
    approved: false,
    name: `Element ${sectionIndex + 1}.${checkList[sectionIndex].elements.length + 1}`,
    archetype: '',
    review: false
  });

  renderEditor();
  renderViewer();
}

function deleteSection(index) {
  const confirmed = confirm('Are you sure you want to delete this section?');
  if (!confirmed) {
    event.preventDefault(); // Prevents the deletion if user cancels
    return;
  }
  checkList.splice(index, 1);
  renderEditor();
  renderViewer();
}

function deleteElement(sectionIndex, elementIndex) {
  const confirmed = confirm('Are you sure you want to delete this element?');
  if (!confirmed) {
    event.preventDefault(); // Prevents the deletion if user cancels
    return;
  }
  checkList[sectionIndex].elements.splice(elementIndex, 1);
  renderEditor();
  renderViewer();
}

function moveElement(sectionIndex, elementIndex, direction) {
  const currentElement = checkList[sectionIndex].elements[elementIndex];

  if (direction === 'up') {
    if (elementIndex > 0) {
      [checkList[sectionIndex].elements[elementIndex - 1], checkList[sectionIndex].elements[elementIndex]] =
        [checkList[sectionIndex].elements[elementIndex], checkList[sectionIndex].elements[elementIndex - 1]];
    } else if (sectionIndex > 0) {
      checkList[sectionIndex].elements.splice(elementIndex, 1);
      checkList[sectionIndex - 1].elements.push(currentElement);
    }
  } else if (direction === 'down') {
    if (elementIndex < checkList[sectionIndex].elements.length - 1) {
      [checkList[sectionIndex].elements[elementIndex + 1], checkList[sectionIndex].elements[elementIndex]] =
        [checkList[sectionIndex].elements[elementIndex], checkList[sectionIndex].elements[elementIndex + 1]];
    } else if (sectionIndex < checkList.length - 1) {
      checkList[sectionIndex].elements.splice(elementIndex, 1);
      checkList[sectionIndex + 1].elements.unshift(currentElement);
    }
  }
  renderEditor();
  renderViewer();
}

function updateElement(sectionIndex, elementIndex, key, value) {
  if (typeof (checkList[sectionIndex].elements[elementIndex][key]) == 'string') {
    checkList[sectionIndex].elements[elementIndex][key] = value.trim();
  }
  else {
    checkList[sectionIndex].elements[elementIndex][key] = value;
  }
  renderViewer();

  if (selectedListItem) {
    if (selectedListItem.classList.contains('new')) {
      getAssignedElements(selectedListItem.id);
    }
    focusNode(selectedListItem.id);
  }
}

function updateSectionName(sectionIndex, value, thissection) {
  checkList[sectionIndex].name = value.trim();
  renderViewer();
}

function moveSection(index, direction) {
  if (direction === 'up' && index > 0) {
    [checkList[index - 1], checkList[index]] = [checkList[index], checkList[index - 1]];
  } else if (direction === 'down' && index < checkList.length - 1) {
    [checkList[index + 1], checkList[index]] = [checkList[index], checkList[index + 1]];
  }
  renderEditor();
  renderViewer();
}

function onArchetypeChange(input, i, j) {
  const value = input.value; // This is the label shown in the input
  const datalist = document.getElementById('myArchetypeCollectionOptions');
  let archetype_id = '';
  let archetype = value;
  // Find the matching option in the datalist
  for (const option of datalist.options) {
    if (option.value === value) {
      archetype_id = option.textContent || '';
      break;
    }
  }

  // Call your update functions
  updateElement(i, j, 'archetype', archetype);
  updateElement(i, j, 'archetype_id', archetype_id);
  input.value = archetype_id;
}

function renderEditor() {

  const container = document.getElementById('checklistSections');
  container.innerHTML = '';
  checkList.forEach((section, i) => {
    const secDiv = document.createElement('div');
    secDiv.className = 'section';
    secDiv.innerHTML = `
<div class="section-header" draggable="false" style="margin-bottom:5px;display:flex; align-items:center; gap:5px;">
  
<img src="images/up.png" alt="Section up" height="10" width="8" onclick="moveSection(${i}, 'up')" style="cursor: pointer;" title="Move section up">

<img src="images/down.png" alt="Section down" height="10" width="8" onclick="moveSection(${i}, 'down')" style="cursor: pointer;" title="Move section down">

<input type="text" class="checklisttextinput_section" value="${section.name}" onchange="this.value = this.value.trim();updateSectionName(${i}, this.value, this.closest('.section').querySelector('.section-content'))" style="font-size:16px; flex:1 1 auto; min-width:0;"/>

<img src="images/remove.png" alt="Delete section" height="14" onclick="deleteSection(${i})" style="cursor: pointer;" title="Delete section">
</div>

<div style="display: flex; justify-content: flex-end; width: 100%;">
  <button class="toggleSectionBtn" onclick="toggleSection(this, ${i})">
    ${section.contentDisplay === 'none' ? 'Expand' : 'Collapse'}
  </button>
</div>

    `;

    const sectionContentDiv = document.createElement('div');
    sectionContentDiv.className = 'section-content';
    sectionContentDiv.style.display = section.contentDisplay;
    sectionContentDiv.innerHTML = `
  <!--
  <div>
<span style="display:flex;align-items: center;">
<img src="images/add.png" alt="Add" height="14" title="Add element" onclick="addElement(${i})"style="cursor:pointer;" >&nbsp;Add element
</span>
</div>
-->
`

    section.elements.forEach((el, j) => {
      const div = document.createElement('div');
      const archetypeCollectionOptions = document.getElementById('myArchetypeCollectionOptions').innerHTML;
      div.className = 'element';
      div.innerHTML = `

      <div class="element_container">

          <div>  
            <img src="images/up.png" alt="Element up" height="10" width="8"  onclick="moveElement(${i}, ${j}, 'up')" style="cursor: pointer;" title="Move element up">
            <img src="images/down.png" alt="Element down" height="10" width="8"  onclick="moveElement(${i}, ${j}, 'down')" style="cursor: pointer;" title="Move element down">
          </div>

          <div class="element_input_description_container">
            <div class="element_input_container">
              <div>
              <input style="width-min:100px;width: calc(100% - 15px);padding-left:3px;" type="text" class="checklisttextinput_element" value="${el.name}" onchange="this.value = this.value.trim();updateElement(${i}, ${j}, 'name', this.value)" autocomplete="off"/>
              </div>


              <span class="combo-wrapper">
              <input node_input_type="checklist_archetype_input" type="search" list="" data-datalist-id="myArchetypeCollectionOptions_${i}_${j}" id="myInput${i}_${j}" name="myInput${i}_${j}" class="checklisttextinput_element mySelect combo-input" placeholder="Select archetype from collection" value="${el.archetype_id || ''}"  node_i="${i}" node_j="${j}" autocomplete="off"/> 
              
              <button type="button" class="input_clear_button" aria-label="Clear">&times;</button>
     
              <datalist style="text-align:left;" id="myArchetypeCollectionOptions_${i}_${j}">${archetypeCollectionOptions}</datalist>

              </span>



              <div style="display:grid; grid-template-columns: auto auto;">
              <input type="checkbox" ${el.approved ? 'checked' : ''} onchange="updateElement(${i}, ${j}, 'approved', this.checked)" />
              <img src="images/2714_color.png" alt="Approved" height="20"   title="Element approved" style="margin-left:-3px;">
              </div>

              <div style="display:grid; grid-template-columns: auto auto;">
              <input class="checklistbox" type="checkbox" ${el.review ? 'checked' : ''} onchange="updateElement(${i}, ${j}, 'review', this.checked)"/>
              <img src="images/26A0_color.png" alt="Need review" height="20"   title="Element needs review" style="margin-left:-3px;margin-right:5px;">
              </div>

                            
            </div>
            
            <div>
              <textarea placeholder="Add description..." class="element_description" onchange="updateElement(${i}, ${j}, 'description', this.value);">${el.description ? el.description : ''}</textarea>
            </div>
          </div>

          <div>
            <div style="margin-left:auto;"><img src="images/remove.png" alt="Delete element" height="14" onclick="deleteElement(${i}, ${j})" style="cursor: pointer;" title="Delete element"></div>
          </div>
      </div>
      `;
      sectionContentDiv.appendChild(div);
    });

    //add the "Add element" button after the elements
    const addButtonDiv = document.createElement('div');
    addButtonDiv.innerHTML = `
    <span style="cursor:pointer;" onclick="addElement(${i})" >
    <img src="images/add.png" alt="Add" height="14" title="Add element" >&nbsp;Add element
    </span>
    `

    sectionContentDiv.appendChild(addButtonDiv);
    secDiv.appendChild(sectionContentDiv);
    container.appendChild(secDiv);
  });
  const addSectionButtonDiv = document.createElement('div');
  addSectionButtonDiv.innerHTML =
    `
  <span style="cursor:pointer; " onclick="addSection()">
    <img src="images/add.png" alt="Add" height="14" title="Add section" >&nbsp;Add section
  </span>
  `
  container.appendChild(addSectionButtonDiv);
  //updateArchetypeSelect();
  //populateNewNodeInclSelection();
  attachDropDownToComboInput('.mySelect');

}

function renderViewer() {
  const container = document.getElementById('checklistView');
  container.innerHTML = '';
  checkList.forEach((section) => {
    const secDiv = document.createElement('div');
    secDiv.classList.add("checklist_section");
    secDiv.innerHTML = `<div class="checklist_section_label">${section.name}</div>`;
    section.elements.forEach((el) => {
      const line = document.createElement('div');

      if (el.archetype === "Select archetype from collection") {
        el.archetype = undefined;
      }
      if (el.archetype_id === "Select archetype from collection") {
        el.archetype_id = undefined;
      }

      // Confusingly the archetype name and id are saved in checkList like this:
      //    uniqe archetype id is el.archetype
      //    name of archetype is el.archetype_id

      //get the archetype concept name if the archetype is new. If not we show the UUID of the archetype
      let archetype_text = el.archetype_id;


      let collectionItem = archetypeListItems
        .filter(item => item.classList.contains('collection'))
        .filter(item => item.id === el.archetype)

      if (!collectionItem) archetype_text = null;

      line.innerHTML = `${el.approved ? '<img src="images/OK.png" height="14" alt="OK"> ' : '<img src="images/what.png" height="14" alt="?"> '}${el.name}<small>${el.review ? ' [needs review]' : ''} 
          ${el.description ? `<br><small style="color:blue;font-style: italic;margin-left:20px;">${el.description}</small>` : ''}
          ${archetype_text ? `<br><span style="margin-left:20px;">${archetype_text}</span>` : ''}</small>
          `
        ;
      secDiv.appendChild(line);
    });
    container.appendChild(secDiv);
  });

  archetype_collection_data = compileCollectionDataForPlanner();
  updateTreeView();
}

function downloadExcel() {
  const flatList = [];
  checkList.forEach((section) => {
    section.elements.forEach((el) => {
      flatList.push({
        Section: section.name,
        Name: el.name,
        ID: el.id,
        Archetype: el.archetype,
        Archetype_name: el.archetype_id,
        Approved: el.approved,
        NeedsReview: el.review,
        Description: el.description
      });
    });
  });
  const ws = XLSX.utils.json_to_sheet(flatList);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'List');

  // Get and sanitize the project name
  let projectName = document.getElementById('project_name').value || 'untitled';
  projectName = projectName.trim().toLowerCase().replace(/[^a-z0-9_\-]/g, '_');

  // Generate timestamp: YYYY-MM-DD_HH-MM-SS
  const now = new Date();
  const pad = n => n.toString().padStart(2, '0');
  const formatted = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

  // Build filename
  const filename = `${formatted}_${projectName}_checklist.xlsx`;
  //write dfile
  XLSX.writeFile(wb, filename);
}

function triggerFileInput() {
  document.getElementById('uploadExcel').click();
}

function loadFromExcel(event) {
  const file = event.target.files[0];
  if (!file)
    return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, {
      type: 'array'
    });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);
    checkList = [];
    rows.forEach((row) => {
      let section = checkList.find((s) => s.name === row.Section);
      if (!section) {
        section = {
          name: row.Section,
          elements: []
        };
        checkList.push(section);
      }
      section.elements.push({
        name: row.Name || '',
        archetype: row.Archetype || '',
        archetype_id: row.Archetype_name || '',
        approved: row.Approved || false,
        review: row.NeedsReview || false,
        description: row.Description || ''
      });
    });

    renderEditor();
    renderViewer();
  };
  reader.readAsArrayBuffer(file);
  document.getElementById("uploadExcel").value = '';
}

// CHECKLIST - EVENT HANDLER **********************************************************************************

function clearchecklist(event) {
  const confirmed = confirm('Are you sure you want to delete the checklist?');
  if (!confirmed) {
    event.preventDefault(); // Prevents the deletion if user cancels
    return;
  }
  // Remove the checklist
  checkList = [];
  updateLists();
  renderEditor();
  renderViewer();
}

// NEW ARCHETYPES *********************************************************************************************
// NEW ARCHETYPES - FUNCTIONS *********************************************************************************
function addNewArchetypesListItems() {

  //delete all new archetype items from the archetypeListItems array
  archetypeListItems = archetypeListItems.filter(item => !item.classList.contains('new'));

  newNodes
    .forEach(item => {
      //create  a new list item
      const li = document.createElement('li');
      li.id = item.id;
      li.textContent = item.archetype_id;
      li.classList.add('collection'); //shows inwhich list this should go
      li.classList.add('new'); //important when we are using new archetypes
      li.onclick = () => {
        if (selectedListItem) selectedListItem.classList.remove('selected');
        li.classList.add('selected');
        selectedListItem = li;
        //take selected list item id and load the data from the newNodes array
        getNewNodeData();
        updateLists();
        renderEditor();
        renderViewer();
      };
      archetypeListItems.push(li);

      /*
      if (selectedListItem)selectedListItem.classList.remove('selected');
      li.classList.add('selected');
      selectedListItem = li;
      */
    });

}

function createNewArchetypeObject() {
  let newObject = {
    "id": uuidv4(),
    "archetype_id": document.getElementById('new_archetype_id').value,
    "class": "",
    "lifecycle_state": "",
    "original_language": "",
    "translation_languages": [],
    "purpose": " ",
    "keywords": [],
    "include": [],
    "exclude": [],
    "concept_name": document.getElementById('new_archetype_id').value,
    "concept_description": "",
    "items": [],
    "parent": "",
    "children": [],
    "similar": []
  };
  newNodes.push(newObject);
  return newObject['id']
}


function compileCollectionDataForPlanner() {
  //get all archetype IDs from the archetyepListItems
  let archetypeCollectionForPlanner = []

  archetypeListItems
    .forEach(item => {
      if (item.classList.contains('collection')) {
        node = {};
        let archetype_class = '';
        let archetype_id = '';
        let id = '';
        let name = '';
        let assigned_elements = [];
        let atcode_items = ['Reference Model'];

        if (item.classList.contains('new')) {
          const foundItem = newNodes.find(dictitem => dictitem.id.toLowerCase() === item.id.toLowerCase());
          archetype_class = foundItem.class.toLowerCase();
          archetype_id = foundItem.archetype_id;
          id = foundItem.id;
          name = foundItem.concept_name;
        }
        else if (item.classList.contains('existing')) {

          const foundItem = allNodes.find(dictitem => dictitem.id.toLowerCase() === item.id.toLowerCase())
          archetype_class = foundItem.class.substring(foundItem.class.lastIndexOf('-') + 1).toLowerCase();
          archetype_id = foundItem.archetype_id;
          id = foundItem.id;
          name = foundItem.concept_name;
          if (foundItem.items && foundItem.items.length != 0) {
            foundItem.items
              .forEach(item => {
                atcode_items.push('[' + item.code + '] ' + item.label + ' ' + item.type)
              });
          }
        }
        node['archetype_class'] = archetype_class;
        node['archetype_id'] = archetype_id;
        node['id'] = id;
        node['name'] = name;
        node['atcode_items'] = atcode_items;
        node['assigned_elements'] = checkList
          .flatMap(section =>
            section.elements
              .filter(el => el.archetype_id === archetype_id)
              .map(el => section.name + ' - ' + el.name));
        archetypeCollectionForPlanner.push(node);
      }
    })
  return archetypeCollectionForPlanner
}





function getNewNodeData() {
  const foundItem = newNodes.find(item => item.id.toLowerCase() === selectedListItem.id.toLowerCase());
  const value = foundItem ? foundItem.id : undefined;

  //load all object data into the correspondingin fields
  document.getElementById('new_archetype_id').value = getAttributefromObject(foundItem, 'archetype_id');
  document.getElementById('new_archetype_uuid').innerHTML = '<small>' + getAttributefromObject(foundItem, 'id') + '</small>';

  document.getElementById('new_archetype_concept_name').value = getAttributefromObject(foundItem, 'concept_name');

  document.getElementById('new_archetype_class').value = foundItem.class;
  document.getElementById('new_archetype_keywords').value = foundItem.archetype_keywords;
  document.getElementById('new_archetype_purpose').value = foundItem.archetype_purpose;

  const inclList = foundItem.include;

  //Get all li IDs from collection_list
  const collectionIds = archetypeListItems
    .filter(item => item.classList.contains('collection'))
    .map(item => item.id);


  //Filter inclList to keep only items present in collectionIds
  const filteredInclList = inclList.filter(item => collectionIds.includes(item));
  //Update the include array of your node (foundItem)
  foundItem.include = filteredInclList;

  let includedArchetypeIds = []
  const my_ul = document.getElementById('new_archetype_inclusions_ul');
  my_ul.innerHTML = '';
  filteredInclList
    .forEach(item => {
      //search for the node id in the archetype collection
      let archetype_id = archetypeListItems.find(c => c.id.toLowerCase() === item.toLowerCase()).textContent;

      //create  a new list item
      const li = document.createElement('li');
      li.id = item;
      li.textContent = archetype_id;
      li.classList.add('notselectable');
      my_ul.appendChild(li);
      includedArchetypeIds.push(archetype_id);
    })

  foundItem.includeNames = includedArchetypeIds;

  document.getElementById('archetype_info').innerHTML = formatNewNodeItemAsHTML(foundItem);
  getAssignedElements(getAttributefromObject(foundItem, 'id'));

  let target = document.getElementById("info_body_right_assigned_elements");
  let source = document.getElementById("new_archetype_elements");
  target.innerHTML = source.innerHTML;

}

function formatNewNodeItemAsHTML(item) {
  // Helper to format arrays of objects
  function formatItemArray(arr) {
    if (!arr || arr.length === 0)
      return '<em>None</em>';
    return '<ul>' + arr.map(obj =>
      `<li class="notselectable">
      ${obj.code} <strong>${obj.label}</strong> <small>${obj.type}</small>
    </li>`).join('') + '</ul>';
  }

  function formatInclusionArray(arr) {
    if (!arr || arr.length === 0)
      return '<em>None</em>';
    return '<ul>' + arr.map(obj =>
      `<li class="notselectable">${obj}</li>`).join('') + '</ul>';
  }

  function formatString(value) {
    if (value == '' || !value || value == 'undefined') {
      return '<em>None</em>';
    }
    else {
      return value
    }
  }

  function formatRecommendationArray(arr) {
    if (!arr || arr.length === 0)
      return '<em>None</em>';
    return '<ul>' + arr.map(obj =>
      `<li class="notselectable">
      ${obj}
    </li>`).join('') + '</ul>';
  }
  let warning = '<p class="warning">This is a proposal for a new archetype.</p>';
  return `
  <div id="info_header">
  <h2>${formatString(item.concept_name)}</h2>
  <p>${formatString(item.archetype_id)}</p>
  <p><small>${item.id}</small></p>
  ` + warning + `
  </div><hr>
  <div id="info_body">
    <div id="info_body_left">      
      <p><strong>Purpose:</strong> ${formatString(item.archetype_purpose)}</p>
      <p><strong>State:</strong> new_proposal</p>
      <p><strong>Keywords:</strong> ${formatString(item.archetype_keywords)}</p>
      <p><strong>Class:</strong> ${formatString(item.class)}</p>
    </div>
    <div id="info_body_right">
      <strong>Assigned Items</strong>
      <div id="info_body_right_assigned_elements"></div>
    </div>
    
  </div>
  <div id="info_additional">
  <hr>
  <h3>Include</h3>
  ${formatInclusionArray(item.includeNames)}
  <br>
  </div>
`;
}

function getAssignedElements(archetype_id) {
  // Flatten all elements from all sections and filter
  const matchingNames = checkList
    .flatMap(section =>
      section.elements
        .filter(el => el.archetype === archetype_id)
        .map(el => section.name + ' - ' + el.name));
  // Inject into the DOM
  const container = document.getElementById("new_archetype_elements");

  if (container) {
    container.innerHTML = '';
    const ul = document.createElement("ul");
    matchingNames.forEach(name => {
      const li = document.createElement("li");
      li.textContent = name;
      li.classList.add('notselectable')
      ul.appendChild(li);
    });
    container.appendChild(ul);
  }
}

function getAttributefromObject(object, attribute) {
  const value = object ? object[attribute] : undefined;
  return value
}

function setNewNodeData() {
  const foundItem = newNodes.find(item => item.id.toLowerCase() === selectedListItem.id.toLowerCase());
  const value = foundItem ? foundItem.id : undefined;

  //change all object data into the corresponding object
  foundItem.concept_name = document.getElementById('new_archetype_concept_name').value;
  foundItem.class = document.getElementById('new_archetype_class').value;
  foundItem.archetype_keywords = document.getElementById('new_archetype_keywords').value;
  foundItem.archetype_purpose = document.getElementById('new_archetype_purpose').value;

  //generate auto ID
  const autoArchetypeID = 'openEHR-EHR-' + foundItem.class + '-' + foundItem.concept_name.trim()
    // normalize accents: "Körpertemperatur" -> "Korpertemperatur"
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    // spaces and hyphens to underscore
    .replace(/[\s-]+/g, '_')
    // remove all characters that are not a-z, 0-9 or underscore
    .replace(/[^a-z0-9_]/g, '')
    // collapse multiple underscores
    .replace(/_+/g, '_')
    // trim leading/trailing underscores
    .replace(/^_+|_+$/g, '')
    // enforce max length if you like
    .slice(0, 100) + '_v0';

  //add the auto-generate archetype ID
  foundItem.archetype_id = autoArchetypeID;
  document.getElementById('new_archetype_id').value = autoArchetypeID;

  //get inclusion list items and add to list
  const currentListItems = Array.from(document.getElementById('new_archetype_inclusions_ul').getElementsByTagName("li"));
  foundItem.include = currentListItems.map(li => li.id);

  //if we chage the archetype id of a new archetype, we want to cahnge the assignment in the checklist
  checkList.forEach((section) => {
    section.elements.forEach((el) => {
      if (el.archetype == foundItem.id) {
        el.archetype_id = foundItem.archetype_id;
      }
    });
  });

  addNewArchetypesListItems();
  updateLists();
  //updateArchetypeSelect();
  //populateNewNodeInclSelection();
}

// NEW ARCHETYPES - EVENT LISTENERS ***************************************************************************

//add an item to the inclusded archetypes list
function addArchetypeToNewArchetypeInclusionList() {

  const select = document.getElementById('new_archetype_listArchetypes');
  const listItemID = select.value;
  const datalist = document.getElementById('myArchetypeCollectionOptions');
  let listItemText = '';
  // Find the matching option in the datalist
  for (const option of datalist.options) {
    if (option.value === listItemID) {
      listItemText = option.textContent || '';
      break;
    }
  }
  const my_ul = document.getElementById('new_archetype_inclusions_ul');
  //if already exists in list, do not add
  const currentListItems = Array.from(my_ul.getElementsByTagName("li"));

  // Check if item already exists
  const alreadyExists = currentListItems.some(li => li.textContent === listItemText);
  if (alreadyExists) {
    select.value = '';
    return; // Do not add duplicate
  }

  //Check if item is the same as the current archetype. Do not permit addind itself.
  if (selectedListItem.id === listItemID) {
    select.value = '';
    return; // Do not add duplicate
  }

  //create and add a list item
  const li = document.createElement("li");
  li.textContent = listItemText;
  li.id = listItemID
  li.classList.add('notselectable');
  my_ul.appendChild(li);
  setNewNodeData();
  select.value = '';

}

function removeArchetypeToNewArchetypeInclusionList() {
  const listItemID = document.getElementById('new_archetype_listArchetypes').value;
  const my_ul = document.getElementById('new_archetype_inclusions_ul');
  // Get current list items
  const currentListItems = Array.from(my_ul.getElementsByTagName("li"));
  // Find and remove the matching item
  const itemToRemove = currentListItems.find(li => li.id === listItemID);
  if (itemToRemove) {
    my_ul.removeChild(itemToRemove);
  }
  setNewNodeData();
  document.getElementById('new_archetype_listArchetypes').value = '';
};

function createNewArchetype() {
  //create a unique name
  let allArchetypeNames = []
  archetypeListItems
    .forEach(item => {
      allArchetypeNames.push(item.textContent);
    })

  let baseTitle = "A New Archetype";
  let title = baseTitle;
  let counter = 1;
  const existingTitles = new Set(allArchetypeNames.map(a => a));
  while (existingTitles.has(title)) {
    title = `${baseTitle} (${counter++})`;
  }

  //add name to the archetype id field
  document.getElementById('new_archetype_id').value = title;

  //CLEAR ALL OTHER FIELDS!
  document.getElementById('new_archetype_uuid').value = '';
  document.getElementById('new_archetype_concept_name').value = '';
  document.getElementById('new_archetype_class').value = '';
  document.getElementById('new_archetype_keywords').value = '';
  document.getElementById('new_archetype_purpose').value = '';
  document.getElementById("new_archetype_elements").innerHtml = '';
  document.getElementById("new_archetype_inclusions_ul").innerHtml = '';

  myNewArchetupeUUID = createNewArchetypeObject();
  addNewArchetypesListItems();
  //set the focus on this new archetype
  const listItem = archetypeListItems.find(n => n.id === myNewArchetupeUUID);
  if (listItem) {
    selectedListItem = listItem;
  }

  updateLists();
  renderEditor();
  renderViewer();
}

function deleteNewArchetype(event) {
  const confirmed = confirm('Are you sure you want to delete this archetype?');
  if (!confirmed) {
    event.preventDefault(); // Prevents the deletion if user cancels
    return;
  }
  // Remove the selected archetype from the array
  newNodes = newNodes.filter(item => item.id !== selectedListItem.id);
  archetypeListItems = archetypeListItems.filter(item => item.id !== selectedListItem.id);
  //remove the deleted id from the lasIds list
  lastIds = lastIds.filter(item => item !== selectedListItem.id);

  const name = selectedListItem.textContent;
  const identifier = selectedListItem.id;
  removeArchetypeFromChecklist(identifier, name);
  removeArchetypeFromTree(identifier, name);

  // Clear selection
  selectedListItem = null;

  updateLists();
  renderEditor();
  renderViewer();
  updateTreeView();
}

// PROJECT *********************************************************************************************
// PROJECT - FUNCTIONS *********************************************************************************

function triggerProjectDownload() {
  createProjectFile();

  // Get and sanitize the project name
  let projectName = document.getElementById('project_name').value || 'untitled';
  projectName = projectName.trim().toLowerCase().replace(/[^a-z0-9_\-]/g, '_');

  // Generate timestamp: YYYY-MM-DD_HH-MM-SS
  const now = new Date();
  const pad = n => n.toString().padStart(2, '0');
  const formatted = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

  // Build filename
  const filename = `${formatted}_${projectName}_project.json`;

  // Create and trigger download
  const blob = new Blob([JSON.stringify(wholeProject, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function createProjectFile() {
  if (wholeProject != [] && wholeProject != {}) {
    wholeProject.project.title = document.getElementById('project_name').value;
    wholeProject.project.description = document.getElementById('project_description').value;

    wholeProject.project.author = document.getElementById('project_author').value;
    wholeProject.project.copyright = document.getElementById('project_copyright').value;
    wholeProject.project.contact = document.getElementById('project_contact').value;

    wholeProject.software_version = version;
    wholeProject.db_source = provenance;
    wholeProject.db_update = extraction_date;

    wholeProject.new_nodes = newNodes;
    //EXTRACT INFORMATION FORM LI OBJECTS
    wholeProject.list_items = saveArchetypeListItems();

    //WHEN LOADING ADD LI ITEMS AGAIN
    wholeProject.checklist = checkList;

    wholeProject.show_splash_on_start = document.getElementById('dont_show_splash').checked;
    document.getElementById('dont_show_splash2').checked = document.getElementById('dont_show_splash').checked

    wholeProject.color_theme_changes = document.getElementById('apply_theme_changes').checked;
    wholeProject.archetype_tree_data = archetypeTree;
  }
}

function triggerNoSplashCheckSync() {

  document.getElementById('dont_show_splash').checked = document.getElementById('dont_show_splash2').checked;
  createProjectFile();
}

function saveArchetypeListItems() {

  const items = []
  archetypeListItems
    .forEach(item => {
      const a = {
        class: item.classList,
        id: item.id,
        textContent: item.textContent
      }
      items.push(a);
    })
  return items;
}

function restituteArchetypeListItem(list_items) {
  const arLiIt = [];
  list_items
    .forEach(item => {
      const li = document.createElement('li');
      li.id = item.id;
      li.textContent = item.textContent;
      li.classList.add(...Object.values(item.class));
      //delete all selected classes
      if (li.classList.contains('selected')) {
        li.classList.remove('selected')
      }
      //add functions
      if (li.classList.contains('new')) {
        li.onclick = () => {

          if (selectedListItem)
            selectedListItem.classList.remove('selected');
          li.classList.add('selected');
          selectedListItem = li;
          //take selected list item id and load the data from the newNodes array
          getNewNodeData();
          updateLists();
          renderEditor();
          renderViewer();
        };
      } else if (li.classList.contains('existing')) {
        li.onclick = () => {

          if (selectedListItem)
            selectedListItem.classList.remove('selected');
          li.classList.add('selected');
          selectedListItem = li;
          //load the current item data
          loadExistingArchetypeData(allNodes.find(item => item.id.toLowerCase() === selectedListItem.id.toLowerCase()));
          updateLists();
          renderEditor();
          renderViewer();
        };
      }
      arLiIt.push(li);
    })
  return arLiIt
}

function populateProject() {
  document.getElementById('project_name').value = wholeProject.project.title;
  document.getElementById('project_description').value = wholeProject.project.description;
  document.getElementById('project_author').value = wholeProject.project.author;
  document.getElementById('project_copyright').value = wholeProject.project.copyright;
  document.getElementById('project_contact').value = wholeProject.project.contact;

  document.getElementById('dont_show_splash').checked = wholeProject.show_splash_on_start;
  document.getElementById('dont_show_splash2').checked = document.getElementById('dont_show_splash').checked;

  document.getElementById('apply_theme_changes').checked = wholeProject.color_theme_changes;
  newNodes = wholeProject.new_nodes;
  if (wholeProject.archetype_tree_data) {
    archetypeTree = wholeProject.archetype_tree_data;

    if (Object.keys(archetypeTree).length == 0) {
      archetypeTree = initArchetypeTree();
    }
  }
  else {
    archetypeTree = initArchetypeTree();
  }

  //compare the stored list of archetypes with the existing archetype DB
  //create a list of existing IDs
  let existing_ids = [];
  allNodes.forEach(existing_item => {
    existing_ids.push(existing_item.archetype_id)
  });

  //create a list of stored IDs
  let loaded_ids = wholeProject.list_items
    .filter(item => Object.values(item.class).includes("existing"))
    .map(item => item.id);

  // Find items to delete (in loaded_ids but not in existing_ids)
  const toDelete = loaded_ids.filter(id => !existing_ids.includes(id));

  // Find items to add (in existing_ids but not in loaded_ids)
  const toAdd = existing_ids.filter(id => !loaded_ids.includes(id));

  // Delete items from wholeProject.list_items
  wholeProject.list_items = wholeProject.list_items.filter(item => !toDelete.includes(item.id));

  // Add missing items to wholeProject.list_items
  toAdd.forEach(id => {
    wholeProject.list_items.push({
      "class": {
        "0": "available",
        "1": "existing"
      },
      "id": id,
      "textContent": id
    });
  });

  if (wholeProject.db_source != provenance || wholeProject.db_update != extraction_date) {
    // Generate HTML summary of changes
    let summaryHTML = `<h2>Update to the archetype database (DB)</h2>
            <br>`;
    if (wholeProject.db_source != provenance || wholeProject.db_update != extraction_date) {
      summaryHTML += "<h3>Archetype database has been changed:</h3>";
      summaryHTML += `Archetypes in loaded project data:
              <br>
              ${wholeProject.db_source} ${wholeProject.db_update}
              <br>
              <br>Archetypes in database:
              <br>${provenance} ${extraction_date}
              <br><br>`
      summaryHTML += "<hr>";
    }
    else {
      summaryHTML += `<br><h3>Archetypes in loaded project data:</h3>
              <br>Source: ${wholeProject.db_source}, Update: ${wholeProject.db_update}<br><br><hr>`;
    }
    if (toDelete.length > 0) {
      summaryHTML += "<h3>Project archetype deleted, because it does not exist in DB:</h3>";
      toDelete.forEach(id => summaryHTML += `${id}<br>`);
      summaryHTML += "<hr>";
    }
    if (toAdd.length > 0) {
      summaryHTML += "<h3>New DB items added to project:</h3>";
      toAdd.forEach(id => summaryHTML += `${id}<br>`);
      summaryHTML += "<hr>";
    }
    if (toDelete.length === 0 && toAdd.length === 0) {
      summaryHTML += "<strong>No changes were necessary.</strong><br>";
    }

    // Show the warning page
    show_warning_page(summaryHTML);
  }

  archetypeListItems = restituteArchetypeListItem(wholeProject.list_items);

  if (selectedListItem)
    selectedListItem.classList.remove('selected');
  selectedListItem = null;

  checkList = wholeProject.checklist;

  document.getElementById('main_view_project_name').innerHTML = document.getElementById('project_name').value;

  updateHeaderGradientForHoliday()
}



// PROJECT - EVENT LISTENERS *********************************************************************************
document.getElementById('download_project_button').addEventListener('click', function () {
  triggerProjectDownload();
})

document.getElementById('load_project_button').addEventListener('click', function () {
  // Clear the input value so selecting the same file again still triggers 'change'
  this.value = '';
});

document.getElementById('load_project_button').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file)
    return;

  const reader = new FileReader();
  reader.onload = function (event) {
    try {
      selectedListItem = null;
      wholeProject = JSON.parse(event.target.result);
      populateProject();
      updateLists();
      renderEditor();
      renderViewer();

    } catch (err) {
      alert("Invalid JSON file.");
    }
  };
  reader.readAsText(file);
})


function triggerProjectFileInput() {
  document.getElementById('load_project_button').click();
}

function loadProjectFromJSON(e) {
  const file = e.target.files[0];
  if (!file)
    return;

  const reader = new FileReader();
  reader.onload = function (event) {
    try {
      selectedListItem = null;
      wholeProject = JSON.parse(event.target.result);
      populateProject();

    } catch (err) {
      alert("Invalid JSON file.");
    }
  };
  reader.readAsText(file);
}

function createNewProject() {
  if (document.getElementById('project_name').value != '') {
    if (confirm("Are you sure you want to clear all project data? This cannot be undone.")) {
      localStorage.removeItem('ArchetypeExplorerProject');
      resetAll();
      wholeProject = {
        project: {
          title: "",
          description: "",
          author: "",
          copyright: "",
          contact: ""

        },
        software_version: "",
        db_source: "",
        db_update: "",
        checklist: "",
        existing_nodes: "",
        new_nodes: "",
        show_splash_on_start: false,
        color_theme_changes: false
      };

      document.getElementById('project_name').value = 'My new project';
      document.getElementById('project_description').value = '';
      document.getElementById('project_author').value = '';
      document.getElementById('project_copyright').value = '';
      document.getElementById('project_contact').value = '';
      archetypeTree = initArchetypeTree();
      updateTreeView();

      alert("Local storage has been cleared.");
    }
  } else {
    localStorage.removeItem('ArchetypeExplorerProject');
    resetAll();
    wholeProject = {
      project: {
        title: "",
        description: ""
      },
      checklist: "",
      existing_nodes: "",
      new_nodes: ""
    }

    document.getElementById('project_name').value = 'My new project';
    archetypeTree = initArchetypeTree();
    updateTreeView();

  }

  //delete all new nodes
  archetypeListItems = archetypeListItems.filter(item => item.classList.contains("existing"));
  newNodes = [];
}



// VISUALIZATION ***************************************************************************************
//FUNCTIONS

function handleZoom(e) {
  d3.select('svg g')
    .attr('transform', e.transform);
}

function initZoom() {
  d3.select('svg').call(myZoom);
}

function resetZoom() {
  d3.select('svg')
    .transition()
    .duration(500)
    .call(myZoom.transform, d3.zoomIdentity);

  if (selectedListItem) {
    focusNode(selectedListItem.id);
  }
}


function redraw() {
  d3.selectAll("svg g > *").remove(); //remove everything from the svg


  //create unique colors for all markers
  const uniqueColors = [...new Set(links.map(link => link.color))]; //gets a list of all line colors. example: ['transparent', 'green', 'red', 'black'

  let defs = svg.select('defs');
  if (defs.empty()) {
    defs = svg.append('defs');
  }

  uniqueColors.forEach(color => {
    defs.append('marker')
      .attr('id', `arrow-${color}`) // e.g., arrow-green or arrow-00ff00
      .attr('markerWidth', 17)
      .attr('markerHeight', 20)
      .attr('refX', 14)
      .attr('refY', 3.5)
      .attr('orient', 'auto')
      .attr('markerUnits', 'strokeWidth')
      .append('polygon')
      .attr('points', '0 0, 10 3.5, 0 7')
      .attr('fill', color);

    defs.append('marker')
      .attr('id', `bwarrow-${color}`) // e.g., arrow-green or arrow-00ff00
      .attr('markerWidth', 17)
      .attr('markerHeight', 20)
      .attr('refX', -5)
      .attr('refY', 3.5)
      .attr('orient', 'auto')
      .attr('markerUnits', 'strokeWidth')
      .append('polygon')
      .attr('points', '10 0, 0 3.5, 10 7')
      .attr('fill', color);
  });

  // Rebind data to links

  lines = svg.selectAll('line')
    .data(links)
    .enter()
    .append('line')
    .attr('stroke', (link) => link.color || 'black')
    .attr('marker-start', link => link.marker_start !== 'None' ? `url(#bwarrow-${(link.color || 'black')})` : null)
    .attr('marker-end', link => link.marker_end !== 'None' ? `url(#arrow-${(link.color || 'black')})` : null)
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', (link) => link.dash || "5,5");

  // Rebind data to circles
  circles = svg.selectAll('circle')
    .data(nodes)
    .enter()
    .append('circle')
    .attr('fill', (node) => node.color)
    .attr('r', (node) => node.size || 10)
    .attr('stroke-width', 3)
    .attr('stroke', (node) => node.stroke || 'transparent')
    .on("click", (event, d) => {
      focusNode(d.id);
      updateLists();
    });

  // Rebind data to text
  text = svg.selectAll('text')
    .data(nodes)
    .enter()
    .append('text')
    .attr('font-size', '12')
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .style('pointer-events', 'none')
    .text((node) => node.archetype_id);

  secondary_text = svg.selectAll('text2')
    .data(nodes)
    .enter()
    .append('text')
    .attr('font-size', '8')
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .style('pointer-events', 'none')
    .style('fill', 'darkgray')
    .style('font-style', 'italic')
    .text((node) => node.secondary_text);


  // Update simulation nodes and links
  simulation.nodes(nodes);
  simulation.force('link', d3.forceLink(links).id(function (d) {
    return d.id;
  }).distance(150));

}

function getConnectedNodesforNewNode(nodeId) {
  if (nodeId != lastIds[lastIds.length - 1]) {
    lastIds.push(nodeId); //add IDs to the array of last visited IDs.
    updateVisitedHistory();
  }
  sel_view = document.getElementById('select_vis_view').value;

  if (sel_view === 'ARCHETYPEMINDMAP') {
    //get selected item from newNode array
    selected = allNodes.find(n => n.id === nodeId);
    selected.color = 'red';
    selected.size = 10;
    selected.stroke = 'black';
    nodes.push(selected);
  }

  if (sel_view === 'ARCHETYPE' || sel_view === 'COMBINATION') {
    //get selected item from newNode array
    selected = newNodes.find(n => n.id === nodeId);
    selected.color = 'red';
    selected.size = 10;
    selected.stroke = 'black';
    nodes.push(selected);

    //add child nodes (there are none by now)
    //add parent  (there is non featured by now)

    //add included nodes
    includedIds = [];
    includedObjects = getAttributefromObject(selected, 'include');
    includedObjects.forEach(a => {
      var tempNode;
      tempNode = allNodes.find(item => item.id.toLowerCase() === a.toLowerCase());

      if (tempNode) {
        //go on
      } else {
        tempNode = newNodes.find(item => item.id.toLowerCase() === a.toLowerCase());
      }

      if (tempNode) {
        tempNode.color = 'white';
        tempNode.size = 10;
        tempNode.stroke = 'green'
        nodes.push(tempNode);
        links.push({
          'source': nodeId,
          'target': a,
          'dash': "5,5",
          'color': 'green',
          'marker_start': 'None',
          'marker_end': 'None'
        });
      }
    });

  }
}

function getConnectedNodes(nodeId) {
  //console.log('getConnectedNodes(nodeId)')
  if (nodeId != lastIds[lastIds.length - 1]) {
    lastIds.push(nodeId); //add IDs to the array of last visited IDs.
    updateVisitedHistory();
  }
  //get the view selector as input
  sel_view = document.getElementById('select_vis_view').value;

  // Create a Set to store connected node IDs
  let connectedIds = new Set();

  // Loop through each link to find connections
  links = [];
  nodes = [];
  dummyNodes = []; //if there is a connection to a node that is not available in the archetype list, we should show the node anyway

  //find current item
  const foundItem = allNodes.find(item => item.id.toLowerCase() === nodeId.toLowerCase());

  if (sel_view === 'ARCHETYPEMINDMAP') {

    //get the archetype structure
    archetypeStructure = foundItem.structure_json;

    let globalPosY = visualization_element.offsetHeight / 2;;

    function parse_archetype_structure(p, pId, posX, posY, path = []) {
      posX+=150;
      // null or primitive → endpoint
      if (p === null || typeof p !== "object") {
        //CREATE A VALUE NODE
        tempNode = {};
        tempNode.id = uuidv4();
        tempNode.archetype_id = p;
        tempNode.color = 'hotpink';
        tempNode.size = 13;
        tempNode.stroke = 'transparent';
        tempNode.fy = globalPosY;
        tempNode.fx = posX;
        nodes.push(tempNode);
        //create link
        links.push({
                'source': pId,
                'target': tempNode.id,
                'dash': "0",
                'color': 'lightgray',
                'marker_start': 'None',
                'marker_end': 'None'
              });
        console.log('Endpoint:', path.join('.'), 'Value:', p);
        return true;
      }
      
      /*
      // If it's an array, iterate indices
      if (Array.isArray(p)) {
        console.log('Key (array index)')
        p.forEach((item, index) => {
          console.log('Key (array index):', index);
          posY+=100; posX+=250
          parse_archetype_structure(item, path.concat(index)); ///////////////////////////////////////////////////////// <-------------
        });
        return;
      }
      */

      // Otherwise it's a plain object
      const keys = Object.keys(p);
      if (keys.length === 0) {
        // empty object: treat as endpoint with empty value
        console.log('Endpoint (empty object):', path.join('.'), 'Value:', p);
        return;
      }
      for (const key of keys) {      
        console.log('Key:', key);
        let text1 = key;
        let text2 = '';
        if (key.includes("||")) {
            const parts = key.split("||");
            text2 = parts[0];
            text1  = parts[1] ?? ""; // empty string (or null) if there's no "after" part
        }
        //CREATE A KEY NODE
        tempNode = {};
        tempNode.id = uuidv4();
        tempNode.archetype_id = text1;
        tempNode.secondary_text = text2;
        tempNode.color = 'lightgray';
        tempNode.size = 13;
        if (key.includes("||")) {
          tempNode.stroke = 'black';
        }
        else{
          tempNode.stroke = 'transparent';
        }
        tempNode.fy = globalPosY;
        tempNode.fx = posX;
        nodes.push(tempNode);
        //create link
        links.push({
                'source': pId,
                'target': tempNode.id,
                'dash': "0",
                'color': 'lightgray',
                'marker_start': 'None',
                'marker_end': 'None'
              });
        parse_archetype_structure(p[key], tempNode.id, posX, posY, path.concat(key));
        globalPosY+=65;
      }
      globalPosY-=65;
    }

    parse_archetype_structure(archetypeStructure, nodeId, visualization_element.offsetWidth / 2, 0)

    //get selected item from newNode array
    selected = allNodes.find(n => n.id === nodeId);
    selected.color = 'red';
    selected.size = 10;
    selected.stroke = 'black';
    selected.fy = visualization_element.offsetHeight / 2;
    selected.fx = visualization_element.offsetWidth / 2 -150;
    nodes.push(selected);
  }

  if (sel_view === 'SIMILAR' || sel_view === 'COMBINATION') {
    //add similar nodes and links
    similarArchetypes = getAttributefromObject(foundItem, 'similar');
    //create a list of links to similar archetypes
    similarArchetypes.forEach(a => {
      connectedIds.add(a);
      tempNode = allNodes.find(item => item.id.toLowerCase() === a.toLowerCase());
      tempNode.color = 'salmon';
      tempNode.size = 10;
      tempNode.stroke = 'transparent';
      links.push({
        'source': nodeId,
        'target': a,
        'dash': "0",
        'color': 'transparent',
        'marker_start': 'None',
        'marker_end': 'None'
      });
    })
  }

  if (sel_view === 'ARCHETYPE' || sel_view === 'COMBINATION') {
    //add children nodes and links
    childrenIds = getAttributefromObject(foundItem, 'children');
    childrenIds.forEach(a => {
      connectedIds.add(a);
      tempNode = allNodes.find(item => item.id.toLowerCase() === a.toLowerCase());
      if (!tempNode) {
        tempNode = {};
        tempNode.id = a;
        tempNode.archetype_id = a;
        tempNode.color = 'lightgray';
        tempNode.size = 13;
        tempNode.stroke = 'transparent';

        dummyNodes.push(tempNode);

      } else {
        tempNode.color = 'black';
        tempNode.size = 7;
        tempNode.stroke = 'black'
      }
      links.push({
        'source': nodeId,
        'target': a,
        'dash': "0",
        'color': 'black',
        'marker_start': 'None',
        'marker_end': 'url(#arrow)'
      });
    })
    //add parent node
    parentID = getAttributefromObject(foundItem, 'parent');
    if (parentID != '') {
      connectedIds.add(parentID);
      tempNode = allNodes.find(item => item.id.toLowerCase() === parentID.toLowerCase());
      if (!tempNode) {
        tempNode = {};
        tempNode.id = parentID;
        tempNode.archetype_id = parentID;
        tempNode.color = 'lightgray';
        tempNode.size = 13;
        tempNode.stroke = 'transparent';
        dummyNodes.push(tempNode);
      } else {
        tempNode.color = 'black';
        tempNode.size = 13;
        tempNode.stroke = 'transparent';
      }
      links.push({
        'source': nodeId,
        'target': parentID,
        'dash': "0",
        'color': 'black',
        'marker_start': 'url(#bwarrow)',
        'marker_end': 'None'
      });
    }

    //add included nodes
    includedIds = [];
    includedObjects = getAttributefromObject(foundItem, 'include');
    includedObjects.forEach(item => {
      archetypeIDs = item.archetypes;
      archetypeIDs.forEach(a => {
        connectedIds.add(a);
        tempNode = allNodes.find(item => item.id.toLowerCase() === a.toLowerCase());
        if (!tempNode) {
          tempNode = {};
          tempNode.id = a;
          tempNode.archetype_id = a;
          tempNode.color = 'lightgray';
          tempNode.size = 13;
          tempNode.stroke = 'transparent';
          dummyNodes.push(tempNode);
        } else {
          tempNode.color = 'white';
          tempNode.size = 10;
          tempNode.stroke = 'green'
        }
        links.push({
          'source': nodeId,
          'target': a,
          'dash': "5,5",
          'color': 'green',
          'marker_start': 'None',
          'marker_end': 'None'
        });
      });
    });

    //add excluded nodes
    excludedIds = [];
    excludedObjects = getAttributefromObject(foundItem, 'exclude');
    excludedObjects.forEach(item => {
      archetypeIDs = item.archetypes;
      archetypeIDs.forEach(a => {
        connectedIds.add(a);
        tempNode = allNodes.find(item => item.id.toLowerCase() === a.toLowerCase());
        if (!tempNode) {
          tempNode = {};
          tempNode.id = a;
          tempNode.archetype_id = a;
          tempNode.color = 'lightgray';
          tempNode.size = 13;
          tempNode.stroke = 'transparent';
          dummyNodes.push(tempNode);
        } else {
          tempNode.color = 'white';
          tempNode.size = 10;
          tempNode.stroke = 'red'
        }
        links.push({
          'source': nodeId,
          'target': a,
          'dash': "5,5",
          'color': 'red',
          'marker_start': 'None',
          'marker_end': 'None'
        });
      });
    });
  }

  if (sel_view === 'ARCHETYPE' || sel_view === 'SIMILAR' || sel_view === 'COMBINATION') {
    //add all connectedID nodes
    nodes = allNodes.filter(node => connectedIds.has(node.id));
    const uniqueNodes = [];
    const ids = new Set();
    for (const node of dummyNodes) {
      if (!ids.has(node.id)) {
        ids.add(node.id);
        uniqueNodes.push(node);
      }
    }
    nodes = nodes.concat(uniqueNodes);
    //nodes = nodes.concat(dummyNodes);
    //add active node
    tempActiveNode = allNodes.find(n => n.id === nodeId);
    //format active node
    tempActiveNode.color = 'red';
    tempActiveNode.size = 10;
    tempActiveNode.stroke = 'black';
    nodes.push(tempActiveNode);
  }
}

function focusNode(nodeId) {
  //console.log('focusNode(nodeId)')
  //only do the rest if the nodeid exists in the archetypeListItems arrayt
  if (archetypeListItems.filter(item => item.id === nodeId).length > 0) {
    //SELECT CURRENT NODE IN LIST

    //Delete selected from sidebar list:
    const lis = document.querySelectorAll('#archetype_sidebar_list li.selected');
    lis.forEach(li => li.classList.remove('selected'));

    if (selectedListItem)
      selectedListItem.classList.remove('selected');
    const listItem = archetypeListItems.find(n => n.id === nodeId);
    if (listItem) {
      listItem.classList.add('selected');
      selectedListItem = listItem;
    }

    //add the selected item to the sidebar
    const targetUl = document.getElementById('archetype_sidebar_list');
    //mark the selected item in the archetype_sidebar_list
    Array.from(targetUl.children).forEach(li => {
      if (selectedListItem) {
        if (li.id == selectedListItem.id) {
          li.classList.add('selected');
        }
      }
    });

    //reset links and nodes
    links = [];
    nodes = [];

    var selected;
    //see if nodeId is 'new' or 'existing'
    if (selectedListItem) {
      if (selectedListItem.classList.contains('existing')) {
        selected = allNodes.find(n => n.id === nodeId);
        //if existing create nodes and links from allNodes
        if (selected) {
          getConnectedNodes(nodeId);
        }
      } else {
        selected = newNodes.find(n => n.id === nodeId);
        if (selected) {
          getConnectedNodesforNewNode(nodeId);
        }
      }
    }

    //get the view selector as input
    sel_view = document.getElementById('select_vis_view').value;

    //create collection view
    if (sel_view === 'COLLECTION') {

      //get all IDs for collection items from archetypeListItems
      const collectionIds = archetypeListItems
        .filter(item => item.classList.contains('collection'))
        .map(item => item.id);

      const collectionIdSet = new Set(collectionIds);

      nodes = [];
      links = [];

      //CREATE NODES AND INVISIBLE CENTER NODE
      collectionIds
        .forEach(item => {
          tempNode = allNodes.find(n => n.id === item);
          if (!tempNode) {
            tempNode = newNodes.find(n => n.id === item);
            tempNode.existing = false;
          } else {
            tempNode.existing = true;
          } //End of IF statement
          //format active node
          if (tempNode.existing) {
            tempNode.color = 'Yellow';
          } else {
            tempNode.color = 'Blue';
          }
          tempNode.stroke = 'black';
          tempNode.size = 10;
          nodes.push(tempNode);
        }); //END OF FOR EACH COLLECTION ID

      //add a central invisible node
      let invisiNode = {};
      invisiNode.id = 'dummy';
      invisiNode.archetype_id = '';
      invisiNode.color = 'transparent';
      invisiNode.size = 0;
      invisiNode.stroke = 'transparent';
      nodes.push(invisiNode);

      //add links from all nodes to the central dummy node
      nodes
        .forEach(n => {
          links.push({
            'source': invisiNode.id,
            'target': n.id,
            'dash': "5,5",
            'color': 'transparent',
            'marker_start': 'None',
            'marker_end': 'None'
          });
        })
      nodes.push(invisiNode);

      //CREATE ALL LINKS (include, exclude, parent, child)
      // INCLUDES
      nodes.forEach(n => {
        let idSet = new Set();
        // handle includes
        if (Array.isArray(n.include)) {
          n.include.forEach(item => {
            if (typeof item === 'string') {
              // Direct ID
              idSet.add(item);
            } else if (item && Array.isArray(item.archetypes)) {
              // Array of IDs under 'archetypes'
              item.archetypes.forEach(id => idSet.add(id));
            }
          }); // END OF n.include.forEach...
        } //END OF if Array...

        // Iterate over idSet and delete IDs not in nodeIds
        for (const id of idSet) {
          if (!collectionIdSet.has(id)) {
            idSet.delete(id);
          }
        }

        idSet
          .forEach(id => {
            links.push({
              'source': n.id,
              'target': id,
              'dash': "5,5",
              'color': 'green',
              'marker_start': 'None',
              'marker_end': 'url(#arrow)'
            });
          }); //END OF each id in idSet
      }); //END OF EACH NODE - INCLUDES


      // EXCLUDES
      nodes.forEach(n => {
        let idSet = new Set();
        // handle excludes
        if (Array.isArray(n.exclude)) {
          n.exclude.forEach(item => {
            if (typeof item === 'string') {
              // Direct ID
              idSet.add(item);
            } else if (item && Array.isArray(item.archetypes)) {
              // Array of IDs under 'archetypes'
              item.archetypes.forEach(id => idSet.add(id));
            }
          }); // END OF n.include.forEach...
        } //END OF if Array...


        // Iterate over idSet and delete IDs not in nodeIds
        for (const id of idSet) {
          if (!collectionIdSet.has(id)) {
            idSet.delete(id);
          }
        }

        idSet
          .forEach(id => {
            links.push({
              'source': n.id,
              'target': id,
              'dash': "5,5",
              'color': 'red',
              'marker_start': 'None',
              'marker_end': 'url(#arrow)'
            });
          }); //END OF each id in idSet
      }); //END OF EACH NODE - EXCLUDES


      // children
      nodes.forEach(n => {
        let idSet = new Set();
        // handle children
        if (Array.isArray(n.children)) {
          n.children.forEach(item => {
            if (typeof item === 'string') {
              // Direct ID
              idSet.add(item);
            } else if (item && Array.isArray(item.archetypes)) {
              // Array of IDs under 'archetypes'
              item.archetypes.forEach(id => idSet.add(id));
            }
          }); // END OF n.include.forEach...
        } //END OF if Array...


        // Iterate over idSet and delete IDs not in nodeIds
        for (const id of idSet) {
          if (!collectionIdSet.has(id)) {
            idSet.delete(id);
          }
        }

        idSet
          .forEach(id => {
            links.push({
              'source': n.id,
              'target': id,
              'dash': "5,0",
              'color': 'black',
              'marker_start': 'None',
              'marker_end': 'url(#arrow)'
            });
          }); //END OF each id in idSet
      }); //END OF EACH NODE - CHILDREN


      //delete all fixed positions
      nodes.forEach(n => {
        if (n.id === 'dummy') {
          //put dummy to center
          n.fx = visualization_element.offsetWidth / 2;
          n.fy = visualization_element.offsetHeight / 2;
        } else {
          n.fx = null;
          n.fy = null;
        }
      });

    } // END OF CREATE COLLECTION VIEW


    // CREATE PROJECT VIEW
    if (sel_view === 'PROJECT') {
      // the source of all information is the checkList array
      nodes = [];
      links = [];
      let sectionCounter = 0;
      const increment = 50;
      checkList.forEach(section => {
        //create nodes for the sections
        const tempNode = {};
        tempNode.id = section.name;
        tempNode.archetype_id = section.name;
        tempNode.color = 'hotpink';
        tempNode.size = 10;
        tempNode.stroke = 'black';
        tempNode.fy = visualization_element.offsetHeight / 2 + sectionCounter * increment;
        tempNode.fx = visualization_element.offsetWidth / 2 + 0;
        nodes.push(tempNode);

        //add element nodes for every section
        section.elements.forEach(element => {
          let tempNode = {};
          tempNode.id = section.name + element.name;
          element.id = tempNode.id;
          tempNode.archetype_id = element.name;
          tempNode.color = 'lime';
          tempNode.size = 10;
          tempNode.stroke = 'black';
          tempNode.fy = visualization_element.offsetHeight / 2 + sectionCounter * increment;
          tempNode.fx = visualization_element.offsetWidth / 2 + 300;
          sectionCounter += 1;
          nodes.push(tempNode);
          //add a link from section to element
          links.push({
            'source': section.name,
            'target': tempNode.id,
            'dash': "5,5",
            'color': 'gray',
            'marker_start': 'None',
            'marker_end': 'None'
          });
          //add the corresponding archetype
          if (element.archetype != '') {
            tempNode = {};
            tempNode.id = element.archetype;
            if (element.archetype_id) {
              tempNode.archetype_id = element.archetype_id;
            }
            else {
              tempNode.archetype_id = element.archetype;
            };

            let temp_existing_node = allNodes.find(n => n.id === tempNode.archetype_id);
            if (temp_existing_node) {
              tempNode.color = 'Yellow';
            } else {
              tempNode.color = 'Blue';
            } //End of IF statement

            tempNode.size = 10;
            tempNode.stroke = 'black';
            tempNode.fx = visualization_element.offsetWidth / 2 + 600;
            tempNode.y = visualization_element.offsetHeight / 2 + sectionCounter * increment;
            nodes.push(tempNode);
            //add link
            links.push({
              'source': element.id,
              'target': tempNode.id,
              'dash': "5,5",
              'color': 'gray',
              'marker_start': 'None',
              'marker_end': 'None'
            });
          } // END of if statement

        }); // END OF ELEMENTS


      }); //END OF CHECKLIST ITEMS

      //get rid of duplicated archetype nodes
      nodes = Array.from(
        new Map(nodes.map(obj => [obj.id, obj])).values());

    } // END OF CREATE PROJECT VIEW


    // CREATE TEMPLATE PLANNER VIEW
    if (sel_view === 'TREEPLANNER') {
      // the source of all information is the checkList array
      nodes = [];
      links = [];
      let verticalCounter = 0;
      let childCounter = 0;
      const verticalincrement = 50;
      const horizontalincrement = 150;

      function collectNodes(node, nodes = []) {
        function addLink(parentID, childID) {
          links.push({
            'source': parentID,
            'target': childID,
            'dash': "5,0",
            'color': 'lightgray',
            'marker_start': 'None',
            'marker_end': 'None'
          });
        }


        // Add the current node (you can customize which properties to include)
        let tempcolor = 'green'; // element color
        let tempname = node.element_value;
        let tempsecondname = '';
        if (node.equivalent != '') tempsecondname = node.equivalent;
        if (node.mode == 'archetype') {
          tempcolor = 'blue'; //archetype color
          tempname = node.name;
          tempsecondname = node.archetype_id;
        }

        nodes.push({
          id: node.node_uid,
          archetype_id: tempname,
          secondary_text: tempsecondname,
          type: node.type,
          mode: node.mode,
          element_value: node.element_value,
          color: tempcolor,
          size: 10,
          stroke: 'black',
          fy: visualization_element.offsetHeight / 2 + verticalCounter * verticalincrement,
          fx: visualization_element.offsetWidth / 2 + childCounter * horizontalincrement
          // add more properties if needed
        });
        verticalCounter += 1;
        // Recursively add children
        if (Array.isArray(node.children)) {
          childCounter += 1;
          node.children.forEach(child => addLink(node.node_uid, child.node_uid))
          node.children.forEach(child => collectNodes(child, nodes));
          childCounter -= 1;
        }
        return nodes;
      }

      nodes = collectNodes(archetypeTree);
    } // END OF CREATE TEMPLATE PLANNER VIEW

    // if the view is ARCHETYPE, SIMILAR or COMBINATION, set all nodes to be free to move and the selected node to the middle
    if (sel_view === 'ARCHETYPE' || sel_view === 'SIMILAR' || sel_view === 'COMBINATION') {
      nodes.forEach(n => {
        n.fx = null;
        n.fy = null;
      });

      // Fix node position to center (if using force simulation)
      selected.fx = visualization_element.offsetWidth / 2;
      selected.fy = visualization_element.offsetHeight / 2;
    }

    redraw();
    //resetZoom();

    //restart simulation
    simulation.alpha(1).restart();

    if (selectedListItem) {
      if (selectedListItem.classList.contains('existing')) {
        loadExistingArchetypeData(selected);
      } else {
        getNewNodeData();
      }
    }
  }
}

simulation.on('tick', () => {
  circles
    .attr('cx', (node) => node.x)
    .attr('cy', (node) => node.y);

  text.attr('x', (node) => node.x).attr('y', (node) => node.y - 20);
  secondary_text.attr('x', (node) => node.x).attr('y', (node) => node.y - 32);

  lines
    .attr('x1', (link) => link.source.x)
    .attr('y1', (link) => link.source.y)
    .attr('x2', (link) => link.target.x)
    .attr('y2', (link) => link.target.y);
});

// Make divs draggable
const draggables = document.querySelectorAll('.movable-div');
draggables.forEach(draggable => {
  const header = draggable.querySelector('.header');
  header.addEventListener('mousedown', (e) => {
    const offsetX = e.clientX - draggable.offsetLeft;
    const offsetY = e.clientY - draggable.offsetTop;

    function mouseMoveHandler(e) {
      document.body.classList.add('unselectable');
      const parent = document.getElementById('main'); // Assuming 'main' is the ID of your parent div
      const parentRect = parent.getBoundingClientRect();
      const draggableRect = draggable.getBoundingClientRect();
      // Calculate the new position
      let newLeft = e.clientX - offsetX;
      let newTop = e.clientY - offsetY;
      // Limit the new position within the parent boundaries
      newLeft = Math.max(0, Math.min(newLeft, parentRect.width - draggableRect.width));
      newTop = Math.max(0, Math.min(newTop, parentRect.height - 30));
      // Apply the new position
      draggable.style.left = `${newLeft}px`;
      draggable.style.top = `${newTop}px`;
    }

    function mouseUpHandler() {
      document.body.classList.remove('unselectable');
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);

    }

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });
  draggable.addEventListener('mousedown', (e) => {

    //set all windows to background
    const zIndexes = Array.from(draggables).map(d => d.style.zIndex);
    // Get sorted unique zIndexes
    const sortedUnique = Array.from(new Set(zIndexes)).sort((a, b) => a - b);
    // Map old zIndex to new normalized zIndex
    const zIndexMap = Object.fromEntries(sortedUnique.map((z, i) => [z, i]));
    draggables.forEach(d => {
      const oldZ = parseInt(d.style.zIndex) || 0;
      d.style.zIndex = zIndexMap[oldZ];
    });

    let maxZ = sortedUnique[sortedUnique.length - 1];
    draggable.style.zIndex = String(maxZ + 1);

  });
});

// Minimize function
function minimize(button) {
  const div = button.closest('.movable-div');
  div.style.display = 'none';
}

document.querySelectorAll('.movable-div').forEach(div => {
  let startX,
    startY,
    startWidth,
    startHeight,
    startTop,
    startLeft,
    direction;

  function onMouseMove(e) {
    if (!direction)
      return;
    div.style.zIndex = "99";
    div.classList.add('resizing');
    if (direction === 'right') {
      div.style.width = Math.max(100, startWidth + (e.clientX - startX)) + 'px';
    }
    if (direction === 'left') {
      const dx = e.clientX - startX;
      div.style.width = Math.max(100, startWidth - dx) + 'px';
      div.style.left = (startLeft + dx) + 'px';
    }
    if (direction === 'bottom') {
      div.style.height = Math.max(100, startHeight + (e.clientY - startY)) + 'px';
    }
    if (direction === 'top') {
      const dy = e.clientY - startY;
      div.style.height = Math.max(100, startHeight - dy) + 'px';
      div.style.top = (startTop + dy) + 'px';
    }
  }

  function onMouseUp() {
    document.body.classList.remove('unselectable');
    direction = null;
    div.classList.remove('resizing');
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  div.querySelectorAll('.resize-handle').forEach(handle => {
    handle.addEventListener('mousedown', function (e) {
      //set all windows to background
      document.body.classList.add('unselectable');
      e.stopPropagation();
      direction = [...handle.classList].find(cls => ['top', 'right', 'bottom', 'left'].includes(cls));
      startX = e.clientX;
      startY = e.clientY;
      startWidth = div.offsetWidth;
      startHeight = div.offsetHeight;
      startTop = div.offsetTop;
      startLeft = div.offsetLeft;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  });
});

//show search history
function show_search_history_page() {
  const wdw_search_history = document.getElementById("wdw_search_history");
  wdw_search_history.style.display = 'inline';
  wdw_search_history.style.position = 'absolute';
  wdw_search_history.style.left = 'calc(50% - 200px)';
  wdw_search_history.style.top = 'calc(50% - 300px)';
  wdw_search_history.style.width = '400px';
  wdw_search_history.style.height = '500px';
  wdw_search_history.style.border = '1px solid black';
  wdw_search_history.style.backgroundColor = 'white';
  wdw_search_history.style.boxShadow = '0 2px 16px rgba(0,0,0,0.2)';
  wdw_search_history.style.overflow = "hidden";
  wdw_search_history.style.zIndex = reset_dragabbles_z_index();
}

//show button_bar
function show_button_bar() {
  const wdw_button_bar = document.getElementById("wdw_button_bar");
  if (wdw_button_bar.style.display == 'none') {
    wdw_button_bar.style.display = 'inline';
    wdw_button_bar.style.position = 'absolute';
    wdw_button_bar.style.left = 'calc(100% - 35px)';
    wdw_button_bar.style.top = '0px';
    wdw_button_bar.style.width = '35px';
    wdw_button_bar.style.height = '100%';
    wdw_button_bar.style.border = '1px solid black';
    wdw_button_bar.style.backgroundColor = 'rgb(240,240,255)';
    wdw_button_bar.style.boxShadow = '0 2px 16px rgba(0,0,0,0.2)';
    wdw_button_bar.style.overflow = "hidden";
  }
  wdw_button_bar.style.zIndex = reset_dragabbles_z_index();
}


//show visualization_view
function show_visualization_view() {
  const wdw_visualization = document.getElementById("wdw_visualization");
  if (wdw_visualization.style.display == 'none') {
    wdw_visualization.style.position = 'absolute';
    wdw_visualization.style.left = '25%';
    wdw_visualization.style.top = '50px';
    wdw_visualization.style.width = '50%';
    wdw_visualization.style.height = '70%';
    wdw_visualization.style.display = 'inline';
    wdw_visualization.style.boxShadow = '0 2px 16px rgba(0,0,0,0.2)';
  }
  wdw_visualization.style.zIndex = reset_dragabbles_z_index();
}

function show_archetype_info() {
  const wdw_archetype_info = document.getElementById("wdw_archetype_info");
  if (wdw_archetype_info.style.display == 'none') {
    wdw_archetype_info.style.position = 'absolute';
    wdw_archetype_info.style.left = '25%';
    wdw_archetype_info.style.top = '50px';
    wdw_archetype_info.style.width = '50%';
    wdw_archetype_info.style.height = '70%';
    wdw_archetype_info.style.display = 'inline';
    wdw_archetype_info.style.boxShadow = '0 2px 16px rgba(0,0,0,0.2)';
  }
  wdw_archetype_info.style.zIndex = reset_dragabbles_z_index();
}

function show_checklist_window() {
  const wdw_checklist = document.getElementById("wdw_checklist");
  if (wdw_checklist.style.display == 'none') {
    wdw_checklist.style.position = 'absolute';
    wdw_checklist.style.left = 'calc(50% - ' + CHECKLISTWIDTH + '/2 )';
    wdw_checklist.style.top = '50px';
    wdw_checklist.style.width = CHECKLISTWIDTH;
    wdw_checklist.style.height = '70%';
    wdw_checklist.style.display = 'inline';
    wdw_checklist.style.boxShadow = '0 2px 16px rgba(0,0,0,0.2)';
  }
  wdw_checklist.style.zIndex = reset_dragabbles_z_index();
}

function show_existing_archetype_list() {
  const wdw_archetype_list = document.getElementById("wdw_archetype_list");
  if (wdw_archetype_list.style.display == 'none') {
    wdw_archetype_list.style.position = 'absolute'; // or 'relative', 'fixed', etc., depending on your layout needs
    wdw_archetype_list.style.left = 'calc(50% - ' + ARCHETYPELISTWIDTH + '/2 )';
    wdw_archetype_list.style.top = '50px'; // Set the desired top position
    wdw_archetype_list.style.width = ARCHETYPELISTWIDTH; // Set the desired width
    wdw_archetype_list.style.height = '60%'; // Set the desired height
    wdw_archetype_list.style.display = 'inline';
    wdw_archetype_list.style.boxShadow = '0 2px 16px rgba(0,0,0,0.2)';
  }
  wdw_archetype_list.style.zIndex = reset_dragabbles_z_index();
}

function show_new_archetype_list() {
  const wdw_archetype_collection = document.getElementById("wdw_archetype_collection");
  if (wdw_archetype_collection.style.display == 'none') {
    wdw_archetype_collection.style.position = 'absolute'; // or 'relative', 'fixed', etc., depending on your layout needs
    wdw_archetype_collection.style.left = 'calc(50% - ' + ARCHETYPELISTWIDTH + '/2 )';
    wdw_archetype_collection.style.top = '50px'; // Set the desired top position
    wdw_archetype_collection.style.width = ARCHETYPELISTWIDTH; // Set the desired width
    wdw_archetype_collection.style.height = '50%'; // Set the desired height
    wdw_archetype_collection.style.display = 'inline';
    wdw_archetype_collection.style.boxShadow = '0 2px 16px rgba(0,0,0,0.2)';
  }
  wdw_archetype_collection.style.zIndex = reset_dragabbles_z_index();
}

function show_checklist_editor() {
  const wdw_checklist_editor = document.getElementById("wdw_checklist_editor");
  if (wdw_checklist_editor.style.display == 'none') {
    wdw_checklist_editor.style.position = 'absolute';
    wdw_checklist_editor.style.left = 'calc(50% - ' + CLEDITORWIDTH + '/2 )';
    wdw_checklist_editor.style.top = '50px';
    wdw_checklist_editor.style.width = CLEDITORWIDTH;
    wdw_checklist_editor.style.height = '70%';
    wdw_checklist_editor.style.display = 'inline';
    wdw_checklist_editor.style.boxShadow = '0 2px 16px rgba(0,0,0,0.2)';
  }
  wdw_checklist_editor.style.zIndex = reset_dragabbles_z_index();
}


function show_extended_search() {
  const wdw_extended_search = document.getElementById("wdw_extended_search");
  if (wdw_extended_search.style.display == 'none') {
    wdw_extended_search.style.display = 'inline';
    wdw_extended_search.style.position = 'absolute';
    wdw_extended_search.style.left = 'calc(50% - ' + EXTSEARCHWIDTH + '/2 )';
    wdw_extended_search.style.top = '50px';
    wdw_extended_search.style.width = EXTSEARCHWIDTH;
    wdw_extended_search.style.height = '70%';
    wdw_extended_search.style.boxShadow = '0 2px 16px rgba(0,0,0,0.2)';
  }
  wdw_extended_search.style.zIndex = reset_dragabbles_z_index();
}

function show_template_planner() {
  const wdw_template_planner = document.getElementById("wdw_template_planner");
  if (wdw_template_planner.style.display == 'none') {
    wdw_template_planner.style.position = 'absolute';
    wdw_template_planner.style.left = 'calc(50% - ' + TEMPLATEPLANNERWIDTH + '/2 )';
    wdw_template_planner.style.top = '50px';
    wdw_template_planner.style.width = TEMPLATEPLANNERWIDTH;
    wdw_template_planner.style.height = '70%';
    wdw_template_planner.style.display = 'inline';
    wdw_template_planner.style.boxShadow = '0 2px 16px rgba(0,0,0,0.2)';
  }
  wdw_template_planner.style.zIndex = reset_dragabbles_z_index();
}

//show about page
function show_about_page() {
  const wdw_about = document.getElementById("wdw_about");
  wdw_about.style.display = 'inline';
  wdw_about.style.position = 'absolute';
  wdw_about.style.left = 'calc(50% - 300px)';
  wdw_about.style.top = 'calc(50% - 300px)';
  wdw_about.style.width = '800px';
  wdw_about.style.height = '600px';
  wdw_about.style.border = '1px solid black';
  wdw_about.style.backgroundColor = 'white';
  wdw_about.style.boxShadow = '0 2px 16px rgba(0,0,0,0.2)';
  wdw_about.style.overflow = "hidden";
  wdw_about.style.zIndex = reset_dragabbles_z_index();
}

//show splash page
function show_splash_page() {
  const wdw_splash = document.getElementById("wdw_splash");
  wdw_splash.style.display = 'inline';
  wdw_splash.style.position = 'absolute';
  wdw_splash.style.left = 'calc(50% - 300px)';
  wdw_splash.style.top = 'calc(50% - 250px)';
  wdw_splash.style.width = '600px';
  wdw_splash.style.height = '500px';
  wdw_splash.style.border = '1px solid black';
  wdw_splash.style.backgroundColor = 'rgb(180,210,235)';
  wdw_splash.style.boxShadow = '0 2px 16px rgba(0,0,0,0.2)';
  wdw_splash.style.zIndex = reset_dragabbles_z_index();
}

//show warning page
function show_warning_page(warningHTML) {
  const wdw_warning = document.getElementById("wdw_warning");
  wdw_warning.style.display = 'inline';
  wdw_warning.style.position = 'absolute';
  wdw_warning.style.left = 'calc(50% - 300px)';
  wdw_warning.style.top = 'calc(50% - 210px)';
  wdw_warning.style.width = '600px';
  wdw_warning.style.height = '500px';
  wdw_warning.style.border = '1px solid black';
  wdw_warning.style.backgroundColor = 'white';
  wdw_warning.style.boxShadow = '0 2px 16px rgba(0,0,0,0.2)';
  wdw_warning.style.zIndex = reset_dragabbles_z_index();
  // Update the warning-content element
  document.getElementById("warning-content").innerHTML = `<div
  style="
  margin: 5px;
  padding: 5px;
  border-radius: 5px;
  background-color: rgb(235,190,180);
  "  
  >` + warningHTML + '</div>';
}

//show glossary page
function show_glossary_page() {
  const wdw_glossary = document.getElementById("wdw_glossary");
  wdw_glossary.style.display = 'inline';
  wdw_glossary.style.position = 'absolute';
  wdw_glossary.style.left = 'calc(50% - 450px)';
  wdw_glossary.style.top = 'calc(50% - 250px)';
  wdw_glossary.style.width = '900px';
  wdw_glossary.style.height = '500px';
  wdw_glossary.style.border = '1px solid black';
  wdw_glossary.style.backgroundColor = 'white';
  wdw_glossary.style.boxShadow = '0 2px 16px rgba(0,0,0,0.2)';
  wdw_glossary.style.zIndex = reset_dragabbles_z_index();

}

//show project setting page
function show_project_settings_page() {
  const wdw_project_options = document.getElementById("wdw_project_options");
  wdw_project_options.style.display = 'inline';
  wdw_project_options.style.position = 'absolute';
  wdw_project_options.style.left = 'calc(50% - 250px)';
  wdw_project_options.style.top = 'calc(50% - 200px)';
  wdw_project_options.style.width = '500px';
  wdw_project_options.style.height = '450px';
  wdw_project_options.style.border = '1px solid black';
  wdw_project_options.style.backgroundColor = 'white';
  wdw_project_options.style.boxShadow = '0 2px 16px rgba(0,0,0,0.2)';
  wdw_project_options.style.overflow = "hidden";

  wdw_project_options.style.zIndex = reset_dragabbles_z_index();
}

//show project setting page
function show_new_archetype_editor() {
  const wdw_new_archetype_editor = document.getElementById("wdw_new_archetype_editor");
  wdw_new_archetype_editor.style.display = 'inline';
  wdw_new_archetype_editor.style.position = 'absolute';
  wdw_new_archetype_editor.style.left = 'calc(50% - 250px)';
  wdw_new_archetype_editor.style.top = 'calc(50% - 300px)';
  wdw_new_archetype_editor.style.width = '500px';
  wdw_new_archetype_editor.style.height = '600px';
  wdw_new_archetype_editor.style.border = '1px solid black';
  wdw_new_archetype_editor.style.backgroundColor = 'white';
  wdw_new_archetype_editor.style.boxShadow = '0 2px 16px rgba(0,0,0,0.2)';
  wdw_new_archetype_editor.style.overflow = "hidden";
  wdw_new_archetype_editor.style.zIndex = reset_dragabbles_z_index();
}

//change the visualization type
function change_visualisation_type(vis_type) {
  const visualization_selector = document.getElementById('select_vis_view');
  visualization_selector.value = vis_type;
  //provoke onchange in this element
  visualization_selector.dispatchEvent(new Event('change'));
}


//move windows to preconfigured position
function set_window_configuration_1() {
  const standard_view_button = document.getElementById("standard_view_button");
  const checklist_editor_view_button = document.getElementById("checklist_editor_view_button");
  const search_view_button = document.getElementById("search_view_button");
  const tree_view_button = document.getElementById("tree_view_button");

  standard_view_button.style.border = '2px solid #6495ED';
  standard_view_button.style.borderRadius = '3px';
  checklist_editor_view_button.style.border = 'none';
  search_view_button.style.border = 'none';
  tree_view_button.style.border = 'none';

  const wdw_archetype_list = document.getElementById("wdw_archetype_list");
  wdw_archetype_list.style.position = 'absolute'; // or 'relative', 'fixed', etc., depending on your layout needs
  wdw_archetype_list.style.left = '0px'; // Set the desired left position
  wdw_archetype_list.style.top = '0px'; // Set the desired top position
  wdw_archetype_list.style.width = ARCHETYPELISTWIDTH; // Set the desired width
  wdw_archetype_list.style.height = '60%'; // Set the desired height
  wdw_archetype_list.style.display = 'inline';
  wdw_archetype_list.style.boxShadow = 'none';

  const wdw_archetype_collection = document.getElementById("wdw_archetype_collection");
  wdw_archetype_collection.style.position = 'absolute'; // or 'relative', 'fixed', etc., depending on your layout needs
  wdw_archetype_collection.style.left = '0px'; // Set the desired left position
  wdw_archetype_collection.style.top = '60%'; // Set the desired top position
  wdw_archetype_collection.style.width = ARCHETYPELISTWIDTH; // Set the desired width
  wdw_archetype_collection.style.height = '40%'; // Set the desired height
  wdw_archetype_collection.style.display = 'inline';
  wdw_archetype_collection.style.boxShadow = 'none';

  const wdw_visualization = document.getElementById("wdw_visualization");
  wdw_visualization.style.position = 'absolute';
  wdw_visualization.style.left = ARCHETYPELISTWIDTH;
  wdw_visualization.style.top = '0px';
  wdw_visualization.style.width = 'calc(100% - ' + ARCHETYPELISTWIDTH + ' - ' + CHECKLISTWIDTH + ')';
  wdw_visualization.style.height = '60%';
  wdw_visualization.style.display = 'inline';
  wdw_visualization.style.boxShadow = 'none';

  const wdw_archetype_info = document.getElementById("wdw_archetype_info");
  wdw_archetype_info.style.position = 'absolute';
  wdw_archetype_info.style.left = ARCHETYPELISTWIDTH;
  wdw_archetype_info.style.top = '60%';
  wdw_archetype_info.style.width = 'calc(100% - ' + ARCHETYPELISTWIDTH + ' - ' + CHECKLISTWIDTH + ')';
  wdw_archetype_info.style.height = '40%';
  wdw_archetype_info.style.display = 'inline';
  wdw_archetype_info.style.boxShadow = 'none';

  const wdw_checklist = document.getElementById("wdw_checklist");
  wdw_checklist.style.position = 'absolute';
  wdw_checklist.style.left = 'calc(100% - ' + CHECKLISTWIDTH + ')';
  wdw_checklist.style.top = '0px';
  wdw_checklist.style.width = 'calc(' + CHECKLISTWIDTH + ' - 35px)';
  wdw_checklist.style.height = '100%';
  wdw_checklist.style.display = 'inline';
  wdw_checklist.style.boxShadow = 'none';

  const wdw_checklist_editor = document.getElementById("wdw_checklist_editor");
  wdw_checklist_editor.style.display = 'none';

  const wdw_extended_search = document.getElementById("wdw_extended_search");
  wdw_extended_search.style.display = 'none';

  const wdw_new_archetype_editor = document.getElementById("wdw_new_archetype_editor");
  wdw_new_archetype_editor.style.display = 'none';

  const wdw_about = document.getElementById("wdw_about");
  wdw_about.style.display = 'none';

  const wdw_project_options = document.getElementById("wdw_project_options");
  wdw_project_options.style.display = 'none';

  const wdw_search_history = document.getElementById("wdw_search_history");
  wdw_search_history.style.display = 'none';

  const wdw_template_planner = document.getElementById("wdw_template_planner");
  wdw_template_planner.style.display = 'none';

  show_button_bar();

  change_visualisation_type('ARCHETYPE');
  updateLists();
};

// checklist editor layout
function set_window_configuration_2() {
  const standard_view_button = document.getElementById("standard_view_button");
  const checklist_editor_view_button = document.getElementById("checklist_editor_view_button");
  const search_view_button = document.getElementById("search_view_button");
  const tree_view_button = document.getElementById("tree_view_button");

  standard_view_button.style.border = 'none';
  checklist_editor_view_button.style.border = '2px solid #6495ED';
  checklist_editor_view_button.style.borderRadius = '3px';
  search_view_button.style.border = 'none';
  tree_view_button.style.border = 'none';

  const wdw_archetype_list = document.getElementById("wdw_archetype_list");
  wdw_archetype_list.style.position = 'absolute'; // or 'relative', 'fixed', etc., depending on your layout needs
  wdw_archetype_list.style.left = '0px'; // Set the desired left position
  wdw_archetype_list.style.top = '0px'; // Set the desired top position
  wdw_archetype_list.style.width = ARCHETYPELISTWIDTH; // Set the desired width
  wdw_archetype_list.style.height = '60%'; // Set the desired height
  wdw_archetype_list.style.display = 'inline';
  wdw_archetype_list.style.boxShadow = 'none';

  const wdw_archetype_collection = document.getElementById("wdw_archetype_collection");
  wdw_archetype_collection.style.position = 'absolute'; // or 'relative', 'fixed', etc., depending on your layout needs
  wdw_archetype_collection.style.left = '0px'; // Set the desired left position
  wdw_archetype_collection.style.top = '60%'; // Set the desired top position
  wdw_archetype_collection.style.width = ARCHETYPELISTWIDTH; // Set the desired width
  wdw_archetype_collection.style.height = '40%'; // Set the desired height
  wdw_archetype_collection.style.display = 'inline';
  wdw_archetype_collection.style.boxShadow = 'none';

  const wdw_visualization = document.getElementById("wdw_visualization");
  wdw_visualization.style.position = 'absolute';
  wdw_visualization.style.left = ARCHETYPELISTWIDTH;
  wdw_visualization.style.top = '0px';
  wdw_visualization.style.width = 'calc(100% - ' + ARCHETYPELISTWIDTH + ' - ' + CLEDITORWIDTH + ' - 35px)';
  wdw_visualization.style.height = '60%';
  wdw_visualization.style.display = 'inline';
  wdw_visualization.style.boxShadow = 'none';

  const wdw_archetype_info = document.getElementById("wdw_archetype_info");
  wdw_archetype_info.style.position = 'absolute';
  wdw_archetype_info.style.left = ARCHETYPELISTWIDTH;
  wdw_archetype_info.style.top = '60%';
  wdw_archetype_info.style.width = 'calc(100% - ' + ARCHETYPELISTWIDTH + ' - ' + CLEDITORWIDTH + ' - 35px)';
  wdw_archetype_info.style.height = '40%';
  wdw_archetype_info.style.display = 'inline';
  wdw_archetype_info.style.boxShadow = 'none';

  const wdw_checklist = document.getElementById("wdw_checklist");
  wdw_checklist.style.display = 'none';

  const wdw_checklist_editor = document.getElementById("wdw_checklist_editor");
  wdw_checklist_editor.style.position = 'absolute';
  wdw_checklist_editor.style.left = 'calc(100% - ' + CLEDITORWIDTH + ' - 35px)';
  wdw_checklist_editor.style.top = '0px';
  wdw_checklist_editor.style.width = CLEDITORWIDTH;
  wdw_checklist_editor.style.height = '100%';
  wdw_checklist_editor.style.display = 'inline';
  wdw_checklist_editor.style.boxShadow = 'none';

  const wdw_extended_search = document.getElementById("wdw_extended_search");
  wdw_extended_search.style.display = 'none';

  const wdw_new_archetype_editor = document.getElementById("wdw_new_archetype_editor");
  wdw_new_archetype_editor.style.display = 'none';

  const wdw_about = document.getElementById("wdw_about");
  wdw_about.style.display = 'none';

  const wdw_project_options = document.getElementById("wdw_project_options");
  wdw_project_options.style.display = 'none';

  const wdw_search_history = document.getElementById("wdw_search_history");
  wdw_search_history.style.display = 'none';

  const wdw_template_planner = document.getElementById("wdw_template_planner");
  wdw_template_planner.style.display = 'none';

  show_button_bar();
  change_visualisation_type('PROJECT');
  updateLists();
};

//search layout
function set_window_configuration_3() {
  const standard_view_button = document.getElementById("standard_view_button");
  const checklist_editor_view_button = document.getElementById("checklist_editor_view_button");
  const search_view_button = document.getElementById("search_view_button");
  const tree_view_button = document.getElementById("tree_view_button");

  standard_view_button.style.border = 'none';
  checklist_editor_view_button.style.border = 'none';
  search_view_button.style.border = '2px solid #6495ED';
  search_view_button.style.borderRadius = '3px';
  tree_view_button.style.border = 'none';

  const wdw_archetype_list = document.getElementById("wdw_archetype_list");
  wdw_archetype_list.style.display = 'none';

  const wdw_archetype_collection = document.getElementById("wdw_archetype_collection");
  wdw_archetype_collection.style.display = 'none';

  const wdw_visualization = document.getElementById("wdw_visualization");
  wdw_visualization.style.position = 'absolute';
  wdw_visualization.style.left = EXTSEARCHWIDTH;
  wdw_visualization.style.top = '0px';
  wdw_visualization.style.width = 'calc(100% - ' + EXTSEARCHWIDTH + ' - ' + CHECKLISTWIDTH + ')';
  wdw_visualization.style.height = '60%';
  wdw_visualization.style.display = 'inline';
  wdw_visualization.style.boxShadow = 'none';

  const wdw_archetype_info = document.getElementById("wdw_archetype_info");
  wdw_archetype_info.style.position = 'absolute';
  wdw_archetype_info.style.left = EXTSEARCHWIDTH;
  wdw_archetype_info.style.top = '60%';
  wdw_archetype_info.style.width = 'calc(100% - ' + EXTSEARCHWIDTH + ' - ' + CHECKLISTWIDTH + ')';
  wdw_archetype_info.style.height = '40%';
  wdw_archetype_info.style.display = 'inline';
  wdw_archetype_info.style.boxShadow = 'none';

  const wdw_checklist = document.getElementById("wdw_checklist");
  wdw_checklist.style.position = 'absolute';
  wdw_checklist.style.left = 'calc(100% - ' + CHECKLISTWIDTH + ')';
  wdw_checklist.style.top = '0px';
  wdw_checklist.style.width = 'calc(' + CHECKLISTWIDTH + ' - 35px)';
  wdw_checklist.style.height = '100%';
  wdw_checklist.style.display = 'inline';
  wdw_checklist.style.boxShadow = 'none';

  const wdw_checklist_editor = document.getElementById("wdw_checklist_editor");
  wdw_checklist_editor.style.display = 'none';

  const wdw_extended_search = document.getElementById("wdw_extended_search");
  wdw_extended_search.style.display = 'inline';
  wdw_extended_search.style.position = 'absolute';
  wdw_extended_search.style.left = '0px';
  wdw_extended_search.style.top = '0px';
  wdw_extended_search.style.width = EXTSEARCHWIDTH;
  wdw_extended_search.style.height = '100%';
  wdw_extended_search.style.boxShadow = 'none';

  const wdw_new_archetype_editor = document.getElementById("wdw_new_archetype_editor");
  wdw_new_archetype_editor.style.display = 'none';

  const wdw_about = document.getElementById("wdw_about");
  wdw_about.style.display = 'none';

  const wdw_project_options = document.getElementById("wdw_project_options");
  wdw_project_options.style.display = 'none';

  const wdw_search_history = document.getElementById("wdw_search_history");
  wdw_search_history.style.display = 'none';

  const wdw_template_planner = document.getElementById("wdw_template_planner");
  wdw_template_planner.style.display = 'none';

  show_button_bar();
  change_visualisation_type('ARCHETYPE');
  updateLists();
};

//template tree standard view
function set_window_configuration_6() {
  const standard_view_button = document.getElementById("standard_view_button");
  const checklist_editor_view_button = document.getElementById("checklist_editor_view_button");
  const search_view_button = document.getElementById("search_view_button");
  const tree_view_button = document.getElementById("tree_view_button");

  standard_view_button.style.border = 'none';
  checklist_editor_view_button.style.border = 'none';
  search_view_button.style.border = 'none';
  tree_view_button.style.border = '2px solid #6495ED';
  tree_view_button.style.borderRadius = '3px';

  const wdw_archetype_list = document.getElementById("wdw_archetype_list");
  wdw_archetype_list.style.display = 'none';

  const wdw_archetype_collection = document.getElementById("wdw_archetype_collection");
  wdw_archetype_collection.style.display = 'none';

  const wdw_visualization = document.getElementById("wdw_visualization");
  wdw_visualization.style.position = 'absolute';
  wdw_visualization.style.left = TEMPLATEPLANNERWIDTH;
  wdw_visualization.style.top = '0px';
  wdw_visualization.style.width = 'calc(100% - ' + TEMPLATEPLANNERWIDTH + ' - ' + CHECKLISTWIDTH + ')';
  wdw_visualization.style.height = '60%';
  wdw_visualization.style.display = 'inline';
  wdw_visualization.style.boxShadow = 'none';

  const wdw_archetype_info = document.getElementById("wdw_archetype_info");
  wdw_archetype_info.style.position = 'absolute';
  wdw_archetype_info.style.left = TEMPLATEPLANNERWIDTH;
  wdw_archetype_info.style.top = '60%';
  wdw_archetype_info.style.width = 'calc(100% - ' + TEMPLATEPLANNERWIDTH + ' - ' + CHECKLISTWIDTH + ')';
  wdw_archetype_info.style.height = '40%';
  wdw_archetype_info.style.display = 'inline';
  wdw_archetype_info.style.boxShadow = 'none';

  const wdw_checklist = document.getElementById("wdw_checklist");
  wdw_checklist.style.position = 'absolute';
  wdw_checklist.style.left = 'calc(100% - ' + CHECKLISTWIDTH + ')';
  wdw_checklist.style.top = '0px';
  wdw_checklist.style.width = 'calc(' + CHECKLISTWIDTH + ' - 35px)';
  wdw_checklist.style.height = '100%';
  wdw_checklist.style.display = 'inline';
  wdw_checklist.style.boxShadow = 'none';

  const wdw_checklist_editor = document.getElementById("wdw_checklist_editor");
  wdw_checklist_editor.style.display = 'none';

  const wdw_extended_search = document.getElementById("wdw_extended_search");
  wdw_extended_search.style.display = 'none';

  const wdw_new_archetype_editor = document.getElementById("wdw_new_archetype_editor");
  wdw_new_archetype_editor.style.display = 'none';

  const wdw_about = document.getElementById("wdw_about");
  wdw_about.style.display = 'none';

  const wdw_project_options = document.getElementById("wdw_project_options");
  wdw_project_options.style.display = 'none';

  const wdw_search_history = document.getElementById("wdw_search_history");
  wdw_search_history.style.display = 'none';


  const wdw_template_planner = document.getElementById("wdw_template_planner");
  wdw_template_planner.style.position = 'absolute';
  wdw_template_planner.style.left = '0px';
  wdw_template_planner.style.top = '0px';
  wdw_template_planner.style.width = TEMPLATEPLANNERWIDTH;
  wdw_template_planner.style.height = '100%';
  wdw_template_planner.style.display = 'inline';
  wdw_template_planner.style.boxShadow = 'none';


  show_button_bar();
  change_visualisation_type('TREEPLANNER');
  updateLists();
};


//template tree standard view with checklist editor open
function enter_extended_search() {
  if (document.getElementById("wdw_checklist_editor").style.display == 'none') {
    set_window_configuration_3();
  }
  else {
    set_window_configuration_5();
  }
}

function enter_checklist_editor() {
  if (document.getElementById("wdw_extended_search").style.display == 'none' && document.getElementById("wdw_template_planner").style.display == 'none') {
    set_window_configuration_2();
  }
  else if (document.getElementById("wdw_extended_search").style.display != 'none' && document.getElementById("wdw_template_planner").style.display == 'none') {
    set_window_configuration_5();
  }
  else if (document.getElementById("wdw_extended_search").style.display == 'none' && document.getElementById("wdw_template_planner").style.display != 'none') {
    set_window_configuration_7();
  }
  else {
    set_window_configuration_1();
  }
}

function exit_extended_search() {
  if (document.getElementById("wdw_checklist_editor").style.display == 'none') {
    set_window_configuration_1();
  }
  else {
    set_window_configuration_2();
  }
}

function enter_template_planner() {
  if (document.getElementById("wdw_checklist_editor").style.display == 'none') {
    set_window_configuration_6();
  }
  else {
    set_window_configuration_7();
  }
}


function exit_template_planner() {
  if (document.getElementById("wdw_checklist_editor").style.display == 'none') {
    set_window_configuration_1();
  }
  else {
    set_window_configuration_2();
  }
}

function exit_checklist_editor() {
  if (
    document.getElementById("wdw_extended_search").style.display == 'none'
    && document.getElementById("wdw_template_planner").style.display == 'none') {
    set_window_configuration_1();
  }
  else if (document.getElementById("wdw_extended_search").style.display != 'none' && document.getElementById("wdw_template_planner").style.display == 'none') {
    set_window_configuration_3();
  }
  else if (document.getElementById("wdw_extended_search").style.display == 'none' && document.getElementById("wdw_template_planner").style.display != 'none') {
    set_window_configuration_6();
  }
  else {
    set_window_configuration_1();
  }
}

document.getElementById('project_name').addEventListener('change', function () {
  document.getElementById('main_view_project_name').innerHTML = document.getElementById('project_name').value;
  wholeProject.project.title = document.getElementById('project_name').value;
})

// BUTTON FUNCTION
//document.getElementById('HistoryBackButton').addEventListener('click', function () {

function oneStepBackInHistory() {
  if (lastIds.length > 0) {
    lastIds.pop();
    // Get the last ID
    let idToUse = lastIds.pop(); // pop() removes and returns the last element
    focusNode(idToUse);
  } else {
    //console.log("No more IDs left to use!");
  }
  updateVisitedHistory();
  updateLists();
};
//});

function clearVisitedHistory() {
  lastIds = [];
  updateVisitedHistory();
  selectedListItem = null;
  updateLists();
}


function generatePrintableReport(wholeProject) {
  const { project, software_version, db_source, db_update, checklist, new_nodes } = wholeProject;
  // Helper to render checklist sections
  function renderChecklist() {
    return checklist.map(section => `
        <section>
          <h3>${section.name}</h3>
          <table>
            <thead>
              <tr>
                <th>Element name</th>
                <th>Approved</th>
                <th>Review necessary</th>
                <th>Archetype ID</th>
              </tr>
            </thead>
            <tbody>
              ${section.elements.map(el => `
                <tr>
                  <td>${el.name || ''}
                  ${el.description ? `<br><em><small style="color:blue;">${el.description}</small></em>` : ''}
                  </td>
                  <td>${el.approved ? '✅' : '❌'}</td>
                  <td>${el.review ? '🔍' : ''}</td>
                  <td>${el.archetype_id || ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </section>
      `).join('');
  }

  function generateArchetypeElementTable() {
    // Group element names by archetype_id
    const grouped = {};
    checklist.forEach(section => {
      section.elements.forEach(item => {
        if (!grouped[item.archetype_id]) {
          grouped[item.archetype_id] = [];
        }
        grouped[item.archetype_id].push(section.name + ' - ' + item.name);
      });
    });
    // Generate HTML table
    let html_table = '<table style="width:100%; border-collapse:collapse;" border="1">';
    html_table += '<tr><th>Archetype ID</th><th>Element Names</th></tr>';
    Object.entries(grouped).forEach(([archetype_id, element_names]) => {
      html_table += `<tr>
                <td style="vertical-align:top;">${archetype_id}</td>
                <td>${element_names.map(name => `<div>${name}</div>`).join('')}</td>
            </tr>`;
    });
    html_table += '</table>';
    return html_table;
  }

  // Helper to render new nodes
  function renderNewNodes() {
    if (!new_nodes || !new_nodes.length) return '';
    return `
        <section>
          <table>
            <thead>
              <tr>
                <th>Concept Name</th>
                <th>Archetype ID</th>
                <th>Class</th>
                <th>Keywords</th>
                <th>Archetype Purpose</th>
              </tr>
            </thead>
            <tbody>
              ${new_nodes.map(node => `
                <tr>
                  <td>${node.concept_name || ''}</td>
                  <td>${node.archetype_id || ''}</td>
                  <td>${node.class || ''}</td>
                  <td>${node.archetype_keywords || ''}</td>
                  <td>${node.archetype_purpose || ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </section>
      `;
  }

  // HTML template
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Project Report - ${project.title}</title>
    <style>
      body {
        font-family: 'Segoe UI', Arial, sans-serif;
        margin: 2em;
        color: #222;
        background: #fff;
      }
      header {
        margin-bottom: 2em;
        padding-bottom: 1em;
      }
      h1, h2, h3 {
        color: #0078d7;
        padding: 0px;
        margin: 5px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 1em;
      }
      th, td {
        border: 1px solid #bbb;
        padding: 5px;
        text-align: left;
      }
      th {
        background: #e6f2fb;
      }

      th:nth-child(1) {
        width:40%;
      }
      th:nth-child(3) {
        width:50%;
      }
      
      th:nth-child(2),th:nth-child(3) {
        width: 150px;
        /*text-align: center;
      }
     
      td:nth-child(2),th:nth-child(3) {
        text-align: center;*/
      }
     

      tr:nth-child(even) {
        background: #f9f9f9;
      }
      @media print {
        body {
          margin: 0.5cm;
          color: #000;
          background: #fff;
        }
        header, h1, h2 {
          color: #000 !important;
          -webkit-print-color-adjust: exact;
        }
        table, th, td {
          border: 1px solid #000 !important;
        }
        th {
          background: #eee !important;
        }
        a[href]:after {
          content: " (" attr(href) ")";
        }
      }
    </style>
  </head>
  <body>
    <header>
    <hr>
      <!--<img src="images/logo.png" alt="Project Icon" style="height:60px; vertical-align:middle; margin-right:1em;">-->
      <h1>Archetype Companion Report</h1>
    <hr>
      <h2>Project: ${project.title}</h2>
      <p>
      <strong>Generated:</strong> ${new Date().toLocaleString()}<br>
      <strong>Description:</strong> ${project.description}</br>
      <strong>Author:</strong> ${project.author}<br>
      <strong>Contact:</strong> <a href="mailto:${project.contact.replace(/^.*mailto:/, '')}">${project.contact.replace(/^.*mailto:/, '')}</a><br>
      <strong>Copyright:</strong> ${project.copyright}<br>
      <strong>Archetype Companion Version:</strong> ${software_version}<br>
      <strong>Database Source:</strong> ${db_source}<br>
      <strong>Database Last Update:</strong> ${db_update}
      </p>
          <hr>
    </header>

    <main>
      <h2>Data Element Checklist</h2>
      ${renderChecklist()}
      <hr>
      <h2>List of Archetypes</h2>
      
        ${generateArchetypeElementTable(checklist)}


      <h2>New Archetypes Details</h2>
      ${renderNewNodes()}
<hr>
      <h2>Planned Archetype Tree</h2>
      ${archetypeTreeToHTML(archetypeTree)}

    </main>
    <hr>
    <footer>
      <p>Generated by Archetype Companion &copy; ${new Date().getFullYear()}</p>
    </footer>
  </body>
  </html>
    `;
}

function createReport() {
  const html = generatePrintableReport(wholeProject);
  // Open in new window for printing:
  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  downloadHtmlFile(html);
}


function downloadHtmlFile(html, filename = "report.html") {

  //create the filename
  let projectName = document.getElementById('project_name').value || 'untitled';
  projectName = projectName.trim().toLowerCase().replace(/[^a-z0-9_\-]/g, '_');

  // Generate timestamp: YYYY-MM-DD_HH-MM-SS
  const now = new Date();
  const pad = n => n.toString().padStart(2, '0');
  const formatted = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

  // Build filename
  filename = `${formatted}_${projectName}_report.html`;

  // Create a Blob with the HTML content
  const blob = new Blob([html], { type: "text/html" });
  // Create a temporary URL for the Blob
  const url = URL.createObjectURL(blob);
  // Create a temporary anchor element
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;

  // Append to the document and trigger the download
  document.body.appendChild(a);
  a.click();
  // Clean up
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}




function reset_dragabbles_z_index() {
  const draggables = document.querySelectorAll('.movable-div');
  //set all windows to background
  const zIndexes = Array.from(draggables).map(d => d.style.zIndex);
  // Get sorted unique zIndexes
  const sortedUnique = Array.from(new Set(zIndexes)).sort((a, b) => a - b);
  // Map old zIndex to new normalized zIndex
  const zIndexMap = Object.fromEntries(sortedUnique.map((z, i) => [z, i]));
  draggables.forEach(d => {
    const oldZ = parseInt(d.style.zIndex) || 0;
    d.style.zIndex = zIndexMap[oldZ];
  });
  let maxZ = sortedUnique[sortedUnique.length - 1];
  return String(maxZ + 1);
}


function downloadSVG(svgId, filename = 'visualization.svg') {
  function addStamp(svg) {
    const stamp = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    stamp.textContent = 'Exported from Archetype Companion';
    stamp.setAttribute('font-family', 'Arial, Helvetica, sans-serif');
    stamp.setAttribute('font-size', '12');
    stamp.setAttribute('text-anchor', 'end');
    stamp.setAttribute('x', svg.viewBox.baseVal.width ? svg.viewBox.baseVal.width - 10 : svg.width.baseVal.value - 10);
    stamp.setAttribute('y', svg.viewBox.baseVal.height ? svg.viewBox.baseVal.height - 5 : svg.height.baseVal.value - 5);
    svg.appendChild(stamp);
  }

  const svg = document.getElementById(svgId);
  if (!svg) {
    alert('SVG element not found!');
    return;
  }

  //create the filename
  let projectName = document.getElementById('project_name').value || 'untitled';
  projectName = projectName.trim().toLowerCase().replace(/[^a-z0-9_\-]/g, '_');

  let viewName = document.getElementById('select_vis_view').value || 'untitled';

  // Generate timestamp: YYYY-MM-DD_HH-MM-SS
  const now = new Date();
  const pad = n => n.toString().padStart(2, '0');
  const formatted = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

  // Build filename
  filename = `${formatted}_${projectName}_${viewName}.svg`;

  // Clone the SVG to avoid modifying the original
  const clone = svg.cloneNode(true);

  // Remove any inline width/height to allow viewBox to control sizing
  clone.removeAttribute('width');
  clone.removeAttribute('height');

  // Append to DOM (hidden) to compute bounding box with transforms
  clone.style.position = 'absolute';
  clone.style.fontFamily = 'Arial, Helvetica, sans-serif';
  //clone.style.visibility = 'hidden';
  document.body.appendChild(clone);

  // Get the bounding box of all content
  const bbox = clone.getBBox();
  // If bbox.x or bbox.y is negative, shift all content so (0,0) is top-left
  if (bbox.x !== 0 || bbox.y !== 0) {
    // Wrap all content in a <g> and apply a translation
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    while (clone.firstChild) g.appendChild(clone.firstChild);
    g.setAttribute('transform', `translate(${-bbox.x},${-bbox.y})`);
    clone.appendChild(g);
  }

  // Set the viewBox and explicit width/height
  clone.setAttribute('viewBox', `0 0 ${bbox.width} ${bbox.height}`);
  clone.setAttribute('width', bbox.width + 10);
  clone.setAttribute('height', bbox.height + 10);

  // Remove from DOM
  document.body.removeChild(clone);

  // Serialize and download as SVG
  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(clone);

  // Add XML declaration and SVG namespace if missing
  if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if (!source.match(/^<svg[^>]+"http:\/\/www\.w3\.org\/1999\/xlink"/)) {
    source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  }
  source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

  const url = URL.createObjectURL(new Blob([source], { type: 'image/svg+xml;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10);
}

// **************** TEMPLATE PLANNER FUNCTIONS *************************

// Find node and parent by UID (recursive)
function findNodeByUID(node, uid, parent = null) {
  if (node.node_uid === uid) return { node, parent };
  if (node.children) {
    for (let child of node.children) {
      let result = findNodeByUID(child, uid, node);
      if (result) return result;
    }
  }
  return null;
}

// Toggle node mode
function toggleNodeMode(uid) {
  const result = findNodeByUID(archetypeTree, uid);
  if (result && result.parent) {
    if (result.node.mode == 'archetype') {
      result.node.name = 'Element';
      result.node.id = '';
      result.node.type = '';
      result.node.children = [];

    }
    else if (result.node.mode == 'element') {
      result.node.name = '';

    }
    result.node.mode = result.node.mode === "archetype" ? "element" : "archetype";
    updateTreeView();

  }
}

// Update node name
function updateTreeNodeName(uid, value) {
  const result = findNodeByUID(archetypeTree, uid);
  if (result) {
    result.node.name = value;
    updateLists();
    //updateTreeView();
  }
}

// Update node type (archetype selection)
function updateTreeNodeID(uid, value) {
  const result = findNodeByUID(archetypeTree, uid);
  if (result) {
    if (value !== "") {
      result.node.id = value;
      //console.log(value)
      //const item = archetype_collection_data.find(obj => obj.archetype_id === value);
      //const item = archetype_collection_data.find(obj => obj.id === value);
      const item = archetype_collection_data.find(obj => obj.archetype_id === value);

      result.node.archetype_id = item ? item.archetype_id : "";
      result.node.type = item ? item.archetype_class : "";
      result.node.name = item ? item.name : "";
      result.node.id = item ? item.id : "";

      //ask if you want to add elements for each atcode in this result
      const message = `Do you want to add one element for each atcode in this archetype to this branch? \n Total of ${item.atcode_items.length} elements will be added.`;
      const confirmed = confirm(message);

      if (confirmed) {
        item.atcode_items.forEach(item => {
          let temp_node = {};
          temp_node.archetype_id = '';
          temp_node.children = [];
          temp_node.element_value = "";
          temp_node.equivalent = item;
          temp_node.id = "";
          temp_node.mode = "element";
          temp_node.name = "Element";
          temp_node.node_uid = uuidv4();
          temp_node.type = "";
          result.node.children.push(temp_node);
        });
      }


    } else {
      result.node.id = "";
      result.node.type = "";
      //result.node.name = "";
      result.node.archetype_id = "";
    }
    updateTreeView();
  }
}

// Update element value (element mode)
function updateNodeElementValue(uid, value) {
  if (value != " ") {
    value = value.trim();
  }
  const result = findNodeByUID(archetypeTree, uid);
  if (result) {
    result.node.element_value = value;
    //updateTreeView();
    updateLists();
  }
}

// Update node comment
function updateNodeComment(uid, value) {
  value = value.trim();
  const result = findNodeByUID(archetypeTree, uid);
  if (result) {
    result.node.comment = value;
  }
  //updateTreeView();
  updateLists();
}

// Update element equivalent
function updateNodeElementEquivalentValue(uid, value) {
  if (value != " ") {
    value = value.trim();
  }
  const result = findNodeByUID(archetypeTree, uid);
  if (result) {
    result.node.equivalent = value;
    updateLists();
    //updateTreeView();
  }
}

// Add child node
function addTreeBranch(uid) {
  const result = findNodeByUID(archetypeTree, uid);
  if (result) {
    if (!result.node.children) result.node.children = [];
    result.node.children.push({
      node_uid: uuidv4(),
      name: "",
      id: "",
      archetype_id: "",
      type: "",
      mode: "archetype",
      element_value: "",
      children: []
    });
    updateTreeView();
  }
}

// Delete node and its branch
function deleteTreeNode(uid) {
  const result = findNodeByUID(archetypeTree, uid);
  let message = 'Are you sure you want to delete this node?';
  if (result) {
    nodeName = result.node.name;
    if (nodeName != '') {
      message = 'Are you sure you want to delete the "' + nodeName + '" node?'
    }
  }
  const confirmed = confirm(message);
  if (!confirmed) {
    event.preventDefault(); // Prevents the deletion if user cancels
    return;
  }
  if (archetypeTree.node_uid === uid) return; // Don't delete root
  //const result = findNodeByUID(archetypeTree, uid);
  if (result && result.parent) {
    result.parent.children = result.parent.children.filter(child => child.node_uid !== uid);
    updateTreeView();
  }
}

// Move node up/down among siblings
function moveTreeNode(uid, direction) {
  const result = findNodeByUID(archetypeTree, uid);
  if (result && result.parent) {
    const siblings = result.parent.children;
    const idx = siblings.findIndex(child => child.node_uid === uid);
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= siblings.length) return;
    [siblings[idx], siblings[newIdx]] = [siblings[newIdx], siblings[idx]];
    updateTreeView();
  }
}

// Compatibility check
function class_compatibility_check(node, parent) {
  if (parent && parent.type && node.type) {
    if (NODE_COMPATIBILITY[parent.type] && !NODE_COMPATIBILITY[parent.type].includes(node.type)) {
      return '<img src="images/26A0_color.png" alt="Check Compatibilty" height="20"   title="Check Compatibilty" style="margin-left:-7px;"></img>'
    }
  }
  return '';
}

function lookup_datalist_text_by_value(input, datalist_id = 'myArchetypeCollectionOptions') {
  const value = input.value; // This is the label shown in the input
  const datalist = document.getElementById(datalist_id);
  let archetype_id = '';


  // Find the matching option in the datalist
  for (const option of datalist.options) {
    if (option.value === value) {
      archetype_id = option.textContent || '';
      break;
    }
  }

  // Call your update functions
  if (archetype_id) { input.value = archetype_id; }
  else { input.value = '' }
}

function cloneTreeBranch(uid) {
  // Get the branch from archetypeTree variable
  const result = findNodeByUID(archetypeTree, uid);
  if (!result || !result.node) return;

  //Clone the node 
  let clonedNode;
  clonedNode = JSON.parse(JSON.stringify(result.node));
  clonedNode.name = '(COPY) ' + clonedNode.name

  //Recursively replace node_uuid
  function replaceUUIDs(node) {
    node.node_uid = uuidv4();
    if (Array.isArray(node.children)) {
      node.children.forEach(child => replaceUUIDs(child));
    }
  }
  replaceUUIDs(clonedNode);

  //add the cloned node in the parent node
  result.parent.children.push(clonedNode);

  updateTreeView();

}

// Render the archetypeTree recursively
function renderTree(node, parent) {
  let parentArchetype
  let atcode_items
  let assignedElements
  if (parent && parent.id) {
    parentArchetype = archetype_collection_data.find(a => a.id === parent.id);
    atcodeItems = parentArchetype ? parentArchetype.atcode_items : [];
    assignedElements = parentArchetype ? parentArchetype.assigned_elements : [];
  }
  const html = [];

  html.push(`<div class="archetypeTree-node${node.mode === "element" ? " element-mode" : ""}" id="${node.node_uid}"  draggable="false" style="display:${node.display}">
     
  <div class="node-controls combo-wrapper_old">
    <div class="drag-handle"  style="cursor: grab; min-width:15px; border-radius: 5px 0px 0px 5px; fill: url(#circles-2) #fff;">

     <img src="images/2195_color.png" width="15">

    </div>

      <button class="icon-btn" title="Switch type" onclick="toggleNodeMode('${node.node_uid}')" ${!parent ? 'disabled' : ''}>${node.mode == 'archetype' ? '<strong style="color:blue;">A</strong>' : '<strong style="color:darkgreen;">E</strong>'}</button>
  `);

  // Render controls based on mode
  if (node.mode === "archetype") {
    const archetypeCollectionOptions = document.getElementById('myArchetypeCollectionOptions').innerHTML;

    html.push(`
      <input type="text" class="template_planner_text_input" value="${node.name}" placeholder="Archetype name" onchange="this.value=this.value.trim();updateTreeNodeName('${node.node_uid}', this.value)">
     
      <span class="combo-wrapper">
      <input type="text" id="node_${node.node_uid}" node_uid="${node.node_uid}" class="mySelectTeePlan combo-input" list=""  data-datalist-id="myArchetypeCollectionOptions_${node.node_uid}" value="${node.archetype_id}" node_input_type="tree_archetype_id" autocomplete="off" placeholder="-- Select Archetype --"  />
      
      <button type="button" class="input_clear_button" aria-label="Clear">&times;</button>
     
      <datalist id="myArchetypeCollectionOptions_${node.node_uid}">${archetypeCollectionOptions}</datalist>
      </span>
    `);

    if (parent && parent.id) {
      //const parentArchetype = archetype_collection_data.find(a => a.id === parent.id);
      //const atcodeItems = parentArchetype ? parentArchetype.atcode_items : [];

      html.push(`
      <span class="combo-wrapper">
      <input type="text" id="node_atcodes_${node.node_uid}"  class="mySelectTeePlanAtcode combo-input" list="" data-datalist-id="datalist_atcodes_${node.node_uid}" node_uid="${node.node_uid}" value="${node.equivalent ? node.equivalent : ''}" autocomplete="off" placeholder="-- Select parent item --" node_input_type="tree_archetype_atcode" />

      <button type="button" class="input_clear_button" aria-label="Clear">&times;</button>

      <datalist id="datalist_atcodes_${node.node_uid}">
            ${atcodeItems.map(el => `<option value="${el}"${node.equivalent === el ? ' selected' : ''}>${el}</option>`).join('')}
      </datalist>
      </span>
      `);

    }
    html.push(`
    <button class="icon-btn" title="Focus" onclick="focusNode('${node.id}');updateLists();"><img src="images/25C9_color.png" alt="Focus" height="20" title="Focus archetype" style="cursor:pointer;" ${node.id == '' ? 'hidden' : ''}></button>
    `);

  } else if (node.mode === "element" && parent && parent.id) {
    //add name selector for the element names of the cheklist assigned to the archetype
    if (assignedElements.length > 0) {
      html.push(`
      <span class="combo-wrapper">
      <input type="text" id="node_assigned_${node.node_uid}" node_uid="${node.node_uid}" class="mySelectTeePlan  combo-input" list="" data-datalist-id="datalist_assigned_${node.node_uid}" value="${node.element_value ? node.element_value : ''}" autocomplete="off" placeholder="-- Select assigned item --" node_input_type="tree_element_name" />

      <button type="button" class="input_clear_button" aria-label="Clear">&times;</button>

            <datalist id="datalist_assigned_${node.node_uid}">
                  ${assignedElements.map(el => `<option value="${el}"${node.element_value === el ? ' selected' : ''}>${el}</option>`).join('')}
            </datalist>
      </span>
      `);
    } else {
      // No assigned elements, just free text
      html.push(`<input type="text" placeholder="Element name" value="${node.element_value || ''}" onchange="this.value=this.value.trim();updateNodeElementValue('${node.node_uid}', this.value)">`);
    }
    //if the current atcode item is not in teh atcodeItems, delete it for this node
    if (!Array.from(atcodeItems).includes(node.equivalent)) {
      node.equivalent = '';
    }

    //  add selector for the atcodes of the parent archetype
    html.push(`
      <span class="combo-wrapper">
      <input type="text" id="node_atcodes_${node.node_uid}" node_uid="${node.node_uid}" class="mySelectTeePlanAtcode  combo-input" list="" data-datalist-id="datalist_atcodes_${node.node_uid}" value="${node.equivalent ? node.equivalent : ''}" autocomplete="off" placeholder="-- Select item --"  node_input_type="tree_element_atcode"/>

      <button type="button" class="input_clear_button" aria-label="Clear">&times;</button>

      <datalist id="datalist_atcodes_${node.node_uid}">
            ${atcodeItems.map(el => `<option value="${el}"${node.equivalent === el ? ' selected' : ''}>${el}</option>`).join('')}
      </datalist>
      </span>
      `);

  } else if (node.mode === "element") {
    // No parent or parent has no archetype, just free text
    html.push(`<input type="text" placeholder="Element name" value="${node.element_value || ''}" onchange="this.value=this.value.trim();updateNodeElementValue('${node.node_uid}', this.value)">`);
  }

  html.push(`
      <button class="icon-btn" title="Move up" onclick="moveTreeNode('${node.node_uid}', -1)" ${!parent ? 'hidden' : ''}>
      <img src="images/up.png" alt="Element up" height="10" width="8" style="cursor: pointer;" title="Move element up"> 
      </button>
      <button class="icon-btn" title="Move down" onclick="moveTreeNode('${node.node_uid}', 1)" ${!parent ? 'hidden' : ''}>
      <img src="images/down.png" alt="Element down" height="10" width="8" style="cursor: pointer;" title="Move element down">   
      </button>

      <button class="icon-btn" title="Clone branch" onclick="cloneTreeBranch('${node.node_uid}')" ${(node.mode == 'element') || !parent ? 'hidden' : ''}>
      <img src="images/clone.png" alt="Clone branch" height="20" style="cursor: pointer;" title="Clone branch">   
      </button>


      <button class="icon-btn" title="Add branch" onclick="addTreeBranch('${node.node_uid}')" ${node.mode == 'element' ? 'hidden' : ''}>
      <img src="images/add.png" alt="Add" height="14" title="Add branch" style="cursor:pointer;" >
      </button>
      <button class="icon-btn" title="Delete" onclick="deleteTreeNode('${node.node_uid}')" ${!parent ? 'hidden' : ''}>
      <img src="images/remove.png" alt="Delete element" height="14" style="cursor: pointer;" title="Delete element">
      </button>
      <!--<span class="uid-label">${node.node_uid}</span>-->
      <span class="archetype-class"><small>${node.type ? node.type.toUpperCase() : ''}</small></span>
      <span class="compatibility-warning">${class_compatibility_check(node, parent)}</span>
      
      <button class="icon-btn" title="toggle comment" onclick="showNodeComment('node_comment_${node.node_uid}', '${node.node_uid}')"}>
      ${!node.comment ? '<img src="images/show_comment.png" alt="show comment" height="14" style="cursor: pointer;" title="Add comment" >'
      : '<img src="images/show_comment_full.png" alt="show comment" height="14" style="cursor: pointer;" title="Show comment" >'}
      </button>
       `);
  if (node.mode === "archetype" && node.children && node.children.length > 0) {
    html.push(`
      <button class="toggleNodesBtn" style="width:25px;" onclick="toggleArchetypeNode('${node.node_uid}', this);">
          ${node.expanded ? 'E' : 'C'} 
      </button>
       `);
  }

  html.push(`
    </div>
     <textarea placeholder="Add your comment here..." class="tree_node_comment" style="display:${node.comment_display || 'none'};border-radius:3px;resize:vertical;width:calc(100% - 25px);margin-left:15px;" name="comment" rows="5" cols="33" onchange="updateNodeComment('${node.node_uid}', this.value, )"  id="node_comment_${node.node_uid}">${node.comment || ''}</textarea>
  `);
  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      html.push(renderTree(child, node));
    });
  }
  html.push(`</div>`);

  return html.join('');
}

function toggleArchetypeNode(nodeId, btn) {

  // Find the node div by ID
  const node = document.getElementById(nodeId);
  if (!node) return;

  //save that the button has expanded
  const result = findNodeByUID(archetypeTree, nodeId);
  if (result) {
    result.node.expanded = !result.node.expanded;
    //change the button style
    if (result.node.expanded) {
      btn.textContent = 'E';
    }
    else {
      btn.textContent = 'C';
    }
  }

  //change the children
  // Only collapse/expand children, not the node itself
  const childNodes = Array.from(node.querySelectorAll(':scope > .archetypeTree-node, :scope > .archetypeTree-node:not([style*="display: none"])'));

  // If any child is visible, collapse; else, expand
  let anyVisible = false;
  childNodes.forEach(child => {
    //set the child.id visible in the archetypeTree variable
    if (child.style.display !== 'none') anyVisible = true;
  });

  childNodes.forEach(child => {
    child.style.display = anyVisible ? 'none' : '';
    const result = findNodeByUID(archetypeTree, child.id);
    if (result) {
      result.node.display = child.style.display;
    }
  });

}

function areAnyNodesExpanded() {
  // Check if any archetype node has visible children
  return Array.from(document.querySelectorAll('.archetypeTree-node:not(.element-mode)')).some(node => {
    return Array.from(node.children).some(child =>
      child.classList && child.classList.contains('archetypeTree-node') && child.style.display !== 'none'
    );
  });
}

function toggleAllArchetypeNodes() {
  const btn = document.getElementById('toggleAllBtn');
  const shouldCollapse = areAnyNodesExpanded();

  document.querySelectorAll('.archetypeTree-node:not(.element-mode)').forEach(node => {
    node.querySelectorAll('.archetypeTree-node').forEach(child => {
      child.style.display = shouldCollapse ? 'none' : '';
      const result = findNodeByUID(archetypeTree, child.id);
      if (result) {
        result.node.display = child.style.display;
      }
    });
    const result = findNodeByUID(archetypeTree, node.id);
    if (result) {
      result.node.expanded = shouldCollapse;
    }
  });

  // Update the main toggle button text
  btn.textContent = shouldCollapse ? 'Expand All' : 'Collapse All';

  updateTreeView();
}


function showNodeComment(commentID, uid) {
  const nodeComment = document.getElementById(commentID);
  const result = findNodeByUID(archetypeTree, uid);

  if (nodeComment.style.display === 'inline') {
    document.getElementById(commentID).style.display = 'none';
    //set node comment visible or not
    if (result) {
      result.node.comment_display = 'none';
    }

  }
  else {
    nodeComment.style.display = 'inline';
    if (result) {
      result.node.comment_display = 'inline';
    }

  }
}


// Drag & drop logic

function addTreeDnDListeners() {
  let draggedNodeId = null;
  document.querySelectorAll('.archetypeTree-node').forEach(node => {
    node.addEventListener('dragstart', function (e) {
      e.stopPropagation();
      draggedNodeId = this.id;
      this.classList.add('dragging');
    });

    node.addEventListener('dragend', function () {
      this.classList.remove('dragging');
      document.querySelectorAll('.archetypeTree-node').forEach(n => n.classList.remove('drag-over'));
    });

    node.addEventListener('dragover', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (this.id !== draggedNodeId) this.classList.add('drag-over');
    });

    node.addEventListener('dragleave', function () {
      this.classList.remove('drag-over');
    });


    node.addEventListener('drop', function (e) {
      e.preventDefault();
      e.stopPropagation();
      this.classList.remove('drag-over');
      if (
        this.id !== draggedNodeId &&
        !isDescendant(draggedNodeId, this.id, archetypeTree) &&
        !isElementTreeNode(archetypeTree, this.id)
      ) {
        moveNodeAsChild(draggedNodeId, this.id);
        updateTreeView();
      }
    });
  });
}


function isElementTreeNode(treeRoot, elementId) {
  function findNodeById(node, id) {
    if (node.node_uid === id) return node;
    if (!node.children) return null;
    for (let child of node.children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
    return null;
  }

  const myNode = findNodeById(treeRoot, elementId);
  if (myNode && myNode.mode == 'element') { return true }
  else { return false };

}

function isDescendant(parentId, childId, treeRoot) {
  function findNodeById(node, id) {
    if (node.node_uid === id) return node;
    if (!node.children) return null;
    for (let child of node.children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
    return null;
  }

  function containsId(node, id) {
    if (!node.children) return false;
    for (let child of node.children) {
      if (child.node_uid === id) return true;
      if (containsId(child, id)) return true;
    }
    return false;
  }


  const parentNode = findNodeById(treeRoot, parentId);
  if (!parentNode) return false;
  return containsId(parentNode, childId);
}

// Move node in data structure
function moveNodeAsChild(nodeId, newParentId) {
  let branchNode;
  let tempArr = [archetypeTree];

  //find and remember the node
  function getTreeNodeByUID(node, uid) {
    if (node.node_uid === uid) return node;
    if (node.children) {
      for (let child of node.children) {
        let result = getTreeNodeByUID(child, uid);
        if (result) {
          return result
        };
      }
    }
  }

  branchNode = getTreeNodeByUID(archetypeTree, nodeId);

  function removeTreeNode(node, uid) {
    if (!node.children || node.children.length === 0) return;
    // Find the index of the child with the matching uid
    const index = node.children.findIndex(child => child.node_uid === uid);

    if (index !== -1) {
      // Remove the child from the array
      node.children.splice(index, 1);
      return; // Stop after deleting, or remove this if you want to delete all matches in the tree
    }
    // Otherwise, recurse into children
    for (let child of node.children) {
      removeTreeNode(child, uid);
    }
  }

  function addTreeNode(root_node, insert_node, parentId) {

    if (parentId === archetypeTree.node_uid) {
      archetypeTree.children.push(insert_node);
      return;
    }

    if (!root_node.children || root_node.children.length === 0) return;
    const index = root_node.children.findIndex(child => child.node_uid === parentId);
    if (index !== -1) {
      // add child to parent....
      root_node.children[index].children.push(insert_node);

      return; // Stop after deleting, or remove this if you want to delete all matches in the tree
    }

    for (let child of root_node.children) {
      addTreeNode(child, insert_node, parentId);
    }

  }

  removeTreeNode(archetypeTree, nodeId);
  addTreeNode(archetypeTree, branchNode, newParentId)

  updateTreeView();

}




// Render the planner
function updateTreeView() {
  document.getElementById('template_planner').innerHTML = renderTree(archetypeTree, null);

  //document.getElementById('result').innerHTML = JSON.stringify(archetypeTree, null, 2);
  addTreeDnDListeners();
  attachDropDownToComboInput('.mySelectTeePlanAtcode, .mySelectTeePlan');
  updateLists();

}

function archetypeTreeToHTML(node) {
  // Helper to display node details
  function HTMLnodeDetails(n) {
    let details = '';
    if (n.mode == 'archetype') {
      //add text for archetype
      details += `<strong style="color:blue;">${n.name || '(no name)'}</strong>`;
      if (n.equivalent && n.equivalent != '') details += `<em><small> -- ${n.equivalent}</small></em>`;
      if (n.archetype_id) {
        details += `<br><span style="color: #888;">${n.archetype_id}</span>`;
      }
      else if (n.id) {
        details += `<br><span style="color: #888;">${n.id}</span>`;
      }

      if (n.type) details += `<br><em>Type:</em> ${n.type.toUpperCase()}`;
      if (n.mode) details += `<br><em><small>${n.mode}</small></em>`;
    }
    else {
      //add text for elements
      details += `<strong style="color:darkgreen;">${n.element_value || '(no name)'}</strong>`;
      if (n.equivalent && n.equivalent != '') details += `<em><small> -- ${n.equivalent}</small></em>`;
      if (n.mode) details += `<br><em><small>${n.mode}</small></em>`;
    }
    if (n.comment) details += `<br><em><small style="color:blue;">${n.comment}</small></em>`;
    return details;
  }

  // Recursive rendering
  function renderHTMLnodeTree(node) {
    let html = `<li style="margin-bottom: 8px; padding: 8px; border-left: 2px solid #ccc;">${HTMLnodeDetails(node)}`;
    if (node.children && node.children.length > 0) {
      html += `<ul style="margin-left: 20px; border-left: 1px dashed #ddd; padding-left: 12px;">`;
      for (const child of node.children) {
        html += renderHTMLnodeTree(child);
      }
      html += `</ul>`;
    }
    html += `</li>`;
    return html;
  }

  return `<ul style="list-style-type: none; font-family: Arial, sans-serif;">${renderHTMLnodeTree(node)}</ul>`;
}

function initArchetypeTree(archetypeTree) {
  archetypeTree = {
    node_uid: uuidv4(),
    name: "-- Start here --",
    id: "",
    archetype_id: "",
    type: "",
    mode: "archetype",
    element_value: "",
    children: []
  };
  return archetypeTree
}

// Initial render
updateTreeView();

// Expose functions to global scope for HTML event handlers
window.updateTreeNodeName = updateTreeNodeName;
window.updateTreeNodeID = updateTreeNodeID;
window.updateNodeElementValue = updateNodeElementValue;
window.addTreeBranch = addTreeBranch;
window.deleteTreeNode = deleteTreeNode;
window.moveTreeNode = moveTreeNode;
window.toggleNodeMode = toggleNodeMode;

function clearArchetypeTree(event) {

  const confirmed = confirm('Are you sure you want to delete the archetype planner tree data?');
  if (!confirmed) {
    event.preventDefault(); // Prevents the deletion if user cancels
    return;
  }
  // Remove the checklist
  archetypeTree = initArchetypeTree();
  updateLists();
  renderEditor();
  renderViewer();


}

function addListenersToTooltip(tooltip_id, text) {
  const tooltip = document.getElementById(tooltip_id);
  const tooltipText = document.getElementById('myTooltipText');

  tooltip.addEventListener('mouseenter', function (e) {
    // Clone tooltip text and append to body
    const rect = tooltip.getBoundingClientRect();
    tooltipText.style.display = 'block';
    tooltipText.style.position = 'absolute';
    tooltipText.style.left = (rect.left + window.scrollX) + 'px';
    tooltipText.style.top = (rect.bottom + window.scrollY) + 'px';
    tooltipText.style.zIndex = 290;
    tooltipText.innerHTML = text;
    reset_dragabbles_z_index();
    document.body.appendChild(tooltipText);
  });

  tooltip.addEventListener('mouseleave', function (e) {
    tooltipText.style.display = 'none';
    tooltipText.style.zIndex = 29;
    tooltip.appendChild(tooltipText); // Move it back
  });
}

addListenersToTooltip('tooltip_searchbar', `Search terms are not case sensitive.<br />
Use quotation marks to search for exact phrases.<br />
<span style="color:gray;">Example: "electronic address"</span><br /><br/>
Examples for the use of boolean operators:<br />
<b>AND</b>: openEHR AND summary<br />
<b>OR</b>: composition OR section<br />
<b>NOT</b>: composition AND NOT v0<br />
<b>Parentheses</b>: location AND ( anatomical OR geo )<br />`)

//addListenersToTooltip('tooltip_topbar', 'HELLO SQUIRREL FRIENDS!')



// EXPERIMENTAL ******************************

// Track collapsed state for all
let allCollapsed = false;

function toggleAllSections() {
  const sections = document.querySelectorAll('#checklistSections .section');
  allCollapsed = !allCollapsed;
  sections.forEach(section => {
    const content = section.querySelector('.section-content');
    const btn = section.querySelector('.toggleSectionBtn');
    if (allCollapsed) {
      content.style.display = 'none';
      btn.textContent = 'Expand';
    } else {
      content.style.display = '';
      btn.textContent = 'Collapse';
    }
    checkList.forEach(section => { section.contentDisplay = content.style.display; });
  });
  document.getElementById('toggleAllSectionsBtn').textContent = allCollapsed ? 'Expand All' : 'Collapse All';
}

function toggleSection(btn, sectionIndex) {
  const content = btn.closest('.section').querySelector('.section-content');
  if (content.style.display === 'none') {
    content.style.display = '';
    btn.textContent = 'Collapse';
  } else {
    content.style.display = 'none';
    btn.textContent = 'Expand';
  }
  checkList[sectionIndex].contentDisplay = content.style.display;
}


//dropdown handling for the template planner and cheklist editor
function attachDropDownToComboInput(classes) {
  // Attach behavior to all inputs with this class
  const inputs = document.querySelectorAll(classes);

  inputs.forEach((input) => {
    const datalistId = input.getAttribute('data-datalist-id');
    const datalist = document.getElementById(datalistId);

    if (!datalist) return;

    let currentFocus = -1;
    const options = Array.from(datalist.options);

    // Show dropdown on focus
    input.addEventListener('focus', (e) => {
      const rect = input.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // Optional: if the list is already rendered/has items, measure it
      datalist.style.display = 'block';
      datalist.style.position = 'fixed';
      datalist.style.left = rect.left + 'px';
      // Temporarily let it auto-size to measure height
      datalist.style.maxHeight = '';
      datalist.style.height = 'auto';
      const listHeight = datalist.offsetHeight || 200; // fallback if 0
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      // If not enough space below but enough above, render above
      if (spaceBelow < listHeight && spaceAbove > listHeight) {
        datalist.style.top = (rect.top - listHeight) + 'px';
      } else {
        // default: below
        datalist.style.top = rect.bottom + 'px';
      }

      input.style.borderRadius = '5px';
    });


    //remember if the mouse is over the datalist
    let mouseOverDatalist = false;

    datalist.addEventListener('mouseenter', () => {
      mouseOverDatalist = true;
    });
    datalist.addEventListener('mouseleave', () => {
      mouseOverDatalist = false;
    });

    //when exiting the input
    input.addEventListener('blur', () => {
      //if the mouse is over an option DON'T make the datalist disappear, you silly goose!
      if (!mouseOverDatalist) {
        datalist.style.display = 'none';
      }
    });

    input.addEventListener('change', () => {
      //hide the datalist
      datalist.style.display = 'none';
      //if this is not the element name input...
      if (input.getAttribute('node_input_type') != 'tree_element_name') {
        //...check if the input is in the options....
        const currentValue = input.value;
        const hasMatch = Array.from(options).some((opt) => {
          return opt.textContent === currentValue;
        });
        if (!hasMatch) {
          //... if not, set the input to empty
          input.value = "";
        } else {

        }
      } //end of if statement

      //in any case, update the node tree informationa and refresh the tree view

      if (input.getAttribute('node_input_type') == 'tree_archetype_id') {
        updateTreeNodeID(input.getAttribute('node_uid'), input.value);
        lookup_datalist_text_by_value(input);
      };
      if (input.getAttribute('node_input_type') == 'tree_archetype_atcode') {
        updateNodeElementEquivalentValue(input.getAttribute('node_uid'), input.value);
      };
      if (input.getAttribute('node_input_type') == 'tree_element_atcode') {
        updateNodeElementEquivalentValue(input.getAttribute('node_uid'), input.value);
      };
      if (input.getAttribute('node_input_type') == 'tree_element_name') {
        updateNodeElementValue(input.getAttribute('node_uid'), input.value);
      };
      if (input.getAttribute('node_input_type') == 'checklist_archetype_input') {
        onArchetypeChange(input, input.getAttribute('node_i'), input.getAttribute('node_j'))
      };

      //make all options visible again...
      Array.from(datalist.options).forEach((opt) => {
        opt.style.display = 'block';
      });

    });


    // Filter options on input
    input.addEventListener('input', () => {
      const text = input.value.toUpperCase();
      currentFocus = -1;
      options.forEach((opt) => {
        if (opt.textContent.toUpperCase().indexOf(text) > -1) {
          opt.style.display = 'block';
        } else {
          opt.style.display = 'none';
        }
        //opt.classList.remove('active');
      });
      datalist.style.display = 'block'; // re-open while typing
    });

    // Click on option
    options.forEach((option) => {
      option.addEventListener('click', () => {
        console.log('click')
        input.value = option.textContent;
        // Inform that the input has changed
        var event = new Event('change');
        input.dispatchEvent(event);
      }); //end of add evenet to click
    }
    );//end for each option


  }); //end for each input


  // Clear buttons
  const wrappers = document.querySelectorAll('.combo-wrapper');
  wrappers.forEach((wrapper) => {
    const input = wrapper.querySelector('.combo-input');
    if (input) {
      const clearBtn = wrapper.querySelector('.input_clear_button');
      const datalistId = input.getAttribute('data-datalist-id');
      const datalist = document.getElementById(datalistId);
      clearBtn.addEventListener('click', () => {
        if (input.value != '') {
          input.value = '';
          if (input.getAttribute('node_input_type') == 'tree_archetype_id') {
            updateTreeNodeID(input.getAttribute('node_uid'), input.value);
            lookup_datalist_text_by_value(input);
          };
          if (input.getAttribute('node_input_type') == 'tree_archetype_atcode') {
            updateNodeElementEquivalentValue(input.getAttribute('node_uid'), input.value);
          };
          if (input.getAttribute('node_input_type') == 'tree_element_atcode') {
            updateNodeElementEquivalentValue(input.getAttribute('node_uid'), input.value);
          };
          if (input.getAttribute('node_input_type') == 'tree_element_name') {
            updateNodeElementValue(input.getAttribute('node_uid'), input.value);
          };
          if (input.getAttribute('node_input_type') == 'checklist_archetype_input') {
            onArchetypeChange(input, input.getAttribute('node_i'), input.getAttribute('node_j'))
          };

          //input.focus();
          if (datalist) {
            // Show all options again
            Array.from(datalist.options).forEach((opt) => {
              opt.style.display = 'block';
            });
            //datalist.style.display = 'block';
          }
        };

      });
    }
  });


};

//prevent the tree branches from being dragged
document.addEventListener('dragstart', function (e) {
  const handle = e.target.closest('.drag-handle');
  dragStartFromHandle = !!handle;
  if (!dragStartFromHandle) {
    e.preventDefault();
    e.target.style.opacity = 1;
  }
}, true);

//after loading everything, make the loading signal invisible
document.getElementById('loading_page').style.display = 'none';


