
document.addEventListener('DOMContentLoaded', () => {
    // --- životopis modal ---
    const open = document.getElementById('openCv');
    const close = document.getElementById('closeCv');
    const modal = document.getElementById('cvModal');
    const canvas = document.getElementById('pdfCanvas');
    const ctx = canvas.getContext('2d');
    let currentScale = 1;
    const url = 'pdf/zivotopis_pindakova.pdf';

    // Otevření a zavření modalu
    open.onclick = e => {
        e.preventDefault();
        modal.style.display = 'flex';
        renderPDF(currentScale);
    };
    close.onclick = () => modal.style.display = 'none';
    window.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };

    // Tlačítko tisk
    const printBtn = document.getElementById('printCv');
    printBtn.addEventListener('click', () => {
        const dataUrl = canvas.toDataURL();
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`<img src="${dataUrl}" style="width:100%">`);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    });


//vykreslení PDF na canvas
function renderPDF() {
    pdfjsLib.getDocument(url).promise.then(pdf => {
        pdf.getPage(1).then(page => {
            const containerWidth = canvas.parentElement.clientWidth;
            const containerHeight = canvas.parentElement.clientHeight;
            const dpr = window.devicePixelRatio || 1;

            const viewport = page.getViewport({ scale: 1 });

            // scale podle kontejneru a dpr pro ostrý text
            const scaleX = (containerWidth / viewport.width) * dpr;
            const scaleY = (containerHeight / viewport.height) * dpr;
            const finalScale = Math.min(scaleX, scaleY); // zachová poměr stran

            const scaledViewport = page.getViewport({ scale: finalScale });

            // canvas fyzické pixely
            canvas.width = scaledViewport.width;
            canvas.height = scaledViewport.height;

            // canvas vizuální velikost (CSS)
            canvas.style.width = (scaledViewport.width / dpr) + 'px';
            canvas.style.height = (scaledViewport.height / dpr) + 'px';

            page.render({
                canvasContext: ctx,
                viewport: scaledViewport
            });
        });
    });
}



    // --- active link highlight ---
    const currentPage = window.location.pathname.split("/").pop();
    const links = document.querySelectorAll(".navigation a");

    links.forEach(link => {
        const href = link.getAttribute("href");
        if (href === currentPage || (href === "index.html" && currentPage === "")) {
            link.classList.add("active");
        }
    });

    // --- slideshow ---
    const slides = document.querySelectorAll(".slide");

if (slides.length > 0) {
    let current = 0;
    setInterval(() => {
        slides[current].classList.remove("active");
        current = (current + 1) % slides.length;
        slides[current].classList.add("active");
    }, 3000);
}

    // darkmode
    const toggleBtn = document.getElementById('toggle-dark');
    const darkIcon = document.getElementById('dark-icon');
    const tooltip = document.getElementById('tooltip');

    // Funkce pro nastavení ikonky a tooltipu podle stavu dark mode
    function updateIcon() {
        if (document.body.classList.contains('dark')) {
            darkIcon.className = 'fa-solid fa-moon';  // plný žlutý měsíc
            darkIcon.style.color = '#FFD43B';
            tooltip.textContent = 'LUMOS!';
        } else {
            darkIcon.className = 'fa-regular fa-moon'; // prázdný měsíc
            darkIcon.style.color = '#aaa'; // světlý měsíc ve světlém módu
            tooltip.textContent = 'NOX!';
        }
    }

    // Výchozí nastavení podle OS nebo uložené preference
    if ((!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
        || localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
    }
    updateIcon();

    // Přepínání dark mode po kliknutí
    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark');

        // Uložení preference
        localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');

        // Aktualizace ikonky a tooltipu
        updateIcon();
    });

    // Vyčistí formulář po návratu ze stránky Formspree
    window.addEventListener("pageshow", function (event) {
        const form = document.querySelector("form");
        if (form) form.reset();
    });


    // --- e-mail obfuskování ---
    const emailContainer = document.getElementById('email-link');
    if (emailContainer) {
        const parts = ['cz', 'seznam', 'teri.pindakova'];
        const email = `${parts[2]}@${parts[1]}.${parts[0]}`;

        const a = document.createElement('a');
        a.href = 'mailto:' + email;
        a.textContent = email;
        a.setAttribute('aria-label', 'E-mail: ' + email);

        emailContainer.appendChild(a);
    }



    // --- modal obrázky v sekci about ---
    // výběr overlay a jeho obsah
const modalAbout = document.getElementById('imageModal');
const modalImgAbout = document.getElementById('modalImage');
const modalCloseAbout = document.querySelector('.modal-close-about');
const prevBtn = document.querySelector('.modal-prev-about');
const nextBtn = document.querySelector('.modal-next-about');

// seznam obrázků
const images = Array.from(document.querySelectorAll('.modal-trigger'));
let currentIndex = 0;

// otevření modalu kliknutím na obrázek
images.forEach((imgLink, index) => {
  imgLink.addEventListener('click', function(e) {
    e.preventDefault();
    currentIndex = index;
    modalImgAbout.src = this.href;
    modalAbout.style.display = "flex";
  });
});

// navigace šipkami
prevBtn.addEventListener('click', (e) => {
  e.stopPropagation(); // aby se modal nezavřel při kliknutí na šipku
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  modalImgAbout.src = images[currentIndex].href;
});

nextBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  currentIndex = (currentIndex + 1) % images.length;
  modalImgAbout.src = images[currentIndex].href;
});

// zavření kliknutím na křížek
modalCloseAbout.addEventListener('click', () => {
  modalAbout.style.display = "none";
});

// zavření kliknutím mimo obrázek
modalAbout.addEventListener('click', (e) => {
  if (e.target === modalAbout) {
    modalAbout.style.display = "none";
  }
});
});
