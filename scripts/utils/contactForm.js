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

/* Fonction pour avoir le focus à l'intérieur d'un élément comme le formulaire*/
const trapFocus = (element, prevFocusableElement = document.activeElement) => {
    /* Sélection de tous les éléments focusables à l'intérieur de l'élément donné*/
    const focusableEls = Array.from(
        element.querySelectorAll('[tabindex]:not([tabindex="-1"])')
    );    
    /* Premier élément focusable dans la liste*/
    const firstFocusableEl = focusableEls[0];
    /* dernier élément focusable dans la liste*/
    const lastFocusableEl = focusableEls[focusableEls.length - 1];
    /* Variable pour suivre l'élément actuellement focusé*/
    let currentFocus = null;

    /* focus sur le premier element*/
    firstFocusableEl.focus();
    currentFocus = firstFocusableEl;
    /* gérer le focus lors de l'utilisation des touches de direction*/

    const handleFocus = e => {
        e.preventDefault();
        if (focusableEls.includes(e.target)) {
            currentFocus = e.target;
        } else {
            /* si l'utilisateur essaie de sortir de l'élément, rediriger le focus vers le début ou la fin*/
            if (currentFocus === firstFocusableEl) {
                lastFocusableEl.focus();
            } else {
                firstFocusableEl.focus();
            }
            currentFocus = document.activeElement;
        }
    };
/* parcourir tous les éléments pour les définir comme focusables*/
    focusableEls.forEach((el, index) => {
            /*Ajout d'événements de gestion du focus pour les touches de direction (haut et bas) */
        el.addEventListener("keydown", function (event) {
            if (event.key === "ArrowDown") {
                event.preventDefault();
                const nextIndex = (index + 1) % focusableEls.length;
                focusableEls[nextIndex].focus();
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                const prevIndex = (index - 1 + focusableEls.length) % focusableEls.length;
                focusableEls[prevIndex].focus();
            }
        });
    });

    /* Ajout d'un événement global pour suivre le focus à l'intérieur de l'élément*/
    document.addEventListener("focus", handleFocus, true);

/* Retourne un objet avec une méthode onClose pour remover le gestionnaire de focus */
    return {
        onClose: () => {
            document.removeEventListener("focus", handleFocus, true);
            /* si le focus est sur le dernier élément, rediriger le focus vers le premier*/
            prevFocusableElement.focus();
        }
    };
};

/* Fonction pour afficher le modal de contact */
async function displayModal() {
    let trapped;
    /*afficher ou masquer le modal de contact */
    const modal = document.getElementById("contact_modal");
    if (modal.getAttribute('aria-hidden') === "true") {
        modal.style.display = "flex";
        modal.setAttribute('aria-hidden', false)
        /* appel de la fonction trapFocus pour avoir le focus sur le formulaire */
        trapped = trapFocus(modal);
    } else {
        /* sinon on masque le modal de contact */
        modal.style.display = "none";
        /* onclose pour retirer le focus quand le modal est masqué */
        if (trapped && trapped.onClose) {
            trapped.onClose();
        }
    }
/* récupérer l'id du photographe depuis l'URL */
    const photographerId = urlParams();
    if (!photographerId) {
        console.error("Aucun ID de photographe spécifié dans l'URL");
        return;
    }
/* attendre que les données soient récupérées */
    const data = await getPhotographerData();
/* si les données sont récupérées*/
    if (data.photographers) {
        /* Recherche du photographe par son ID dans la liste des photographes */
        const photographer = data.photographers.find(photographe => photographe.id === parseInt(photographerId));
/* si le photographe est trouvé */
        if (photographer) {
            modal.style.display = "flex";
            const modal_title = document.getElementById("contact_modal_title");
            modal_title.innerHTML = `<h2> contactez-moi <br/>${photographer.name}</h2>`;
        } else {
            console.error("Photographe introuvable pour l'ID : " + photographerId);
        }
    }
}


/* Fonction pour fermer le modal de contact */
function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
}
/* Gestionnaire de touche pour fermer le modal de contact */
window.addEventListener('keydown', function (e) {
    if (e.key == 'Escape') {
        e.preventDefault();
        closeModal();
    }
});
/* Fonction pour récupérer l'id du photographe depuis l'URL */
function urlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

/* Fonction pour soumettre le formulaire de contact du photographe */
function submitForm(e) {
    e.preventDefault();

    const form = document.querySelector("form");

    const photographerId = urlParams();

    if (photographerId) {
        const formData = new FormData(form);
        formData.forEach((value, key) => {
            console.log(key + ": " + value);
        })
        closeModal();
        form.reset();
    } else {
        console.error("Aucun ID de photographe spécifié dans l'URL.");
    }
}
/* au subtmit du form, on appelle la fonction submitForm */
const form = document.querySelector("form");
form.addEventListener("submit", submitForm);

/* gestionnaire de touche pour soumettre le formulaire de contact */
form.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        submitForm(event);
    }
})