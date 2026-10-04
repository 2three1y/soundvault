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



// Accessible, dependency-free sharing intents for Soundvault.
(() => {
  const pageUrl = new URL(window.location.href);
  pageUrl.hash = '';
  const url = pageUrl.href;
  const title = document.title;
  const shareText = title + ' ' + url;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(url);
  document.querySelector('[data-share="twitter"]').href = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(title) + '&url=' + encodedUrl;
  document.querySelector('[data-share="threads"]').href = 'https://www.threads.net/intent/post?text=' + encodedText;
  document.querySelector('[data-share="mastodon"]').href = 'https://mastodonshare.com/?text=' + encodedText;
  document.querySelector('[data-share="facebook"]').href = 'https://www.facebook.com/sharer/sharer.php?u=' + encodedUrl;
  const status = document.querySelector('#share-status');
  const nostrCopy = document.querySelector('[data-share="nostr"]');
  const copyText = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareText);
      } else {
        const field = document.createElement('textarea');
        field.value = shareText;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.select();
        const copied = document.execCommand('copy');
        field.remove();
        if (!copied) throw new Error('Copy command unavailable');
      }
      status.textContent = 'Share text copied. Paste it into your Nostr client.';
    } catch {
      status.textContent = 'Could not copy automatically. Select and copy this page address for your Nostr client: ' + url;
    }
  };
  nostrCopy.addEventListener('click', copyText);
  const deviceButton = document.querySelector('#device-share');
  if (typeof navigator.share === 'function') {
    deviceButton.hidden = false;
    deviceButton.addEventListener('click', async () => {
      try {
        await navigator.share({title, text: 'Explore this curated archive of accessible audio and speech tools.', url});
      } catch (error) {
        if (error.name !== 'AbortError') status.textContent = 'Device sharing is unavailable right now. You can use one of the sharing links instead.';
      }
    });
  }
})();
