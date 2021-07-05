class UI {
    constructor() {
        this.name = document.querySelector('#name');
        this.email = document.querySelector('#email');
        this.password = document.querySelector('#password');
        this.role = document.querySelector('#role');
        this.accessCode = document.querySelector('#access-code');
        this.addAccountBtn = document.querySelector('.add-account');
        this.viewState = 'signup';
        this.loginLink = document.querySelector('#login-link');
        this.signupLink = document.querySelector('#signup-link');
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
        if(newState === 'login') {
            document.querySelector('.signup-holder').style.display = 'none';
            document.querySelector('.login-holder').style.display = 'block';
            this.loginLink.style.display = 'none';
            this.signupLink.style.display = 'inline';
        } else {
            document.querySelector('.login-holder').style.display = 'none';
            document.querySelector('.signup-holder').style.display = 'block';
            this.signupLink.style.display = 'none';
            this.loginLink.style.display = 'inline';
        }
    }
}

export const ui = new UI();