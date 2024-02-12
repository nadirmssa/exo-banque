import { fetchJSON } from "./functions/api.js";
import { createDashboard, createElement, createSelectorCompte, destroySession, disableBtn, enableBtn } from "./functions/dom.js";
import { addIdCompteToForm, getFormOp } from "./functions/operations.js";
const endpoint = 'http://localhost:8000/backend/back.php'
const query = window.location.search;
const urlParams = new URLSearchParams(query);
const id = urlParams.get('id');
const target = document.querySelector('.section__hero');

if (id) {
    enableBtn(document.querySelector('.add-operation'));
    const titleCompte = createElement('div', 'compte__title');
    titleCompte.innerText = `Bienvenu dans notre banque`;
    target.prepend(titleCompte);
    const compte = await fetchJSON(endpoint + "?compte=show", {
        method: "POST",
        body: JSON.stringify({ "id": id })
    })
    console.log(compte);
    createDashboard(compte);
    addIdCompteToForm(id);

    let formAddOperation;
    if(document.querySelector('#form_add-operation')){
        formAddOperation = document.querySelector('#form_add-operation');
        formAddOperation.addEventListener('submit', (e) => {
            e.preventDefault();
            const bodyReq = getFormOp(e);
            fetchJSON(endpoint + "?op", {
                method: "PATCH",
                body: JSON.stringify(bodyReq)
            }).then(data => console.log(data))
            location.reload();
        });
    }
} else {
    disableBtn(document.querySelector('.add-operation'))
    const titleCompte = createElement('div', 'compte__title');
    titleCompte.innerText = `Selectionner un compte ci-dessous`;
    target.prepend(titleCompte);
    createSelectorCompte(document.querySelector('.compte'));
}

destroySession();
