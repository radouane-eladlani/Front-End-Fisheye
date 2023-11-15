/* afficher les informations des photographes */
function photographerTemplate(data) {
    /* je recupere les donnees du photographe */
    const { name, portrait, price, city, country, tagline, id } = data;

    /* Chemin de l'image du photographe*/
    const picture = `assets/photographers/${portrait}`;

    /* Fonction pour créer l'élément DOM représentant le photographe*/
    function getUserCardDOM() {
        /* je creer un l'element article pour ratacher tous les informations du photographe*/
        const article = document.createElement('article');
        article.tabIndex = 0;
        /*Création d'un élément img pour afficher la photo du photographe*/
        const img = document.createElement('img');
        img.setAttribute("src", picture)
        img.setAttribute("alt", `${name} photo`)
        img.setAttribute("role", "button");
        img.setAttribute("tabindex", "0");
        /* Ajout d'un event listener sur l'image pour rediriger vers la page du photographe*/
        img.addEventListener("click", () => {
            window.location.href = a.getAttribute("href");
        });
        /* Ajout d'un event listener sur l'image pour rediriger vers la page du photographe*/
        article.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                window.location.href = `photographe.html?id=${id}`;
            }
        })
        /* Création d'un élément "a" (lien) pour rediriger vers la page du photographe*/
        const a = document.createElement('a');
        a.setAttribute("href", `photographe.html?id=${id}`);
        a.textContent = `${name}`;
        /* Création d'un élément h2 pour afficher la ville et le pays du photographe*/
        const h2 = document.createElement('h2');
        h2.textContent = `${city}, ${country}`;
        /* Création d'un élément h3 pour afficher la tagline du photographe*/
        const pTagline = document.createElement('h3');
        pTagline.textContent = `${tagline}`;
        /* Création d'un élément p pour afficher le prix du photographe*/
        const prix = document.createElement('p');
        prix.textContent = `${price}€/jour`;
        /* ratacher les informations du photographe*/
        a.appendChild(img);
        article.appendChild(img);
        article.appendChild(a);
        article.appendChild(h2);
        article.appendChild(pTagline);
        article.appendChild(prix);
        return (article);

    }
    return { name, picture, price, city, country, tagline, getUserCardDOM }
}

/* permet de changer le focus au clavier*/
document.addEventListener('keydown', function (event) {
    
    if (event.key === "Tab") {
        /* Recherche des éléments focusables*/
        const focusableElements = document.querySelectorAll("[tabindex]");
        const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
/* Permet de changer le focus au clavier*/
        if (currentIndex === -1) {
            focusableElements[0].focus();
        } else {
            const nextIndex = (currentIndex + 1) % focusableElements.length;
            focusableElements[nextIndex].focus();
        }
        event.preventDefault();
    }
});











