/* Récupérer les données des photographes */
async function getPhotographerData() {
    try {
        const response = await fetch('data/photographers.json');
        if (!response.ok) {
            throw new Error("La requête a échoué");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        return {};
    }
}

/* afficher les données des photographes */
function photographerProfile(data) {
    /* je recupere les informations du photographe */
    const { name, portrait, city, country, tagline } = data;
    /* je creer une constante picture et je lui passe la valeur de portrait*/
    const picture = `assets/photographers/${portrait}`;

    /* je creer une function getPhotographerProfileDOM 
    pour afficher les informations du photographe */
    function getPhotographerProfileDOM() {
        /* je creer un l'element article pour ratacher les informations du photographe*/
        const article = document.createElement('article');
        /* je creer l'element h2 */
        const nameElement = document.createElement('h2');
        /* ensuite je fais nameElement.textContent pour afficher le nom */
        nameElement.textContent = `${name}`;
        /* je creer l'element h3 */
        const h3 = document.createElement('h3');
        /* ensuite je fais  h3.textContent 
        pour afficher la ville et le pays */
        h3.textContent = `${city}, ${country}`;
        /* je creer l'element p */
        const pTagline = document.createElement('p');
        /* ensuite je fais pTagline.textContent pour afficher la tagline */
        pTagline.textContent = `${tagline}`;
        /* je creer l'element img */
        const img = document.createElement('img');
        /* ensuite je fais img.setAttribute pour attribuer la valeur de picture */
        img.setAttribute("src", picture);
        /* ensuite je fais img.setAttribute pour attribuer l'alt */
        img.setAttribute("alt", `${name} photo`);
        /* ensuite je appenchild les elements a l'element article */
        article.appendChild(nameElement);
        article.appendChild(h3);
        article.appendChild(pTagline);
        article.appendChild(img);

        return article;
    }
    /* en retourne la fonction pour afficher les informations du photographe */
    return { getPhotographerProfileDOM };
}
/* je creer la fonction getPhotograperIdFromUrl pour recuperer l'id */
function getPhotographerIdFromUrl() {
    /* recuperer l'URL de la page  */
    const urlParams = new URLSearchParams(window.location.search);
    /* ensuite récuperer les paramètres de l'URL */
    return urlParams.get('id');
}
/* je lance la fonction init pour afficher les informations du photographe */
async function init() {
    try {
        /* Je récupère l'ID du photographe depuis l'URL */
        const photographerId = getPhotographerIdFromUrl();
        /* Si aucun ID de photographe n'est présent dans l'URL, je génère une erreur */

        if (!photographerId) {
            throw new Error("Aucun ID de photographe spécifié dans l'URL.");
        }

        /* J'obtiens les données du photographe depuis le fichier JSON*/
        const photographerData = await getPhotographerData();
        /* Je cherche le photographe correspondant à l'ID spécifié ensuite 
        je reconverti l'ID en un nombre */
        const selectedPhotographer = photographerData.photographers.find(photographer =>
            photographer.id === parseInt(photographerId));
        /* je creer une constante media et je lui passe les données du json et ensuite 
        je filtre les media.photographerId */
        const media = photographerData.media.filter(media =>
            media.photographerId === parseInt(photographerId));
        /* je parcours la liste des medias */
        media.forEach((element, index) => {
            /* je creer une constante mediaclass et je lui passe la new class MediaPhotoVideo */
            const mediaclass = new MediaPhotoVideo(element);
            /*j'append le mediaclass a l'id mediaContener */
            document.getElementById('mediaContener').appendChild(mediaclass.genererCarte(index, media));

        });

        /* Si aucun photographe n'est trouvé avec l'ID spécifié, je génère une erreur */
        if (!selectedPhotographer) {
            throw new Error("Le photographe avec l'ID spécifié n'a pas été trouvé.");
        }

        /* j'appel la fonction displayPhotographerInfo en parametre l'ID du photographe */
        displayPhotographerInfo(selectedPhotographer);
        /* j'appel la fonction totalLikesMedia en parametre media */
        totalLikesMedia(media);
        /* j'appel la fonction priceMedia en parametre l'ID du photographe et le fichier JSON */
        priceMedia(photographerId, photographerData);



    } catch (error) {
        /* En cas d'erreur, j'affiche un message d'erreur dans la console */
        console.error("Erreur lors de la récupération des données :", error.message);
    }
}

/* Cette fonction gère l'affichage des informations du photographe dans le DOM */
function displayPhotographerInfo(selectedPhotographer) {
    const photographerName = document.getElementById('photograph-name');
    const photographerLocation = document.getElementById('photograph-city-country');
    const photographerTagline = document.getElementById('photograph-tagline');
    const photographerImage = document.getElementById('photograph-image');

    /* J'attribue les informations du photographe aux éléments HTML correspondants */
    photographerName.textContent = selectedPhotographer.name;
    photographerLocation.textContent = `${selectedPhotographer.city}, ${selectedPhotographer.country}`;
    photographerTagline.textContent = selectedPhotographer.tagline;
    photographerImage.src = `assets/photographers/${selectedPhotographer.portrait}`;

}

/* J'appelle la fonction init pour afficher les informations du photographe */
init();

/*fonction qui permet de mettre a jour le total des likes des medias */
function totalLikesMedia(media) {
    /*Utilisation de reduce pour sommer les likes de tous les médias*/
    const totalLikes = media.reduce((total, media) => total + media.likes, 0);
    /*Sélection de l'élément DOM pour afficher le new total des likes*/
    const totalLikesContainer = document.getElementById("total-likesDesMedia");
    /* Création du texte HTML avec le total des likes et l'icône de cœur*/
    const likesText = `<span id="totalLikes">${totalLikes}</span> <i class="fa-solid fa-heart"></i>`;
    /*Mise à jour du contenu de l'élément DOM avec le texte généré*/
    totalLikesContainer.innerHTML = likesText;
}
/*fonction qui permet d'avoir le prix de chaque photographe et de le mettre dans le DOM */
function priceMedia(photographerId, photographerData) {
    /*Recherche du photographe correspondant à l'ID*/
    const photographer = photographerData.photographers.find(photographer =>
        photographer.id === parseInt(photographerId));
/* si photographer alors je creer une constante pour le prix du photographe*/
    if (photographer) {
        const priceContainer = document.getElementById("price-jour");
        priceContainer.textContent = `${photographer.price}€ / jour`;
    }
}

