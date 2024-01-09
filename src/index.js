import addOnUISdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/express/theme-darkest.js';
import '@spectrum-web-components/theme/express/theme-dark.js';
import '@spectrum-web-components/theme/express/theme-light.js';
import '@spectrum-web-components/theme/express/theme-lightest.js';
import '@spectrum-web-components/theme/express/scale-medium.js';
import '@spectrum-web-components/theme/express/scale-large.js';
import '@spectrum-web-components/grid/sp-grid.js';
import '@spectrum-css/typography';
import '@spectrum-css/inlinealert';
import '@spectrum-css/ui-icons';




addOnUISdk.ready.then(async () => {
    console.log("addOnUISdk is ready for use.");
    displayFirstPage();
});


const firstPageDiv = document.querySelector("#firstPage");
const secondPageDiv = document.querySelector("#secondPage");
const thirdPageDiv = document.querySelector("#thirdPage");
const fourthPageDiv = document.querySelector("#fourthPage");
const continueButton = document.querySelector("#continue");
const generatePage = document.querySelector("#generatePage");
// const backButton = document.querySelector("#back");
const backButton1 = document.querySelector("#back1");
const choosePagesButton = document.querySelector("#choosePages");
const generatePrintoutButton = document.querySelector("#generatePrintout");
const imagesContainer = document.querySelector("#imagesContainer");
const maxImageExportSize=20*1024*1024;//20MB
var imageBlobs = [];

// Declaring listeners
generatePrintoutButton.onclick = () => {
    zipAndSendImages('.png');
}

backButton1.onclick = () => {
    firstPageDiv.style.display = "none";
    secondPageDiv.style.display = "none";
    thirdPageDiv.style.display = "none";
    fourthPageDiv.style.display = "block";
    generatePage.style.display = "none";

}
// backButton.onclick = () => {
//     firstPageDiv.style.display = "block";
//     secondPageDiv.style.display = "none";
//     thirdPageDiv.style.display = "none";
//     fourthPageDiv.style.display = "none";
//     generatePage.style.display = "none";
//     imageBlobs = [];
// }
continueButton.onclick = () => {
    firstPageDiv.style.display = "none";
    thirdPageDiv.style.display = "block";
}

choosePagesButton.onclick = () => {
    thirdPageDiv.style.display = "none";
    fourthPageDiv.style.display = "block";
}

const displayFirstPage = () => {

    //TODO
}
const zipAndSendImages = async (imageExtension) => {
    // Check if there's only one blob in the array
    if (imageBlobs.length === 1) {
        // Send the single image directly
        const formData = new FormData();
        formData.append('file', imageBlobs[0], 'image' + imageExtension);
        sendFormData(formData);
        console.log("formData", formData);
    } else {
        console.log("zip");
        // More than one blob, proceed with zipping
        const zip = new JSZip();
        console.log("zip111");
        imageBlobs.forEach((blob, index) => {
            zip.file('image' + index + imageExtension, blob);
            console.log("zip2222", zip);
        });

        zip.generateAsync({ type: 'blob' })
            .then(zipBlob => {
                const formData = new FormData();
                formData.append('file', zipBlob, 'images.zip');
                console.log("formData", formData);
                const file = formData.get('file');
                if (file && file.type === 'application/zip' || file.name.endsWith('.zip')) {
                    console.log('FormData contains a ZIP file');
                }
                sendFormData(formData);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
};
const sendFormData = (formData) => {
    fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
    })

    .then(response => response.json())
    .then(data => {
        if (data.status === 200) {
            const imageUrl = data.imageUrl;
            openNewTab('https://ecardify.io/print-on-labels?imgUrl=' + imageUrl);
        }
        else if(data.status===400){

        }//bad request kur file size is big
    
        else if(data.status===403 ){
//teksti: server refused this request
        }//
         else {
            alert("Something went wrong. Please try again later.");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle error
    });
    
};

const populateGeneratePage = () => {
    firstPageDiv.style.display = "none";
    secondPageDiv.style.display = "none";
    thirdPageDiv.style.display = "none";
    fourthPageDiv.style.display = "none";
    generatePage.style.display = "block";
    console.log("imageBlobs", imageBlobs);
    const container = document.getElementById('image-container');
    container.innerHTML = '';
    imageBlobs.forEach(blob => {
        const imageUrl = URL.createObjectURL(blob);
        const img = document.createElement('img');
        img.src = imageUrl;
        img.onload = () => URL.revokeObjectURL(imageUrl); // Clean up after load
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        cell.appendChild(img);
        container.appendChild(cell);
    });

 

}


const openNewTab = (url) => {
    var newTab = window.open(url, '_blank');
    if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
        // Popup blocked, inform the user and provide a fallback
        alert('Popup window to printing page was blocked. We will redirect you instead.');
        window.location.href = url;
    }
};

const showPremiumContentError = async () => {
    addOnUISdk.app.showModalDialog({
        variant: "error",
        title: "Can't initiate printout",
        description: "Some assets are only included in the Premium plan. Try replacing with something else or upgrading Adobe Express to a Premium plan.",
        buttonLabels: { secondary: "Upgrade" }

    }).then((result) => {
        if (result.buttonType === "secondary") {
            window.open("https://www.adobe.com/go/express_addons_pricing", "_blank");
        }

    });
};
const getSelectedRange = () => {
    const rangeSelect = document.querySelector("#rangeSelect");
    return rangeSelect.value;
};

document.querySelector("#export").onclick = async () => {
    const { app, constants } = addOnUISdk;
    const { Range, RenditionFormat } = constants;

    const selectedRange = getSelectedRange();

    const renditionOptions = {
        range: selectedRange === "currentPage" ? Range.currentPage : Range.entireDocument,
        format: RenditionFormat.png
    };
    console.log("111111111",RenditionFormat.png);
    try {
        const renditions = await app.document.createRenditions(renditionOptions);
        console.log(renditions);
        const blobs = renditions.map(rendition => rendition.blob);
        imageBlobs = blobs;
        if(isOverSize(imageBlobs)){
           //display error popup ,mbaje ne te njejten faqe 
           //teksti: "The file size is too big. Please try again with less images."
            return;
        }
        populateGeneratePage();

    } catch (err) {
        if (err.message?.includes("USER_NOT_ENTITLED_TO_PREMIUM_CONTENT")) {
            showPremiumContentError();
        }
    }

};
const isOverSize = (blobsToCheck) => {
    blobsToCheck.forEach(blob => {
        if (blob.size > maxImageExportSize) {
            return true;
        }
        return false;
    });
}

// var showElement = function (elementId) {
//     document.getElementById(elementId).style.display = 'block';
// };
// var hideElement = function (elementId) {
//     document.getElementById(elementId).style.display = 'none';
// };

// function hideAll() {
//     hideElement("aaaa"));
//     hideElement("aaaa"));
//     hideElement("aaaa"));
//     hideElement("aaaa"));
// };

// function displayOne(elementId) {
//     hideAll();
//     showElement(elementId);
// };