import { http } from './http';
import { ui } from './ui';

document.addEventListener('DOMContentLoaded', setCurrentState);

document.querySelector('.add-account').addEventListener('click', addUser);

document.querySelector('.login').addEventListener('click', loginUser);

document.querySelector('#login-link').addEventListener('click', enableLogin);

document.querySelector('#signup-link').addEventListener('click', enableSignup);

document.querySelector('#logout-link').addEventListener('click', logoutUser);

document.querySelector('.add-project-btn').addEventListener('click', submitProject);

document.querySelector('.dev-projects').addEventListener('click', expandDevItem);
document.querySelector('.qa-projects').addEventListener('click', expandQaItem);

document.querySelector('.backBtn').addEventListener('click', clearActionState);
document.querySelector('.devBackBtn').addEventListener('click', clearActionState);

document.querySelector('.submit-qa-btn').addEventListener('click', submitProjectQA);

function getUserProjects(user) {
  http.get(`http://localhost:8000/api/user/${user.id}/fetch/projects`)
    .then(data => ui.displayUserProjects(data))
    .catch(err => console.log(err));
}

function getAllProjects() {
  http.get(`http://localhost:8000/api/fetch/all/projects`)
    .then(data => ui.displayQaProjects(data))
    .catch(err => console.log(err));
}

function setCurrentState(){

  if(localStorage.getItem('user') === null){
    
    localStorage.setItem('state', 'login');

  } else {
    localStorage.setItem('state', 'loggedIn');
    const user = JSON.parse(localStorage.getItem('user'));
    getUserProjects(user);
    getAllProjects();
  }

  ui.initiateState();

}

function addUser(e) {
  const name = document.querySelector('#name').value;
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  const role = document.querySelector('#role').value;
  const accessCode = document.querySelector('#access-code').value;

  const data = {
    name,
    email,
    password,
    role,
    accessCode
  }

  http.post('http://localhost:8000/api/user/signup', data)
  .then(data => {
    if(data.status === 'error'){
      ui.showAlert(data.message, 'alert alert-danger');
    } else {
      ui.showAlert(data.message, 'alert alert-success');
      ui.changeViewState('login');
    }
    console.log(data);
  })
  .catch(err => console.log(err));

  e.preventDefault();
}

function loginUser(e){
  const email = document.querySelector('#login-email').value;
  const password = document.querySelector('#login-password').value;

  const data = {
    email,
    password
  }

  http.post('http://localhost:8000/api/user/signin', data)
  .then(data => {
    if(data.status === 'error'){
      ui.showAlert(data.message, 'alert alert-danger');
      console.log(data);
    } else {
      ui.showAlert(data.message, 'alert alert-success');
      storeLoggedUser(data.user);
      if(data.user.role === 'developer') {
        getUserProjects(data.user);
      } else {
        getAllProjects();
      }
      console.log(data);
    }
  })
  .catch(err => console.log(err));

  e.preventDefault();
}


function storeLoggedUser(user){
  
  if(localStorage.getItem('user') === null){
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    removeUser()
    localStorage.setItem('user', JSON.stringify(user));
  }

  ui.changeViewState('loggedIn');
  ui.initiateState();

}

function clearActionState(e) {
  localStorage.removeItem('actionState');
  localStorage.removeItem('currentProject');

  ui.initiateState();

  e.preventDefault();
}

function removeUser(){
  localStorage.removeItem('user');
}

function submitProject(){
  const projectName = document.querySelector('#project-name').value;
  const projectUrl = document.querySelector('#project-url').value;
  const user = JSON.parse(localStorage.getItem('user'));

  const data = {
    projectName,
    projectUrl,
    userID: user.id
  }

  http.post('http://localhost:8000/api/submit/project', data)
  .then(data => {
    if(data.status === 'error'){
      ui.showAlert(data.message, 'alert alert-danger');
    } else {
      ui.showAlert(data.message, 'alert alert-success');
      ui.clearSubmitProjectFields();
      getUserProjects(user);
    }
    
  })
  .catch(err => console.log(err));
}

function submitProjectQA() {
  const user = JSON.parse(localStorage.getItem('user'));
  const project = JSON.parse(localStorage.getItem('currentProject'));
  const qaUrl = document.querySelector('#qa-url').value,
        qaComment = document.querySelector('#qa-comment').value,
        qaMedia = document.querySelector('#qa-media').value;

  const data = {
    userID: user.id,
    projectID: project[0].id,
    qaUrl,
    qaComment,
    qaMedia
  }

  http.post('http://localhost:8000/api/submit/qa', data)
  .then(data => {
    if(data.status === 'error'){
      ui.showAlert(data.message, 'alert alert-danger');
    } else {
      document.querySelector('#qa-url').value = '';
      document.querySelector('#qa-comment').value = '';
      document.querySelector('#qa-media').value = '';
      ui.showAlert(data.message, 'alert alert-success');
      getProjectDetails(project[0].id);
      ui.initiateState();
    }
    
  })
  .catch(err => console.log(err));

}

function getProjectDetails(id) {
  const user = JSON.parse(localStorage.getItem('user'));
  http.get(`http://localhost:8000/api/fetch/project/${id}/details`)
    .then(data => {
      localStorage.setItem('currentProject', JSON.stringify(data.project));

      if(user.role === 'qa_person'){
        ui.addviewState('actionState', 'qa-project-details');
      } else {
        ui.addviewState('actionState', 'dev-project-details');
      }

      console.log(data.project);
    })
    .catch(err => console.log(err));
}

function expandDevItem(e) {
  if(e.target.parentElement.classList.contains('qa-item')){
    const projectID = e.target.parentElement.id;
    getProjectDetails(projectID);
  }

  e.preventDefault();
}

function expandQaItem(e) {
  if(e.target.parentElement.classList.contains('qa-item')){
    const projectID = e.target.parentElement.id;
    getProjectDetails(projectID);
  }

  e.preventDefault();
}

function enableLogin(e) {
  ui.changeViewState('login');
  e.preventDefault();
}

function enableSignup(e) {
  ui.changeViewState('signup');
  ui.initiateState();
  e.preventDefault();
}

function logoutUser(e){
  document.querySelector('#welcomeText').textContent = '';
  localStorage.removeItem('actionState');
  localStorage.removeItem('currentProject');
  removeUser();
  ui.changeViewState('login');
  ui.initiateState();
  e.preventDefault();
}