import { fetchJSON } from "./functions/api.js";
import { addTxInput, destroySession } from "./functions/dom.js";

const endpoint = 'http://localhost:8000/backend/back.php'


document.querySelector('#typeCompte').addEventListener('change', () => {
    if(document.querySelector('#typeCompte').value === 'courant') {
        addTxInput(document.querySelector('.type'));
    }
})

const createCompte = async (e) => {
    e.preventDefault();
    let tx = undefined;
    const typeCompte = document.querySelector('#typeCompte').value;
    if(typeCompte === 'courant') {
        tx = +(document.querySelector('#taux').value)
    }
    const montant = +(document.querySelector('#montant').value);
    //create compte
    const rep = await fetchJSON(endpoint, {
        method: "POST",
        body: JSON.stringify(
            {
                "montant":montant,
                "type": typeCompte,
                "tx": tx
            }
        )
    })
    window.location.href = `./mycompte.html?id=${rep.id}`;
}

document.querySelector('form').addEventListener('submit', createCompte);

destroySession();
