'use strict';

// Storage https://developer.chrome.com/extensions/storage
// Typeahead https://sliptree.github.io/bootstrap-tokenfield/
// Bootstrap https://getbootstrap.com/docs/4.5/components/alerts/
// Bootswatch https://bootswatch.com/sketchy/
// jQuery https://api.jquery.com/

$(document).ready(() => {
  Init.run();
});

class Init {
  constructor() {
    this.init();
  }

  static run() {
    new Init();
  }

  init() {
    this.initAppWithData();
    this.initBootstrapComponents();
  }

  initAppWithData() {
    chrome.storage.sync.get(['settingsTags', 'records'], (result) => {
      let dataTags = result.settingsTags || '',
          dataRecords = result.records || [];

      DeleteItem.run(
        $('.list-group .list-group-item .delete-action'),
        $('.list-group .list-group-item')
      );

      TypeaheadTags.run(
        $('.tab-pane #inputSettingsTags'),
        $('.tab-pane .save-settings-tags'),
        dataTags
      );

      TypeaheadTags.run(
        $('#addItemModal #inputTags'),
        null,
        dataTags
      );

      Search.run(
        $('.search-action #searchInput'),
        $('.search-action #searchFilter'),
        $('.list-group li.list-group-item')
      );

      SaveRecordModal.run(
        $('#addItemModal'),
        dataRecords
      );
    });
  }

  initBootstrapComponents() {
    $(function() {
      $('[data-toggle="tooltip"]').tooltip();
    });
  }
}

class Toast {
  constructor() {
    this.toastSuccess = $('.toast-notify-success');
    this.toastWarning = $('.toast-notify-warning');
    this.toastError = $('.toast-notify-error');

    this.toasts = $('.toast');

    this.events();
  }

  showToastSuccess() {
    this.toastSuccess.toast('show');
  }

  showToastWarning() {
    this.toastWarning.toast('show');
  }

  showToastError() {
    this.toastError.toast('show');
  }

  hideToastSuccess() {
    this.toastSuccess.toast('hide');
  }

  hideToastWarning() {
    this.toastWarning.toast('hide');
  }

  hideToastError() {
    this.toastError.toast('hide');
  }

  hideAllToasts() {
    this.toasts.toast('dispose');
  }

  events() {
    this.toasts.on('show.bs.toast', function() {});
    this.toasts.on('shown.bs.toast', function() {});
    this.toasts.on('hide.bs.toast', function() {});
    this.toasts.on('hidden.bs.toast', function() {});
  }
}

class DeleteItem {
  constructor(deleteButton, deleteElement) {
    this.deleteButton = deleteButton;
    this.deleteElement = deleteElement;

    this.init(this);
  }

  static run(deleteButton, deleteElement) {
    new DeleteItem(deleteButton, deleteElement);
  }

  init(self) {
    self.deleteButton.on('click', function() {
      const element = $(this).closest(self.deleteElement);

      self.cuteHide(element);
    });
  }

  cuteHide(element) {
    element.animate({opacity: '0'}, 150, function(){
      element.animate({height: '0px'}, 150, function(){
        element.remove();
      });
    });
  }
}

class TypeaheadTags extends Toast {
  constructor(inputTags, saveTagsButton, tags) {
    super(inputTags, saveTagsButton, tags);

    this.inputTags = inputTags;
    this.saveTagsButton = saveTagsButton;
    this.tags = tags;

    this.init();
  }

  static run(inputTags, saveTagsButton, tags) {
    new TypeaheadTags(inputTags, saveTagsButton, tags);
  }

  init() {
    this.initTags();

    if (this.saveTagsButton) {
      this.saveTags();
    }
  }

  initTags() {
    if (this.saveTagsButton) {
      this.inputTags.tokenfield({ // this.inputTags.tokenfield('setTokens', this.tags);
        tokens: this.tags
      });
    } else {
      let prepareTags = this.tags.split(', ');

      this.inputTags.tokenfield({
        autocomplete: {
          source: [...prepareTags],
          delay: 100
        },
        showAutocompleteOnFocus: true
      });
    }
  }

  saveTags() {
    this.saveTagsButton.on('click', (event) => {
      event.preventDefault();

      const value = this.inputTags.tokenfield('getTokensList', ', ');

      if (!value) {
        this.showToastError();

        return;
      }

      chrome.storage.sync.set({settingsTags: value}, () => {
        this.showToastSuccess();
      });
    });
  }
}

class Search {
  constructor(searchInput, searchFilter, listItems) {
    this.searchInput = searchInput;
    this.searchFilter = searchFilter;
    this.listItems = listItems;

    this.init();
  }

  static run(searchInput, searchFilter, listItems) {
    new Search(searchInput, searchFilter, listItems);
  }

  init() {
    let self = this;

    this.searchInput.on("keyup", function() {
      let value = $(this).val().toLowerCase(),
          filter = self.searchFilter.val().toLowerCase();

      self.filter(value, filter);
    });

    this.searchFilter.on("change",function() {
      let value = self.searchInput.val().toLowerCase(),
          filter = $(this).val().toLowerCase();

      self.filter(value, filter);
    });
  }

  filter(value, filter) {
    const self = this;

    switch (filter) {
      case 'all':
        self.listItems.filter(function() {
          $(this).toggle($(this).find('.data').text().toLowerCase().indexOf(value) > -1)
        });

        break;
      case 'title':
        self.listItems.filter(function() {
          $(this).toggle($(this).find('.data .data-title').text().toLowerCase().indexOf(value) > -1)
        });

        break;
      case 'tags':
        self.listItems.filter(function() {
          $(this).toggle($(this).find('.data .data-tags').text().toLowerCase().indexOf(value) > -1)
        });

        break;
    }
  }
}

class SaveRecordModal extends Toast {
  constructor(modalElement, records) {
    super(modalElement, records);

    this.modalElement = modalElement;
    this.records = records;

    this.init();
  }

  static run(modalElement, records) {
    new SaveRecordModal(modalElement, records);
  }

  init() {
    const form = this.modalElement.find('form'),
          self = this;

    this.modalElement.find('.save-action').on('click', function() {
      let data = {};

      form.find('input, textarea').each(function() {
        if (this.name) data[this.name] = $(this).val();
      });

      if (!data) {
        self.showToastError();

        return;
      }

      data['id'] = self.uuid();
      self.records.push(data);

      chrome.storage.sync.set({records: self.records}, function() {
        self.showToastSuccess();
        self.modalElement.modal('hide');
      });
    });
  }

  uuid() {
    let uuid = "", i, random;

    for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;

      if (i === 8 || i === 12 || i === 16 || i === 20) uuid += "-";

      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
    }

    return uuid;
  }
}

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
