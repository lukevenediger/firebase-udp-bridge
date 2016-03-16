var Config = { 
    firebase : 'https://cs-nb-uploader.firebaseio.com/'
};

var Lookups = { 
    Defaults : {
        CONTENT_TITLE : "Click to set title"
    },
    Firebase : {
        Nodes : {
                CONTENT : 'content',
                CONTENT_TITLES : 'contentTitles'
        },
        Events : {
            VALUE : 'value',
            CHILD_ADDED : 'child_added',
            CHILD_REMOVED : 'child_removed',
            CHILD_UPDATED : 'child_changed',
        }
    }    
};