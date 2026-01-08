// clientes.js - usado por add-client.html
const BASE = window.location.origin;

function getToken() {
  return localStorage.getItem('token');
}

async function postJSON(url, data) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = 'Bearer ' + token;

  console.debug('POST', url, data, 'headers', headers);
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
  return res;
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('clienteForm');
  const errEl = document.getElementById('clienteError');
  const okEl = document.getElementById('clienteSuccess');

  if (!form) {
    console.error('clienteForm não encontrado na página');
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errEl.textContent = '';
    okEl.textContent = '';

    const nome = form.nome.value && form.nome.value.trim();
    if (!nome) {
      errEl.textContent = 'Nome é obrigatório';
      return;
    }

    const token = getToken();
    if (!token) {
      errEl.textContent = 'Você precisa estar logado';
      return;
    }

    try {
      const res = await postJSON(BASE + '/api/clientes', { nome });

      const text = await res.text();
      let body;
      try { body = JSON.parse(text); } catch (e) { body = { raw: text }; }

      console.debug('Resposta /api/clientes', res.status, body);

      if (res.ok) {
        okEl.textContent = 'Cliente criado com sucesso';
        form.reset();

        // opcional: voltar para o dashboard automaticamente
        setTimeout(() => {
          window.location.href = '/index.html';
        }, 800);
      } else if (res.status === 401 || res.status === 403) {
        errEl.textContent = body.error || 'Não autorizado (token inválido). Faça login novamente.';
      } else {
        errEl.textContent = body.error || JSON.stringify(body) || 'Erro ao criar cliente';
      }
    } catch (err) {
      console.error('Erro na fetch:', err);
      errEl.textContent = 'Erro de conexão com o servidor';
    }
  });
});
