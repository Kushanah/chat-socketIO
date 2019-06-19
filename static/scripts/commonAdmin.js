function toggleNavBurger(){
    document.getElementById("navbar-burger").classList.toggle("is-active");
    document.getElementById("navbar-menu").classList.toggle("is-active");
}

function toggleDropdown() {
    document.getElementById("dropdown-menu").classList.toggle("is-display");
}

let api = {
    info : function(callback){
        fetch('../api/panel/infoAdmin').then((res) => {
            if(res.status === 404){
                console.error("L'api n'existe pas...");
            } else if (res.status === 503){
                console.error("Le serveur à rencontrer une erreur");
            } else if (res.status === 200) {
                console.log("Les informations ont été bien récupérée");
                res.json().then((resJson) => {
                    callback(resJson);
                })
            }
        });
    },
    lastAccounts : function(callback){
        fetch('../api/panel/lastAccounts').then((res) => {
            if(res.status === 404){
                console.error("L'api n'existe pas...");
            } else if (res.status === 503){
                console.error("Le serveur à rencontrer une erreur");
            } else if (res.status === 200) {
                console.log("Les informations ont été bien récupérée");
                res.json().then((resJson) => {
                    callback(resJson);
                })
            }
        });
    },

}