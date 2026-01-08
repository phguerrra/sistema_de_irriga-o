const BASE = window.location.origin;
const token = localStorage.getItem("token");

if (!token) window.location.href = "/login.html";

function $(x) { return document.getElementById(x); }

async function loadClientes() {
    const res = await fetch(BASE + "/api/clientes", {
        headers: { Authorization: "Bearer " + token }
    });

    const clientes = await res.json();

    $("clientList").innerHTML = clientes.map(c => `
        <div class="card" style="margin-top:10px;">
            <strong>${c.nome}</strong>
            <div style="margin-top:10px;">
                <button class="btn btn-accent" onclick="editCliente(${c.id}, '${c.nome}')">Editar</button>
                <button class="btn btn-danger" onclick="delCliente(${c.id})">Excluir</button>
            </div>
        </div>
    `).join("");
}

async function addCliente() {
    const nome = prompt("Nome do cliente:");
    if (!nome) return;

    await fetch(BASE + "/api/clientes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
        },
        body: JSON.stringify({ nome })
    });

    loadClientes();
}

async function editCliente(id, old) {
    const nome = prompt("Novo nome:", old);
    if (!nome) return;

    await fetch(BASE + `/api/clientes/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
        },
        body: JSON.stringify({ nome })
    });

    loadClientes();
}

async function delCliente(id) {
    if (!confirm("Tem certeza?")) return;

    await fetch(BASE + `/api/clientes/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token }
    });

    loadClientes();
}

loadClientes();
