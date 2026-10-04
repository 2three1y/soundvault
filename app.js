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



// Lightweight, accessible sharing controls; no external services or SDKs.
(() => {
  const promoText = 'Soundvault — The Vault of sounds. For everyone to access. Curated speech tools, soundpacks, and accessible audio resources.';
  const canonicalUrl = 'https://2three1y.github.io/soundvault/';
  const shareText = promoText + ' ' + canonicalUrl;
  const platformSelect = document.querySelector('#share-platform');
  const actionButton = document.querySelector('#share-action-btn');
  const copyButton = document.querySelector('#share-copy-btn');
  const status = document.querySelector('#share-status');
  const deviceButton = document.querySelector('#device-share');

  const copyShareText = async () => {
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
        if (!copied) throw new Error('Clipboard copy unavailable');
      }
      status.textContent = 'Copied share text to clipboard!';
    } catch {
      status.textContent = 'Could not copy automatically. You can copy this text: ' + shareText;
    }
  };

  const updateActionLabel = () => {
    actionButton.textContent = 'Share to ' + platformSelect.options[platformSelect.selectedIndex].text;
  };

  platformSelect.addEventListener('change', updateActionLabel);
  copyButton.addEventListener('click', copyShareText);
  actionButton.addEventListener('click', async () => {
    const platform = platformSelect.value;
    if (platform === 'nostr') {
      await copyShareText();
      return;
    }
    const encodedUrl = encodeURIComponent(canonicalUrl);
    const encodedText = encodeURIComponent(promoText + ' ' + canonicalUrl);
    let intentUrl;
    if (platform === 'twitter') {
      intentUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(promoText) + '&url=' + encodedUrl;
    } else if (platform === 'mastodon') {
      intentUrl = 'https://mastodonshare.com/?text=' + encodedText;
    } else if (platform === 'threads') {
      intentUrl = 'https://www.threads.net/intent/post?text=' + encodedText;
    } else if (platform === 'facebook') {
      intentUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodedUrl;
    }
    if (intentUrl) window.open(intentUrl, '_blank', 'noopener,noreferrer');
  });

  if (typeof navigator.share === 'function') {
    deviceButton.hidden = false;
    deviceButton.addEventListener('click', async () => {
      try {
        await navigator.share({title: 'Soundvault', text: promoText, url: canonicalUrl});
      } catch (error) {
        if (error.name !== 'AbortError') status.textContent = 'Device sharing is unavailable right now. You can use the selected platform or copy the share text.';
      }
    });
  }
})();
