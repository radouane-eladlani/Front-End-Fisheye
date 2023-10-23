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

async function displayModal() {
    const photographerId = urlParams();
    if (!photographerId) {
        console.error("Aucun ID de photographe spécifié dans l'URL");
        return;
    }

    const data = await getPhotographerData();

    if (data.photographers) {
        const photographer = data.photographers.find(photographe => photographe.id === parseInt(photographerId));

        if (photographer) {
            const modal = document.getElementById("contact_modal");
            modal.style.display = "flex";
            const modal_title = document.getElementById("contact_modal_title");
            modal_title.innerHTML = `<h2> contactez-moi <br/>${photographer.name}</h2>`;
        } else {
            console.error("Photographe introuvable pour l'ID : " + photographerId);
        }
    }
}


function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
    location.reload();
  }
  window.addEventListener('keydown', function (e) {
    if (e.key == 'Escape') {
        e.preventDefault();
        closeModal();
    }
});

  
  function urlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
  }
  
  function submitForm(e) {
    e.preventDefault();

    const form = document.querySelector("form");
    
    const photographerId = urlParams();

    if (photographerId) {
        const formData = new FormData(form);

        formData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });
        
    } else {
        console.error("Aucun ID de photographe spécifié dans l'URL.");
    }

}
const form = document.querySelector("form");
form.addEventListener("submit", submitForm);
