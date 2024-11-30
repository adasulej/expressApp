import addOnUISdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";
// Base styles
import '@spectrum-css/typography';
import '@spectrum-css/inlinealert';
import '@spectrum-css/icon';

// Themes and scales

import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/express/theme-darkest.js';
import '@spectrum-web-components/theme/express/theme-dark.js';
import '@spectrum-web-components/theme/express/theme-light.js';
import '@spectrum-web-components/theme/express/theme-lightest.js';
import '@spectrum-web-components/theme/express/scale-medium.js';
import '@spectrum-web-components/theme/express/scale-large.js';

// Spectrum Web Components

import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/progress-circle/sp-progress-circle.js';
import '@spectrum-web-components/field-label/sp-field-label.js';
import '@spectrum-web-components/grid/sp-grid.js';
import '@spectrum-web-components/radio-group';
import '@spectrum-web-components/radio/sp-radio.js';
import '@spectrum-web-components/picker/sp-picker.js';
import '@spectrum-web-components/menu/sp-menu-group.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import '@spectrum-web-components/alert-dialog/sp-alert-dialog.js';

// Optional imports






const fourthPageDiv = document.querySelector("#fourthPage");
const continueButton = document.querySelector("#continue");
const generatePage = document.querySelector("#generatePage");
const alertBox = document.querySelector("#alertBox");
const maxImageExportSize = 100 * 1024 * 1024;//100MB
const minimumSingleImageSize = 10000;//10KB
const serverUrl = "https://ecardify.io";
const apiEndPoint = serverUrl + "/api/1.1/adobeExpress";
let selectedFormat;
var imageBlobs = [];


