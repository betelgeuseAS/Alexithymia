'use strict';

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
const events = ['focus', 'blur', 'keydown'];
for(let i = 0; i < events.length; i++) {
  (function() {
    let item = events[i];
    field['on' + item] = function(e) {
      switch (item) {
        case 'focus':
          document.body.classList.add("is-focus");
          break;

        case 'blur':
          document.body.classList.remove('is-focus', 'is-type');
          break;

        case 'keydown':
            document.body.classList.add('is-type');
            if ((e.which === 8) && this.value === '') {
              document.body.classList.remove('is-type');
            }

          break;

        default:
          break;
      }
    };
  })();
}
