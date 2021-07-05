import { http } from './http';
import { ui } from './ui';

document.querySelector('.add-account').addEventListener('click', addUser);

document.querySelector('.login').addEventListener('click', loginUser);

document.querySelector('#login-link').addEventListener('click', enableLogin);

document.querySelector('#signup-link').addEventListener('click', enableSignup);

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
      ui.showAlert('Successful', 'alert alert-success');
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
      ui.showAlert('Successful', 'alert alert-success');
    }
    console.log(data);
  })
  .catch(err => console.log(err));

  e.preventDefault();
}

function enableLogin(e) {
  ui.changeViewState('login');
  e.preventDefault();
}

function enableSignup(e) {
  ui.changeViewState('signup');
  e.preventDefault();
}