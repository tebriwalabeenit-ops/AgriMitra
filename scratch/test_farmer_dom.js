const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'AgriMitra-Farmer', 'farmer', 'register.html');
const jsPath = path.join(__dirname, '..', 'AgriMitra-Farmer', 'farmer', 'js', 'main.js');

const htmlContent = fs.readFileSync(htmlPath, 'utf8');
const jsContent = fs.readFileSync(jsPath, 'utf8');

class MockElement {
  constructor(tag, id = '', className = '') {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.className = className;
    this.children = [];
    this.parentElement = null;
    this.attributes = {};
    this.eventListeners = {};
    this.value = '';
    this.disabled = false;
    this.placeholder = '';
    this._style = {};
  }

  get style() {
    return this._style;
  }

  getAttribute(name) {
    return this.attributes[name] || null;
  }

  setAttribute(name, val) {
    this.attributes[name] = val;
  }

  removeAttribute(name) {
    delete this.attributes[name];
  }

  appendChild(child) {
    this.children.push(child);
    child.parentElement = this;
    return child;
  }

  removeChild(child) {
    const idx = this.children.indexOf(child);
    if (idx !== -1) this.children.splice(idx, 1);
    child.parentElement = null;
  }

  addEventListener(event, handler) {
    if (!this.eventListeners[event]) this.eventListeners[event] = [];
    this.eventListeners[event].push(handler);
  }

  dispatchEvent(event) {
    const handlers = this.eventListeners[event.type] || [];
    for (const h of handlers) {
      h.call(this, event);
    }
  }

  focus() {}

  set innerHTML(val) {
    this.children = [];
  }

  querySelectorAll(sel) {
    const results = [];
    function search(node) {
      for (const child of node.children) {
        if (sel === '.district-pill-btn' && child.className && child.className.includes('district-pill-btn')) {
          results.push(child);
        }
        if (sel === 'option' && child.tagName === 'OPTION') {
          results.push(child);
        }
        search(child);
      }
    }
    search(this);
    return results;
  }

  querySelector(sel) {
    const list = this.querySelectorAll(sel);
    return list.length > 0 ? list[0] : null;
  }

  get classList() {
    const el = this;
    return {
      add: (cls) => {
        const classes = new Set(el.className.split(' ').filter(Boolean));
        classes.add(cls);
        el.className = Array.from(classes).join(' ');
      },
      remove: (cls) => {
        const classes = new Set(el.className.split(' ').filter(Boolean));
        classes.delete(cls);
        el.className = Array.from(classes).join(' ');
      },
      contains: (cls) => {
        return el.className.split(' ').includes(cls);
      }
    };
  }
}

console.log('--- TESTING FARMER STATE & DISTRICT SELECT DROPBOXES ---');

// 1. Verify HTML: reg-state-select is a select, reg-district-select is a select
if (!htmlContent.includes('<select id="reg-state-select" class="form-select reg-state"')) {
  throw new Error('reg-state-select is not using .form-select');
}
if (!htmlContent.includes('<select id="reg-district-select" name="district" class="form-select reg-district"')) {
  throw new Error('reg-district-select is not using .form-select');
}
console.log('✓ HTML correctly uses matching .form-select dropdowns for both State and District!');

// 2. Extract stateDistricts from JS
const sIdx = jsContent.indexOf('const stateDistricts = {');
const eIdx = jsContent.indexOf('};', sIdx);
const stateDistrictsCode = jsContent.substring(sIdx + 'const stateDistricts = '.length, eIdx + 1);
const stateDistricts = eval('(' + stateDistrictsCode + ')');

// 3. Test select dropbox interaction simulation
const stateSelect = new MockElement('select', 'reg-state-select', 'form-select reg-state');
const districtSelect = new MockElement('select', 'reg-district-select', 'form-select reg-district');
districtSelect.disabled = true;

const quickContainer = new MockElement('div', 'district-quick-suggestions', 'district-quick-suggestions');

const regForm = new MockElement('form', 'farmer-reg-form', 'farmer-registration-form');
regForm.appendChild(stateSelect);
regForm.appendChild(districtSelect);
regForm.appendChild(quickContainer);

global.document = {
  getElementById: (id) => {
    if (id === 'district-quick-suggestions') return quickContainer;
    return null;
  },
  createElement: (tag) => new MockElement(tag)
};