const translations = {
    'en-US': {
        infoAlertHeader: 'Please finalize label design first <svg  class="spectrum-Icon spectrum-Icon--sizeM spectrum-InLineAlert-icon"focusable="false" aria-hidden="true"> <use xlink:href="#myInfoIcon" /></svg>',
        infoAlertDescription: 'Ensure you finish designing your label(s) before continuing.',
        firstPageContinueButton: 'Continue',
        exportPageHeader: '<strong>Select the label design page or pages that you want to print out</strong>',
        radioButtonTitle: 'Page selection',
        radio1: 'Entire document',
        radio2: 'Current page',
        dropdownTitle: 'File format',
        dropdown1: 'PNG (recommended)',
        dropdown2: 'JPG',
        exportPageSelectButton: 'Select',
        generateButton: 'Specify Layout',
        backButton: 'Back',
        loadingDivHeader: 'Preparing label images',
        loadingDivDescription: 'This might take a while.',
        generatingDivHeader: 'Preparing printout dialog',
        generatingDivDescription: 'This might take a while.',
        sizeLimitAlertHeader: 'Size Limit Exceeded <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-InLineAlert-icon" focusable="false" aria-hidden="true"><use xlink:href="#alert" /></svg>',
        sizeLimitAlertDescription: 'The chosen pages exceed the maximum allowed size of 100 MB. Please select fewer pages.',
        underSizeLimitAlertHeader: 'Make sure you\'re done designing <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-InLineAlert-icon" focusable="false" aria-hidden="true"><use xlink:href="#alert" /></svg>',
        underSizeLimitAlertDescription: 'If you have finished designing click the button below.',
        error403AlertHeader: 'Oops! <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-InLineAlert-icon" focusable="false" aria-hidden="true"><use xlink:href="#alert" /></svg>',
        error403AlertDescription: 'Server refused this request.',
        error500AlertHeader: 'Oops! <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-InLineAlert-icon" focusable="false" aria-hidden="true"><use xlink:href="#alert" /></svg>',
        error500AlertDescription: 'Something went wrong on the server. Please try again later.',
        upgradeDialogHeader: 'Can\'t initiate printout',
        upgradeDialogDescription: 'Some assets are only included in the Premium plan. Try replacing with something else or upgrading Adobe Express to a Premium plan.',
        upgradeDialogButton: 'Upgrade',
        openPrintingDialogHeader: "Specify Layout",
        openPrintingDialogDescription: "You will be forwarded to Ecardify to specify the layout of your printout.",

    },
    'de-DE': {
        infoAlertHeader: 'Bitte finalisieren Sie zunächst das Etikettendesign<svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-InLineAlert-icon" focusable="false" aria-hidden="true"> <use xlink:href="#myInfoIcon" /></svg>',
        infoAlertDescription: 'Stellen Sie sicher, dass Sie Ihr Etikett(en)-Design fertigstellen, bevor Sie fortfahren.',
        firstPageContinueButton: 'Fortfahren',
        exportPageHeader: '<strong>Wählen Sie die Etiketten-Designseite oder -seiten aus, die Sie ausdrucken möchten</strong>',
        radioButtonTitle: 'Seitenauswahl',
        radio1: 'Gesamtes dokument',
        radio2: 'Aktuelle seite',
        dropdownTitle: 'Dateiformat',
        dropdown1: 'PNG (empfohlen)',
        dropdown2: 'JPG',
        exportPageSelectButton: 'Wählen',
        generateButton: 'Layout Ageben',
        backButton: 'Zurück',
        loadingDivHeader: 'Vorbereiten von Etiketten Bildern',
        loadingDivDescription: 'Dies könnte eine Weile dauern.',
        generatingDivHeader: 'Bereite Druckdialog vor',
        generatingDivDescription: 'Dies könnte eine Weile dauern.',
        sizeLimitAlertHeader: 'Größenlimit überschritten <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-InLineAlert-icon" focusable="false" aria-hidden="true"><use xlink:href="#alert" /></svg>',
        sizeLimitAlertDescription: 'Die ausgewählten Seiten überschreiten die maximale erlaubte Größe von 100 MB. Bitte wählen Sie weniger Seiten aus.',
        underSizeLimitAlertHeader: 'Stelle sicher, dass du mit dem Design fertig bist  <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-InLineAlert-icon" focusable="false" aria-hidden="true"><use xlink:href="#alert" /></svg> ',
        underSizeLimitAlertDescription: 'Wenn du mit dem Design fertig bist, klicke auf die Schaltfläche unten.',
        error403AlertHeader: 'Oops! <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-InLineAlert-icon" focusable="false" aria-hidden="true"><use xlink:href="#alert" /></svg>',
        error403AlertDescription: 'Der Server hat diese Anfrage abgelehnt.',
        error500AlertHeader: 'Oops! <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-InLineAlert-icon" focusable="false" aria-hidden="true"><use xlink:href="#alert" /></svg>',
        error500AlertDescription: 'Etwas ist auf dem Server schiefgelaufen. Bitte versuchen Sie es später erneut.',
        upgradeDialogHeader: 'Druckvorgang kann nicht gestartet werden',
        upgradeDialogDescription: 'Einige Ressourcen sind nur im Premium-Plan enthalten. Versuchen Sie, sie durch etwas anderes zu ersetzen oder Adobe Express auf einen Premium-Plan zu aktualisieren.',
        upgradeDialogButton: 'Aktualisierung',
        openPrintingDialogHeader: "Layout angeben",
        openPrintingDialogDescription: "Sie werden an Ecardify weitergeleitet, um das Layout Ihres Ausdrucks anzugeben.",
    },

    'zh-Hans-CN': {
        infoAlertHeader: '请先完成标签设计 <svg  class="spectrum-Icon spectrum-Icon--sizeM spectrum-InLineAlert-icon"focusable="false" aria-hidden="true"> <use xlink:href="#myInfoIcon" /></svg>',
        infoAlertDescription: '请确保在继续之前完成标签的设计。',
        firstPageContinueButton: '继续',
        exportPageHeader: '<strong>选择要打印的标签设计页面</strong>',
        radioButtonTitle: '页面选择',
        radio1: '整个文档',
        radio2: '当前页面',
        dropdownTitle: '文件格式',
        dropdown1: 'PNG（推荐）',
        dropdown2: 'JPG',
        exportPageSelectButton: '选择',
        generateButton: '指定布局',
        backButton: '返回',
        loadingDivHeader: '正在准备标签图像',
        loadingDivDescription: '可能需要一些时间。',
        generatingDivHeader: '正在准备打印对话框',
        generatingDivDescription: '可能需要一些时间。',
        sizeLimitAlertHeader: '大小超过限制 <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-InLineAlert-icon" focusable="false" aria-hidden="true"><use xlink:href="#alert" /></svg>',
        sizeLimitAlertDescription: '所选页面超过了100MB的最大允许大小。请选择较少的页面。',
        underSizeLimitAlertHeader: '确保你已完成设计 <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-InLineAlert-icon" focusable="false" aria-hidden="true"> <use xlink:href="#alert" /></svg>',
        underSizeLimitAlertDescription: '如果你已经完成设计，请点击下面的按钮。',
        error403AlertHeader: '糟糕！ <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-InLineAlert-icon" focusable="false" aria-hidden="true"><use xlink:href="#alert" /></svg>',
        error403AlertDescription: '服务器拒绝了此请求。',
        error500AlertHeader: '糟糕！ <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-InLineAlert-icon" focusable="false" aria-hidden="true"><use xlink:href="#alert" /></svg>',
        error500AlertDescription: '服务器出现问题。请稍后再试。',
        upgradeDialogHeader: '无法启动打印',
        upgradeDialogDescription: '某些资源仅包含在高级计划中。尝试替换为其他内容或将Adobe Express升级为高级计划。',
        upgradeDialogButton: '升级',
        openPrintingDialogHeader: "指定布局",
        openPrintingDialogDescription: "您将被转到Ecardify以指定打印输出的布局。",
    },

    'fr-FR': {
        infoAlertHeader: 'Veuillez finaliser d\'abord la conception de l\'étiquette <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-InLineAlert-icon" focusable="false" aria-hidden="true"> <use xlink:href="#myInfoIcon" /></svg>',
        infoAlertDescription: 'Assurez-vous de terminer la conception de votre/vos étiquette(s) avant de continuer.',
        firstPageContinueButton: 'Continuer',
        exportPageHeader: '<strong>Sélectionnez la page ou les pages de conception d\'étiquettes que vous souhaitez imprimer</strong>',
        radioButtonTitle: 'Sélection de page',
        radio1: 'Document entier',
        radio2: 'Page actuelle',
        dropdownTitle: 'Format de fichier',
        dropdown1: 'PNG (recommandé)',
        dropdown2: 'JPG',
        exportPageSelectButton: 'Sélectionner',
        generateButton: 'Spécifier la mise en page.',
        backButton: 'Retour',
        loadingDivHeader: 'Préparation des images d\'étiquettes',
        loadingDivDescription: 'Cela peut prendre un certain temps.',
        generatingDivHeader: 'Préparation de la boîte de dialogue d\'impression',
        generatingDivDescription: 'Cela peut prendre un certain temps.',
        sizeLimitAlertHeader: 'Limite de taille dépassée <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-InLineAlert-icon" focusable="false" aria-hidden="true"><use xlink:href="#alert" /></svg>',
        sizeLimitAlertDescription: 'Les pages choisies dépassent la taille maximale autorisée de 100 MB. Veuillez sélectionner moins de pages.',
        underSizeLimitAlertHeader: ' Assurez-vous d\'avoir terminé la conception <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-InLineAlert-icon" focusable="false" aria-hidden="true"> <use xlink:href="#alert" /></svg>',
        underSizeLimitAlertDescription: 'Si vous avez terminé la conception, cliquez sur le bouton ci-dessous.',
        error403AlertHeader: 'Oups ! <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-InLineAlert-icon" focusable="false" aria-hidden="true"><use xlink:href="#alert" /></svg>',
        error403AlertDescription: 'Le serveur a refusé cette demande.',
        error500AlertHeader: 'Oups ! <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-InLineAlert-icon" focusable="false" aria-hidden="true"><use xlink:href="#alert" /></svg>',
        error500AlertDescription: 'Quelque chose s\'est mal passé sur le serveur. Veuillez réessayer plus tard.',
        upgradeDialogHeader: 'Impossible d\'initier la sortie imprimée',
        upgradeDialogDescription: 'Certains éléments ne sont inclus que dans le plan Premium. Essayez de les remplacer par autre chose ou mettez à niveau Adobe Express vers un plan Premium.',
        upgradeDialogButton: 'Mettre à niveau',
        openPrintingDialogHeader: "Spécifier la mise en page",
        openPrintingDialogDescription: "Vous serez redirigé vers Ecardify pour spécifier la mise en page de votre impression.",
    },

    'it-IT': {
        infoAlertHeader: 'Si prega di finalizzare prima il design dell\'etichetta <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-InLineAlert-icon" focusable="false" aria-hidden="true"><use xlink:href="#myInfoIcon" /></svg>',
        infoAlertDescription: 'Assicurarsi di completare il design delle etichette prima di procedere.',
        firstPageContinueButton: 'Continua',
        exportPageHeader: '<strong>Seleziona la pagina o le pagine con il design dell\'etichetta che desideri stampare</strong>',
        radioButtonTitle: 'Selezione pagina',
        radio1: 'Documento intero',
        radio2: 'Pagina corrente',
        dropdownTitle: 'Formato file',
        dropdown1: 'PNG (consigliato)',
        dropdown2: 'JPG',
        exportPageSelectButton: 'Seleziona',
        generateButton: 'Specificare il layout',
        backButton: 'Indietro',
        loadingDivHeader: 'Preparazione delle immagini delle etichette',
        loadingDivDescription: 'Potrebbe richiedere del tempo.',
        generatingDivHeader: 'Preparazione dialogo di stampa',
        generatingDivDescription: 'Potrebbe richiedere del tempo.',
        sizeLimitAlertHeader: 'Superato il limite di dimensioni <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-InLineAlert-icon" focusable="false" aria-hidden="true"><use xlink:href="#alert" /></svg>',
        sizeLimitAlertDescription: 'Le pagine selezionate superano la dimensione massima consentita di 100 MB. Selezionare meno pagine.',
        underSizeLimitAlertHeader: ' Assicurati di aver terminato il design <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-InLineAlert-icon" focusable="false" aria-hidden="true"> <use xlink:href="#alert" /></svg>',
        underSizeLimitAlertDescription: 'Se hai finito di progettare, fai clic sul pulsante qui sotto.',
        error403AlertHeader: 'Ops! <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-InLineAlert-icon" focusable="false" aria-hidden="true"><use xlink:href="#alert" /></svg>',
        error403AlertDescription: 'Il server ha rifiutato questa richiesta.',
        error500AlertHeader: 'Ops! <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-InLineAlert-icon" focusable="false" aria-hidden="true"><use xlink:href="#alert" /></svg>',
        error500AlertDescription: 'Qualcosa è andato storto sul server. Riprovare più tardi.',
        upgradeDialogHeader: 'Impossibile avviare la stampa',
        upgradeDialogDescription: 'Alcune risorse sono disponibili solo nel piano Premium. Prova a sostituire con altro o esegui l\'upgrade di Adobe Express a un piano Premium.',
        upgradeDialogButton: 'Aggiornamento',
        openPrintingDialogHeader: "Specificare il layout",
        openPrintingDialogDescription: "Verrai inoltrato a Ecardify per specificare il layout della tua stampa.",
    },
    'es-ES': {
        infoAlertHeader: 'Por favor, finaliza primero el diseño de la etiqueta <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-InLineAlert-icon" focusable="false" aria-hidden="true"><use xlink:href="#myInfoIcon" /></svg>',
        infoAlertDescription: 'Asegúrate de terminar el diseño de tu(s) etiqueta(s) antes de continuar.',
        firstPageContinueButton: 'Continuar',
        exportPageHeader: '<strong>Selecciona la página o páginas de diseño de etiquetas que deseas imprimir</strong>',
        radioButtonTitle: 'Selección de página',
        radio1: 'Documento completo',
        radio2: 'Página actual',
        dropdownTitle: 'Formato de archivo',
        dropdown1: 'PNG (recomendado)',
        dropdown2: 'JPG',
        exportPageSelectButton: 'Seleccionar',
        generateButton: 'Especificar el diseño',
        backButton: 'Atrás',
        loadingDivHeader: 'Preparando imágenes de etiquetas',
        loadingDivDescription: 'Esto podría tomar un tiempo.',
        generatingDivHeader: 'Preparando cuadro de diálogo de impresión',
        generatingDivDescription: 'Esto podría tomar un tiempo.',
        sizeLimitAlertHeader: 'Límite de tamaño excedido <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-InLineAlert-icon" focusable="false" aria-hidden="true"><use xlink:href="#alert" /></svg>',
        sizeLimitAlertDescription: 'Las páginas seleccionadas exceden el tamaño máximo permitido de 100 MB. Por favor, selecciona menos páginas.',
        underSizeLimitAlertHeader: ' Asegúrate de haber terminado el diseño <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-InLineAlert-icon" focusable="false" aria-hidden="true"><use xlink:href="#alert" /></svg>',
        underSizeLimitAlertDescription: 'Si has terminado de diseñar, haz clic en el botón de abajo.',
        error403AlertHeader: '¡Ups! <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-InLineAlert-icon" focusable="false" aria-hidden="true"><use xlink:href="#alert" /></svg>',
        error403AlertDescription: 'El servidor ha rechazado esta solicitud.',
        error500AlertHeader: '¡Ups! <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-InLineAlert-icon" focusable="false" aria-hidden="true"><use xlink:href="#alert" /></svg>',
        error500AlertDescription: 'Algo salió mal en el servidor. Por favor, inténtalo de nuevo más tarde.',
        upgradeDialogHeader: 'No se puede iniciar la impresión',
        upgradeDialogDescription: 'Algunos activos solo están incluidos en el plan Premium. Intenta reemplazarlos con otra cosa o actualiza a Adobe Express a un plan Premium.',
        upgradeDialogButton: 'Mejora',
        openPrintingDialogHeader: "Especificar el diseño",
        openPrintingDialogDescription: "Serás redirigido a Ecardify para especificar el diseño de tu impresión.",
    },



};

