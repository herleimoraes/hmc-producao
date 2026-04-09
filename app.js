// Registra o Service Worker para habilitar a instalação do PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service worker registrado com sucesso.'))
            .catch(err => console.log('Erro ao registrar service worker:', err));
    });
}

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

// ==========================================
// NAVEGAÇÃO DO RODAPÉ (SINGLE PAGE APP)
// ==========================================

// Seleciona todos os botões do rodapé e todas as páginas
const botoesMenu = document.querySelectorAll('.nav-item');
const paginas = document.querySelectorAll('.app-pagina');

// Onde está o seu código de NAVEGAÇÃO DO RODAPÉ (SINGLE PAGE APP)
botoesMenu.forEach(botao => {
    botao.addEventListener('click', function(event) {
        event.preventDefault(); 

        botoesMenu.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        paginas.forEach(p => p.classList.add('d-none'));

        const paginaAlvo = this.getAttribute('data-alvo');
        document.getElementById(paginaAlvo).classList.remove('d-none');

        // ======== ADICIONE ESTAS TRÊS LINHAS AQUI ========
        if (paginaAlvo === 'pagina-clientes') {
            carregarClientes();
        }
        // ==================================================
    });
});

// ==========================================
// CADASTRO DE CLIENTES
// ==========================================

const formNovoCliente = document.getElementById('formNovoCliente');
const btnSalvarCliente = document.getElementById('btnSalvarCliente');
const textoBtnCliente = document.getElementById('textoBtnCliente');
const iconSalvarCliente = document.getElementById('iconSalvarCliente');
const alertaCliente = document.getElementById('alertaCliente');

// Função que gera um código único tipo "CLI-X8B4"
function gerarCodigoCliente() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let sufixo = '';
    for (let i = 0; i < 4; i++) {
        sufixo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return 'CLI-' + sufixo;
}

formNovoCliente.addEventListener('submit', async function(event) {
    event.preventDefault(); 

    // Cria os campos automáticos
    const codigoGerado = gerarCodigoCliente();
    
    // Pega a data de hoje e já formata para o padrão brasileiro (DD/MM/YYYY)
    const dataAtual = new Date().toLocaleDateString('pt-BR');

    // Coleta todos os dados + a "ação" para o Apps Script saber o que fazer
    const payload = {
        acao: "salvar_cliente",
        dados: {
            codigo: codigoGerado,
            dataCadastro: dataAtual,
            ultimaAtualizacao: dataAtual,
            nome: document.getElementById('cliNome').value,
            telefone: document.getElementById('cliTelefone').value,
            documento: document.getElementById('cliDocumento').value,
            email: document.getElementById('cliEmail').value,
            endereco: document.getElementById('cliEndereco').value,
            observacoes: document.getElementById('cliObs').value
        }
    };

    // UX: Botão carregando
    btnSalvarCliente.disabled = true;
    textoBtnCliente.innerText = 'Salvando...';
    iconSalvarCliente.className = 'fa-solid fa-spinner fa-spin me-2'; 
    alertaCliente.classList.add('d-none');
    alertaCliente.classList.remove('alert-success', 'alert-danger');

    try {
        const resposta = await fetch(URL_BACKEND, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload)
        });

        const resultado = await resposta.json();

        if (resposta.ok && resultado.status === 'sucesso') {
            alertaCliente.innerHTML = `<i class="fa-solid fa-circle-check me-1"></i> Cliente ${codigoGerado} salvo!`;
            alertaCliente.classList.add('alert-success');
            alertaCliente.classList.remove('d-none');
            formNovoCliente.reset();
            carregarClientes();

            // Fecha o Modal automático
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalNovoCliente'));
                modal.hide();
                alertaCliente.classList.add('d-none');
            }, 2000);

        } else {
            throw new Error(resultado.erro);
        }

    } catch (erro) {
        alertaCliente.innerHTML = '<i class="fa-solid fa-triangle-exclamation me-1"></i> Erro ao salvar.';
        alertaCliente.classList.add('alert-danger');
        alertaCliente.classList.remove('d-none');
    } finally {
        btnSalvarCliente.disabled = false;
        textoBtnCliente.innerText = 'Salvar Cliente';
        iconSalvarCliente.className = 'fa-solid fa-floppy-disk me-2';
    }
});

// ==========================================
// MODO ESCURO (DARK MODE)
// ==========================================

const toggleModoEscuro = document.getElementById('toggleModoEscuro');

toggleModoEscuro.addEventListener('change', function() {
    if (this.checked) {
        // Se a chave for ligada, avisa o HTML para usar o tema escuro
        document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
        // Se desligada, volta pro claro
        document.documentElement.setAttribute('data-bs-theme', 'light');
    }
});

