document.addEventListener('DOMContentLoaded', init);

function init(): void {
  isLoaded();
}

function isLoaded(): void {
  const getElem: HTMLElement | null = document.querySelector('.loaded');
  if (getElem) getElem.classList.add('true');
}
