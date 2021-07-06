import { http } from './http';
import { ui } from './ui';

document.addEventListener('DOMContentLoaded', setCurrentState);

document.querySelector('.add-account').addEventListener('click', addUser);

document.querySelector('.login').addEventListener('click', loginUser);

document.querySelector('#login-link').addEventListener('click', enableLogin);

document.querySelector('#signup-link').addEventListener('click', enableSignup);

document.querySelector('#logout-link').addEventListener('click', logoutUser);

document.querySelector('.add-project-btn').addEventListener('click', submitProject);

function getUserProjects(user) {
  http.get(`http://localhost:8000/api/user/${user.id}/fetch/projects`)
    .then(data => ui.displayProjects(data))
    .catch(err => console.log(err));
}

function setCurrentState(){

  if(localStorage.getItem('user') === null){
    
    if(localStorage.getItem('state') === null){
      localStorage.setItem('state', 'login');
    } else {
      localStorage.removeItem('state');
      localStorage.setItem('state', 'login');
    }

  } else {
    localStorage.setItem('state', 'loggedIn');
    const user = JSON.parse(localStorage.getItem('user'));
    getUserProjects(user);
  }

}

ui.initiateState();

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
    } else {
      ui.showAlert(data.message, 'alert alert-success');
      storeLoggedUser(data.user);
      getUserProjects(data.user);
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
  removeUser();
  ui.changeViewState('login');
  ui.initiateState();
  e.preventDefault();
}