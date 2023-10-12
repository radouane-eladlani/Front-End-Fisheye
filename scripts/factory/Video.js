class Video {
  constructor(data) {
    this.id = data.id;
    this.photographerId = data.photographerId;
    this.title = data.title;
    this.video = data.video;
    this.likes = data.likes;
    this.date = data.date;
    this.price = data.price;
  }

  genererCarte(index) {
    const article = document.createElement('article');
    const videoElement = document.createElement('video');
    videoElement.src = `assets/images/${this.photographerId}/${this.video}`;
    videoElement.alt = this.title;
    videoElement.controls = true;
    videoElement.classList.add("imgVideo");

    videoElement.addEventListener('click', () => {
      modalVideo.src = `assets/images/${this.photographerId}/${this.video}`;
      modalVideo.title = this.title;
      this.openLightbox(index, modalVideo.src, modalVideo.title);
    }, true);

    const titleElement = document.createElement('h3');
    titleElement.textContent = this.title;

    article.appendChild(videoElement);
    article.appendChild(titleElement);

    return article;
  }


  openLightbox(index, videoSrc, title) {
    currentIndex = index;
    const modal = document.querySelector('.lightbox');
    containerImage.replaceChildren([]);
    const video = document.createElement('video');
    video.classList.add('video');
    video.id = "lightbox-video";
    video.src = videoSrc;
    video.alt = title;
    video.controls = true;
    modalTitle.textContent = title;
    containerImage.appendChild(video)
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
  }
}

let modalVideo = document.getElementById('lightbox-video');

function getPhotographerId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

let videoData = [];

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
        videoData = media;
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