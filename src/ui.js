class UI {
    constructor() {
        this.name = document.querySelector('#name');
        this.email = document.querySelector('#email');
        this.password = document.querySelector('#password');
        this.role = document.querySelector('#role');
        this.accessCode = document.querySelector('#access-code');
        this.addAccountBtn = document.querySelector('.add-account');
        this.loginLink = document.querySelector('#login-link');
        this.signupLink = document.querySelector('#signup-link');
        this.logoutLink = document.querySelector('#logout-link');
    }

    initiateState(){
        const currentState = localStorage.getItem('state');
        const user = JSON.parse(localStorage.getItem('user'));

        if(currentState === 'login'){
            document.querySelector('#dev').style.display = 'none';
            document.querySelector('.add-project').style.display = 'none';
            this.logoutLink.style.display = 'none';
            document.querySelector('.signup-holder').style.display = 'none';
            this.loginLink.style.display = 'none';
            document.querySelector('.login-holder').style.display = 'block';
            this.signupLink.style.display = 'inline';
        } else if(currentState === 'signup') {
            document.querySelector('#dev').style.display = 'none';
            document.querySelector('.add-project').style.display = 'none';
            this.logoutLink.style.display = 'none';
            document.querySelector('.login-holder').style.display = 'none';
            this.signupLink.style.display = 'none';
            document.querySelector('.signup-holder').style.display = 'block';
            this.loginLink.style.display = 'inline';
        } else if(currentState === 'loggedIn' && user.role === 'developer') {
            document.querySelector('.signup-holder').style.display = 'none';
            document.querySelector('.login-holder').style.display = 'none';
            this.loginLink.style.display = 'none';
            this.signupLink.style.display = 'none';
            document.querySelector('.login-holder').style.display = 'none';
            document.querySelector('.signup-holder').style.display = 'none';
            this.signupLink.style.display = 'none';
            this.loginLink.style.display = 'none';

            document.querySelector('.add-project').style.display = 'block';
            this.logoutLink.style.display = 'inline';
            document.querySelector('#dev').style.display = 'block';
        } else if(currentState === 'loggedIn' && user.role === 'qa_person') {

        }

    }

    displayProjects(projects) {
        let output = '';
        projects.projects.forEach(project => {
            output += `
                <tr>
                    <td>${project.project_name}</td>
                    <td>${project.project_url}</td>
                    <td>${project.status}</td>
                </tr>
            `
        });

        document.querySelector('.dev-projects').innerHTML = output;
    }

    showAlert(msg, alertClass) {
        const div = document.createElement('div');
        div.className = alertClass
        div.appendChild(document.createTextNode(msg));

        const container = document.querySelector('.viewContainer');
        const card = document.querySelector('.card-form');

        container.insertBefore(div, card);

        setTimeout(() => {
            this.clearAlert();
        }, 4000);
    }

    clearAlert() {
        const currentAlert = document.querySelector('.alert');

        if(currentAlert){
            currentAlert.remove();
        }
    }

    changeViewState(newState) {
        if(localStorage.getItem('state') === null){
            localStorage.setItem('state', newState);
        } else {
            localStorage.removeItem('state');
            localStorage.setItem('state', newState);
        }

        this.initiateState();
    }

    clearSubmitProjectFields() {
        document.querySelector('#project-name').value = '';
        document.querySelector('#project-url').value = '';
    }
}

export const ui = new UI();