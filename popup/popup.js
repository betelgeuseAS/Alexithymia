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




console.clear();

const elDevices = document.querySelectorAll('.device');

const machine = {
  initial: 'list',
  states: {
    list: {
      on: {
        ARTICLE: 'article'
      }
    },
    article: {
      on: {
        BACK: 'list'
      }
    }
  }
};

let currentState = elDevices[0].dataset.view;

function readCssVar(element, varName){
  const elementStyles = getComputedStyle(element);
  return elementStyles.getPropertyValue('--'+varName).trim();
}

const flipping = new Flipping({
  duration: +readCssVar(elDevices[0], 'duration').replace(/(s|ms)/,'') || 300,
  activeSelector: el => {
    return el.matches(`[data-layer="${elDevices[0].dataset.view}"] *`);
  }
});

function send(event) {
  const nextState = machine.states[currentState].on[event];

  flipping.read();
  currentState = nextState;
  [...elDevices].forEach( d => {
    d.dataset.view = nextState;
  });
  flipping.flip();
}

const elArticles = [...document.querySelectorAll('.clickable')];
const elBackos = [...document.querySelectorAll('.exit')];

elArticles.forEach( el => {
  el.addEventListener('click', () => {
    send('ARTICLE');
  });
});


elBackos.forEach( el => {
  el.addEventListener('click', () => {
    send('BACK');
  });
});
