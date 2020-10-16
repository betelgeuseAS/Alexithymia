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

// Animated element removal
function cuteHide(element) {
  element.animate({opacity: '0'}, 150, function(){
    element.animate({height: '0px'}, 150, function(){
      element.remove();
    });
  });
}

$('.content-data-item .delete-content-data-item').on('click', function(){
  const element = $(this).closest('.content .content-data .content-data-item');
  cuteHide(element);
});

// Notes
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

// function createTodoItem(title) {
//   const checkbox = createElement('input', { type: 'checkbox', className: 'checkbox' });
//   const label = createElement('label', { className: 'title' }, title);
//   const editInput = createElement('input', { type: 'text', className: 'textfield' });
//   const editButton = createElement('button', { className: 'edit' }, 'Edit');
//   const deleteButton = createElement('button', { className: 'delete' }, 'Remove');
//   const listItem = createElement('li', { className: 'todo-item' }, checkbox, label, editInput, editButton, deleteButton);
//   return listItem;
// }
