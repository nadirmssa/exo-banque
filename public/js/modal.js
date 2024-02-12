let modal = null;
const focusableSelector = 'button, a, input, textarea';
let focusables = [];
const openModal = (e) => {
    e.preventDefault();
    const id = e.target.dataset.target;
    modal = document.getElementById(id);
    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    modal.style.display = null;
    modal.removeAttribute('aria-hidden')
    modal.setAttribute('aria-modal', 'true');
    modal = modal;
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-close-modal').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
}

const closeModal = (e) => {
    if (modal === null) { return };
    e.preventDefault();
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-close-modal').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
    modal = null;
}

const stopPropagation = (e) => e.stopPropagation();


document.querySelectorAll('.js-modal').forEach(e => e.addEventListener('click', openModal));

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
        closeModal(e);
    }
})