const numTiles = {
    account : document.getElementById("usersNumber"),
    visit : document.getElementById("visitsNumber"),
    report : document.getElementById("reportsNumber"),
    error : document.getElementById("errorsNumber"),
};
let textLastAccounts = document.getElementsByClassName("textLastAccounts");
let listLastAccounts = document.getElementsByClassName("list-item");

api.info((dataAPI) => {
    numTiles.account.textContent = dataAPI.data.countAccounts;
    numTiles.visit.textContent = dataAPI.data.countsVisits;
    numTiles.report.textContent = dataAPI.data.countReports;
    //numTiles.error.textContent = dataAPI.dataAPI.countErrors;
});
api.lastAccounts((dataAPI) => {
    for(let key in dataAPI.data) {
        textLastAccounts[key].textContent = dataAPI.data[key].pseudo;
        listLastAccounts[key].href = document.location.hostname + "/panel/user/" + dataAPI.data[key].pseudo;
    }
});

