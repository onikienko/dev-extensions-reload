chrome.runtime.onInstalled.addListener(function (details) {
    function setDefaults(callback) {
        storage.area.get(function (stored_options) {
            var default_options = storage.default_options,
                option,
                new_options = {};
            
            for (option in default_options) {
                if (!stored_options.hasOwnProperty(option)) {
                    new_options[option] = default_options[option];
                }
            }
            if (Object.keys(new_options).length !== 0) {
                // save to area if new default options is appeared
                storage.area.set(new_options, function () {
                    if (typeof callback === 'function') {
                        callback();
                    }
                });
            } else {
                if (typeof callback === 'function') {
                    callback();
                }
            }
        });
    }

    switch (details.reason) {
        case 'install': // if ext is  first installed
            setDefaults(function () {
                // show options page
                chrome.tabs.create({'url': 'options.html'});
            });
            break;
        case 'update':
            setDefaults();
            break;
        default:
            break;
    }
});

chrome.runtime.onUpdateAvailable.addListener(function () {
    // when an update is available - reload extension
    // update will be install immediately
    chrome.runtime.reload();
});


function reload() {
    function reEnable(extension) {
        chrome.management.setEnabled(extension.id, false, function () {
            chrome.management.setEnabled(extension.id, true);
        });
    }

    chrome.management.getAll(function (extensions) {
        extensions.forEach(function (extension) {
            if (extension.enabled && extension.installType === "development" && extension.shortName !== "Dev extensions reload") {
                reEnable(extension);
            }
        });
    });
    storage.area.get('reload_tabs', function (stored_option) {
        if (stored_option.reload_tabs) {
            chrome.tabs.reload({});
        }
    });
}

chrome.commands.onCommand.addListener(function (command) {
    if (command === "reload_dev_extensions") {
        reload();
    }
});

function contMenu () {
    storage.area.get('context_menu', function (stored_option) {
        if (stored_option && stored_option.context_menu) {
            chrome.contextMenus.create({
                    "id": 'someID',
                    "title": chrome.i18n.getMessage('cm_title')
                }
            );
            chrome.contextMenus.onClicked.addListener(function (menu) {
                if (menu.menuItemId === 'someID') {
                    reload();
                }
            });
        }
    });
}

chrome.storage.onChanged.addListener(function (e) {
    if (e && e.context_menu !== undefined) {
        contMenu();
    }
});

contMenu();