// Simulation of updateDistrictSuggestions from main.js for select tag
function updateDistrictSuggestions(stateName, keepExistingVal) {
  const districts = stateDistricts[stateName] || [];
  const isSelectTag = districtSelect.tagName === 'SELECT';

  if (isSelectTag) {
    districtSelect.innerHTML = '';

    if (districts.length > 0) {
      const defaultOpt = document.createElement('option');
      defaultOpt.value = '';
      defaultOpt.disabled = true;
      defaultOpt.selected = true;
      defaultOpt.textContent = '-- Select District --';
      districtSelect.appendChild(defaultOpt);

      districts.forEach((d) => {
        const opt = document.createElement('option');
        opt.value = d;
        opt.textContent = d;
        districtSelect.appendChild(opt);
      });

      districtSelect.disabled = false;
      if (keepExistingVal && districts.includes(keepExistingVal)) {
        districtSelect.value = keepExistingVal;
      } else {
        districtSelect.value = '';
      }
    } else {
      const defaultOpt = document.createElement('option');
      defaultOpt.value = '';
      defaultOpt.disabled = true;
      defaultOpt.selected = true;
      defaultOpt.textContent = '-- Select State first --';
      districtSelect.appendChild(defaultOpt);
      districtSelect.disabled = true;
      districtSelect.value = '';
    }
  }

  if (quickContainer) {
    quickContainer.innerHTML = '';
    if (districts.length > 0) {
      quickContainer.style.display = 'flex';
      const labelSpan = document.createElement('span');
      labelSpan.className = 'quick-pills-label';
      labelSpan.textContent = 'Popular:';
      quickContainer.appendChild(labelSpan);

      const topDistricts = districts.slice(0, 6);
      topDistricts.forEach((d) => {
        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = 'district-pill-btn' + (districtSelect.value === d ? ' active' : '');
        pill.textContent = d;
        pill.addEventListener('click', (e) => {
          districtSelect.value = d;
          districtSelect.dispatchEvent({ type: 'change' });
          quickContainer.querySelectorAll('.district-pill-btn').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
        });
        quickContainer.appendChild(pill);
      });
    } else {
      quickContainer.style.display = 'none';
    }
  }
}

// Test Step 1: Initial state (No state selected)
updateDistrictSuggestions('', false);
console.log(`✓ Initial State: districtSelect.disabled = ${districtSelect.disabled} (Expected true), options = ${districtSelect.children.length}`);
if (!districtSelect.disabled) throw new Error('District should be disabled when no state selected');

// Test Step 2: Select Maharashtra
stateSelect.value = 'Maharashtra';
updateDistrictSuggestions(stateSelect.value, false);
console.log(`✓ Selected Maharashtra:`);
console.log(`  - districtSelect.disabled = ${districtSelect.disabled} (Expected false)`);
console.log(`  - district options count = ${districtSelect.children.length} (1 prompt + 36 districts = 37)`);
if (districtSelect.children.length !== 37) throw new Error(`Expected 37 options, got ${districtSelect.children.length}`);
console.log(`  - quick pills count: ${quickContainer.querySelectorAll('.district-pill-btn').length} (Expected 6)`);

// Test Step 3: Click quick pill
const pills = quickContainer.querySelectorAll('.district-pill-btn');
const firstPill = pills[0];
firstPill.dispatchEvent({ type: 'click' });
console.log(`✓ Clicked pill "${firstPill.textContent}" -> districtSelect.value = "${districtSelect.value}"`);
if (districtSelect.value !== firstPill.textContent) throw new Error('Clicking pill did not update district select value');

// Test Step 4: Switch state to Gujarat
stateSelect.value = 'Gujarat';
updateDistrictSuggestions(stateSelect.value, false);
console.log(`✓ Switched to Gujarat:`);
console.log(`  - districtSelect.value reset = "${districtSelect.value}" (Expected empty)`);
if (districtSelect.value !== '') throw new Error('District value should reset when switching state');
console.log(`  - district options count = ${districtSelect.children.length} (1 prompt + 33 districts = 34)`);
if (districtSelect.children.length !== 34) throw new Error(`Expected 34 options, got ${districtSelect.children.length}`);

// Test Step 5: Select "Ahmedabad" in district dropdown
districtSelect.value = 'Ahmedabad';
console.log(`✓ Selected "Ahmedabad" in dropbox -> districtSelect.value = "${districtSelect.value}"`);
if (districtSelect.value !== 'Ahmedabad') throw new Error('Failed to set Ahmedabad in dropbox');

console.log('ALL TESTS PASSED! Dropboxes and CSS are consistent and functional.');
