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
const selectField = document.querySelector('.select-field');


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
          // if ((e.which === 8) && this.value === '') {
          //   document.body.classList.remove('is-type');
          // }
          break;

        default:
          break;
      }
    };
  })();
}


let language = 'en';
document.body.onload = () => {
  selectField.value = browserLanguage();
  language = browserLanguage();
};
selectField.addEventListener('change', (e) => {
  language = e.target.value;
});


listen('.field', 'keypress', debounce(function(e) {
  //"https://en.wikipedia.org/w/api.php";
  let url = `https://${language}.wikipedia.org/w/api.php`;

  let params = {
    action: "opensearch",
    prop: "info",
    limit: "5",
    search: this.value,
    namespace: "0",
    format: "json",

    //A cookie associated with a cross-site resource:
    //https://www.chromestatus.com/feature/5088147346030592
    //https://www.chromestatus.com/feature/5633521622188032
    SameSite: 'None'
  };

  url = url + "?origin=*";
  Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

  fetch(url)
    .then(function(response){return response.json();})
    .then(function(response) {
      //response?.query?.search[0];
      console.log(response);
      document.body.classList.remove('is-type', is);
    })
    .catch(function(error){console.log(error);});
}, 2000));
