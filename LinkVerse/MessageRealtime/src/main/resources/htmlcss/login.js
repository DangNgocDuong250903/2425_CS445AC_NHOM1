'use strict';

var loginForm = document.querySelector('#loginForm');

function login(event) {
    var loginUsername = document.querySelector('#username').value.trim();
    var loginPassword = document.querySelector('#password').value.trim();

    if (loginUsername && loginPassword) {
        // Simulate login and token retrieval
        var token = 'dummy-token'; // Replace with actual token retrieval logic
        localStorage.setItem('token', token);

        window.location.href = '/index.html';
    }

    event.preventDefault();
}

loginForm.addEventListener('submit', login, true);