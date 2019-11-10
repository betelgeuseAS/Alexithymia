'use strict';

// let changeColor = document.getElementById('changeColor');
// chrome.storage.sync.get('color', function(data) {
//   changeColor.style.backgroundColor = data.color;
//   changeColor.setAttribute('value', data.color);
// });
//
// changeColor.onclick = function(element) {
//   let color = element.target.value;
//   debugger;
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     chrome.tabs.executeScript(
//       tabs[0].id,
//       {code: 'document.body.style.backgroundColor = "' + color + '";'});
//   });
// };


const listen = (selector = '', event = '', listener = () => {}, useCapture = false) => {
  document.querySelector(selector)
    .addEventListener(event, listener, useCapture);
};

listen('.field', 'focus', () => {
  document.body.classList.add("is-focus");
});

listen('.field', 'blur', () => {
  document.body.classList.remove('is-focus', 'is-type');
});

listen('.field', 'keydown', (e) => {
  document.body.classList.add('is-type');
  if ((e.which === 8) && this.value === '') {
    document.body.classList.remove('is-type');
  }
});

// var obj = document.querySelector('body');
// var items = ['keydown', 'mouseup'];
// for(var i = 0; i < items.length; i++) {
//   (function() {
//     var item = items[i];
//     obj['on' + item] = function() {
//       console.log('Thanks for your ' + item);
//       // if(item == 'click') {
//       // 	console.log('click');
//       // } else if(item == 'mouseover') {
//       // 	console.log('mouseover');
//       // }
//     };
//   })();
// }
