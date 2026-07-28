function openModal(modalName) {
    const modal = document.getElementById(modalName + '-modal');
    if (modal) modal.style.display = 'block';
}

function closeModal(modalName) {
    const modal = document.getElementById(modalName + '-modal');
    if (modal) modal.style.display = 'none';
}
