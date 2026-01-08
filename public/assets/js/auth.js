// auth.js - compartilhado pelas páginas de login e registro

const BASE = window.location.origin;

async function postJSON(url, body) {
    const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    return r;
}

/* ----------- LOGIN ----------- */

if (document.getElementById('loginForm')) {

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const f = e.target;
        const data = {
            email: f.email.value,
            senha: f.senha.value
        };

        const res = await postJSON(BASE + '/api/login', data);
        const json = await res.json();

        if (res.ok) {
            localStorage.setItem('token', json.token);
            window.location.href = '/index.html';
        } else {
            document.getElementById('authError').textContent =
                json.error || 'Erro ao fazer login';
        }
    });
}

/* ----------- REGISTER ----------- */

if (document.getElementById('registerForm')) {

    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const f = e.target;
        const data = {
            nome: f.nome.value,
            email: f.email.value,
            senha: f.senha.value
        };

        const res = await postJSON(BASE + '/api/register', data);
        const json = await res.json();

        if (res.ok) {
            localStorage.setItem('token', json.token);
            window.location.href = '/index.html';
        } else {
            document.getElementById('regError').textContent =
                json.error || 'Erro ao registrar usuário';
        }
    });
}
