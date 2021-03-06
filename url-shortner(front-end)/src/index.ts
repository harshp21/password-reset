import { UrlDetails } from './interfaces/url-details.interface';
import { ResponseJson } from './interfaces/response-json.interface';
let apiUrl: string = 'https://password-reset-url-shortner.herokuapp.com';

// fetch all url details to display in table
let fetchAllUrlDetails = async () => {
    try {
        let urlDetails = await fetch(`${apiUrl}/url-data`);
        let urlDetailsJson: ResponseJson = await urlDetails.json();
        return urlDetailsJson;
    } catch (err) {
        console.error(err);
    }
}

// display url details in table and show loader till the data is been fetch and the hide loader
let displayUrlDetails = async () => {
    showLoader();
    let urlDetailsJson = await fetchAllUrlDetails();
    hideLoader();
    createDomForUrlDetails(urlDetailsJson);
}

// fetch the redirect url and redirect in a new tab
let redirectToOriginalUrl = async (shortUrl: string) => {
    showLoader();
    let urlDetails = await fetchRedirectUrl(shortUrl);
    displayUrlDetails();
    window.open(`${urlDetails.data.url}`, '_blank');
    hideLoader();
}

// makes an api call to fetch the redirect url data
let fetchRedirectUrl = async (shortUrl: string) => {
    try {
        let urlData = await fetch(`${apiUrl}/redirect-url/${shortUrl}`);
        let urlDataJson = await urlData.json();
        return urlDataJson;
    } catch (err) {
        console.error(err);
    }
}

//creating table for the url details fetched
let createDomForUrlDetails = (urlDetailsJson) => {
    let urlDetails: Array<UrlDetails> = urlDetailsJson.data;

    let tableContainer = document.createElement('div');
    tableContainer.classList.add('container-table');

    let tableHeaderRow = document.createElement('div');
    tableHeaderRow.classList.add('container-table-header-row');

    let columnHeaders = ['Sr no.', 'Url', 'Short Url', 'Clicks'];
    columnHeaders.forEach(element => {
        let columnData = document.createElement('div');
        columnData.classList.add('column-table-data');
        columnData.innerHTML = element;
        tableHeaderRow.append(columnData);
    })

    tableContainer.append(tableHeaderRow);

    urlDetails.forEach((element: UrlDetails, index: number) => {
        let columnRow = document.createElement('div');
        columnRow.classList.add('column-table-row');

        let columnSerialData = document.createElement('div');
        columnSerialData.classList.add('column-data');
        columnSerialData.innerHTML = `${index + 1}`;

        let columnUrlData = document.createElement('div');
        columnUrlData.classList.add('column-data', 'url-data');
        columnUrlData.innerHTML = `<a href="${element.url}" target="_blank">${element.url}</a>`;

        let columnShortUrlData = document.createElement('div');
        columnShortUrlData.classList.add('column-data', 'short-url');
        columnShortUrlData.innerHTML = `${element.shortUrl}`;
        columnShortUrlData.onclick = () => {
            redirectToOriginalUrl(element.shortUrl);
        }

        let columnUrlClicksData = document.createElement('div');
        columnUrlClicksData.classList.add('column-data');
        columnUrlClicksData.innerHTML = `${element.clicks}`;

        columnRow.append(columnSerialData, columnUrlData, columnShortUrlData, columnUrlClicksData);
        tableContainer.appendChild(columnRow);
    });
    document.getElementById('table-contents').innerHTML = '';
    document.getElementById('table-contents').append(tableContainer);

}

// creating a loader to show till the data is fetched
let createLoader = () => {
    let loaderContainer = document.createElement('div');
    loaderContainer.classList.add('loader-container');
    loaderContainer.id = 'loader-contanier';

    let loader = document.createElement('div');
    loader.classList.add('loader');

    loaderContainer.append(loader);
    document.body.append(loaderContainer)
}

// show the loader
let showLoader = () => {
    document.getElementById('loader-contanier').style.display = 'flex';
}

//hide the loader
let hideLoader = () => {
    document.getElementById('loader-contanier').style.display = 'none';
}

//make an api call to shortern the url
let shortenUrl = async () => {
    try {
        showLoader();
        let url = (<HTMLInputElement>document.getElementById('shrink-text')).value;
        let shortenUrl = await fetch(`${apiUrl}/shorten-url`, {

            // Adding method type 
            method: "POST",

            // Adding body or contents to send 
            body: JSON.stringify({
                url,
            }),

            // Adding headers to the request 
            headers: {
                "Content-type": "application/json"
            }
        });
        let shortenUrlDetails = await shortenUrl.json();
        (<HTMLInputElement>document.getElementById('shrink-text')).value = '';
        displayMsgModal(shortenUrlDetails.message);
        displayUrlDetails();
        hideLoader();
    } catch (err) {

    }
}

// create a modal to display appropriate msg and disappear in 3 secs
let displayMsgModal = (msg: string) => {
    let msgModalContainer = document.createElement('div');
    msgModalContainer.classList.add('msg-modal-container');
    msgModalContainer.id = 'msg-modal-container';

    let msgModalContent = document.createElement('div');
    msgModalContent.classList.add('msg-modal-content');
    msgModalContent.innerHTML = msg;

    let modalCloseBtn = document.createElement('div');
    modalCloseBtn.classList.add('modal-close-btn');
    modalCloseBtn.innerHTML = 'close';

    msgModalContent.append(modalCloseBtn);

    msgModalContainer.append(msgModalContent);
    document.body.append(msgModalContainer);

    modalCloseBtn.onclick = () => {
        msgModalContainer.style.display = 'none';
    }
    setTimeout(() => {
        msgModalContainer.remove();
    }, 3000)
}

