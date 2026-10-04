const form = document.querySelector('#search-form');
const search = document.querySelector('#search');
const cards = [...document.querySelectorAll('#catalog article.card')];
const status = document.querySelector('#search-status');
const empty = document.querySelector('#no-results');
function filterCards() {
  const query = search.value.trim().toLocaleLowerCase();
  let count = 0;
  for (const card of cards) {
    const visible = !query || card.textContent.toLocaleLowerCase().includes(query);
    card.hidden = !visible;
    if (visible) count++;
  }
  status.textContent = query ? `${count} ${count === 1 ? 'entry' : 'entries'} found.` : 'Showing all entries.';
  empty.hidden = count !== 0;
}
form.addEventListener('submit', event => { event.preventDefault(); filterCards(); });
search.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.keyCode === 13) { event.preventDefault(); filterCards(); }
});
