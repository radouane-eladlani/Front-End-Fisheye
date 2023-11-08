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

    genererCarte(index, media) {
        const article = document.createElement('article');
        article.tabIndex = 0;
        article.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                if (document.activeElement === likesElement) {
                    if (likesElement.classList.contains("liked")) {
                        this.likes--;
                        document.getElementById("totalLikes").innerHTML = parseInt(document.getElementById("totalLikes").textContent) - 1;
                        likesElement.innerHTML = `${this.likes} <i class="fa-regular fa-heart noLike" aria-hidden="true"></i>`;
                        likesElement.classList.remove("liked");
                    } else {
                        this.likes++;
                        document.getElementById("totalLikes").innerHTML = parseInt(document.getElementById("totalLikes").textContent) + 1;
                        likesElement.innerHTML = `${this.likes} <i class="fa-solid fa-heart like" aria-hidden="true"></i>`;
                        likesElement.classList.add("liked");
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
            if (likesElement.classList.contains("liked")) {
                this.likes--;
                document.getElementById("totalLikes").innerHTML = parseInt(document.getElementById("totalLikes").textContent) - 1;
                likesElement.innerHTML = `${this.likes} <i class="fa-regular fa-heart noLike" aria-hidden="true"></i>`;
                likesElement.classList.remove("liked");

            } else {
                this.likes++;
                document.getElementById("totalLikes").innerHTML = parseInt(document.getElementById("totalLikes").textContent) + 1;
                likesElement.innerHTML = `${this.likes} <i class="fa-solid fa-heart like" aria-hidden="true"></i>`;
                likesElement.classList.add("liked");

            }       
    
        });        
        totalLikesDesPhotos(media);


        divH3EtLike.appendChild(titleElement);
        divH3EtLike.appendChild(likesElement);
        article.appendChild(divH3EtLike);

        return article;
    }
        
    openLightbox(indexImg, elementSrc) {
        const modal = document.querySelector('.lightbox');
        const containerImage = document.getElementById('image-carousel');
        const modalTitle = document.getElementById('lightbox-title');

        currentIndex = indexImg;
        containerImage.replaceChildren([]);
        let childElement;
        if ("image" in this) {
            childElement = this.createImage(elementSrc);
        } else {
            childElement = this.createVideo(elementSrc);
        }
        modalTitle.textContent = this.title;
        containerImage.appendChild(childElement)
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
    }

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


function getPhotographerId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

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
                const selectedPhotographer = data.photographers.find(photographer =>
                    photographer.id === parseInt(photographerId)
                );

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
    currentIndex = (currentIndex - 1 + imagesData.length) % imagesData.length;
    changeImage(imagesData[currentIndex]);
}

function nextPhoto() {
    currentIndex = (currentIndex + 1) % imagesData.length;
    changeImage(imagesData[currentIndex]);
}

function changeImage(imageData) {
    containerImage.replaceChildren([])
    if ("image" in imageData) {
        const image = document.createElement('img');
        image.id = "lightbox-image";
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


const btnDropdown = document.querySelector('.btn-dropdown');
function showHideMenu() {
    const dropdownContent = document.querySelector('.dropdown-content');    
    dropdownContent.classList.toggle('active');
    document.querySelector('.chevron').classList.toggle('rotate');
}


btnDropdown.addEventListener('click', showHideMenu);
const allFilters = Array.from(document.querySelectorAll('.dropdown-content li button'));
const currentSort = document.getElementById('sort');
allFilters.tabIndex = 0;

let optionFilters = allFilters.find((filter) => filter.textContent === 
currentSort.textContent);
optionFilters.style.display = 'none';

allFilters.forEach(filter => {
    filter.addEventListener('click', () => {
      const filterValue = filter.textContent;
      currentSort.textContent = filterValue;
      if (optionFilters) optionFilters.style.display = 'block';
      filter.style.display = 'none';
      optionFilters = filter;
      const sortedData = sortData(filterValue);
      imagesData = sortedData;
      genererCarte();
      showHideMenu();
    });
  });


const sortData = (sortType) => {
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
  };

function genererCarte() {
    const mediaContener = document.getElementById('mediaContener');
    mediaContener.innerHTML = ''; 

    for (let i = 0; i < imagesData.length; i++) {
        const mediaInstance = new MediaPhotoVideo(imagesData[i]);
        const mediaCard = mediaInstance.genererCarte(i, imagesData);
        mediaContener.appendChild(mediaCard);
    }
}
