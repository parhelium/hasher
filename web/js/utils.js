function generateSaltsConfig(salts){
    var salts = salts || [
        {label: "gmail",         value:'gmail',             test:{master:'home', hash:'', outputLength:128}},
        {label: "odesk",         value:'odesk',             test:{master:'home', hash:'', outputLength:128}},
        {label: "elance",        value:'elance',            test:{master:'home', hash:'', outputLength:128}},
        {label: "github",        value:'github',            test:{master:'home', hash:'', outputLength:128}},
        {label: "twitter",       value:'twitter',           test:{master:'home', hash:'', outputLength:128}},
        {label: "bitbucket",     value:'bitbucket',         test:{master:'home', hash:'', outputLength:128}},
        {label: "bankMillenium", value:'bankmillenium',     test:{master:'home', hash:'', outputLength:128}},
        {label: "mbank",         value:'mbank',             test:{master:'home', hash:'', outputLength:128}},
        {label: "stackoverflow", value:'stackoverflow',     test:{master:'home', hash:'', outputLength:128}},
        {label: "bitstamp",      value:'bitstamp',          test:{master:'home', hash:'', outputLength:128}},
        {label: "bitcurex",      value:'bitcurex',          test:{master:'home', hash:'', outputLength:128}},
        {label: "mt.gox",        value:'mt.gox',            test:{master:'home', hash:'', outputLength:128}},
    ]
    for(var index in salts){
        var pass = salts[index].test.master+salts[index].value;
        salts[index].test.hash = CryptoJS.SHA3(pass, { outputLength: salts[index].test.outputLength }).toString()
        console.log(salts[index].test.hash )
    }
    return salts;
}