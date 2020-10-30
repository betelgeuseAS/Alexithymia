'use strict';

// Storage https://developer.chrome.com/extensions/storage
// Typeahead https://sliptree.github.io/bootstrap-tokenfield/
// Bootstrap https://getbootstrap.com/docs/4.5/components/alerts/
// Bootswatch https://bootswatch.com/sketchy/
// jQuery https://api.jquery.com/

// Chrome tab API https://developer.chrome.com/extensions/tabs
// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//   chrome.tabs.executeScript(
//     tabs[0].id,
//     {code: 'document.body.style.backgroundColor = red;'});
// });

$(document).ready(() => {
  $(function() {
    $('[data-toggle="tooltip"]').tooltip();
  });

  // chrome.storage.sync.clear();
  chrome.storage.sync.get(['settingsTags', 'records'], (result) => {
    let dataTags = result.settingsTags || '',
        dataRecords = result.records || [];

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

    SaveRecordModal.run(
      $('#addItemModal'),
      dataRecords
    );





    // Global variables
    const searchInput = $('.search-action #searchInput'),
          searchFilter = $('.search-action #searchFilter');
    let listItems = $('.list-group li.list-group-item');

    function createRecordHandler(record) {
      // let div = $("<div>", {id: "foo", "class": "a"});
      // div.click(function() {});
      // $("#box").append(div);

      let li = `
      <li class="list-group-item" data-id="${record.id}">
        <div class="d-flex justify-content-between align-items-center">
          <div class="w-50 data">
            <div class="data-content">${record.content}</div>
            <div class="data-tags">[ <span class="text-muted">${record.tags}</span> ]</div>
          </div>
      
          <div>
            <button type="button" class="btn btn-outline-warning edit-action btn-sm">Edit</button>
            <button type="button" class="btn btn-outline-danger delete-action btn-sm">Delete</button>
          </div>
        </div>
      </li>
    `;

      $("#content ul.list-group").prepend(li);
    }

    function hideElementHandler(element) {
      element.animate({opacity: '0'}, 150, function(){
        element.animate({height: '0px'}, 150, function(){
          element.remove();
        });
      });
    }

    function filterHandler(value, filter) {
      switch (filter) {
        case 'all':
          listItems.filter(function() {
            $(this).toggle($(this).find('.data').text().toLowerCase().indexOf(value) > -1)
          });

          break;
        case 'content':
          listItems.filter(function() {
            $(this).toggle($(this).find('.data .data-content').text().toLowerCase().indexOf(value) > -1)
          });

          break;
        case 'tags':
          listItems.filter(function() {
            $(this).toggle($(this).find('.data .data-tags').text().toLowerCase().indexOf(value) > -1)
          });

          break;
      }
    }

    function searchInputHandler() {
      let value = $(this).val().toLowerCase(),
        filter = searchFilter.val().toLowerCase();

      filterHandler(value, filter);
    }

    function searchFilterHandler() {
      let value = searchInput.val().toLowerCase(),
        filter = $(this).val().toLowerCase();

      filterHandler(value, filter);
    }

    function bindEvents(recordItem) {
      const editButton = $(recordItem).find('button.edit-action');
      const deleteButton = $(recordItem).find('button.delete-action');

      editButton.on('click', editRecordItemHandler);
      deleteButton.on('click', deleteRecordItemHandler);
    }

    function editRecordItemHandler() {

    }

    function deleteRecordItemHandler() {
      const element = $(this).closest('li.list-group-item'),
            id = element.data('id');

      let records = $.grep(dataRecords, function(item){
        return item.id !== id;
      });

      chrome.storage.sync.set({records: records}, function() {
        dataRecords = records;
        hideElementHandler(element);
        // self.showToastSuccess();
      });
    }

    function main() {
      // Generate records
      dataRecords.forEach((record) => {
        createRecordHandler(record);
      });
      listItems = $('.list-group li.list-group-item');
      listItems.each(function() { bindEvents(this); });

      // Search
      searchInput.on('keyup', searchInputHandler);
      searchFilter.on('change', searchFilterHandler);
    }

    main();
  });
});







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

      data['id'] = uuid();
      self.records.push(data);

      chrome.storage.sync.set({records: self.records}, function() {
        self.showToastSuccess();
        self.modalElement.modal('hide');
      });
    });
  }
}
