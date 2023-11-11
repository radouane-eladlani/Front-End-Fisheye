/* classe MediaPhotoVideo sert a la construction des cartes */
class MediaPhotoVideo {
    constructor(data) {
        this.id = data.id;
        this.photographerId = data.photographerId;
        this.title = data.title;
        if ("image" in data) {
            this.image = data.image;
        } else {
            this.video = data.video;
        }
        this.likes = data.likes;
        this.date = data.date;
        this.price = data.price;
    }
    /* genererCarte permet de construire les cartes */
    genererCarte(index, media) {
        /* Je creer l'article */
        const article = document.createElement('article');
        /* j'ajoute un tabindex de 0 pour la nvigation au clavier*/
        article.tabIndex = 0;
        /* je creer un addEventListener pour les focus  */
        article.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                /* activeElement permet de recuperer le focus */
                if (document.activeElement === likesElement) {
                    if (likesElement.classList.contains("liked")) {
                        this.likes--;
                        likesElement.innerHTML = `${this.likes} <i class="fa-regular fa-heart noLike" aria-hidden="true"></i>`;
                        likesElement.classList.remove("liked");
                        /* je recupere id totalLikes puis je le converti en entier et j'ajoute un textContent et le nombre sera -1 */
                        document.getElementById("totalLikes").innerHTML = parseInt(document.getElementById("totalLikes").textContent) - 1;
                    } else {
                        this.likes++;
                        likesElement.innerHTML = `${this.likes} <i class="fa-solid fa-heart like" aria-hidden="true"></i>`;
                        likesElement.classList.add("liked");
                        /* je recupere id totalLikes puis je le converti en entier et j'ajoute un textContent et le nombre sera -1 */
                        document.getElementById("totalLikes").innerHTML = parseInt(document.getElementById("totalLikes").textContent) + 1;
                    }
                } else {
                    this.openLightbox(index, `assets/images/${this.photographerId}/${this.image}`);
                }
            }
        });

        if ("image" in this) {
            const photoElement = document.createElement('img');
            photoElement.src = `assets/images/${this.photographerId}/${this.image}`;
            photoElement.alt = `Photographie : ${this.title}`
            photoElement.date = this.date;
            photoElement.classList.add("imgVideo");
            photoElement.addEventListener('click', () => {
                this.openLightbox(index, `assets/images/${this.photographerId}/${this.image}`);
            });

            article.appendChild(photoElement);

        } else {
            const videoElement = document.createElement('video');
            videoElement.src = `assets/images/${this.photographerId}/${this.video}`;
            videoElement.alt = `Vidéo : ${this.title}`
            videoElement.date = this.date;
            videoElement.controls = true;
            videoElement.classList.add("imgVideo");
            videoElement.addEventListener('click', () => {
                modalVideo.src = `assets/images/${this.photographerId}/${this.video}`;
                modalVideo.title = this.title;
                this.openLightbox(index, `assets/images/${this.photographerId}/${this.video}`);
            });

            article.appendChild(videoElement);


        }
        const divH3EtLike = document.createElement('div');
        divH3EtLike.classList.add("flexBetween");
        const titleElement = document.createElement('h3');
        titleElement.textContent = this.title;
        const likesElement = document.createElement('i');
        likesElement.classList.add("flexInline")
        likesElement.innerHTML = `${this.likes} <i class="fa-regular fa-heart noLike" aria-hidden="true"></i>`;
        likesElement.tabIndex = 0;
        likesElement.addEventListener('click', () => {
            /* si le coeur est like on le retire sinon on l'ajoute avec du style */
            if (likesElement.classList.contains("liked")) {
                this.likes--;
                likesElement.innerHTML = `${this.likes} <i class="fa-regular fa-heart noLike" aria-hidden="true"></i>`;
                likesElement.classList.remove("liked");
                /* je recupere id totalLikes puis je le converti en entier et j'ajoute un textContent et le nombre sera -1 */
                document.getElementById("totalLikes").innerHTML = parseInt(document.getElementById("totalLikes").textContent) - 1;

            } else {
                this.likes++;
                likesElement.innerHTML = `${this.likes} <i class="fa-solid fa-heart like" aria-hidden="true"></i>`;
                likesElement.classList.add("liked");
                /* je recupere id totalLikes puis je le converti en entier et j'ajoute un textContent et le nombre sera +1 */
                document.getElementById("totalLikes").innerHTML = parseInt(document.getElementById("totalLikes").textContent) + 1;
            }

        });
        totalLikesMedia(media);


        divH3EtLike.appendChild(titleElement);
        divH3EtLike.appendChild(likesElement);
        article.appendChild(divH3EtLike);

        return article;
    }
