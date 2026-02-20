document.addEventListener('DOMContentLoaded', function() {
	var sections = [
		{ id: 'bio', url: 'sections/bio.html' },
		{ id: 'news', url: 'sections/news.html' },
		{ id: 'publication', url: 'sections/publication.html' },
		{ id: 'education', url: 'sections/education.html' },
		{ id: 'honors', url: 'sections/honors.html' },
		{ id: 'experience', url: 'sections/experience.html' },
		{ id: 'miscellanea', url: 'sections/miscellanea.html' }
	];

	var loaded = 0;
	var total = sections.length;

	function onSectionLoaded() {
		loaded++;
		if (loaded === total) {
			initPubToggle();
		}
	}

	sections.forEach(function(section) {
		loadSection(section.id, section.url, onSectionLoaded);
	});
});

function isFileProtocol() {
	return window.location.protocol === 'file:';
}

function loadSection(elementId, url, callback) {
	var element = document.getElementById(elementId);
	if (!element) {
		if (callback) callback();
		return;
	}

	var showServerHint = isFileProtocol() && typeof loadSection._fileErrorShown === 'undefined';
	if (showServerHint) loadSection._fileErrorShown = true;
	var errorHtml = showServerHint
		? '<p class="load-error">Sections load over HTTP only. Run a local server in this folder (e.g. <code>python3 -m http.server 8000</code>) then open <a href="http://localhost:8000">http://localhost:8000</a>.</p>'
		: '<p class="load-error">Error loading content.</p>';

	fetch(url)
		.then(function(response) {
			if (!response.ok) throw new Error('HTTP ' + response.status);
			return response.text();
		})
		.then(function(html) {
			element.innerHTML = html;
			element.classList.remove('section-placeholder');
		})
		.catch(function(err) {
			console.error('Error loading ' + elementId + ':', err);
			element.innerHTML = errorHtml;
			element.classList.remove('section-placeholder');
		})
		.finally(function() {
			if (callback) callback();
		});
}

function initPubToggle() {
	var showFullBtn = document.getElementById('showFullListBtn');
	var showSelectedBtn = document.getElementById('showSelectedListBtn');
	if (showFullBtn) {
		showFullBtn.addEventListener('click', function() {
			document.body.classList.add('pub-show-all');
			showFullBtn.style.display = 'none';
			if (showSelectedBtn) showSelectedBtn.style.display = 'inline-block';
		});
	}
	if (showSelectedBtn) {
		showSelectedBtn.addEventListener('click', function() {
			document.body.classList.remove('pub-show-all');
			showSelectedBtn.style.display = 'none';
			if (showFullBtn) showFullBtn.style.display = 'inline-block';
		});
	}
}
