const handleModalClick = e => { e.stopPropagation() }

const closeModal = () => {
  const modal = document.getElementById('modal');
  const modalBG = modal.parentElement;
  modalBG.classList.add('hiding');
  modal.classList.add('hiding');
  modalBG.removeEventListener('click', closeModal);
  modal.removeEventListener('click', handleModalClick);

  setTimeout(() => {
    modal.classList.remove('hiding');
    modalBG.classList.remove('hiding');
    modal.classList.add('hidden');
    modalBG.classList.add('hidden');
  }, 400)
}

const openModal = () => {
  const modal = document.getElementById('modal');
  const modalBG = modal.parentElement;
  modalBG.classList.remove('hidden');
  modal.classList.remove('hidden');
  modalBG.addEventListener('click', closeModal);
  modal.addEventListener('click', handleModalClick);
}

module.exports = {
  openModal, 
  closeModal
}