// ==========================================
// CARREGAR E LISTAR CLIENTES (COM PAGINAÇÃO)
// ==========================================

let todosClientes = []; // Vai guardar a lista completa
let paginaAtual = 1;
const clientesPorPagina = 8; // Limite que você escolheu

async function carregarClientes() {
    const divLista = document.getElementById('lista-clientes');
    const ulPaginacao = document.getElementById('paginacao-clientes');
    
    divLista.innerHTML = `
        <div class="text-center p-4">
            <i class="fa-solid fa-spinner fa-spin fa-2x text-primary mb-2"></i>
            <p class="text-secondary small">Carregando clientes...</p>
        </div>
    `;
    ulPaginacao.innerHTML = ''; // Esconde paginação durante o loading

    try {
        const resposta = await fetch(URL_BACKEND, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ acao: 'listar_clientes' })
        });

        const resultado = await resposta.json();

        if (resposta.ok && resultado.status === 'sucesso') {
            todosClientes = resultado.clientes; // Guarda tudo na memória
            paginaAtual = 1; // Sempre volta pra página 1 ao recarregar

            if (todosClientes.length === 0) {
                divLista.innerHTML = '<p class="text-center text-secondary small mt-3">Nenhum cliente cadastrado ainda.</p>';
                return;
            }

            renderizarClientes(); // Chama a função que desenha a página

        } else {
            throw new Error(resultado.erro);
        }
    } catch (erro) {
        console.error('Erro ao carregar clientes:', erro);
        divLista.innerHTML = '<p class="text-center text-danger small mt-3"><i class="fa-solid fa-triangle-exclamation me-1"></i> Erro ao carregar a lista.</p>';
    }
}

// Função que corta a lista e mostra apenas os 8 da página atual
function renderizarClientes() {
    const divLista = document.getElementById('lista-clientes');
    divLista.innerHTML = '';

    // Lógica matemática para cortar a lista
    const inicio = (paginaAtual - 1) * clientesPorPagina;
    const fim = inicio + clientesPorPagina;
    const clientesPagina = todosClientes.slice(inicio, fim);

    clientesPagina.forEach(cli => {
        const card = `
            <div class="card border-0 shadow-sm rounded-4 mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h6 class="fw-bold mb-0 text-truncate pe-2">${cli.nome}</h6>
                        <span class="badge bg-primary bg-opacity-10 text-primary border border-primary-subtle">${cli.codigo}</span>
                    </div>
                    <p class="text-secondary small mb-1"><i class="fa-brands fa-whatsapp me-2"></i>${cli.telefone || 'Sem telefone'}</p>
                    <p class="text-secondary small mb-0"><i class="fa-solid fa-location-dot me-2"></i>${cli.endereco || 'Não informado'}</p>
                </div>
            </div>
        `;
        divLista.innerHTML += card;
    });

    renderizarBotoesPaginacao();
}

// Função que desenha os botões (1, 2, 3, Anterior, Próximo)
function renderizarBotoesPaginacao() {
    const ulPaginacao = document.getElementById('paginacao-clientes');
    ulPaginacao.innerHTML = '';

    const totalPaginas = Math.ceil(todosClientes.length / clientesPorPagina);

    // Se tiver 8 ou menos clientes, nem mostra os botões
    if (totalPaginas <= 1) return;

    // Botão "Anterior"
    ulPaginacao.innerHTML += `
        <li class="page-item ${paginaAtual === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="event.preventDefault(); mudarPagina(${paginaAtual - 1})">
                <i class="fa-solid fa-chevron-left"></i>
            </a>
        </li>
    `;

    // Números das Páginas
    for (let i = 1; i <= totalPaginas; i++) {
        ulPaginacao.innerHTML += `
            <li class="page-item ${paginaAtual === i ? 'active' : ''}">
                <a class="page-link" href="#" onclick="event.preventDefault(); mudarPagina(${i})">${i}</a>
            </li>
        `;
    }

    // Botão "Próximo"
    ulPaginacao.innerHTML += `
        <li class="page-item ${paginaAtual === totalPaginas ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="event.preventDefault(); mudarPagina(${paginaAtual + 1})">
                <i class="fa-solid fa-chevron-right"></i>
            </a>
        </li>
    `;
}

// Função engatilhada quando você clica num botão de página
window.mudarPagina = function(novaPagina) {
    const totalPaginas = Math.ceil(todosClientes.length / clientesPorPagina);
    
    // Trava de segurança para não ir pra página que não existe
    if (novaPagina < 1 || novaPagina > totalPaginas) return;
    
    paginaAtual = novaPagina;
    renderizarClientes(); // Atualiza a tela
    
    // Opcional: Rola a tela de volta para o topo da lista suavemente
    document.getElementById('pagina-clientes').scrollIntoView({ behavior: 'smooth' });
};
