(function () {
  let studentNames = null;

  function getStudentNames() {
    studentNames = window.localStorage.getItem('studentNames');
    if (!studentNames) {
      studentNames = [];
      window.localStorage.setItem('studentNames', studentNames);
    } else if (typeof studentNames === 'string') {
      studentNames = studentNames.split(',');
    }

    return studentNames;
  }

  function refreshList() {
    const list = document.getElementById('student-list');

    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }

    const sns = studentNames || getStudentNames();

    for (let i = 0; i < sns.length; i++) {
      const name = sns[i];
      const newListItem = document.createElement('li');
      newListItem.className = 'list-item';
      const newBadge = document.createElement('span');
      newBadge.className = 'badge rounded-pill bg-secondary';
      newBadge.innerText = name;
      newListItem.appendChild(newBadge);
      list.appendChild(newListItem);
    }
  }

  function addStudentName(name) {
    const sns = studentNames || getStudentNames();
    if (sns.indexOf(name) < 0) {
      sns.push(name);
    }

    window.localStorage.setItem('studentNames', sns);
    refreshList();
  }

  function getRandomStudentName() {
    console.log(studentNames);
    const sns = studentNames || getStudentNames();
    const i = Math.floor(Math.random() * sns.length);
    const retval = sns[i];
    sns.splice(i, 1);
    studentNames = sns;
    window.localStorage.setItem('studentNames', sns);
    refreshList();
    return retval;
  }

  function onGetStudentNameClick(e) {
    e.preventDefault();
    const name = getRandomStudentName();
    const display = document.getElementById('picked-name');
    display.innerText = name;
  }

  function onAddStudentNameClick(e) {
    e.preventDefault();
    const nameTextBox = document.getElementById('name-input');
    const currentName = nameTextBox.value;
    if (currentName !== '') {
      addStudentName(currentName);
      nameTextBox.value = '';
    }
  }

  function onDocumentReady() {
    getStudentNames();
    refreshList();
    console.log(studentNames);
    const pickButton = document.getElementById('pick-name');
    const addButton = document.getElementById('add-name');
    pickButton.addEventListener('click', onGetStudentNameClick);
    addButton.addEventListener('click', onAddStudentNameClick);
  }

  document.addEventListener('DOMContentLoaded', onDocumentReady);
}());
