//Customize event listener
const listen = (selector = '', event = '', listener = () => {}, useCapture = false) => {
  document.querySelector(selector)
    .addEventListener(event, listener, useCapture);
};
