document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar o envio padrão do formulário

    const formData = new FormData(event.target);
    const loginData = {
        username: formData.get('username'),
        password: formData.get('password')
    };

    try {
        const response = await fetch('/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(loginData)
        });

        if (response.ok) {
            const data = await response.json();

            // Armazenar o token no localStorage
            localStorage.setItem('access_token', data.access_token);

            // Redirecionar com base na categoria do usuário
            if (data.categoria === 3) {
                window.location.href = "/status"; // Usuário categoria 3
            } else {
                window.location.href = "/menu"; // Usuário comum
            }
        } else {
            // Exibir mensagem de erro
            alert('Credenciais inválidas. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Ocorreu um erro. Tente novamente mais tarde.');
    }
});
console.log(localStorage.getItem('access_token'));

