//Customize event listener
const listen = (selector = '', event = '', listener = () => {}, useCapture = false) => {
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
