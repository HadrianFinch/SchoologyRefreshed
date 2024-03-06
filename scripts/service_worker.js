try {
    importScripts('/scripts/optionsController.js');
} catch (e) {
    console.error(e);
}

const Modules = {};

const ModuleController = {
    RegisterModule: async (identifier, urls, excludeUrls, useCss, useJS) => {
        var scripts = await chrome.scripting.getRegisteredContentScripts();
        const scriptIds = scripts.map(script => script.id);

        const module = {
            identifier: identifier,
            cssFile: "/html/generated/" + identifier.id + ".css",
            jsFile: "/scripts/" + identifier.id + ".js",

            enabled: scriptIds.includes(identifier.id),

            Enable: async () => {
                await chrome.scripting.registerContentScripts([{
                    id: identifier.id,
                    matches: urls.map((e) => "https://*.schoology.com/" + e),
                    excludeMatches: excludeUrls.map((e) => "https://*.schoology.com/" + e), 
                    js: useJS ? [module.jsFile] : null,
                    css: useCss ? [module.cssFile] : null,
                    runAt:'document_end'
                }]);

                module.enabled = true;
            },
            Disable: async () => {
                await chrome.scripting.unregisterContentScripts({ids: [identifier.id]});
                module.enabled = false;
            },

            EnableFromOptions: async (overrideId) => {
                const id = overrideId != null ? overrideId.id : identifier.id;
                if (Options[id].get())
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
    },
    DebugRestartAll: async () =>
    {
        try {
            const scripts = await chrome.scripting.getRegisteredContentScripts();
            const scriptIds = scripts.map(script => script.id);

            if (scriptIds.length > 0)
            {
                return chrome.scripting.unregisterContentScripts(scriptIds);
            }
            
        } catch (error) {
            const message = [
                "An unexpected error occurred while",
                "unregistering dynamic content scripts.",
            ].join(" ");
            throw new Error(error, {cause : error});
        }
    }
};

(async () => {
    await OptionsController.Init();

    await ModuleController.DebugRestartAll();

    (await ModuleController.RegisterModule(Options.rounded_corners.id, ["*"], [], true, false)).EnableFromOptions();
    (await ModuleController.RegisterModule(Options.redisigned_homepage.id, ["home*"], [], true, false)).EnableFromOptions();
    (await ModuleController.RegisterModule(Options.redisigned_course_page.id, ["course*", "assignment*"], ["*/assessments/*"], true, true)).EnableFromOptions();
    (await ModuleController.RegisterModule({id: "assignment_page_redisign"}, ["assignment*"], [], true, false)).EnableFromOptions(Options.redisigned_course_page.id);
    (await ModuleController.RegisterModule(Options.fixed_navbar_logo_alignment.id, ["*"], [], true, false)).EnableFromOptions();
    (await ModuleController.RegisterModule(Options.fixed_powerschool_colors.id, ["*"], [], true, false)).EnableFromOptions();
    (await ModuleController.RegisterModule(Options.hide_footer.id, ["*"], [], true, false)).EnableFromOptions();
    (await ModuleController.RegisterModule(Options.unified_controls.id, ["*"], [], true, false)).EnableFromOptions();

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
