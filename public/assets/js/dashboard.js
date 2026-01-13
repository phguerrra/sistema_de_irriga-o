const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/";
}

let mangueiraSelecionada = null;

// ================================
// LOGOUT
// ================================
function logout() {
  localStorage.removeItem("token");
  window.location.href = "/";
}

// ================================
// CARREGAR MANGUEIRAS
// ================================
async function carregarMangueiras() {
  const res = await fetch("/api/mangueiras", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const mangueiras = await res.json();
  const lista = document.getElementById("lista-mangueiras");
  lista.innerHTML = "";

  mangueiras.forEach(m => {
    const div = document.createElement("div");
    div.className = "mangueira-item";
    div.innerText = m.nome;

    div.onclick = () => selecionarMangueira(m);
    lista.appendChild(div);
  });
}

// ================================
// SELECIONAR MANGUEIRA
// ================================
function selecionarMangueira(m) {
  mangueiraSelecionada = m;
  document.getElementById("welcome").innerText = m.nome;

  carregarStatus();
  carregarHistorico();
}

// ================================
// STATUS ATUAL (COM SENSOR)
// ================================
async function carregarStatus() {
  const res = await fetch(`/api/status/${mangueiraSelecionada.id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const status = await res.json();

  document.getElementById("hoseStatus").innerHTML = `
  <p><strong>Status:</strong> ${status.status}</p>
  <p><strong>Sensor:</strong> ${status.sensorStatus}</p>

  <button class="btn btn-accent" onclick="ligar()">Ligar</button>
  <button class="btn btn-danger" onclick="desligar()">Desligar</button>
`;

}

// ================================
// HISTÓRICO
// ================================
async function carregarHistorico() {
  const res = await fetch(
    `/api/mangueiras/${mangueiraSelecionada.id}/historico`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const historico = await res.json();
  const div = document.getElementById("historico");
  div.innerHTML = "";

  if (!historico.length) {
    div.innerHTML = "<p>Nenhum histórico.</p>";
    return;
  }

  historico.forEach(h => {
    const ligado = h.ligadoEm
      ? new Date(h.ligadoEm).toLocaleString()
      : "—";

    const desligado =
      h.desligadoEm !== null
        ? new Date(h.desligadoEm).toLocaleString()
        : "—";

    const tempo =
      h.tempoLigado !== null
        ? `${h.tempoLigado} segundos`
        : "—";

    const item = document.createElement("div");
    item.className = "historico-item";
    item.innerHTML = `
      <p>
        <strong>Ligado:</strong> ${ligado}<br>
        <strong>Desligado:</strong> ${desligado}<br>
        <strong>Tempo:</strong> ${tempo}
      </p>
    `;

    div.appendChild(item);
  });
}

// ================================
// LIGAR / DESLIGAR
// ================================
async function ligar() {
  await fetch(`/on/${mangueiraSelecionada.id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  setTimeout(carregarStatus, 500);
  setTimeout(carregarHistorico, 1000);
}

async function desligar() {
  await fetch(`/off/${mangueiraSelecionada.id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  setTimeout(carregarStatus, 500);
  setTimeout(carregarHistorico, 1000);
}

// ================================
// MODAL ADICIONAR MANGUEIRA
// ================================
document.getElementById("addHoseBtn").onclick = () => {
  document.getElementById("addModal").style.display = "flex";
};

document.getElementById("closeAdd").onclick = () => {
  document.getElementById("addModal").style.display = "none";
};

document.getElementById("addHoseForm").onsubmit = async e => {
  e.preventDefault();

  const nome = e.target.nome.value;

  await fetch("/api/mangueiras", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ nome })
  });

  document.getElementById("addModal").style.display = "none";
  carregarMangueiras();
};

// ================================
// INIT
// ================================
carregarMangueiras();
