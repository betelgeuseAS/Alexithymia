const debounce = (fn, time) => {
  let timeout;

  return function() {
    const functionCall = () => fn.apply(this, arguments);
    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  }
};

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
// const checkbox = createElement('input', { type: 'checkbox', className: 'checkbox' });
// const label = createElement('label', { className: 'title' }, title);
// const editInput = createElement('input', { type: 'text', className: 'textfield' });
// const editButton = createElement('button', { className: 'edit' }, 'Edit');
// const deleteButton = createElement('button', { className: 'delete' }, 'Remove');
// const listItem = createElement('li', { className: 'todo-item' }, checkbox, label, editInput, editButton, deleteButton);
// return listItem;

function uuid() {
  let uuid = "", i, random;

  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;

    if (i === 8 || i === 12 || i === 16 || i === 20) uuid += "-";

    uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
  }

  return uuid;
}
