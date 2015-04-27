var main_tabs = new Tabs('#main_tabs');

document.addEventListener('optionsPageReady', function () {
    var browser = navigator.userAgent.indexOf('OPR/') === -1 ? 'chrome' : 'opera',
        chrome_link = 'chrome://extensions/configureCommands',
        opera_link = 'opera://extensions/configureCommands',
        opera_dev_link = 'opera://settings/configureCommands';

    if (browser !== 'opera') {
        document.querySelector('#opera_next').remove();
    }
    document.querySelector('#linker').addEventListener('click', function (e) {
        var target = e.target;

        if (target.tagName === 'A') {
            if (target.getAttribute('id') === 'ks_link') {
                chrome.tabs.create({
                    url: browser !== 'opera' ? chrome_link : opera_link,
                    active: true
                });
                e.preventDefault();
            }
            if (target.getAttribute('id') === 'opera_next_link') {
                chrome.tabs.create({
                    url: opera_dev_link,
                    active: true
                });
                e.preventDefault();
            }
        }
    });
    document.addEventListener('optionSaved', function (event) {
        // reload extension after toggle session watcher option
        if (event.detail.val.hasOwnProperty('context_menu') && event.detail.success) {
            chrome.runtime.reload();
        }
    });
});