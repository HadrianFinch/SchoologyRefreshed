
chrome.tabs.onUpdated.addListener((tabId, info) => {
    if (info.status === 'complete') {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: () => {
                console.log("AOsnfsadnsajdn");
            }
        });
    }
});
