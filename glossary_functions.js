


    
const glossary_entryList = document.getElementById('glossary_entryList');
const glossary_mainPanel = document.getElementById('glossary_mainPanel');
const glossary_searchInput = document.getElementById('glossary_searchInput');
const glossary_searchAttrName = document.getElementById('glossary_searchAttrName');
const glossary_searchAttrDesc = document.getElementById('glossary_searchAttrDesc');
const glossary_searchAttrDataType = document.getElementById('glossary_searchAttrDataType');

document.getElementById('glossary_extraction_date').innerHTML = '<b>Updated:</b> ' + glossary_extraction_date ;

let glossaryClassNames = Object.keys(glossary_data).sort();
let filteredGlossaryClassNames = glossaryClassNames.slice();
let lastGlossarySearch = '';
let lastSelectedGlossaryClass = '';

function highlightFoundGlossaryText(text, term) {
  if (!term) return text;
  const esc = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(esc, 'gi'), match => `<span class="texthighlight">${match}</span>`);
}

function filterGlossaryClasses() {
  const q = glossary_searchInput.value.trim().toLowerCase();
  lastGlossarySearch = q;
  const searchInAttrName = glossary_searchAttrName.checked;
  const searchInAttrDesc = glossary_searchAttrDesc.checked;
  const searchInAttrDatatype = glossary_searchAttrDataType.checked;
  
  filteredGlossaryClassNames = glossaryClassNames.filter(className => {
    const cls = glossary_data[className];
    let found = className.toLowerCase().includes(q) || (cls.description && cls.description.toLowerCase().includes(q)) || (cls.type && cls.type.toLowerCase().includes(q));
    if (!found && (searchInAttrName || searchInAttrDesc || searchInAttrDatatype) && cls.attributes) {
      for (const [attr, details] of Object.entries(cls.attributes)) {
        if (searchInAttrName && attr.toLowerCase().includes(q)) { found = true; break; }
        if (searchInAttrDesc && details.description && details.description.toLowerCase().includes(q)) { found = true; break; }
        if (searchInAttrDatatype && details.type && details.type.join(', ').toLowerCase().includes(q)) { found = true; break; }
      }
    }
    return !q || found;
  });
}

function renderGlossaryEntryList() {
  glossary_entryList.innerHTML = '';
  filteredGlossaryClassNames.forEach(className => {
    const li = document.createElement('li');
    //li.innerHTML = highlightFoundGlossaryText(className, lastGlossarySearch);
    li.innerHTML = className;
    li.onclick = () => showGlossaryClass(className);
    li.id = 'entry-' + className;
    glossary_entryList.appendChild(li);
  });
}

function showGlossaryClass(className) {
  document.querySelectorAll('.glossary_entry_list li').forEach(li => li.classList.remove('active'));
  const activeLi = document.getElementById('entry-' + className);
  if (activeLi) activeLi.classList.add('active');
  lastSelectedGlossaryClass = className;
  glossary_mainPanel.innerHTML= renderGlossaryClass(className)
  // glossary_mainPanel.innerHTML = html;
  // Scroll to the class title if navigated by anchor
  setTimeout(() => {
    const el = document.getElementById('class-' + className);
    //if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 0);
}


function renderGlossaryClass(className){
  const cls = glossary_data[className];
  // let html = `<div class="class-title" id="class-${className}">${highlightFoundGlossaryText(className, lastGlossarySearch)}</div>`;
  let html = `<div class="class-title" id="class-${className}">${className}</div>`;
  html += `<div class="class-desc">${highlightFoundGlossaryText(cls.description || '', lastGlossarySearch)}</div>`;
  if (cls.inherit) {
    // If the inherited class exists, make it a link
    if (glossary_data[cls.inherit]) {
      html += `<div class="class-inherit">Inherits: <a href="#class-${cls.inherit}" onclick="scrollToClass('${cls.inherit}');return false;">${highlightFoundGlossaryText(cls.inherit, lastGlossarySearch)}</a></div>`;
    } else {
      html += `<div class="class-inherit">Inherits: ${highlightFoundGlossaryText(cls.inherit, lastGlossarySearch)}</div>`;
    }
  }
  if (cls.url) html += `<div class="class-url"><a href="${cls.url}" target="_blank">Specification &rarr;</a></div>`;
  if (cls.attributes && Object.keys(cls.attributes).length) {
    html += `<table class="attributes-table"><tr><th>Attribute</th><th>Description</th><th>Existence</th><th>Type</th></tr>`;
    for (const [attr, details] of Object.entries(cls.attributes)) {
      html += `<tr>
        <td>${highlightFoundGlossaryText(attr, glossary_searchAttrName.checked ? lastGlossarySearch : '')}</td>
        <td>${highlightFoundGlossaryText(details.description || '', glossary_searchAttrDesc.checked ? lastGlossarySearch : '')}</td>
        <td>${details.existence || ''}</td>
        <td>${highlightFoundGlossaryText((details.type || []).join(', '), glossary_searchAttrDataType.checked ? lastGlossarySearch : '')}</td>
        <!--<td>${(details.type || []).join(', ')}</td>-->
      </tr>`;
    }
    html += `</table>`;
  }
 if (cls.functions && Object.keys(cls.functions).length) {
    html += `<table class="attributes-table"><tr><th>Function</th><th>Description</th><th>Existence</th><th>Return Type</th></tr>`;
    for (const [attr, details] of Object.entries(cls.functions)) {
      html += `<tr>
        <td>${attr} ${details.prerequisite && details.prerequisite.trim() !== '' ? '<br><br><i>Prerequisite:</i> '+ details.prerequisite : ''}</td>
        <td>${highlightFoundGlossaryText(details.description || '', glossary_searchAttrDesc.checked ? lastGlossarySearch : '')}</td>
        <td>${details.existence || ''}</td>
        <td>${highlightFoundGlossaryText((details.return_type || []).join(', '), glossary_searchAttrDataType.checked ? lastGlossarySearch : '')}</td>
        <!--<td>${(details.return_type || []).join(', ')}</td>-->
      </tr>`;
    }
    html += `</table>`;

  }
  return html
}

// For anchor navigation from "Inherits" links
window.scrollToClass = function(className) {
    
  // Select the class in the glossary_sidebar and show its details
  showGlossaryClass(className);
  // Also scroll the glossary_sidebar to the selected entry
  const li = document.getElementById('entry-' + className);
  if (li) li.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  
};

function updateSearch() {
  filterGlossaryClasses();
  renderGlossaryEntryList();
  //what is the current active className?
  if (lastSelectedGlossaryClass && lastSelectedGlossaryClass!=''){
  showGlossaryClass(lastSelectedGlossaryClass);
  }
  //glossary_mainPanel.innerHTML = `<div style="color:#888;">Select a class from the left to view details.</div>`;
}

glossary_searchInput.addEventListener('input', updateSearch);
glossary_searchAttrName.addEventListener('change', updateSearch);
glossary_searchAttrDesc.addEventListener('change', updateSearch);
glossary_searchAttrDataType.addEventListener('change', updateSearch);

renderGlossaryEntryList();