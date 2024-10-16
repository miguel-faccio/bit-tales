function logout() {
    localStorage.removeItem('access_token');
    window.location.href = '/';
}

document.getElementById('logout-button').addEventListener('click', logout);
