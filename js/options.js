var main_tabs = new Tabs('#main_tabs');

document.addEventListener('optionSaved', function (event) {
    // reload extension after toggle session watcher option
    if (event.detail.val.hasOwnProperty('context_menu') && event.detail.success) {
        chrome.runtime.reload();
    }
}, false);