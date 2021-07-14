import { http } from './http';
import { ui } from './ui';

const URI = 'https://qa.createdright.com/api';

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

document.querySelector('.project-qas').addEventListener('click', devAction);

document.querySelector('.passedBtn').addEventListener('click', passProject);
document.querySelector('.keepPendingBtn').addEventListener('click', keepPending);

function getUserProjects(user) {
  http.get(`${URI}/user/${user.id}/fetch/projects`)
    .then(data => ui.displayUserProjects(data))
    .catch(err => console.log(err));
}

function getAllProjects() {
  http.get(`${URI}/fetch/all/projects`)
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

  http.post(`${URI}/user/signup`, data)
  .then(data => {
    if(data.status === 'error'){
      ui.showAlert(data.message, 'alert alert-danger');
    } else {
      ui.showAlert(data.message, 'alert alert-success');
      ui.changeViewState('login');
    }
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

  http.post(`${URI}/user/signin`, data)
  .then(data => {
    if(data.status === 'error'){
      ui.showAlert(data.message, 'alert alert-danger');
    } else {
      ui.showAlert(data.message, 'alert alert-success');
      storeLoggedUser(data.user);
      if(data.user.role === 'developer') {
        getUserProjects(data.user);
      } else {
        getAllProjects();
      }
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

  location.reload();

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

  http.post(`${URI}/submit/project`, data)
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

  http.post(`${URI}/submit/qa`, data)
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

function passProject(e) {
  const project = JSON.parse(localStorage.getItem('currentProject'));
  const projectID = project[0].id;

  const data = {
    status: 'passed'
  }

  http.put(`${URI}/update/project/${projectID}/status`, data)
    .then(data => {
      ui.showAlert(data.message, 'alert alert-success');
      getProjectDetails(projectID);
      ui.initiateState();
    })
    .catch(err => console.log(err));

  e.preventDefault();
}

function keepPending(e) {
  const project = JSON.parse(localStorage.getItem('currentProject'));
  const projectID = project[0].id;

  const data = {
    status: 'pending'
  }

  http.put(`${URI}/update/project/${projectID}/status`, data)
    .then(data => {
      ui.showAlert(data.message, 'alert alert-success');
      getProjectDetails(projectID);
      ui.initiateState();
    })
    .catch(err => console.log(err));

  e.preventDefault();
}

function getProjectDetails(id) {
  const user = JSON.parse(localStorage.getItem('user'));
  http.get(`${URI}/fetch/project/${id}/details`)
    .then(data => {
      localStorage.setItem('currentProject', JSON.stringify(data.project));

      if(user.role === 'qa_person'){
        ui.addviewState('actionState', 'qa-project-details');
      } else {
        ui.addviewState('actionState', 'dev-project-details');
      }
    })
    .catch(err => console.log(err));
}

function devAction(e) {
  const project = JSON.parse(localStorage.getItem('currentProject'));

  if(e.target.classList.contains('decline-btn')){
    const qaID = e.target.id;
    const devComment = document.querySelector(`#dev-qa-comment-${qaID}`).value;

    const data = {
      devComment,
      status: 'Declined'
    }

    if(devComment !== '') {
      http.put(`${URI}/add/dev/qa/${qaID}/comment`, data)
        .then(data => {
          getProjectDetails(project[0].id);
          ui.initiateState();
        })
        .catch(err => console.log(err));
    }
  } else if(e.target.classList.contains('done-btn')) {
    const qaID = e.target.id;
    const data = {
      devComment: 'QA fixes done',
      status: 'Done'
    }

    http.put(`${URI}/add/dev/qa/${qaID}/comment`, data)
        .then(data => {
          getProjectDetails(project[0].id);
          ui.initiateState();
        })
        .catch(err => console.log(err));
  }

  e.preventDefault();
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