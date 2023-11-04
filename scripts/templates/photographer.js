function photographerTemplate(data) {
    const {name,portrait,price,city,country,tagline,id} = data;

    const picture = `assets/photographers/${portrait}`;


    function getUserCardDOM() {
        const article = document.createElement( 'article' );

        const a = document.createElement( 'a' );
        a.setAttribute("href", `photographe.html?id=${id}`);

        const img = document.createElement( 'img' );
        img.setAttribute("src",picture)
        img.setAttribute("alt",`${name} photo`)
        img.addEventListener("click", () => {
            window.location.href = a.getAttribute("href");
        });
        
        const h2 = document.createElement( 'h2' );
        h2.textContent = `${name}`;
        h2.addEventListener("click", () => {
            window.location.href = a.getAttribute("href");
        });
        const h3 = document.createElement( 'h3' );
        h3.textContent = `${city}, ${country}`;
        const pTagline = document.createElement( 'h4' );
        pTagline.textContent = `${tagline}`;
        const prix = document.createElement( 'p' );
        prix.textContent = `${price}€/jour`;
        
        a.appendChild(img);
        a.appendChild(h2);

        article.appendChild(a);
        article.appendChild(img);
        article.appendChild(h2);
        article.appendChild(h3);
        article.appendChild(pTagline);
        article.appendChild(prix);
        return (article);

    }
    return { name, picture,price,city,country,tagline, getUserCardDOM }
}
