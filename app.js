// app.js

const formulario = document.getElementById('meuFormulario');
const btnEnviar = document.getElementById('btnEnviar');
const textoBtn = document.getElementById('textoBtn');
const iconEnviar = document.getElementById('iconEnviar');
const alertaMensagem = document.getElementById('alertaMensagem');

// IMPORTANTE: Cole aqui a URL do seu App da Web do Google Apps Script
const URL_BACKEND = 'https://script.google.com/macros/s/AKfycbweeQEbjMJsWXhcRJ0yI-wsMCMOU8Q3JlqJ1yFrWRFDGJzcQLehSrAHip09FzL_G2ah/exec'; 

formulario.addEventListener('submit', async function(event) {
    event.preventDefault(); 

    // Coleta os dados
    const dados = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value
    };

    // UX: Altera o estado do botão para "Carregando"
    btnEnviar.disabled = true;
    textoBtn.innerText = 'Processando...';
    iconEnviar.className = 'fa-solid fa-spinner fa-spin me-2'; 
    
    // Esconde alertas anteriores
    alertaMensagem.classList.add('d-none');
    alertaMensagem.classList.remove('alert-success', 'alert-danger');

    try {
        // Dispara os dados para o Apps Script
        const resposta = await fetch(URL_BACKEND, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8' // Mantemos o macete do CORS
            },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (resposta.ok && resultado.status === 'sucesso') {
            // Feedback de Sucesso
            alertaMensagem.innerHTML = '<i class="fa-solid fa-circle-check me-2"></i>Registrado com sucesso!';
            alertaMensagem.classList.add('alert-success');
            alertaMensagem.classList.remove('d-none');
            formulario.reset(); // Limpa os campos
        } else {
            throw new Error(resultado.erro || 'Erro ao comunicar com a planilha');
        }

    } catch (erro) {
        // Feedback de Erro
        console.error('Falha:', erro);
        alertaMensagem.innerHTML = '<i class="fa-solid fa-triangle-exclamation me-2"></i><strong>Erro:</strong> Não foi possível salvar.';
        alertaMensagem.classList.add('alert-danger');
        alertaMensagem.classList.remove('d-none');
    } finally {
        // UX: Restaura o botão ao estado original
        btnEnviar.disabled = false;
        textoBtn.innerText = 'Salvar Dados';
        iconEnviar.className = 'fa-solid fa-paper-plane me-2';
    }
});