/* je creer une fonction openLightbox */
    openLightbox(indexImg, elementSrc) {
        const modal = document.querySelector('.lightbox');
        const containerImage = document.getElementById('image-carousel');
        const modalTitle = document.getElementById('lightbox-title');
        /* je recupere l'index de l'image dans le tableau */
        currentIndex = indexImg;
        /* ensuite je fais containerImage.replaceChildren pour vider le containerImage */
        containerImage.replaceChildren([]);
        /* ensuite je declare un childElement */
        let childElement;
        /* si l'image est une image je creer une image sinon une video */
        if ("image" in this) {
            childElement = this.createImage(elementSrc);
        } else {
            childElement = this.createVideo(elementSrc);
        }
        /* j'ajoute le title de l'image */
        modalTitle.textContent = this.title;
        /* j'ajoute le childElement au containerImage */
        containerImage.appendChild(childElement)
        /* je regle la modal avec un display flex */
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
    }
    /* je creer un element image et video */
    createImage(elementSrc) {
        const image = document.createElement('img');
        image.id = "lightbox-image";
        image.src = elementSrc;
        image.alt = this.title;
        return image;
    }
    createVideo(elementSrc) {
        const video = document.createElement('video');
        video.classList.add('video');
        video.id = "lightbox-video";
        video.src = elementSrc;
        video.alt = this.title;
        video.controls = true;
        return video;
    }
}



const modal = document.querySelector('.lightbox');
const containerImage = document.getElementById('image-carousel');
let modalImage = document.getElementById('lightbox-image');
let modalVideo = document.getElementById('lightbox-video');
const modalTitle = document.getElementById('lightbox-title');
let imagesData = [];

let currentIndex = 0;

const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const closeButton = document.getElementById('close-button');

/* Fonction pour récupérer l'id du photographe depuis l'URL */
function getPhotographerId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}
/* Fonction d'initialisation */
function init() {
    try {
        /* Je récupère l'ID du photographe depuis l'URL */
        const photographerId = getPhotographerId()
        /* Si aucun ID de photographe n'est présent dans l'URL, je génère une erreur */
        if (!photographerId) {
            throw new Error("Aucun ID de photographe spécifié dans l'URL.");
        }

        /* Je récupère les données du photographe depuis le fichier JSON */
        fetch('data/photographers.json')
            .then((response) => response.json())
            .then((data) => {
                /* Je recherche le photographe avec l'ID." et je reconverti l'ID en un nombre */

                const selectedPhotographer = data.photographers.find(photographer =>

                    photographer.id === parseInt(photographerId)
                );
                /* Si aucun photographe n'est trouvé avec l'ID spécifié, je génère une erreur */
                if (!selectedPhotographer) {
                    throw new Error("Le photographe avec l'ID spécifié n'a pas été trouvé.");
                }

                /* Récupérer les médias pour ce photographe */
                const media = data.media.filter(media =>
                    media.photographerId === parseInt(photographerId)
                );

                /* Appeler la fonction pour afficher les informations du photographe */
                changeImage(selectedPhotographer);

                /* Charger les données des images du photographe */
                imagesData = media;
            })
            .catch((error) => {
                console.error('Erreur lors de la requête :', error);
            });
    } catch (error) {
        /* En cas d'erreur, j'affiche un message d'erreur dans la console */
        console.error("Erreur lors de la récupération des données :", error.message);
    }
}

init()

function closeLightbox() {
    modal.style.display = 'none';
}

function prevPhoto() {
    /* je recupere l'index de l'image dans le tableau et j'enleve 1 pour avoir l'image precedente */
    currentIndex = (currentIndex - 1) ;
    changeImage(imagesData[currentIndex]);
}

function nextPhoto() {
    currentIndex = (currentIndex + 1);
    changeImage(imagesData[currentIndex]);
}

function changeImage(imageData) {
    /* containerImage.replaceChildren pour vider le containerImage */
    containerImage.replaceChildren([])
    /* si image est une image je creer une image sinon une video */
    if ("image" in imageData) {
        const image = document.createElement('img');
        image.id = "lightbox-image";
        /* ajouter l'image au containerImage */
        containerImage.appendChild(image)
        modalImage = document.getElementById('lightbox-image');
        modalImage.src = `assets/images/${imageData.photographerId}/${imageData.image}`;
        modalImage.alt = imageData.title;
        modalTitle.textContent = imageData.title;
    } else {
        const video = document.createElement('video');
        video.id = "lightbox-video";
        video.classList.add('video');
        video.controls = true;
        containerImage.appendChild(video)
        modalVideo = document.getElementById('lightbox-video');
        modalVideo.src = `assets/images/${imageData.photographerId}/${imageData.video}`;
        modalTitle.textContent = imageData.title;
    }
}

