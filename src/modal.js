const handleModalClick = e => { e.stopPropagation() }

let onCloseCB = null;

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
    modal.classList.add('hidden');
    modalBG.classList.add('hidden');
  }, 400)

  if (onCloseCB) {
    onCloseCB();
  }
}

const openModal = ({ animate, onClose }) => {
  const modal = document.getElementById('modal');
  const modalBG = modal.parentElement;
  const startButton = document.getElementById('start-button');

  modalBG.classList.remove('hidden');
  modal.classList.remove('hidden');
  if (animate) {
    setTimeout(() => {
      modal.classList.remove('hiding');
      modalBG.classList.remove('hiding');
    }, 0)
  }
  
  modalBG.addEventListener('click', closeModal);
  startButton.addEventListener('click', closeModal);
  modal.addEventListener('click', handleModalClick);


  if (onClose) {
    onCloseCB = onClose;
  }
}

module.exports = {
  openModal, 
  closeModal
}