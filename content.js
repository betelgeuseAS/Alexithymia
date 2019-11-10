const listen = (selector = '', event = '', listener = () => {}, useCapture = false) => {
  document.querySelector(selector)
    .addEventListener(event, listener, useCapture);
};

// listen('body', 'mouseup', (e) => {
//   // let selection = document.getSelection ? document.getSelection().toString() :  document.selection.createRange().toString() ;
//   console.log(document.getSelection().toString());
//
//   // console.log('Selection object:', window.getSelection());
//   // console.log('Selected text:', window.getSelection().toString());
// });


listen('body', 'keydown', (e) => {
  let eventObj = window.event ? event : e;

  switch(true) {
    case (eventObj.keyCode === 83 && eventObj.ctrlKey && eventObj.shiftKey)://Ctrl + Shift + S
      console.log(document.getSelection().toString());
      break;

    case (eventObj.keyCode === 65 && eventObj.ctrlKey && eventObj.shiftKey)://Ctrl + Shift + A
      console.log(document.getSelection().toString());
      break;

    default:
      break;
  }
});
