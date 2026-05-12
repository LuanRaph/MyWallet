const API = "http://localhost:4000";
function dark_mode() {
    let tema = document.querySelector("html").getAttribute("data-bs-theme");
    let icon = document.getElementById("icon_mode");
    if (tema === "light") {
        document.querySelector("html").setAttribute("data-bs-theme", "dark");
        icon.classList.remove("bi-moon-stars-fill");
        icon.classList.add("bi-brightness-high-fill");
    } else {
        document.querySelector("html").setAttribute("data-bs-theme", "light");
        icon.classList.remove("bi-brightness-high-fill");
        icon.classList.add("bi-moon-stars-fill");
    }
}

function MostrarLogin() {
    document.getElementById("form-login").classList.remove("d-none");
    document.getElementById("form-cadastro").classList.add("d-none");
};

function MostrarCadastro() {
    document.getElementById("form-cadastro").classList.remove("d-none");
    document.getElementById("form-login").classList.add("d-none");
};

async function login() {
    const email = document.getElementById("login-email").value;
    const senha = document.getElementById("login-senha").value;
    const erro = document.getElementById("erro-login");

    try {
        const res = await fetch(`${API}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ email, senha })
        });
        const data = await res.json();
        if (!res.ok) {
            erro.textContent = data.erro;
            erro.classList.remove("d-none");
            return;
        }
        localStorage.setItem('token', data.token);
        localStorage.setItem('nome', data.nome);
        window.location.href = 'index.html';
    } catch (err) {
        erro.textContent = 'Erro ao conectar. Tente novamente';
        erro.classList.remove("d-none");
    }
}

async function cadastro() {
    const nome = document.getElementById('cad-nome').value;
    const email = document.getElementById('cad-email').value;
    const senha = document.getElementById('cad-senha').value;
    const erro = document.getElementById('erro-cadastro');

    try {
        const res = await fetch(`${API}/cadastro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });

        const data = await res.json();

        if (!res.ok) {
            erro.textContent = data.erro;
            erro.classList.remove('d-none');
            return;
        }

        alert('Conta criada! Faça login.');
        MostrarLogin();

    } catch (err) {
        erro.textContent = 'Erro ao conectar. Tente novamente!';
        erro.classList.remove('d-none');
    }
}