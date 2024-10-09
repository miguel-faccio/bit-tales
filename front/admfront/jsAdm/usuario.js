function showAddForm() {
    document.getElementById("unidadeConsumidoraForm").classList.remove("d-none");
}

// Função para buscar as unidades consumidoras e preencher o select
document.addEventListener("DOMContentLoaded", function () {
    fetch('/api/unidades-consumidoras')
        .then(response => response.json())
        .then(data => {
            const unidadeConsumidoraSelect = document.getElementById('unidadeConsumidora');
            data.forEach(unidade => {
                const option = document.createElement('option');
                option.value = unidade.id;
                option.textContent = unidade.nome;
                unidadeConsumidoraSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao carregar as unidades consumidoras:', error));
});

// Função para enviar o formulário
document.getElementById("unidadeConsumidoraFormElement").addEventListener("submit", function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const unidadeConsumidoraId = document.getElementById("unidadeConsumidora").value;

    const data = {
        nome: nome,
        unidade_consumidora_id: unidadeConsumidoraId
    };

    fetch('/api/dependencias', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            alert('Cômodo salvo com sucesso!');
            location.reload();
        } else {
            alert('Erro ao salvar o cômodo');
        }
    })
    .catch(error => console.error('Erro ao salvar cômodo:', error));
});