document.addEventListener("DOMContentLoaded", () => {

    // =======================================================
    // 1. LÓGICA DE PESTAÑAS (TABS) - Movida desde el HTML
    // =======================================================
    const tabs = document.querySelectorAll('.nav-btn');
    const paneles = document.querySelectorAll('[role="tabpanel"]');
    
    const changeTab = (tab) => {
        // Quitar activo a todos los botones
        tabs.forEach(t => {
            t.classList.remove("activo");
            t.setAttribute("aria-selected", "false");
        });

        // Ocultar todos los paneles
        paneles.forEach(panel => {
            panel.classList.remove("vista-activa");
            panel.classList.add("vista-oculta");
            panel.setAttribute("hidden", "true");
        });

        // Activar el botón presionado
        tab.classList.add("activo");
        tab.setAttribute("aria-selected", "true");

        // Mostrar el panel correspondiente
        const idDestino = tab.getAttribute("aria-controls");
        const seccionDestino = document.getElementById(idDestino);
        if (seccionDestino) {
            seccionDestino.classList.remove("vista-oculta");
            seccionDestino.classList.add("vista-activa");
            seccionDestino.removeAttribute("hidden");
            // Mover el foco para accesibilidad
            seccionDestino.focus({ preventScroll: true });
            window.scrollTo(0, 0); // Subir al inicio de la página al cambiar de tab
        }
    };

    tabs.forEach(tab => {
        tab.addEventListener("click", () => changeTab(tab));
    });


    // =======================================================
    // 2. BASE DE DATOS DE RECETAS Y LÓGICA DEL MODAL
    // =======================================================
    const recetasDB = {
        tacos: {
            titulo: "Tacos al Pastor", badge: "Región: Centro | Plato Fuerte",
            img: "https://comedera.com/wp-content/uploads/sites/9/2017/08/tacos-al-pastor-receta.jpg",
            ingredientes:["1 kg de lomo de cerdo en filetes", "3 chiles guajillo y 2 chiles pasilla", "Pasta de achiote", "1/2 taza de jugo de piña y un chorrito de vinagre", "Piña fresca, cebolla, cilantro y tortillas de maíz"],
            preparacion: "Licúa los chiles (previamente hidratados) con el achiote, vinagre, jugo de piña y especias. Marina la carne con esta mezcla por al menos 4 horas. Apila la carne imitando un trompo (o ásala en sartén a fuego alto). Sirve sobre tortillas calientes y decora con piña asada, cebolla picada y cilantro."
        },
        mole: {
            titulo: "Mole Poblano", badge: "Región: Sur | Plato Fuerte",
            img: "https://media.elgourmet.com/recetas/cover/mole-_9IMJjkql3RCWT1eg6AHUD8PKyZLh7o.png",
            ingredientes:["Pollo cocido en piezas", "Chiles mulato, ancho y pasilla", "Chocolate de mesa mexicano", "Almendras, nueces, ajonjolí y pasas", "Plátano macho frito y especias (canela, anís)"],
            preparacion: "Tuesta los chiles y las semillas por separado. Fríe el plátano y el pan. Licúa todo usando caldo de pollo hasta obtener una pasta espesa. Sofríe la pasta en una cazuela grande de barro, agrega el chocolate hasta que se funda y ajusta el espesor con más caldo. Sirve bañando las piezas de pollo y espolvorea ajonjolí tostado."
        },
        enchiladas: {
            titulo: "Enchiladas Verdes", badge: "Región: Centro | Plato Fuerte",
            img: "https://www.mexicoinmykitchen.com/wp-content/uploads/2022/11/Enchiladas-verdes-2-500x375.jpg",
            ingredientes:["12 tortillas de maíz", "Pechuga de pollo cocida y deshebrada", "1/2 kg de tomatillo verde", "Chile serrano, cilantro, cebolla y ajo", "Crema ácida, queso fresco y cebolla en aros para decorar"],
            preparacion: "Hierve los tomatillos con los chiles. Licúalos con ajo, cebolla y un puñado generoso de cilantro. Fríe esta salsa verde en una olla con poco aceite. Pasa las tortillas rápidamente por aceite caliente para suavizarlas, rellénalas con el pollo deshebrado, enróllalas y báñalas en la salsa verde caliente. Decora con crema y queso."
        },
        guacamole: {
            titulo: "Guacamole Tradicional", badge: "Nacional | Antojito",
            img: "https://cdn-ilddihb.nitrocdn.com/MgqZCGPEMHvMRLsisMUCAIMWvgGMxqaj/assets/images/optimized/rev-e7d9c75/www.goya.com/wp-content/uploads/2023/10/mexican-guacamole.jpg",
            ingredientes:["3 aguacates Hass maduros", "1/2 cebolla blanca finamente picada", "1 chile jalapeño o serrano picado", "1 manojo de cilantro fresco picado", "Jugo de 2 limones y sal al gusto"],
            preparacion: "Abre los aguacates, retira el hueso y extrae la pulpa. Machaca la pulpa en un molcajete o tazón usando un tenedor (deja algunos trozos enteros para darle textura). Agrega la cebolla, el chile, el cilantro y mezcla suavemente. Finalmente, exprime el limón, añade sal al gusto e integra. Sirve de inmediato con totopos."
        },
        pozole: {
            titulo: "Pozole Rojo", badge: "Región: Centro | Sopa y Caldo",
            img: "https://editorialtelevisa.brightspotcdn.com/wp-content/uploads/2018/03/STPozole-rojo-de-cerdo.jpg",
            ingredientes:["1 kg de maíz cacahuazintle pre-cocido", "1 kg de carne de cerdo (espinazo y maciza)", "Chiles guajillo y ancho", "Ajo, cebolla y orégano", "Guarniciones: lechuga, rábano, cebolla picada, limón y tostadas"],
            preparacion: "Cuece la carne junto con el maíz, media cebolla y una cabeza de ajo hasta que ambos estén muy tiernos (el maíz debe 'florecer'). Licúa los chiles hidratados y cuélalos sobre el caldo. Hierve todo junto durante 30 minutos más para integrar sabores. Sirve muy caliente y permite que cada comensal agregue sus guarniciones."
        },
        aguachile: {
            titulo: "Aguachile Verde", badge: "Región: Costas | Antojito",
            img: "https://www.cocinavital.mx/wp-content/uploads/2025/02/aguachile-verde-de-camaron.jpg",
            ingredientes:["500g de camarón crudo, pelado y limpio", "1 taza de jugo de limón recién exprimido", "2 pepinos sin semilla cortados en media luna", "1 cebolla morada fileteada", "Chiles serranos, cilantro y sal de grano"],
            preparacion: "Corta los camarones en forma de mariposa y colócalos en un tazón plano. Licúa el jugo de limón con los chiles serranos y el cilantro. Vierte este 'aguachile' verde sobre los camarones. Añade la cebolla morada y el pepino. Deja reposar en el refrigerador por solo 15-20 minutos para que el limón cure el camarón. Sirve con tostadas."
        },
        cochinita: {
            titulo: "Cochinita Pibil", badge: "Región: Sur | Plato Fuerte",
            img: "https://images.ctfassets.net/ttw7uwgviuml/3Gh5MRpMBgqyCbEAyuRjQs/a23a7b3919dc97c0511090668c8d522a/SKU_80193_2.jpg?fm=webp",
            ingredientes:["1.5 kg de carne de cerdo (pierna y lomo)", "1 bloque de pasta de achiote", "1 taza de jugo de naranja agria", "Especias: orégano, comino, pimienta negra", "Hojas de plátano asadas para envolver"],
            preparacion: "Disuelve el achiote en el jugo de naranja agria junto con las especias y sal. Marina la carne cortada en trozos grandes en esta mezcla toda la noche. Forra una olla de cocción lenta o charola de horno con las hojas de plátano, coloca la carne y su jugo, y envuelve bien. Hornea a fuego bajo (160°C) por 3 a 4 horas hasta que se deshaga sola. Sirve con cebollitas encurtidas con chile habanero."
        },
        churros: {
            titulo: "Churros Mexicanos", badge: "Nacional | Postre",
            img: "https://images.unsplash.com/photo-1624371414361-e670edf4898d?auto=format&fit=crop&w=800&q=80",
            ingredientes:["1 taza de agua y 1 taza de harina", "1 barra pequeña de mantequilla", "1 cucharadita de vainilla y una pizca de sal", "Aceite para freír", "Mezcla de azúcar y canela en polvo para espolvorear"],
            preparacion: "Hierve el agua con la mantequilla y la sal. Añade la harina de golpe y mezcla vigorosamente hasta que se forme una bola de masa que no se pegue a la olla. Pon la masa en una manga pastelera con boquilla de estrella gruesa. Exprime tiras de masa directamente en aceite bien caliente y fríe hasta que estén dorados. Pásalos inmediatamente por el azúcar con canela."
        },
        ceviche: {
            titulo: "Ceviche de Pescado", badge: "Región: Costas | Plato Fuerte",
            img: "https://www.recetasnestle.com.ec/sites/default/files/styles/recipe_detail_desktop_new/public/srh_recipes/bbb31707c4bd37def6dd0ae89d42e085.jpg?itok=1U9BUf6D",
            ingredientes:["500g de filete de pescado blanco (sierra o tilapia) en cubos", "Jugo de 8 limones", "2 tomates picados", "1 cebolla morada, chiles verdes y cilantro picados", "Aceitunas picadas y un chorrito de aceite de oliva"],
            preparacion: "Pon el pescado en un recipiente de vidrio, báñalo con el jugo de limón y mételo al refrigerador por 30-40 minutos hasta que se vuelva blanco y firme. Escurre un poco del exceso de limón. Añade el tomate, la cebolla, el chile, el cilantro y las aceitunas. Agrega sal, pimienta y un toque de aceite de oliva. Sirve frío."
        },
        machaca: {
            titulo: "Machaca con Huevo", badge: "Región: Norte | Plato Fuerte",
            img: "https://mojo.generalmills.com/api/public/content/pTBVe4zv70K4XlU0C_AK1A_gmi_hi_res_jpeg.jpeg?v=d16488e5&t=16e3ce250f244648bef28c5949fb99ff",
            ingredientes:["100g de machaca (carne de res seca y deshebrada)", "4 huevos", "1/2 cebolla picada", "1 jitomate picado y 1 chile serrano picado", "Tortillas de harina y frijoles refritos para acompañar"],
            preparacion: "En un sartén con un poco de aceite, sofríe la cebolla y el chile hasta que acitronen. Agrega el jitomate y cocina unos minutos. Incorpora la machaca y fríe ligeramente (cuidado de no quemarla). Bate los huevos, viértelos en el sartén y revuelve constantemente hasta que estén cocidos. Sirve acompañado de frijoles refritos y tortillas de harina calientes."
        },
        sopalima: {
            titulo: "Sopa de Lima", badge: "Región: Sur | Sopa y Caldo",
            img: "https://www.seriouseats.com/thmb/9lylUmOSkIlUH1_hNa6zTmenGl4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__2016__05__20160505-sopa-de-lima-22-a78c408efb60416d8b6e36b45e3977fa.jpg",
            ingredientes:["1 litro de caldo de pollo rico y bien sazonado", "Pechuga de pollo cocida y deshebrada", "1/2 cebolla asada y 1 pimiento asado", "Jugo de 1 lima yucateca (o limón suave) y rodajas para adornar", "Tiras de tortilla de maíz fritas (totopos)"],
            preparacion: "Sofríe la cebolla y el pimiento asados y picados en una olla. Agrega el caldo de pollo y deja hervir. Justo antes de servir, apaga el fuego e incorpora el jugo de la lima (no debe hervir con el jugo para no amargar). Coloca pollo deshebrado en el fondo de un plato hondo, sirve el caldo caliente encima y decora con abundantes tiras de tortilla frita y una rodaja de lima."
        },
        flan: {
            titulo: "Flan Napolitano", badge: "Nacional | Postre",
            img: "https://i.ytimg.com/vi/BSnyr2gUuvw/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBY7BcLKkPMbZHHHRnK2P0g35AEXQ",
            ingredientes:["1 lata de leche condensada", "1 lata de leche evaporada", "5 huevos enteros y 1 cucharada de vainilla", "190g de queso crema", "1 taza de azúcar (para el caramelo)"],
            preparacion: "Funde el azúcar en una flanera o molde a fuego medio hasta hacer un caramelo dorado y cubre el fondo. Licúa las dos leches, los huevos, la vainilla y el queso crema. Vierte la mezcla en la flanera sobre el caramelo endurecido. Tapa con papel aluminio y cocina a baño maría en el horno (o estufa) por unos 45-50 minutos. Deja enfriar completamente y refrigera antes de desmoldar."
        }
    };

    const modal = document.getElementById('modal-receta');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalBadge = document.getElementById('modal-badge');
    const modalImg = document.getElementById('modal-img');
    const modalIng = document.getElementById('modal-ingredientes');
    const modalPrep = document.getElementById('modal-preparacion');
    const btnCerrarModal = document.getElementById('cerrar-modal');
    const botonesReceta = document.querySelectorAll('.btn-leer-mas');

    // Abrir Modal
    botonesReceta.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const recetaId = e.target.getAttribute('data-receta');
            const data = recetasDB[recetaId];

            if (data) {
                modalTitulo.textContent = data.titulo;
                modalBadge.textContent = data.badge;
                modalImg.src = data.img;
                modalPrep.textContent = data.preparacion;
                
                // Generar lista de ingredientes
                modalIng.innerHTML = '';
                data.ingredientes.forEach(ing => {
                    const li = document.createElement('li');
                    li.textContent = ing;
                    modalIng.appendChild(li);
                });

                modal.showModal();
            }
        });
    });

    // Cerrar Modal con botón X
    if (btnCerrarModal) {
        btnCerrarModal.addEventListener('click', () => {
            modal.close();
        });
    }

    // Cerrar modal al hacer click afuera (en el ::backdrop)
    if(modal) {
        modal.addEventListener('click', (e) => {
            const rect = modal.getBoundingClientRect();
            // Si el click fue fuera de los límites del contenedor, se cierra
            if (e.clientY < rect.top || e.clientY > rect.bottom || e.clientX < rect.left || e.clientX > rect.right) {
                modal.close();
            }
        });
    }

    // =======================================================
    // 3. LÓGICA DE FILTROS CRUZADOS (Platillos)
    // =======================================================
    const checkboxesRegion = document.querySelectorAll('.filtro-region');
    const checkboxesTipo = document.querySelectorAll('.filtro-tipo');
    const dishCards = document.querySelectorAll('.tarjeta');
    const statusMsg = document.getElementById('status-msg');

    // Función para manejar las casillas de "Todos" vs Específicos
    const manejarComportamientoCheckboxes = (checkboxes, esGrupoRegion) => {
        checkboxes.forEach(cb => {
            cb.addEventListener('change', (e) => {
                const valor = e.target.value;
                const estaChequeado = e.target.checked;
                
                if (valor === 'todas' || valor === 'todos') {
                    // Si marcan "Todas", desmarcar las demás
                    if (estaChequeado) {
                        checkboxes.forEach(box => {
                            if (box.value !== valor) box.checked = false;
                        });
                    }
                } else {
                    // Si marcan una específica, desmarcar "Todas"
                    const cbTodas = Array.from(checkboxes).find(b => b.value === 'todas' || b.value === 'todos');
                    if(estaChequeado) cbTodas.checked = false;
                    
                    // Si desmarcan todas las específicas, volver a marcar "Todas"
                    const algunaMarcada = Array.from(checkboxes).some(b => (b.value !== 'todas' && b.value !== 'todos') && b.checked);
                    if (!algunaMarcada) cbTodas.checked = true;
                }
                filterDishes();
            });
        });
    };

    manejarComportamientoCheckboxes(checkboxesRegion, true);
    manejarComportamientoCheckboxes(checkboxesTipo, false);

    const filterDishes = () => {
        // Obtener valores seleccionados
        const regionesActivas = Array.from(checkboxesRegion).filter(cb => cb.checked).map(cb => cb.value);
        const tiposActivos = Array.from(checkboxesTipo).filter(cb => cb.checked).map(cb => cb.value);

        let visibleCount = 0;
        
        dishCards.forEach(card => {
            const cardRegion = card.dataset.region;
            const cardTipo = card.dataset.tipo;
            
            // Lógica Cruzada: ¿Pasa el filtro de región Y de tipo?
            const pasaRegion = regionesActivas.includes('todas') || regionesActivas.includes(cardRegion) || cardRegion === 'todas';
            const pasaTipo = tiposActivos.includes('todos') || tiposActivos.includes(cardTipo);

            if (pasaRegion && pasaTipo) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Actualizar mensaje de accesibilidad y visual
        if (visibleCount > 0) {
            statusMsg.textContent = `Mostrando ${visibleCount} platillos.`;
            statusMsg.style.display = 'block';
        } else {
            statusMsg.textContent = 'No se encontraron platillos con esos filtros combinados. ¡Prueba otra combinación!';
            statusMsg.style.display = 'block';
        }
    };

    if(statusMsg) filterDishes(); // Llamada inicial


    // =======================================================
    // 4. LÓGICA DEL MENÚ DESPLEGABLE Y NAVEGACIÓN DESDE SUBMENÚS
    // =======================================================
    const dropdownItems = document.querySelectorAll('.nav-item-has-dropdown');

    const showSubmenu = (item) => {
        item.classList.add('is-visible');
        const button = item.querySelector('button');
        if (button) button.setAttribute('aria-expanded', 'true');
    };

    const hideSubmenu = (item) => {
        item.classList.remove('is-visible');
        const button = item.querySelector('button');
        if (button) button.setAttribute('aria-expanded', 'false');
    };

    dropdownItems.forEach(item => {
        const button = item.querySelector('button');
        item.addEventListener('mouseenter', () => showSubmenu(item));
        item.addEventListener('mouseleave', () => hideSubmenu(item));

        button.addEventListener('click', (event) => {
            const isVisible = item.classList.contains('is-visible');
            if (!isVisible) event.stopPropagation();
            item.classList.toggle('is-visible');
            button.setAttribute('aria-expanded', !isVisible);
        });

        item.addEventListener('focusin', () => showSubmenu(item));
        item.addEventListener('focusout', (event) => {
            if (!item.contains(event.relatedTarget)) hideSubmenu(item);
        });
    });

    // Funcionalidad: Si das click en un submenú de Platillos (ej: Antojitos)
    const enlacesFiltro = document.querySelectorAll('.enlace-filtro');
    enlacesFiltro.forEach(enlace => {
        enlace.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 1. Cambiar a la pestaña de Platillos
            const tabPlatillos = document.getElementById('tab-platillos');
            changeTab(tabPlatillos);

            // 2. Extraer qué tipo seleccionó (ej. "antojito")
            const tipoSeleccionado = enlace.getAttribute('data-tipo');

            // 3. Modificar los checkboxes y forzar el filtrado
            checkboxesTipo.forEach(cb => {
                if(cb.value === tipoSeleccionado) {
                    cb.checked = true;
                } else {
                    cb.checked = false; // Desmarcar "Todos" y los demás
                }
            });
            
            filterDishes();

            // 4. Bajar a la zona de filtros
            document.querySelector('.encabezado-simple').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // =======================================================
    // 5. LÓGICA DEL SLIDER DE IMÁGENES (CARRUSEL)
    // =======================================================
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const sliderContainer = document.querySelector('.slider-container');

    if (slides.length > 0) {
        let currentSlide = 0;
        let slideInterval;    
        const intervalTime = 5000; 

        const goToSlide = (index) => {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            currentSlide = (index + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        };

        const nextSlide = () => goToSlide(currentSlide + 1);
        const prevSlide = () => goToSlide(currentSlide - 1);

        const startSlideShow = () => { slideInterval = setInterval(nextSlide, intervalTime); };
        const resetTimer = () => { clearInterval(slideInterval); startSlideShow(); };

        if(nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });
        if(prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => { goToSlide(index); resetTimer(); });
        });

        // Touch Swipe
        let touchStartX = 0;
        let touchEndX = 0;
        if(sliderContainer) {
            sliderContainer.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                clearInterval(slideInterval);
            }, { passive: true });

            sliderContainer.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                if (touchEndX < touchStartX - 50) nextSlide();
                if (touchEndX > touchStartX + 50) prevSlide();
                startSlideShow();
            }, { passive: true });
        }

        startSlideShow();
    }

    // =======================================================
    // 6. LÓGICA DEL FORMULARIO DE CONTACTO
    // =======================================================
    const contactForm = document.getElementById('contact-form');
    const nombreInput = document.getElementById('nombre-input');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm) {
        nombreInput.addEventListener('input', () => {
            if (nombreInput.value.trim().length >= 3) {
                nombreInput.classList.add('input-valid');
                nombreInput.classList.remove('input-invalid');
            } else {
                nombreInput.classList.add('input-invalid');
                nombreInput.classList.remove('input-valid');
            }
        });

        contactForm.addEventListener('submit', (event) => {
            event.preventDefault(); 
            const nombre = nombreInput.value.trim();

            if (nombre.length >= 3) {
                showFeedback(`¡Gracias, ${nombre}! Hemos recibido tu receta y la revisaremos pronto.`, 'success');
                contactForm.reset(); 
                nombreInput.classList.remove('input-valid');
            } else {
                showFeedback('Por favor, ingresa un nombre válido (mínimo 3 caracteres).', 'error');
            }
        });
    }

    const showFeedback = (message, type) => {
        formFeedback.textContent = message;
        formFeedback.className = `feedback-${type} visible`; 
        setTimeout(() => {
            formFeedback.classList.remove('visible');
        }, 5000);
    };

});