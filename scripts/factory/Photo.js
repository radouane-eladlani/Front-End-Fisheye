class Photo {
  constructor(data) {
    this.id = data.id;
    this.photographerId = data.photographerId;
    this.title = data.title;
    this.image = data.image;
    this.likes = data.likes;
    this.date = data.date;
    this.price = data.price;
  }

  genererCarte(index) {
    const article = document.createElement('article');
    const photoElement = document.createElement('img');
    photoElement.src = `assets/images/${this.photographerId}/${this.image}`;
    photoElement.alt = this.title;
    photoElement.classList.add("imgVideo");

    const titleElement = document.createElement('h3');
    titleElement.textContent = this.title;

    photoElement.addEventListener('click', () => {
      openLightbox(index, `assets/images/${this.photographerId}/${this.image}`, this.title);
    });

    article.appendChild(photoElement);
    article.appendChild(titleElement);

    return article;
  }
}

const modal = document.querySelector('.lightbox');
const containerImage = document.getElementById('image-carousel');
let modalImage = document.getElementById('lightbox-image');
const modalTitle = document.getElementById('lightbox-title');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const closeButton = document.getElementById('close-button');

let imagesData = [];
let currentIndex = 0;
let currentPhotographerId;

function getPhotographerId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

function init() {
  try {
    /* Je récupère l'ID du photographe depuis l'URL */
    const photographerId = getPhotographerId();
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

// Appelez init() pour démarrer le chargement des données
init();

function openLightbox(indexImg, imageSrc, title) {
  currentIndex = indexImg;
  containerImage.replaceChildren([]);
  const image = document.createElement('img');
  image.id = "lightbox-image";
  image.src = imageSrc;
  image.alt = title;
  modalTitle.textContent = title;
  containerImage.appendChild(image)
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
}

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
}, true);