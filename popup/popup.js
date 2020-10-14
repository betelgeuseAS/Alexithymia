'use strict';

// Tabs
const TabItemSelector = '.tab-item';
const ContentItemSelector = '.content-item';

class TabsManager {
  constructor (navNode) {
    this.tabs = [];
    this.activeTab = null;

    this.initFromHtml(navNode);
    this.activateTab(this.tabs[0]);
  }

  initFromHtml (navNode) {
    const headers  = navNode.querySelectorAll(TabItemSelector);
    const contents = navNode.querySelectorAll(ContentItemSelector);

    for (var i = 0; i < headers.length; i++) {
      this.registerTab(headers[i], contents[i]);
    }
  }

  registerTab (header, content) {
    const tab = new TabItem(header, content);

    tab.onActivate(() => this.activateTab(tab));
    this.tabs.push(tab);
  }

  activateTab (tabItem) {
    if (this.activeTab) {
      this.activeTab.setActive(false);
    }

    this.activeTab = tabItem;
    this.activeTab.setActive(true);
  }

}

const ActiveTabHeaderClass = 'tab-active';
const ActiveTabContentClass = 'content-active';

class TabItem {
  constructor (header, content) {
    this.header  = header;
    this.content = content;
  }

  onActivate (action) {
    this.header.addEventListener('click', () => action(this));
  }

  setActive(value) {
    this.header.classList.toggle(ActiveTabHeaderClass, value);
    this.content.classList.toggle(ActiveTabContentClass, value);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  let tabs = new TabsManager(document.querySelector('nav.nav-header'));
});














// let changeColor = document.getElementById('changeColor');
// chrome.storage.sync.get('color', function(data) {
//   changeColor.style.backgroundColor = data.color;
//   changeColor.setAttribute('value', data.color);
// });
//
// changeColor.onclick = function(element) {
//   let color = element.target.value;
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     chrome.tabs.executeScript(
//       tabs[0].id,
//       {code: 'document.body.style.backgroundColor = "' + color + '";'});
//   });
// };

const field = document.querySelector('.field');
const selectField = document.querySelector('.select-field');


// const events = ['focus', 'blur', 'keydown'];
// for(let i = 0; i < events.length; i++) {
//   (function() {
//     let item = events[i];
//     field['on' + item] = function(e) {
//       switch (item) {
//         case 'focus':
//           document.body.classList.add("is-focus");
//           break;
//
//         case 'blur':
//           document.body.classList.remove('is-focus', 'is-type');
//           break;
//
//         case 'keydown':
//           document.body.classList.add('is-type');
//           // if ((e.which === 8) && this.value === '') {
//           //   document.body.classList.remove('is-type');
//           // }
//           break;
//
//         default:
//           break;
//       }
//     };
//   })();
// }


// let language = 'en';
// document.body.onload = () => {
//   selectField.value = browserLanguage();
//   language = browserLanguage();
// };
// selectField.addEventListener('change', (e) => {
//   language = e.target.value;
// });


// listen('.field', 'keypress', debounce(function(e) {
//   //"https://en.wikipedia.org/w/api.php";
//   let url = `https://${language}.wikipedia.org/w/api.php`;
//
//   let params = {
//     action: "opensearch",
//     prop: "info",
//     limit: "5",
//     search: this.value,
//     namespace: "0",
//     format: "json",
//
//     //A cookie associated with a cross-site resource:
//     //https://www.chromestatus.com/feature/5088147346030592
//     //https://www.chromestatus.com/feature/5633521622188032
//     SameSite: 'None'
//   };
//
//   url = url + "?origin=*";
//   Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});
//
//   fetch(url)
//     .then(function(response){return response.json();})
//     .then(function(response) {
//       //response?.query?.search[0];
//       console.log(response);
//       document.body.classList.remove('is-type', is);
//     })
//     .catch(function(error){console.log(error);});
// }, 2000));


// function createTodoItem(title) {
//   const checkbox = createElement('input', { type: 'checkbox', className: 'checkbox' });
//   const label = createElement('label', { className: 'title' }, title);
//   const editInput = createElement('input', { type: 'text', className: 'textfield' });
//   const editButton = createElement('button', { className: 'edit' }, 'Edit');
//   const deleteButton = createElement('button', { className: 'delete' }, 'Remove');
//   const listItem = createElement('li', { className: 'todo-item' }, checkbox, label, editInput, editButton, deleteButton);
//   return listItem;
// }




