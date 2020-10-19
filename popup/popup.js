'use strict';

// Storage https://developer.chrome.com/extensions/storage
// Typeahead https://sliptree.github.io/bootstrap-tokenfield/
// Bootstrap https://getbootstrap.com/docs/4.5/components/alerts/
// Bootswatch https://bootswatch.com/sketchy/
// jQuery https://api.jquery.com/

$(document).ready(() => {
  Init.run();

  // DeleteItem.run(
  //   $('.list-group .list-group-item .delete-action'),
  //   $('.list-group .list-group-item')
  // );
  //
  // TypeaheadTags.run(
  //   $('.tab-pane #inputSettingsTags'),
  //   $('.tab-pane .save-settings-tags')
  // );
  //
  // Search.run(
  //   $('.search-action #searchInput'),
  //   $('.search-action #searchFilter'),
  //   $('.list-group li.list-group-item')
  // );
  //
  // SaveRecordModal.run(
  //   $('#addItemModal')
  // )
});

// Toast Notifications
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
    this.toasts.on('show.bs.toast', function() {
      // do something...
    });

    this.toasts.on('shown.bs.toast', function() {
      // do something...
    });

    this.toasts.on('hide.bs.toast', function() {
      // do something...
    });

    this.toasts.on('hidden.bs.toast', function() {
      // do something...
    });
  }
}

// Init
class Init {
  constructor() {
    this.init();
  }

  static run() {
    new Init();
  }

  init() {
    $(function() { // Tooltips Bootstrap
      $('[data-toggle="tooltip"]').tooltip();
    });


    chrome.storage.sync.get(['settingsTags', 'records'], (result) => {
      let dataTags = result.settingsTags,
          dataRecords = result.records;

      DeleteItem.run(
        $('.list-group .list-group-item .delete-action'),
        $('.list-group .list-group-item')
      );

      TypeaheadTags.run(
        $('.tab-pane #inputSettingsTags'),
        $('.tab-pane .save-settings-tags')
      );

      Search.run(
        $('.search-action #searchInput'),
        $('.search-action #searchFilter'),
        $('.list-group li.list-group-item')
      );

      SaveRecordModal.run(
        $('#addItemModal')
      );
    });
  }
}

// Animated element removal
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

// Typeahead
class TypeaheadTags extends Toast {
  constructor(inputTags, saveTagsButton) {
    super(inputTags, saveTagsButton);

    this.inputTags = inputTags;
    this.saveTagsButton = saveTagsButton;

    this.init();
  }

  static run(inputTags, saveTagsButton) {
    new TypeaheadTags(inputTags, saveTagsButton);
  }

  init() {
    this.inputTags.tokenfield();

    this.save();
    this.ready();
  }

  save() {
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

  ready() {
    chrome.storage.sync.get(['settingsTags'], (result) => {
      this.inputTags.tokenfield('setTokens', result.settingsTags);
    });
  }
}

// Search
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

// Save Modal
class SaveRecordModal extends Toast {
  constructor(modalElement) {
    super(modalElement);

    this.modalElement = modalElement;

    this.init();
  }

  static run(modalElement) {
    new SaveRecordModal(modalElement);
  }

  init() {
    const form = this.modalElement.find('form'),
          self = this;

    this.modalElement.find('.save-action').on('click', function() {
      let data = {};

      form.find('input, textarea').each(function() {
        data[this.name] = $(this).val();
      });

      if (!data) {
        self.showToastError();
      }

      chrome.storage.sync.set({records: [data]}, function() {
        self.showToastSuccess();
        self.modalElement.modal('hide');
      });
    });
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
