import { fetchJSON } from "./api.js";

export function createElement(tagName, className){
    const elt = document.createElement(tagName);
    elt.classList.add(className);
    return elt;
}

export function destroySession(){
    const endpoint = 'http://localhost:8000/backend/back.php'
    document.querySelector('#destroy').addEventListener('click', () => {
        fetchJSON(endpoint + '?need=destroy', {method: 'GET'}).then(data => console.log(data));
    })
}

function createCell(value, type, target){
    const tdElt = createElement(type, 'operation__cell');
    tdElt.innerText = value;
    target.append(tdElt);
}

export function createDashboard(compte){
    const target = document.querySelector('.compte');
    const ctnElt = createElement('div', 'compte__ctn');
    const idElt = createElement('div', 'compte__id');
    idElt.innerText = `idCompte`;
    const spanLabelId = createElement('span', 'spanLabel');
    spanLabelId.innerText = compte.id;
    idElt.append(spanLabelId);

    const soldeElt = createElement('div', 'compte__solde');
    soldeElt.innerText = `Solde`;
    const spanLabelSolde = createElement('span', 'spanLabel');
    spanLabelSolde.innerText = `${compte.solde} €`;
    soldeElt.append(spanLabelSolde);

    const typeCompteElt = createElement('div', 'compte__type');
    typeCompteElt.innerText = 'Type';
    const spanType = createElement('span', 'spanLabel');
    spanType.innerText = compte.typeCompte;
    typeCompteElt.append(spanType);
    let txElt;
    if(compte.tx) {
        txElt = createElement('div', 'compte__tx');
        txElt.innerText = 'Découvert autorisé : ';
        const spanTx = createElement('span', 'spanLabel');
        spanTx.innerText = compte.tx + " €";
        txElt.append(spanTx);
    }

    ctnElt.append(idElt, soldeElt, typeCompteElt, txElt);

    const table = createElement('table', 'operation__table');

    const headElt = createElement('tr', 'operation__head');
    createCell('Id','th', headElt);
    createCell('Montant','th', headElt);
    createCell('Date','th', headElt);
    createCell('Type','th', headElt);
    createCell('Statut','th', headElt);
    table.append(headElt);

    let trElt;
    compte.operations.forEach(operation => {
        trElt = createElement('tr', 'operation__row');
        createCell(operation.id,"td",  trElt)
        createCell(operation.montant + " €","td",  trElt)
        createCell(operation.date,"td",  trElt)
        createCell(operation.type ? 'credit': 'debit',"td", trElt)
        createCell(operation.Accepted ? 'ok': 'rejected',"td", trElt)
        table.append(trElt)
    });

    const ctnTable = createElement('div', 'operation');
    ctnTable.append(table);
    target.append(ctnElt, ctnTable);
}


export function createTableComptes(comptes, target){
    const title = createElement('h1', 'title');
    title.innerText = 'Liste des comptes'
    const table = createElement('table', 'comptes__table');

    const headElt = createElement('tr', 'comptes__head');
    createCell('Id','th', headElt);
    createCell('Solde','th', headElt);
    createCell('Nb d\'opération','th', headElt);
    createCell('Type','th', headElt);
    createCell('Decouvert autorisé','th', headElt);
    table.append(headElt);

    comptes.forEach(compte => {
        let trElt = createElement('tr', 'compte__row');
        createCell(compte.id,"td",  trElt);
        createCell(compte.solde + " €","td",  trElt);
        createCell(compte.operations.length,"td",  trElt)
        createCell(compte.typeCompte,"td",  trElt)
        createCell(compte.tx === undefined ? 'aucun': compte.tx,"td",  trElt)
        table.append(trElt)
    })

    const ctnTable = createElement('div', 'comptes');
    ctnTable.append(table);
    target.append(title,ctnTable);
}

export function createTableOperations(operations, target){
    const title = createElement('h1', 'title');
    title.innerText = 'Liste des opérations'
    const table = createElement('table', 'operations__table');

    const headElt = createElement('tr', 'operations__head');
    createCell('Id','th', headElt);
    createCell('Montant','th', headElt);
    createCell('Date','th', headElt);
    createCell('Type','th', headElt);
    table.append(headElt);
    operations.forEach(operation => {
        let trElt = createElement('tr', 'operation__row');
        createCell(operation.id,"td",  trElt)
        createCell(operation.montant + " €","td",  trElt)
        createCell(operation.date,"td",  trElt)
        createCell(operation.type ? 'credit': 'debit',"td", trElt)
        table.append(trElt)
    })

    const ctnTable = createElement('div', 'operations');
    ctnTable.append(table);
    target.append(title,ctnTable);
}

export async function createSelectorCompte(target){
    const endpoint = "http://localhost:8000/backend/back.php?need=";

    const select = createElement('select', 'select-compte');
    select.setAttribute('name', 'comptes');
    const option = document.createElement('option');
    option.value = "";
    option.textContent = "Choisir votre numéro de compte";
    select.append(option);

    const comptes = await fetchJSON(endpoint + 'comptes', {method: 'GET'})

    comptes.forEach(compte => {
        const option = document.createElement('option');
        option.value = compte.id;
        option.textContent = compte.id;
        select.append(option);
    })
    const container = createElement('div', 'select-container');
    container.append(select, btnSelectionner())
    target.append(container);
}

function btnSelectionner(){
    const btn = createElement('button', 'btn-standard');
    btn.id = 'btnGetCompte'
    btn.textContent = "Selectionner";
    btn.addEventListener('click', sendIdToUrl);
    return btn;
}

function sendIdToUrl(){
    const id = document.querySelector('.select-compte').value;
    window.location.href = `./mycompte.html?id=${id}`;
}

export function disableBtn(target){
    target.disabled = true;
}
export function enableBtn(target){
    target.disabled = false;
}

export function addTxInput(target){
    const ctn = createElement('div', 'inscription__form-group');
    const label = document.createElement('label');
    label.setAttribute('for', 'taux');
    label.innerText = 'Montant du découvert';
    const input = document.createElement('input');
    input.id = 'taux';
    input.setAttribute('type', 'text');
    input.setAttribute('required', 'true');
    ctn.append(label, input);
    target.after(ctn);
}