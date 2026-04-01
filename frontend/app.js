document.addEventListener('DOMContentLoaded', () => {
  const urlInput = document.getElementById('url-input');
  const sniffBtn = document.getElementById('sniff-btn');
  const clearBtn = document.getElementById('clear-btn');
  const progressArea = document.getElementById('progress-area');
  const resultArea = document.getElementById('result-area');
  const tryAgainWrap = document.getElementById('try-again-wrap');
  
  // Stages
  const stageExtract = document.getElementById('stage-extract');
  const stageAnalyze = document.getElementById('stage-analyze');
  const stageMatch = document.getElementById('stage-match');
  
  // Results
  const resultFound = document.getElementById('result-found');
  const resultNotFound = document.getElementById('result-notfound');
  const resultError = document.getElementById('result-error');
  
  // Result Data
  const artwork = document.getElementById('result-artwork');
  const title = document.getElementById('result-title');
  const artist = document.getElementById('result-artist');
  const album = document.getElementById('result-album');
  const linksWrap = document.getElementById('result-links');
  const errorMessage = document.getElementById('error-message');

  let isProcessing = false;

  urlInput.addEventListener('input', () => {
    clearBtn.style.display = urlInput.value ? 'flex' : 'none';
  });

  clearBtn.addEventListener('click', () => {
    urlInput.value = '';
    clearBtn.style.display = 'none';
    urlInput.focus();
  });

  document.getElementById('try-again-btn').addEventListener('click', () => {
    resetUI();
    urlInput.value = '';
    clearBtn.style.display = 'none';
    urlInput.focus();
  });

  sniffBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    if (!url || isProcessing) return;

    try {
      new URL(url);
    } catch {
      alert("Please enter a valid URL.");
      return;
    }

    startProcessing();
    
    try {
      const response = await fetch('/api/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      finishProcessing();
      showResult(data);
      
    } catch (err) {
      console.error(err);
      finishProcessing();
      showResult({ status: 'error', error_message: err.message || 'Failed to connect to backend.' });
    }
  });

  let stageTimer;
  function startProcessing() {
    isProcessing = true;
    urlInput.disabled = true;
    sniffBtn.disabled = true;
    
    // Original icon state
    const btnIcon = sniffBtn.querySelector('.sniff-btn-icon');
    btnIcon.classList.add('spin');
    
    resetUI();
    progressArea.style.display = 'block';
    
    // Simulate stages since we don't have websocket progress from backend
    stageExtract.classList.add('active');
    
    stageTimer = setTimeout(() => {
      stageExtract.classList.remove('active');
      stageExtract.classList.add('done');
      stageAnalyze.classList.add('active');
      
      stageTimer = setTimeout(() => {
        stageAnalyze.classList.remove('active');
        stageAnalyze.classList.add('done');
        stageMatch.classList.add('active');
      }, 5000);
    }, 4000);
  }

  function finishProcessing() {
    clearTimeout(stageTimer);
    isProcessing = false;
    urlInput.disabled = false;
    sniffBtn.disabled = false;
    const btnIcon = sniffBtn.querySelector('.sniff-btn-icon');
    btnIcon.classList.remove('spin');
    
    stageMatch.classList.remove('active');
    stageMatch.classList.add('done');
    setTimeout(() => {
      progressArea.style.display = 'none';
    }, 400);
  }

  function showResult(data) {
    resultArea.style.display = 'block';
    tryAgainWrap.style.display = 'block';

    if (data.status === 'success') {
      resultFound.style.display = 'flex';
      title.textContent = data.title || 'Unknown Title';
      artist.textContent = data.artist || 'Unknown Artist';
      album.textContent = data.album ? `Album: ${data.album}` : '';
      
      if (data.cover_url) {
        artwork.src = data.cover_url;
      } else {
        artwork.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="%23222"><rect width="100%" height="100%"/></svg>';
      }
      
      linksWrap.innerHTML = '';
      if (data.links) {
        if (data.links.spotify) {
          linksWrap.innerHTML += `<a href="${data.links.spotify}" target="_blank" class="link-btn link-btn--spotify">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.3 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.32-1.32 9.72-.66 13.44 1.62.42.24.54.84.3 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.621.539.3.719 1.02.419 1.56-.239.54-.959.72-1.559.3z"/></svg>
            Spotify
          </a>`;
        }
        if (data.links.apple_music) {
          linksWrap.innerHTML += `<a href="${data.links.apple_music}" target="_blank" class="link-btn link-btn--apple">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm5.122 17.51l-5.748-3.318V6.634h1.725v6.55l4.886 2.82-.863 1.506z"/></svg>
            Apple Music
          </a>`;
        }
        if (data.links.songlink) {
          linksWrap.innerHTML += `<a href="${data.links.songlink}" target="_blank" class="link-btn">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
            More links
          </a>`;
        }
      }
    } else if (data.status === 'not_found') {
      resultNotFound.style.display = 'flex';
    } else {
      resultError.style.display = 'flex';
      errorMessage.textContent = data.error_message || "An unexpected error occurred.";
    }
  }

  function resetUI() {
    progressArea.style.display = 'none';
    resultArea.style.display = 'none';
    tryAgainWrap.style.display = 'none';
    
    resultFound.style.display = 'none';
    resultNotFound.style.display = 'none';
    resultError.style.display = 'none';
    
    stageExtract.className = 'stage';
    stageAnalyze.className = 'stage';
    stageMatch.className = 'stage';
  }
});
