export function getFormOp(event){
    event.preventDefault();
    let radio;
    let type;
    let id;
    if(document.getElementsByName("type")) {
        radio = Array.from(document.getElementsByName("type"));
        radio.forEach(val => {
            if(val.checked){
                type = val.value;
            }
        })
    }
    let montant;
    if(document.querySelector('#montant')){
        montant = document.querySelector('#montant').value;
    }

    if(document.querySelector('#identity')) {
        id = document.querySelector('#identity').value;
    }
    const body = {
        "id": id,
        "type": (type === 'ajouter') ? true : false,
        "montant": montant
    };
    return body;
}

export function addIdCompteToForm(id){
    let idElt;
    if(document.querySelector('#identity')){
        idElt = document.querySelector('#identity');
        idElt.value = id;
    }
}