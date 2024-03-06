const Options = {};

const OptionsController = {
    OptionType: {
        BOOLEAN: 1,
        INT: 2,
        FLOAT: 3,
        STRING: 4
    },

    loadedOptionValues: {
        "global_enable": "true"
    },

    optionsParentDiv: null,
    IsOptionsPage: () => {
        return OptionsController.optionsParentDiv != null;
    },

    CreateOptionProvider: (id, obj, get, set) => 
    {
        const object = {
            id: id,
            obj: obj,
            GetDisplay: get,
            SetDisplay: set,
            UpdateSaved: () => {
                OptionsController.loadedOptionValues[id.id] = object.GetDisplay();
            },
            GetSaved: () => {
                return OptionsController.loadedOptionValues[id.id];
            },
            get: () => {
                if (OptionsController.IsOptionsPage())
                {
                    return object.GetDisplay();
                }
                else
                {
                    return object.GetSaved();
                }
            },
        };

        if (OptionsController.IsOptionsPage())
        {
            obj.addEventListener("input", () => {
                object.UpdateSaved();
                /* async */ OptionsController.SaveOptions();
            });

            object.SetDisplay(object.GetSaved());
        }

        return object
    },
    
    GenerateOptionUi: (identifier, type) => {
        var elm = null;
        var container = null;
        switch (type) {
            case OptionsController.OptionType.BOOLEAN:
            {
                container = document.createElement("p");

                elm = document.createElement("input");
                elm.type = "checkbox";
                elm.id = identifier.id;

                const span = document.createElement("span");
                span.innerHTML = identifier.name;

                container.appendChild(elm);
                container.appendChild(span);
            }
            break;
        }

        OptionsController.optionsParentDiv.appendChild(container);
        return elm;
    },

    CreateStandardOptionProvider(id, elm, type)
    {
        switch (type) {
            case OptionsController.OptionType.BOOLEAN:
                return OptionsController.CreateOptionProvider(id, elm, () => {return elm.checked;}, (val) => {elm.checked = val;});
        }
    },

    RegisterOption: (identifier, type) => {

        var uiElm = null;
        if (OptionsController.IsOptionsPage())
        {
            uiElm = OptionsController.GenerateOptionUi(identifier, type);
        }
        
        const optionProvider = OptionsController.CreateStandardOptionProvider(identifier, uiElm, type);
        Options[identifier.id] = optionProvider;
    },

    SaveOptions: async () => {
        await chrome.storage.sync.set({options: JSON.stringify(OptionsController.loadedOptionValues)});
    },
      
    LoadOptions: async () => {
        const result = await chrome.storage.sync.get(["options"]);

        if (result.options != null)
        {
            OptionsController.loadedOptionValues = JSON.parse(result.options);
        }
    },

    Init: async () => {
        if (typeof document !== 'undefined')
        {
            OptionsController.optionsParentDiv = document.querySelector("#options");
        }
        
        await OptionsController.LoadOptions();
        
        OptionsController.RegisterOption({id: "global_enable", name: "Enable Schoology UI Refreshed"}, OptionsController.OptionType.BOOLEAN);
        // OptionsController.RegisterOption({id: "card_shadow", name: "Shadow on cards"}, OptionsController.OptionType.BOOLEAN);
        
        OptionsController.RegisterOption({id: "rounded_corners", name: "Rounded Corners"}, OptionsController.OptionType.BOOLEAN);
        OptionsController.RegisterOption({id: "redisigned_homepage", name: "Redisigned Homepage"}, OptionsController.OptionType.BOOLEAN);
        OptionsController.RegisterOption({id: "redisigned_course_page", name: "Redisigned Course Page"}, OptionsController.OptionType.BOOLEAN);
        OptionsController.RegisterOption({id: "fixed_navbar_logo_alignment", name: "Fix navbar logo alignment"}, OptionsController.OptionType.BOOLEAN);
        OptionsController.RegisterOption({id: "fixed_powerschool_colors", name: "Fix off-brand colors"}, OptionsController.OptionType.BOOLEAN);
        OptionsController.RegisterOption({id: "hide_footer", name: "Remove useless footer from all pages"}, OptionsController.OptionType.BOOLEAN);
        OptionsController.RegisterOption({id: "unified_controls", name: "Make all buttons, dropdowns, menus, etc. have the same look and feel"}, OptionsController.OptionType.BOOLEAN);
    }
};
