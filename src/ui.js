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
            document.querySelector('.qa-action').style.display = 'none';
            document.querySelector('#qa').style.display = 'none';
            document.querySelector('#project-qas').style.display = 'none';
            document.querySelector('.dev-action').style.display = 'none';
            document.querySelector('.login-holder').style.display = 'block';
            this.signupLink.style.display = 'inline';
        } else if(currentState === 'signup') {
            document.querySelector('#dev').style.display = 'none';
            document.querySelector('.add-project').style.display = 'none';
            this.logoutLink.style.display = 'none';
            document.querySelector('.login-holder').style.display = 'none';
            this.signupLink.style.display = 'none';
            document.querySelector('#qa').style.display = 'none';
            document.querySelector('.qa-action').style.display = 'none';
            document.querySelector('#project-qas').style.display = 'none';
            document.querySelector('.dev-action').style.display = 'none';
            document.querySelector('.signup-holder').style.display = 'block';
            this.loginLink.style.display = 'inline';
        } else if(currentState === 'loggedIn' && user.role === 'developer' && localStorage.getItem('actionState') === null) {
            document.querySelector('#welcomeText').textContent = `Howdy! ${user.name}, you are logged in as a ${user.role}.`;
            document.querySelector('.signup-holder').style.display = 'none';
            document.querySelector('.login-holder').style.display = 'none';
            this.loginLink.style.display = 'none';
            this.signupLink.style.display = 'none';
            document.querySelector('.login-holder').style.display = 'none';
            document.querySelector('.signup-holder').style.display = 'none';
            this.signupLink.style.display = 'none';
            this.loginLink.style.display = 'none';
            document.querySelector('#qa').style.display = 'none';
            document.querySelector('.qa-action').style.display = 'none';
            document.querySelector('#project-qas').style.display = 'none';
            document.querySelector('.dev-action').style.display = 'none';

            document.querySelector('.add-project').style.display = 'block';
            this.logoutLink.style.display = 'inline';
            document.querySelector('#dev').style.display = 'block';
        } else if(currentState === 'loggedIn' && user.role === 'qa_person' && localStorage.getItem('actionState') === null) {
            document.querySelector('#welcomeText').textContent = `Howdy! ${user.name}, you are logged in as a ${user.role}.`;
            document.querySelector('.signup-holder').style.display = 'none';
            document.querySelector('.login-holder').style.display = 'none';
            this.loginLink.style.display = 'none';
            this.signupLink.style.display = 'none';
            document.querySelector('.login-holder').style.display = 'none';
            document.querySelector('.signup-holder').style.display = 'none';
            this.signupLink.style.display = 'none';
            this.loginLink.style.display = 'none';
            document.querySelector('.add-project').style.display = 'none';
            document.querySelector('#dev').style.display = 'none';
            document.querySelector('.qa-action').style.display = 'none';
            document.querySelector('#project-qas').style.display = 'none';
            document.querySelector('.dev-action').style.display = 'none';

            document.querySelector('#qa').style.display = 'block';
            this.logoutLink.style.display = 'inline';
        } else if (currentState === 'loggedIn' && user.role === 'qa_person' && localStorage.getItem('actionState') === 'qa-project-details') {
            document.querySelector('#welcomeText').textContent = `Howdy! ${user.name}, you are logged in as a ${user.role}.`;
            document.querySelector('.signup-holder').style.display = 'none';
            document.querySelector('.login-holder').style.display = 'none';
            this.loginLink.style.display = 'none';
            this.signupLink.style.display = 'none';
            document.querySelector('.login-holder').style.display = 'none';
            document.querySelector('.signup-holder').style.display = 'none';
            this.signupLink.style.display = 'none';
            this.loginLink.style.display = 'none';
            document.querySelector('.add-project').style.display = 'none';
            document.querySelector('#dev').style.display = 'none';
            document.querySelector('.dev-action').style.display = 'none';

            document.querySelector('#qa').style.display = 'none';
            this.logoutLink.style.display = 'inline';
            document.querySelector('.qa-action').style.display = 'block';
            document.querySelector('#project-qas').style.display = 'block';

            this.displayProjectDetails();
        } else if (currentState === 'loggedIn' && user.role === 'developer' && localStorage.getItem('actionState') === 'dev-project-details') {
            document.querySelector('#welcomeText').textContent = `Howdy! ${user.name}, you are logged in as a ${user.role}.`;
            document.querySelector('.signup-holder').style.display = 'none';
            document.querySelector('.login-holder').style.display = 'none';
            this.loginLink.style.display = 'none';
            this.signupLink.style.display = 'none';
            document.querySelector('.login-holder').style.display = 'none';
            document.querySelector('.signup-holder').style.display = 'none';
            this.signupLink.style.display = 'none';
            this.loginLink.style.display = 'none';
            document.querySelector('.add-project').style.display = 'none';
            document.querySelector('#dev').style.display = 'none';

            document.querySelector('#qa').style.display = 'none';
            this.logoutLink.style.display = 'inline';
            document.querySelector('.qa-action').style.display = 'none';
            document.querySelector('.dev-action').style.display = 'block';
            document.querySelector('#project-qas').style.display = 'block';

            this.displayProjectDetails();
        }

    }

    displayUserProjects(projects) {
        let output = '';

        if(projects.projects.length > 0) {
            projects.projects.forEach(project => {
                output += `
                    <tr class="qa-item" id="${project.id}">
                        <td>${project.project_name}</td>
                        <td>${project.project_url}</td>
                        <td>${project.status}</td>
                    </tr>
                `;
            });
        }else {
            output = '';
        }

        document.querySelector('.dev-projects').innerHTML = output;
    }

    displayQaProjects(projects) {
        let output = '';

        if(projects.projects.length > 0) {
            projects.projects.forEach(project => {
                output += `
                    <tr class="qa-item" id="${project.id}">
                        <td>${project.project_name}</td>
                        <td>${project.project_url}</td>
                        <td>${project.status}</td>
                        <td>QA</td>
                    </tr>
                `;
            });
        }else {
            output = '';
        }

        document.querySelector('.qa-projects').innerHTML = output;
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

    displayProjectDetails() {
        const user = JSON.parse(localStorage.getItem('user'));
        const project = JSON.parse(localStorage.getItem('currentProject'));

        if(user.role === 'qa_person'){
            document.querySelector('.project-title').textContent = project[0].project_name;
            document.querySelector('.project-url').textContent = project[0].project_url;
            document.querySelector('.project-status').textContent = project[0].status;

            if(project[0].status === 'pending') {
                document.querySelector('.keepPendingBtn').style.display = 'none';
                document.querySelector('.passedBtn').style.display = 'block';
            } else {
                document.querySelector('.keepPendingBtn').style.display = 'block';
                document.querySelector('.passedBtn').style.display = 'none';
            }

            this.displayProjectQas(project);
        } else {
            document.querySelector('.dev-project-title').textContent = project[0].project_name;
            document.querySelector('.dev-project-url').textContent = project[0].project_url;
            document.querySelector('.dev-project-status').textContent = project[0].status;
            this.displayProjectQasWithActionBtn(project);
        }

    }

    displayProjectQasWithActionBtn(project) {
        let output = '';

        if(project[0].qas.length > 0) {
            project[0].qas.forEach((qa) => {
                output += `
                    <tr class="project-qa" id="${qa.id}">
                        <td>${qa.qa_url}</td>
                        <td>${qa.qa_comment}</td>
                        <td>${qa.qa_media}</td>
                        <td>${qa.developer_comment}</td>
                        <td>${qa.status}</td>
                        <td>
                            <textarea id="dev-qa-comment-${qa.id}" style="resize: none;" placeholder="Developer Comment" class="form-control"></textarea>
                            <button class="btn btn-danger decline-btn decline-${qa.id}">Decline QA</button
                        </td>
                        <td>
                            <button class="btn btn-success done-btn done-${qa.id}">Done</button>
                        </td>
                    </tr>
                `;
            });
        }

        document.querySelector('.project-qas').innerHTML = output;
    }

    displayProjectQas(project){
        let output = '';

        if(project[0].qas.length > 0) {
            project[0].qas.forEach((qa) => {
                output += `
                    <tr class="project-qa" id="${qa.id}">
                        <td>${qa.qa_url}</td>
                        <td>${qa.qa_comment}</td>
                        <td>${qa.qa_media}</td>
                        <td>${qa.developer_comment}</td>
                        <td>${qa.status}</td>
                        <td></td>
                    </tr>
                `;
            });
        }

        document.querySelector('.project-qas').innerHTML = output;
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

    addviewState(state, value) {
        localStorage.setItem(state, value);
        this.displayProjectDetails();
        this.initiateState();
    }

    clearSubmitProjectFields() {
        document.querySelector('#project-name').value = '';
        document.querySelector('#project-url').value = '';
    }
}

export const ui = new UI();