//Customize event listener
const listen = (selector = 'body', event = '', listener = () => {}, useCapture = false) => {
  document.querySelector(selector)
    .addEventListener(event, listener, useCapture);
};

//Debounce
//Make sure that the function returned is not an arrow function, as you will lose context.
const debounce = (fn, time) => {
  let timeout;

  return function() {
    const functionCall = () => fn.apply(this, arguments);
    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  }
};

//Set browser language
const browserLanguage = () => {
  let userLang = navigator.language || navigator.userLanguage;

  return userLang ? userLang.slice(0, 2) : 'en';
};

//Create element node
function createElement(tag, props, ...children) {
  const element = document.createElement(tag);

  Object.keys(props).forEach(key => element[key] = props[key]);

  if (children.length > 0) {
    children.forEach(child => {
      if (typeof child === 'string') {
        child = document.createTextNode(child);
      }
      element.appendChild(child);
    });
  }

  return element;
}
