function photographerTemplate(data) {
    const { name, portrait, price, city, country, tagline, id } = data;

    const picture = `assets/photographers/${portrait}`;


    function getUserCardDOM() {
        const article = document.createElement('article');
        article.tabIndex = 12;
        const img = document.createElement('img');
        img.setAttribute("src", picture)
        img.setAttribute("alt", `${name} photo`)
        img.setAttribute("role", "button");
        img.setAttribute("tabindex", "0");

        img.addEventListener("click", () => {
            window.location.href = a.getAttribute("href");
        });

        article.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                window.location.href = `photographe.html?id=${id}`;
            }
        })

        const a = document.createElement('a');
        a.setAttribute("href", `photographe.html?id=${id}`);
        a.textContent = `${name}`;
        const h2 = document.createElement('h2');
        h2.textContent = `${city}, ${country}`;
        const pTagline = document.createElement('h3');
        pTagline.textContent = `${tagline}`;
        const prix = document.createElement('p');
        prix.textContent = `${price}€/jour`;

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


document.addEventListener('keydown', function (event) {
    if (event.key === "Tab") {
        const focusableElements = document.querySelectorAll("[tabindex]");
        const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);

        if (currentIndex === -1) {
            focusableElements[0].focus();
        } else {
            const nextIndex = (currentIndex + 1) % focusableElements.length;
            focusableElements[nextIndex].focus();
        }
        event.preventDefault();
    }
});











