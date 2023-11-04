
/* Récupérer les données des photographes */
async function getPhotographers() {
    try {
        /* On attend que la requête s'effectue */
        const response = await fetch("data/photographers.json");
        /* Si la requête a échoué, on affiche un message d'erreur */
        if (!response.ok) {
            throw new Error("La requête a échoué");
        }
        /* On récupère les données de la requête et on retourne data*/
        const data = await response.json();
        return data;
        /* Si il y a une erreur lors de la requête  on affiche error et 
        en retourne le tableau vide */
    } catch (error) {
        console.error("Erreur lors de la récupération des photographes :", error);
        return { photographers: [] };
    }
}
    /* afficher les données des photographes */
    async function displayData(photographers) {
        /* je recupere la class photographer_section */
        const photographersSection = document.querySelector(".photographer_section");
        /* je parcours la liste des photographes */
        photographers.forEach((photographer) => {
            /* je creer une constante photographerModel avec la fonction photographerTemplate
            et je lui passe les données de l'objet photographer pour les affichers */
            const photographerModel = photographerTemplate(photographer);
            /* je creer une constante userCardDOM et je lui passe
            la constante photographerModel avec la fonction getUserCardDOM pour les affichers*/
            const userCardDOM = photographerModel.getUserCardDOM();
            /* ensuite je ratache la constante userCardDOM a la div photographer_section */
            photographersSection.appendChild(userCardDOM);
        });
    }

    /* je lance la fonction init pour afficher les données des photographes */
    async function init() {
        const { photographers } = await getPhotographers();
        displayData(photographers);

    }

    /* je lance la fonction init */
    init();
    
    