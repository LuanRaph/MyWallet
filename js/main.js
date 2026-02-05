let transacoes = JSON.parse(localStorage.getItem('my_wallet_data')) || [];
let s_valor_e = 0
let s_valor_s = 0
let saldo_valor = 0
let id_c = 0


function grafico() {
    const ctx = document.getElementById("graficoCanvas");

    if (!ctx) return;


    if (window.grfc instanceof Chart) {
        window.grfc.destroy();
    }

    window.grfc = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Entradas', 'Saidas'],
            datasets: [{
                data: [s_valor_e, s_valor_s],
                backgroundColor: ["#10ad10", "#b30f0f"],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function editar(id) {
    let transacao = transacoes.find(t => t.id === id);
    if (!transacao) return;
    let linha = document.getElementById(`linha-${id}`);
    linha.innerHTML = `
    <td><input id="edit_desc_${id}" class="form-control" placeholder="Edite descrição" value="${transacao.descricao}" type="text"></td>
    <td><input id="edit_val_${id}" type="number" placeholder="Edite o valor" value="${transacao.valor}" class="form-control"></td>
    <td><input id="edit_data_${id}" type="date" class="form-control" value="${transacao.data}"></td>
    <td class="d-flex justify-content-center gap-2">
        <button class="btn btn-success btn-sm" onclick="salvarEdicao(${id})">
            <i class="bi bi-check"></i>
        </button>
        <button class="btn btn-secondary btn-sm" onclick="cancelarEdicao(${id})">
            <i class="bi bi-x"></i>
        </button>
        </td>
    
    `;
}



function salvarEdicao(id) {
    let trans = transacoes.find(t => t.id === id);

    trans.descricao = document.getElementById(`edit_desc_${id}`).value;
    trans.valor = parseFloat(document.getElementById(`edit_val_${id}`).value);
    trans.data = document.getElementById(`edit_data_${id}`).value;

    localStorage.setItem('my_wallet_data', JSON.stringify(transacoes));
    atualizarTabela();
}


function cancelarEdicao(id) {
    atualizarTabela();
}



function excluir(id) {
    transacoes = transacoes.filter(t => t.id !== id);
    localStorage.setItem('my_wallet_data', JSON.stringify(transacoes));
    atualizarTabela();
}


function atualizarTabela() {
    let dado = document.getElementById("b-card");
    dado.innerHTML = "";
    s_valor_s = 0
    s_valor_e = 0
    saldo_valor = 0
    id_c = 0
    transacoes.map((trans) => {
        let tipo = ""
        if (trans.tipo === 'saida') {
            tipo = "-"
            s_valor_s += trans.valor
            saida_valor = document.getElementById("s-saida")
            saida_valor.innerHTML = `
            <h2>R$ ${s_valor_s}</h2>
            `
        }
        else {
            tipo = "+"
            s_valor_e += trans.valor
            s_entrada = document.getElementById("s-entrada")
            s_entrada.innerHTML = `
            <h2>R$ ${s_valor_e}</h2>
            `
        }
        saldo_valor = Math.max(s_valor_e - s_valor_s, 0)
        id_c += 1
        s_saldo = document.getElementById("saldo-total")
        s_saldo.innerHTML = `
        <h2>R$ ${saldo_valor}</h2>
        `
        dado.innerHTML += `
        <tr id="linha-${trans.id}">
            <td id="edit_desc_${trans.id}">${trans.descricao}</td>
            <td id="edit_val_${trans.id}">${tipo} R$ ${trans.valor}</td>
            <td id="edit_data_${trans.id}">${trans.data}</td>
            <td class="d-flex justify-content-center">
                <button class="btn" onclick=excluir(${trans.id})>
                    <i class="bi bi-trash"></i>
                </button>
                <button class="btn" onclick="editar(${trans.id})">
                    <i class="bi bi-pencil-square"></i>
                    </button>
                    </td>
                    </tr>
        `
    });
    grafico();
};

function get(event) {
    event.preventDefault()
    let descricao = document.getElementById("desc").value;
    let valor = parseFloat(document.getElementById("val").value);
    let tipo = document.querySelector('input[name="option"]:checked').id;
    let data = document.getElementById("data").value;

    const dados = {
        descricao: descricao,
        valor: valor,
        tipo: tipo,
        data: data,
        id: id_c
    };

    transacoes.push(dados);
    localStorage.setItem('my_wallet_data', JSON.stringify(transacoes));
    atualizarTabela();
    console.log(transacoes)
    close()
}
function close() {
    let mElement = document.getElementById("exampleModal");
    let modal = bootstrap.Modal.getInstance(mElement);
    modal.hide();
}

window.addEventListener('load', () => {
    atualizarTabela();
    dark_mode()
});

function dark_mode () {
    let tema = document.querySelector("html").getAttribute("data-bs-theme");
    let icon = document.getElementById("icon_mode")
    if (tema === "light") {
        document.querySelector("html").setAttribute("data-bs-theme", "dark");
        icon.classList.remove("bi-moon-stars-fill");
        icon.classList.add("bi-brightness-high-fill");
        
    }
    else {
        document.querySelector("html").setAttribute("data-bs-theme", "light");
        icon.classList.remove("bi-brightness-high-fill");
        icon.classList.add("bi-moon-stars-fill");
    }
}
    


