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
    const data = await getPhotographerData();
    
    if (data.photographers && photographerId) {
        const photographer = data.photographers.find(photographe => photographe.id === parseInt(photographerId));
        
        if (photographer) {
            const modal = document.getElementById("contact_modal");
            modal.style.display = "flex";
            const modal_title = document.getElementById("contact_modal_title");
            modal_title.textContent = "Contactez-moi " + photographer.name;
        } else {
            console.error("Photographe introuvable pour l'ID : " + photographerId);
        }
    }
}

function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
}

function urlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

displayModal();