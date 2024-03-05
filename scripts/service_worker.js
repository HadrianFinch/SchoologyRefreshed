try {
    importScripts('/scripts/optionsController.js');
} catch (e) {
    console.error(e);
}

if (Options.global_enable)
{
    
    chrome.tabs.onUpdated.addListener((tabId, info) => {
        if (info.status === 'complete') {
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                func: () => {
    
                    console.log("Schoology Refreshed: enabled");
                }
            });
        }
    });

}