addOnUISdk.ready.then(async () => {
    var language = addOnUISdk.app.ui.locale;
    if (language == 'zh-Hant-TW') {
        language = 'zh-Hans-CN';
    }
    const fullUrl = window.location.href;
    console.log('fulll',fullUrl);
    //Populate the UI components text based on the language
    const translation = translations[language] || translations['en-US'];
    var firstDivInfoAlert = document.querySelector('#infoAlert > div:nth-of-type(1)');
    var secondDivInfoAlert = document.querySelector('#infoAlert > div:nth-of-type(2)');
    firstDivInfoAlert.innerHTML = translation.infoAlertHeader;
    secondDivInfoAlert.innerHTML = translation.infoAlertDescription;
    continueButton.innerHTML = translation.firstPageContinueButton;
    var loadingDivHeadingElement = document.querySelector('#loadingDiv .spectrum-Heading--sizeS')
    var loadingDivBodyElement = document.querySelector('#loadingDiv .spectrum-Heading--sizeM');
    var generatingDivHeadingElement = document.querySelector('#generatingDiv .spectrum-Heading--sizeS');
    var generatingDivBodyElement = document.querySelector('#generatingDiv .spectrum-Heading--sizeM');
    loadingDivHeadingElement.innerHTML = translation.loadingDivHeader;
    loadingDivBodyElement.innerHTML = translation.loadingDivDescription;
    generatingDivHeadingElement.innerHTML = translation.generatingDivHeader;
    generatingDivBodyElement.innerHTML = translation.generatingDivDescription;
    var fourthPageDivHeader = document.querySelector('#fourthPage .spectrum-Heading--sizeM');
    fourthPageDivHeader.innerHTML = translation.exportPageHeader;
    var radioButtonTitle = document.querySelector('#radioButtonTitle');
    radioButtonTitle.innerHTML = translation.radioButtonTitle;
    var radio1 = document.querySelector('#radio1');
    radio1.innerHTML = translation.radio1;
    var radio2 = document.querySelector('#radio2');
    radio2.innerHTML = translation.radio2;
    var dropdownTitle = document.querySelector('#dropdownTitle');
    dropdownTitle.innerHTML = translation.dropdownTitle;
    var dropdown1 = document.querySelector('#dropdown1');
    dropdown1.innerHTML = translation.dropdown1;
    var dropdown2 = document.querySelector('#dropdown2');
    dropdown2.innerHTML = translation.dropdown2;
    var exportButton = document.querySelector('#export');
    exportButton.innerHTML = translation.exportPageSelectButton;
    var backButton1 = document.querySelector("#back1");
    var generatePrintoutButton = document.querySelector("#generatePrintout");
    generatePrintoutButton.innerHTML = translation.generateButton;
    backButton1.innerHTML = translation.backButton;


    // Declaring listeners
    generatePrintoutButton.onclick = () => {
        alertBox.style.display = "none";
        zipAndSendImages();
    }

    exportButton.onclick = () => {
        document.querySelector("#alertBox").style.display = "none";
    }

    backButton1.onclick = () => {
        displayOne("fourthPage");
        document.querySelector('#alertBox').style.display = "none";

    }

    continueButton.onclick = () => {
        displayOne("fourthPage");
        document.querySelector('#alertBox').style.display = "none";

    }



    //Called when the user clicks on the "Specify Layout" button, after the renditions are generated
    const zipAndSendImages = async () => {
        // Show loading indicator
        document.querySelector("#generatingDiv").style.display = "flex";
        generatePage.style.display = "none";

        // Check if there's only one blob in the array
        if (imageBlobs.length === 1) {
            // Send the single image directly
            const formData = new FormData();
            formData.append('file', imageBlobs[0]);
            formData.append('contentType', imageBlobs[0].type);
            //Make the API call to the server
            sendFormData(formData);

        } else {
            // More than one blob, proceed with zipping
            const zip = new JSZip();

            imageBlobs.forEach((blob, index) => {
                zip.file('image' + index + "." + selectedFormat, blob);

            });

            zip.generateAsync({ type: 'blob' })
                .then(zipBlob => {
                    const formData = new FormData();
                    formData.append('file', zipBlob);
                    formData.append('zip', true);
                    formData.append('contentType', imageBlobs[0].type);
                    //Make the API call to the server
                    sendFormData(formData);
                })
                .catch(error => {
                    console.error('Error: Looks like the server is not responding. ', error);
                })

        }
    };


    const sendFormData = (formData) => {
        fetch(apiEndPoint + "/upload", {
            method: 'POST',
            body: formData,
        })
            .then(response => {
                document.querySelector("#generatingDiv").style.display = "none";
                if (response.ok) {
                    return response.json();
                } else {
                    console.error(`HTTP error! Status: ${response.status}`);
                    // Handle 403: Forbidden
                    if (response.status === 403) {
                        generatePage.style.display = "block";
                        var firstDiv = document.querySelector('#alertBox > div:nth-of-type(1)');
                        var secondDiv = document.querySelector('#alertBox > div:nth-of-type(2)');
                        firstDiv.innerHTML = translation.error403AlertHeader;
                        secondDiv.innerHTML = translation.error403AlertDescription;
                        alertBox.classList.add("spectrum-InLineAlert--negative");
                        alertBox.style.display = "block";
                        return Promise.reject('Server error');

                    } else if (response.status === 400) {
                        // Handle 400: Bad Request. In our case, this means the file is too large
                        fourthPageDiv.style.display = "block";
                        var firstDiv = document.querySelector('#alertBox > div:nth-of-type(1)');
                        var secondDiv = document.querySelector('#alertBox > div:nth-of-type(2)');
                        firstDiv.innerHTML = translation.sizeLimitAlertHeader;
                        secondDiv.innerHTML = translation.sizeLimitAlertDescription;
                        alertBox.classList.add("spectrum-InLineAlert--notice");
                        alertBox.style.display = "block";
                        return Promise.reject('Server error');
                    } else if (response.status === 500) {
                        // Handle 500: Internal Server Error
                        generatePage.style.display = "block";
                        var firstDiv = document.querySelector('#alertBox > div:nth-of-type(1)');
                        var secondDiv = document.querySelector('#alertBox > div:nth-of-type(2)');
                        firstDiv.innerHTML = translation.error500AlertHeader;
                        secondDiv.innerHTML = translation.error500AlertDescription;
                        alertBox.classList.add("spectrum-InLineAlert--negative");
                        alertBox.style.display = "block";
                        return Promise.reject('Server error'); 
                    }
                }
            })
            .then(data => {
                if (data) {
                    document.querySelector("#generatePage").style.display = "block";
                    const imageUrl = data.imageUrl;   
                    //openNewTab(serverUrl + '/print-on-labels?imgUrl=' + imageUrl);
                    openNewTab(serverUrl + '/print-on-labels?frm=express&imgUrl=' + imageUrl);
                }
            })
            .catch(error => {
                console.error('Error: Server is not bringing back the image URL. ', error);
                //TODO Build a retry div which will have a retry button.

            });
    };


    //Populates the image-container div with the images from the imageBlobs array
    const populateGeneratePage = () => {
        hideAll();
        showElement("generatePage");
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

 
    // when replaceHrefFallback is false, it will fall back to opening the modal dialog
    const openNewTab = (url, replaceHrefFallback) => {
        // Fallback to either replacing the href, or opening a modal dialog
        const fallBack = (url, replaceIt) => {
            if (replaceIt) {
            // Inform the user and replace location
            document.querySelector('#alertBox').style.display = "block";
            var firstDiv = document.querySelector('#alertBox > div:nth-of-type(1)');
            var secondDiv = document.querySelector('#alertBox > div:nth-of-type(2)');
            alertBox.classList.add("spectrum-InLineAlert--negative");
            firstDiv.innerHTML = 'Pop-up blocked <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-InLineAlert-icon" focusable="false" aria-hidden="true"><use xlink:href="#alert" /></svg> ';
            secondDiv.innerHTML ="To allow us to open a new tab, please enable pop-ups for new.express.adobe.com in this browser.";
            // window.location.href = url;
            } else {
            // openInFrameDialog(url,imageUrl);
            openPrintingDialog(url);
            }
        }

        // Try to open the URL in a new tab
        var newTab;
        try {
        newTab = window.open(url, '_blank');
        }
        catch (err) {
        fallBack(url, replaceHrefFallback);
        return;
        }
        if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
        //Pop-up blockers stopped it
        fallBack(url, replaceHrefFallback) ;
        }
    
    };


    const openPrintingDialog = (url) => {
        addOnUISdk.app.showModalDialog({
            variant: "information",
            title: translation.openPrintingDialogHeader,
            description: translation.openPrintingDialogDescription,
            buttonLabels: { primary: translation.firstPageContinueButton }
        }).then((result) => {
            if (result.buttonType === "primary") {
            // If even modal dialog fails to open a new tab, fall back to replacing the href
            openNewTab(url, true);
            }
        });
    };
    //Handles the error when the user is not entitled to premium content
    const showPremiumContentError = async () => {
        addOnUISdk.app.showModalDialog({
            variant: "error",
            title: translation.upgradeDialogHeader,
            description: translation.upgradeDialogDescription,
            buttonLabels: { secondary: translation.upgradeDialogButton }

        }).then((result) => {
            if (result.buttonType === "secondary") {
                window.open("https://www.adobe.com/go/express_addons_pricing", "_blank");
            }

        });
        fourthPageDiv.style.display = "block";
        document.querySelector('#loadingDiv').style.display = "none";
    };

    // Get the selected range from the radio buttons
    const getSelectedRange = () => {
        const selectedRadio = rangeSelect.querySelector('sp-radio[checked]');
        return selectedRadio ? selectedRadio.value : null;
    };

    document.querySelector("#export").onclick = async () => {
        const { app, constants } = addOnUISdk;
        const { Range, RenditionFormat } = constants;
        const selectedRange = getSelectedRange();
        alertBox.style.display = "none";
        selectedFormat = document.querySelector("#formatSelect").value; // Get the selected format from the dropdown
        // Creates the rendition options 
        const renditionOptions = {
            range: selectedRange === "currentPage" ? Range.currentPage : Range.entireDocument,
            format: RenditionFormat[selectedFormat],
        };
        console.log('OPTIONS',renditionOptions);
        document.querySelector("#loadingDiv").style.display = "flex";
        fourthPageDiv.style.display = "none";
        try {

            // Creates the rendition
            const renditions = await app.document.createRenditions(renditionOptions);
            const blobs = renditions.map(rendition => rendition.blob);
            imageBlobs = blobs;
            // Check if the size of the images is over the limit of 100MB and display an alert
            if (isOverSize(imageBlobs)) {
                fourthPageDiv.style.display = "block";
                document.querySelector('#loadingDiv').style.display = "none";
                var firstDiv = document.querySelector('#alertBox > div:nth-of-type(1)');
                var secondDiv = document.querySelector('#alertBox > div:nth-of-type(2)');
                firstDiv.innerHTML = translation.sizeLimitAlertHeader;
                secondDiv.innerHTML = translation.sizeLimitAlertDescription;
                document.querySelector('#alertBox').classList.add("spectrum-InLineAlert--notice");
                document.querySelector('#alertBox').style.display = "block";
                return;
            }
            // Check if the size of the images is under the limit of 10KB and display an alert
            else if (isUnderByteSize(imageBlobs)) {

                var firstDiv = document.querySelector('#alertBox > div:nth-of-type(1)');
                var secondDiv = document.querySelector('#alertBox > div:nth-of-type(2)');
                firstDiv.innerHTML = translation.underSizeLimitAlertHeader;
                secondDiv.innerHTML = translation.underSizeLimitAlertDescription;
                document.querySelector('#alertBox').classList.add("spectrum-InLineAlert--notice");
                document.querySelector('#alertBox').style.display = "block";
                populateGeneratePage();
                document.querySelector("#loadingDiv").style.display = "none";
               
                return;
            }

            // If the size is within the limits, populate the generate page with the images
            populateGeneratePage();
            document.querySelector("#loadingDiv").style.display = "none";

        } catch (err) {
            if (err.message?.includes("USER_NOT_ENTITLED_TO_PREMIUM_CONTENT")) {
                showPremiumContentError();
            }
        }

    };
});

