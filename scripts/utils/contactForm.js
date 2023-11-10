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

const trapFocus = (element, prevFocusableElement = document.activeElement) => {
    const focusableEls = Array.from(
        element.querySelectorAll(
            '[tabindex]:not([tabindex="-1"])'
        )
    );
    const firstFocusableEl = focusableEls[0];
    const lastFocusableEl = focusableEls[focusableEls.length - 1];
    let currentFocus = null;

    firstFocusableEl.focus();
    currentFocus = firstFocusableEl;
    const handleFocus = e => {
        e.preventDefault();
        if (focusableEls.includes(e.target)) {
            currentFocus = e.target;
        } else {
            if (currentFocus === firstFocusableEl) {
                lastFocusableEl.focus();
            } else {
                firstFocusableEl.focus();
            }
            currentFocus = document.activeElement;
        }
    };
    focusableEls.forEach((el, index) => {
        el.addEventListener("keydown", function(event) {
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


    document.addEventListener("focus", handleFocus, true);

    return {
        onClose: () => {
            document.removeEventListener("focus", handleFocus, true);
            prevFocusableElement.focus();
        }
    };
};

async function displayModal() {

    let trapped;
    const modal = document.getElementById("contact_modal");
    if (modal.getAttribute('aria-hidden') === "true") {
        modal.style.display = "flex";
        modal.setAttribute('aria-hidden', false)
        trapped = trapFocus(modal);
    } else {
        modal.style.display = "none";
        if (trapped && trapped.onClose){
                    trapped.onClose();

        }
    }

    const photographerId = urlParams();
    if (!photographerId) {
        console.error("Aucun ID de photographe spécifié dans l'URL");
        return;
    }

    const data = await getPhotographerData();

    if (data.photographers) {
        const photographer = data.photographers.find(photographe => photographe.id === parseInt(photographerId));

        if (photographer) {
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
            }
            window.addEventListener('keydown', function (e) {
                if (e.key == 'Escape') {
                    e.preventDefault();
                    closeModal();
                    this.location.reload();
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

            form.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    submitForm(event);
                }
            })