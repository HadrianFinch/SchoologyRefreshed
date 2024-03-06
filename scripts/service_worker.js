try {
    importScripts('/scripts/optionsController.js');
} catch (e) {
    console.error(e);
}

const Modules = {};

const ModuleController = {
    RegisterModule: (identifier, urls, useCss, useJS) => {
        const module = {
            identifier: identifier,
            cssFile: "/html/generated/" + identifier.id + ".css",
            jsFile: "/script/" + identifier.id + ".css",

            enabled: false,

            Enable: async () => {
                await chrome.scripting.registerContentScripts([{
                    id: identifier.id,
                    matches: ["https://*.schoology.com/" + urls],
                    js: useJS ? [module.jsFile] : null,
                    css: useCss ? [module.cssFile] : null,
                }]);

                module.enabled = true;
            },
            Disable: async () => {
                await chrome.scripting.unregisterContentScripts({ids: [identifier.id]});
                module.enabled = false;
            },

            EnableFromOptions: async () => {
                if (Options[identifier.id].get())
                {
                    if (!module.enabled)
                    {
                        await module.Enable();
                    }
                }
                else
                {
                    if (module.enabled)
                    {
                        await module.Disable();
                    }
                }
            }
        };
        Modules[identifier.id] = module;
        return module;
    },

    UpdateModuleOptions: () =>
    {
        for (const key in Modules)
        {
            if (Object.hasOwnProperty.call(Modules, key))
            {
                const element = Modules[key];
                element.EnableFromOptions();
            }
        }
    }
};

(async () => {
    await OptionsController.Init();

    ModuleController.RegisterModule(Options.rounded_corners.id, "*", true, false).EnableFromOptions(Options.rounded_corners);
})();


chrome.tabs.onUpdated.addListener((tabId, info) => {
    if (info.status === 'loading')
    {
        // chrome.scripting.executeScript({
        //     target: { tabId: tabId },
        //     func: () => {
        //         console.log("AOsnfsadnsajdn");
        //     }
        // });

        OptionsController.LoadOptions();
        ModuleController.UpdateModuleOptions();
    }
});
