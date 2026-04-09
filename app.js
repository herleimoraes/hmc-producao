// app.js

const formulario = document.getElementById('meuFormulario');
const btnEnviar = document.getElementById('btnEnviar');
const textoBtn = document.getElementById('textoBtn');
const iconEnviar = document.getElementById('iconEnviar');
const alertaMensagem = document.getElementById('alertaMensagem');

// COLE AQUI A SUA URL DO WEB APP
const URL_BACKEND = 'https://script.google.com/macros/s/AKfycbweeQEbjMJsWXhcRJ0yI-wsMCMOU8Q3JlqJ1yFrWRFDGJzcQLehSrAHip09FzL_G2ah/exec'; 

formulario.addEventListener('submit', async function(event) {
    event.preventDefault(); 

    // Coleta os novos dados do Controle de Produção
    const dados = {
        cliente: document.getElementById('cliente').value,
        modelo: document.getElementById('modeloTenda').value,
        quantidade: document.getElementById('quantidade').value
    };

    // UX: Botão processando
    btnEnviar.disabled = true;
    textoBtn.innerText = 'Registrando...';
    iconEnviar.className = 'fa-solid fa-spinner fa-spin me-2'; 
    alertaMensagem.classList.add('d-none');
    alertaMensagem.classList.remove('alert-success', 'alert-danger');

    try {
        const resposta = await fetch(URL_BACKEND, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (resposta.ok && resultado.status === 'sucesso') {
            
            // Exibe mensagem rápida de sucesso
            alertaMensagem.innerHTML = '<i class="fa-solid fa-circle-check me-1"></i> Ordem gerada!';
            alertaMensagem.classList.add('alert-success');
            alertaMensagem.classList.remove('d-none');
            
            formulario.reset(); 

            // Fecha o Modal automaticamente após 1 segundo e meio
            setTimeout(() => {
                const modalElement = document.getElementById('modalNovaOrdem');
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                modalInstance.hide();
                alertaMensagem.classList.add('d-none'); // Esconde o alerta para a próxima vez
            }, 1500);

        } else {
            throw new Error(resultado.erro || 'Erro ao comunicar com a planilha');
        }

    } catch (erro) {
        console.error('Falha:', erro);
        alertaMensagem.innerHTML = '<i class="fa-solid fa-triangle-exclamation me-1"></i> Erro ao salvar.';
        alertaMensagem.classList.add('alert-danger');
        alertaMensagem.classList.remove('d-none');
    } finally {
        // Restaura botão
        btnEnviar.disabled = false;
        textoBtn.innerText = 'Gerar Ordem de Produção';
        iconEnviar.className = 'fa-solid fa-paper-plane me-2';
    }
});