prevButton.addEventListener('click', () => {
    prevPhoto();
});

nextButton.addEventListener('click', () => {
    nextPhoto();
});

closeButton.addEventListener('click', () => {
    closeLightbox();
});

window.addEventListener('keydown', function (e) {
    if (e.key == 'Escape') {
        e.preventDefault();
        closeLightbox();
    }
});

window.addEventListener('keydown', function (e) {
    if (e.key == 'ArrowLeft') {
        e.preventDefault();
        prevPhoto();
    }
})
window.addEventListener('keydown', function (e) {
    if (e.key == 'ArrowRight') {
        e.preventDefault();
        nextPhoto();
    }
})

/* Fonction pour afficher ou masquer le menu déroulant*/
function toggleMenu() {
    const dropdownContent = document.querySelector('.dropdown-content');
    dropdownContent.classList.toggle('active');
    document.querySelector('.chevron').classList.toggle('rotate');
}

/* Fonction pour mettre à jour le texte du bouton de tri lors du click*/
function updateSortButtonText(button, newText) {
    button.textContent = newText;
}

/* Fonction pour masquer un bouton et afficher l'option sélectionnée*/
function hideButtonAndShowSelectedOption(button, selectedOption) {
    if (selectedOption) {
        selectedOption.style.display = 'block';
    }
    button.style.display = 'none';
}

/*Fonction pour trier les données en fonction du type de tri*/
function sortImages(sortType) {
    switch (sortType) {
        case 'Popularité':
            return imagesData.slice().sort((a, b) => b.likes - a.likes);
        case 'Date':
            return imagesData.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
        case 'Titre':
            return imagesData.slice().sort((a, b) => a.title.localeCompare(b.title));
        default:
            return imagesData;
    }
}

/* Fonction pour mettre à jour l'affichage après le tri*/
function updateDisplay() {
    genererCarte();
    toggleMenu();
}

/*Écouteur d'événement pour le clic sur le bouton de tri*/
function handleFilterClick(filter) {
    return () => {
        /* recuperer le texte du bouton de tri */
        const filterValue = filter.textContent;
        /* mettre le texte du bouton de tri dans le bouton de tri */
        updateSortButtonText(currentSort, filterValue);
        /* masquer le bouton et afficher l'option choisie */
        hideButtonAndShowSelectedOption(filter, optionFilters);
        /* changer l'option de tri */
        optionFilters = filter;
        /* trier les données en fonction du type de tri */
        const sortedData = sortImages(filterValue);
        /* mettre a jour la variable globale qui contient les données trieées*/
        imagesData = sortedData;
        updateDisplay();
    };
}

/* Sélection des éléments du DOM*/
const btnDropdown = document.querySelector('.btn-dropdown');
/* Ajout d'écouteur d'événements au bouton de tri pour afficher ou masquer le menu déroulant*/
btnDropdown.addEventListener('click', toggleMenu);
/*selectionner tous les boutons de tri  */
const allFilters = Array.from(document.querySelectorAll('.dropdown-content li button'));
allFilters.tabIndex = 0;
const currentSort = document.getElementById('sort');
/*masquer le bouton currenSort*/
let optionFilters = allFilters.find((filter) => filter.textContent === currentSort.textContent);
optionFilters.style.display = 'none';
/*pour chaque bouton de tri on ajoute un écouteur d'événements avec la fonction handleFilterClick */
allFilters.forEach((filter) => {
    filter.addEventListener('click', handleFilterClick(filter));
});

/*Fonction pour générer les cartes d'affichage des médias*/
function genererCarte() {
    /* Je vide le conteneur des cartes */
    const mediaContener = document.getElementById('mediaContener');
    mediaContener.innerHTML = '';
/* Pour chaque image je crée une carte */
    for (let i = 0; i < imagesData.length; i++) {
        /* Je crée une nouvelle instance de la classe MediaPhotoVideo */
        const mediaInstance = new MediaPhotoVideo(imagesData[i]);
        /* Je l'ajoute au conteneur */
        const mediaCard = mediaInstance.genererCarte(i, imagesData);
        mediaContener.appendChild(mediaCard);
    }
}