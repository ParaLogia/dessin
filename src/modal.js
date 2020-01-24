const handleModalClick = e => { e.stopPropagation() }

let closingCallback = null;

const closeModal = () => {
  const modal = document.getElementById('modal');
  const modalBG = modal.parentElement;
  const startButton = document.getElementById('start-button');
  modalBG.classList.add('hiding');
  modal.classList.add('hiding');
  modalBG.removeEventListener('click', closeModal);
  startButton.removeEventListener('click', closeModal);
  modal.removeEventListener('click', handleModalClick);

  setTimeout(() => {
    modal.classList.remove('hiding');
    modalBG.classList.remove('hiding');
    modal.classList.add('hidden');
    modalBG.classList.add('hidden');
  }, 400)

  if (closingCallback) {
    closingCallback();
  }
}

const openModal = (cb) => {
  const modal = document.getElementById('modal');
  const modalBG = modal.parentElement;
  const startButton = document.getElementById('start-button');
  modalBG.classList.remove('hidden');
  modal.classList.remove('hidden');
  modalBG.addEventListener('click', closeModal);
  startButton.addEventListener('click', closeModal);
  modal.addEventListener('click', handleModalClick);
  closingCallback = cb;
}

module.exports = {
  openModal, 
  closeModal
}