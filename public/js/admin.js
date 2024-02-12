import { fetchJSON } from "./functions/api.js";
import { createTableComptes, createTableOperations } from "./functions/dom.js";

const target = document.querySelector('.dashboard');
const endpoint = "http://localhost:8000/backend/back.php?need=";

let btnComptes;
if(document.querySelector('#btnComptes')){
    btnComptes = document.querySelector('#btnComptes');
    btnComptes.addEventListener('click', async (e) => {
        let btn = e.currentTarget;
        btn.classList.add('active');
        document.querySelector('#btnOperations').classList.remove('active');
        const comptes = await fetchJSON(endpoint + 'comptes', {method: 'GET'})
        target.innerHTML = ' ';
        createTableComptes(comptes, target);
    })
}

let btnOperations;
if(document.querySelector('#btnOperations')){
    btnOperations = document.querySelector('#btnOperations');
    btnOperations.addEventListener('click', async (e) => {
        let btn = e.currentTarget;
        btn.classList.add('active');
        document.querySelector('#btnComptes').classList.remove('active');
        const operations = await fetchJSON(endpoint + 'operations', {method: 'GET'})
        target.innerHTML = ' ';
        createTableOperations(operations, target);
    })
}