// Checks if the size of the images is under the limit of 10KB
const isUnderByteSize = (arrayOfBlobs) => {

    for (const blob of arrayOfBlobs) {
        if (blob.size < minimumSingleImageSize) {
            return true;
        }
    }
    return false;
}

// Checks if the size of the images is over the limit of 100MB
const isOverSize = (blobsToCheck) => {
    for (const blob of blobsToCheck) {
        if (blob.size > maxImageExportSize) {
            return true;
        }
    }
    return false;
};

// Hides an element by its ID
const hideElement = (elementId) => {
    const element = document.querySelector(`#${elementId}`);
    if (element) {
        element.style.display = 'none';
    }
};

// Shows an element by its ID
const showElement = (elementId) => {
    const element = document.querySelector(`#${elementId}`);
    if (element) {
        element.style.display = 'block';
    }
}

// Hides all the pages
const hideAll = () => {
    hideElement("firstPage");
    hideElement("fourthPage");
    hideElement("generatePage");
}

// Shows a page by its ID
const displayOne = (elementId) => {
    hideAll();
    showElement(elementId);
}


  // const openInFrameDialog=(url,imageUrl)=>{
    //     console.log('11111111111',url);
    //     document.querySelector('#specifyLayout').action=url;
    //      document.querySelector('#imageUrlId').value=imageUrl;
    //     document.querySelector('#openPrintingDialogDiv').style.display="block";
    //     generatePage.style.display = "none";
    // }

    
//     const openPrintingDialog = (url) => {
//         addOnUISdk.app.showModalDialog({
//             variant: "information",
//             title: translation.openPrintingDialogHeader,
//             description: translation.openPrintingDialogDescription,
//             buttonLabels: { primary: translation.firstPageContinueButton }

//         }).then((result) => {
//             if (result.buttonType === "primary") {
//                 window.open(url, "_blank");
//             }

//         });
//     };
    // const openNewTab = (url) => {
    //     var newTab;

    //     // Try to open the URL in a new tab
    //     try {
    //         newTab = window.open(url, '_blank');
    //     }
    //     catch (err) {
    //         // openInFrameDialog(url,imageUrl);
    //         openPrintingDialog(url);
    //         return;
    //     }

    //     // Fallback to opening in a new tab if the popup blocker blocked the new tab
    //     if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
    //         //  openInFrameDialog(url,imageUrl);
    //         openPrintingDialog(url);
    //     }

    //     //openPrintingDialog(url);
    // };