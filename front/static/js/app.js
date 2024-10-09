async function connectToAPI(){
    const apiUrl = 'http://localhost:8000';
    try {
        const response = await fetch(apiUrl);
        if (response.ok) {
            const now = new Date();
            document.getElementById('status').innerText = `Conectado à API BitTales em ${now}`;
        } else {
            document.getElementById('status').innerText = `Falha na conexão: ${response.statusText}`;
        }
    } catch (error) {
        document.getElementById('status').innerText = `Erro ao tentar conectar: ${error.message}`;
    }

}
window.onload = connectToAPI;