function setEventListner(id: string, eventType: string, cb) {
    var element = document.getElementById(id);
    if (typeof (element) !== 'undefined' && element != null) {
        element.addEventListener(eventType, cb);
    }
}

// on click of btn call a method to shorten the url
setEventListner('shortenUrl', 'click', () => {
    shortenUrl();
})

setEventListner('sign-in', 'click', () => {
    showModal('sign-in-modal');
})

setEventListner('sign-up', 'click', () => {
    showModal('sign-up-modal');
})

setEventListner('sign-in-modal-close-btn', 'click', () => {
    closeModal('sign-in-modal');
})

setEventListner('sign-up-modal-close-btn', 'click', () => {
    closeModal('sign-up-modal');
})

setEventListner('forgot-password-close-btn', 'click', () => {
    closeModal('forgot-password');
})

setEventListner('login-btn', 'click', () => {
    signInUser();
})

setEventListner('sign-up-btn', 'click', () => {
    signUpUser();
})

setEventListner('retreive-password-btn', 'click', () => {
    retrievePassword();
})

setEventListner('btn-forgot-password', 'click', () => {
    closeModal('sign-in-modal');
    showModal('forgot-password');
})

let showModal = (id: string): void => {
    document.getElementById(id).style.display = 'flex';
}

let closeModal = (id: string): void => {
    document.getElementById(id).style.display = 'none';
}

let signUpUser = async () => {
    try {
        let email = (<HTMLInputElement>document.getElementById('sign-up-email')).value;
        let password = (<HTMLInputElement>document.getElementById('sign-up-password')).value;
        let confirmPassword = (<HTMLInputElement>document.getElementById('sign-up-confirm-password')).value;

        let mailFormat = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!mailFormat.test(email.toLowerCase())) {
            displayMsgModal('Please enter a valid email');
        } else if (password === '' || password.length < 6) {
            displayMsgModal('Passwrod length should be greater than 6');
        } else if (password !== confirmPassword) {
            displayMsgModal('password and confirm password should match');
        } else {
            showLoader();
            let user = await fetch(`${apiUrl}/sign-up`, {

                // Adding method type 
                method: "POST",

                // Adding body or contents to send 
                body: JSON.stringify({
                    email,
                    password
                }),

                // Adding headers to the request 
                headers: {
                    "Content-type": "application/json"
                }
            })
            let userJson = await user.json();
            console.log(userJson);
            displayMsgModal(userJson.message);
            hideLoader();
        }

    } catch (err) {

    }

}

let signInUser = async () => {
    try {
        let email = (<HTMLInputElement>document.getElementById('sign-in-email')).value;
        let password = (<HTMLInputElement>document.getElementById('sign-in-password')).value;
        let mailFormat = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!mailFormat.test(email.toLowerCase())) {
            displayMsgModal('Please enter a valid email');
        } else {
            showLoader();
            let user = await fetch(`${apiUrl}/login-in`, {

                // Adding method type 
                method: "POST",

                // Adding body or contents to send 
                body: JSON.stringify({
                    email,
                    password
                }),

                // Adding headers to the request 
                headers: {
                    "Content-type": "application/json"
                }
            })

            let userJson = await user.json();
            hideLoader();
            displayMsgModal(userJson.message);
        }

    } catch (err) {
        console.log(err);
    }
}

let retrievePassword = async () => {
    try {
        let email = (<HTMLInputElement>document.getElementById('forgot-password-email')).value;
        let mailFormat = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!mailFormat.test(email.toLowerCase())) {
            displayMsgModal('Please enter a valid email');
        } else {
            showLoader();
            let user = await fetch(`${apiUrl}/forget-password`, {

                // Adding method type 
                method: "POST",

                // Adding body or contents to send 
                body: JSON.stringify({
                    email
                }),

                // Adding headers to the request 
                headers: {
                    "Content-type": "application/json"
                }
            })

            let userJson = await user.json();
            displayMsgModal(userJson.message);
            hideLoader();
        }
    } catch (err) {
        console.error(err);
    }
}

createLoader();


if (window.location.pathname === '/reset-password.html') {
    let form = document.getElementById("reset");
    form.addEventListener("submit", e => {
        e.preventDefault();
        resetPassword();
    });
} else {
    displayUrlDetails();
}

async function resetPassword() {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("key");
    console.log(token);
    try {
        let password = (<HTMLInputElement>document.getElementById("password")).value;
        let confirmPassword = (<HTMLInputElement>document.getElementById("confirm-password")).value;
        if (password === confirmPassword) {
            showLoader();
            let data = await fetch("http://localhost:3000/reset", {
                // Adding method type
                method: "PUT",

                // Adding body or contents to send
                body: JSON.stringify({
                    token,
                    password
                }),

                // Adding headers to the request
                headers: {
                    "Content-type": "application/json",
                },
            });
            let jsonData = await data.json();
            hideLoader();
            displayMsgModal(jsonData.message);
        } else {
            displayMsgModal("password and confirm password shoud be same");
        }
    } catch (err) {
        console.log(err);
    }
}
