document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar o envio padrão do formulário
    const formData = new FormData(event.target);

    const loginData = new URLSearchParams();
    loginData.append('username', formData.get('username'));
    loginData.append('password', formData.get('password'));

    try {
        await fetch('/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: loginData
        });

        // Se o servidor redirecionar, o navegador irá automaticamente para a nova URL
        // Você pode opcionalmente adicionar uma mensagem de carregamento ou similar aqui

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Ocorreu um erro. Tente novamente mais tarde.');
    }
});
