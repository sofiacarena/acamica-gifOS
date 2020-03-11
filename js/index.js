// CAMBIO DE TEMA
// Local storage del tema
let storageTheme = localStorage.getItem('theme');
if(storageTheme === 'light'){
    switchTheme('light');
} else if (storageTheme === 'dark') {
    switchTheme('dark');
}
// Selector temas
let btnLight = document.getElementById('light');
btnLight.addEventListener('click', event =>{
    switchTheme(event.target.id); 
});
let btnDark = document.getElementById('dark');
btnDark.addEventListener('click', event =>{
    switchTheme(event.target.id); 
});
//función de cambio de tema, logo, subrayado de los botones del tema, lupa de búsqueda
// y guardado del tema en local storage
function switchTheme(themeValue){
    if (themeValue != 'light'){
        document.getElementById('dark_theme').removeAttribute('disabled');
        document.getElementById('gifOS_logo').setAttribute('src', './img/gifOF_logo_dark.png');
        document.getElementById('dark').classList.add('underline');
        document.getElementById('light').classList.remove('underline');
        document.getElementById("dropdown_icon").setAttribute('style', 'filter:invert();');
        if (document.getElementById('search_lupa')){
            document.getElementById('search_lupa').src = "./img/CombinedShape.svg";
        }
        localStorage.setItem('theme', themeValue);
        
    }else{
        document.getElementById('dark_theme').setAttribute('disabled', '');
        document.getElementById('gifOS_logo').setAttribute('src', './img/gifOF_logo.png');
        document.getElementById('light').classList.add('underline');
        document.getElementById('dark').classList.remove('underline');
        document.getElementById("dropdown_icon").removeAttribute('style');
        localStorage.setItem('theme', themeValue);
    } 
}
// NAV BAR
// addEvent Listener en el boton 'Crear guifos' lleva a upload.html
let crearGuifosBtn = document.getElementById('guifos_btn');
crearGuifosBtn.addEventListener('click', () => {
    location.href = 'upload.html';
});
// Click event para el dropdown
let dropdownBtn = document.getElementById('dropdown_btn');
dropdownBtn.addEventListener('click', () => {
    changeClassToDisplay('themes_btns');
    clickHandler();
});
let themeBtn = document.getElementById('theme_btn');
themeBtn.addEventListener('click', () => {
    changeClassToDisplay('themes_btns');
    clickHandler();
});
//Cierre boton dropdown, clickeando afuera del dropdown
document.addEventListener('click', event =>{
    let btn = document.getElementById('dropdown');
    let targetBtn = event.target;
    do {
        if (targetBtn == btn ){
            return;
        }
        targetBtn = targetBtn.parentNode;
    }while (targetBtn);
    changeClassToHidden('themes_btns');
    if (elementIsClicked == false){
        clickHandler();
    }
});
//Cierre boton dropdown, clickeando el boton elegir tema
//utiliza la variable elementIsCicked que determina si los botones de dropdown fueron clickeados 
let themeMenu = document.getElementById('dropdown');
themeMenu.addEventListener('click', () => {
    if (elementIsClicked == true){
        changeClassToHidden('themes_btns');
    }
});

// BÚSQUEDA SECTION
// Array de terminos de búsqueda
const searched = [];
// Fetch de búsqueda
async function getSearchResults(search) {
    const found = await fetch('https://api.giphy.com/v1/gifs/search?q=' + search + '&api_key=' + apiKey)
    const data = await found.json();
    return data;
}
// adhesión término de búsqueda al array y ejecución de la búsqueda
let searchBtn = document.getElementById('search_btn');
if (searchBtn){
    searchBtn.addEventListener('click', () => {
        var searchValue = document.getElementById('search_value').value;
        createResults(searchValue);
    });
}
// autocomplete input de las búsquedas ya hechas en el array searched
function autocomplete(inp, arr) {
    var currentFocus;
    let searchAutocomplete = document.getElementById('search_autocomplete');
    if (inp){
        inp.addEventListener("input", function () {
            var a, b, i, val = this.value;
            closeAllLists();
            changeClassToDisplay('search_autocomplete');
            if (!val) { 
                changeClassToHidden('search_autocomplete');
                if(localStorage.getItem('theme') === 'light'){
                    document.getElementById('search_lupa').setAttribute("src", "./img/lupa_inactive.svg");
                }else{
                    document.getElementById('search_lupa').setAttribute("src", "./img/CombinedShape.svg");
                }
                searchBtn.setAttribute("class", "search_btn_inactive");
                return false;}
            currentFocus = -1;
            a = document.createElement("div");
            a.setAttribute("id", this.id + "autocomplete_list");
            a.setAttribute("class", "autocomplete_items");
            // inserto el div que va a contener los valores de búsqueda
            searchAutocomplete.appendChild(a);
            var matchFound = [];
            for (i = 0; i < arr.length; i++) {
                if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                    matchFound.push(arr[i]);
                }
            }
            for (i = 0; i < 3; i++){
                //si se encontraron coincidencias, crea un div con el término con el que se coincidió
                if (matchFound.length > 0 && matchFound[i] != null){
                    /* display contenedor*/
                    changeClassToDisplay('search_autocomplete');
                    b = document.createElement("div");
                    b.innerHTML = matchFound[i];
                    b.innerHTML += "<input type='hidden' value='" + matchFound[i] + "'>";
                    b.addEventListener("click", function (e) {
                        inp.value = this.getElementsByTagName("input")[0].value;
                        closeAllLists();
                    });
                    a.appendChild(b);
                } else if (matchFound.length == 0){
                    /* sin coincidencias, oculto contenedor */
                    changeClassToHidden('search_autocomplete');
                }
            }
            // cambio del src de la lupa cuando exista input
            if (localStorage.getItem('theme') === 'light') {
                document.getElementById('search_lupa').setAttribute("src", "./img/lupa.svg");
            } else {
                document.getElementById('search_lupa').setAttribute("src", "./img/lupa_light.svg");
            }
            // color de la letra del input cuando haya un valor
            searchBtn.setAttribute("class", "search_btn_active");
            this.style.color = '#110038';
        });
        // ejecuta una funcion cuando se presiona una tecla sobre el input del buscador
        inp.addEventListener("keydown", function (e) {
            var x = document.getElementById(this.id + "autocomplete_list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                // key down
                currentFocus++;
                addActive(x);
            } else if (e.keyCode == 38) {
                // key up
                currentFocus--;
                addActive(x);
            } else if (e.keyCode == 13) {
                //ENTER en las opciones, evita el submit
                e.preventDefault();
                if (currentFocus > -1) {
                    if (x) x[currentFocus].click();
                    changeClassToHidden('search_autocomplete');
                }
            }
        });
        // mueve y remueve el focus con la class autocomplete_active
        function addActive(x) {
            if (!x) return false;
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            x[currentFocus].classList.add("autocomplete_active");
        }
        function removeActive(x) {
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete_active");
            }
        }
        function closeAllLists(elmnt) {
            var x = document.getElementsByClassName("autocomplete_items");
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
        // ejecuta una funcion cuando se clickea document
        document.addEventListener("click", function (e) {
            // cierra lista abierta
            closeAllLists(e.target);
            // oculto el div #search_autocomplete 
            changeClassToHidden('search_autocomplete');
        });
    }
}
// ejecucion de la funcion autocomplete con el id del input y el array de los terminos buscados
autocomplete(document.getElementById("search_value"), searched);

// HOY TE SUGERIMOS SECTION
// fetch sugerencia
let gifContainers = document.getElementsByClassName('suggestion_gif_container');
let gifTagContainers = document.getElementsByClassName("suggestion_tag");
let randomTags = ['anime', 'exo', 'animation', 'adamdriver', 'starwars', 'haikyuu', 'gudetama', 'cats', 'criminalminds', 'janeausten', 'nct', 'naruto', 'itachi', 'exol', 'ghibli'];
for (let i=0; i<4; i++){
    // posición seleccionada al azar dentro de randomTags
    let random = randomTags[getRandomNumber(randomTags)];
    async function getRandomGif() {
        const resp = await fetch('https://api.giphy.com/v1/gifs/random?&api_key=' + apiKey + '&tag=' + random);
        const datos = await resp.json();
        return datos;
    }
    getRandomGif().then(function (response) {
        gifContainers[i].setAttribute('style', 'background:url(' + (response.data.images.fixed_height.url) + ') center center; background-size: cover');
        gifTagContainers[i].textContent = '#'+random;
    })
    .catch((error) => {
        return ('Error al adquirir giphy random:' + error);
    });
}
// Acción del boton de cierre de suggestion section
// cambia el gif que hay por otro, utilizando la misma funcion de getRandomGif
let gifCloseBtns = document.getElementsByClassName("suggestion_close_btn");
for (let i=0; i<gifCloseBtns.length; i++){
    gifCloseBtns[i].addEventListener('click', () =>{
        let random = randomTags[getRandomNumber(randomTags)];
        async function getRandomGif() {
            const resp = await fetch('https://api.giphy.com/v1/gifs/random?&api_key=' + apiKey + '&tag=' + random);
            const datos = await resp.json();
            return datos;
        }
        getRandomGif().then(function (response) {
            gifContainers[i].setAttribute('style', 'background:url(' + (response.data.images.fixed_height.url) + ') center center; background-size: cover');
            gifTagContainers[i].textContent = '#' + random;
        })
        .catch((error) => {
            return ('Error al adquirir giphy random:'+ error);
        });
    });
}
// Función del btn Ver Más: búsqueda del tag mostrado en hoy te sugerimos clickeando en el boton ver más del div correspondiente
let verMasBtn = document.getElementsByClassName("ver_mas_btn");
for(let i = 0; i < verMasBtn.length; i++){
    verMasBtn[i].addEventListener('click', () => {
        createResults(gifTagContainers[i].textContent.substring(1));
    });
}

// TRENDING SECTION
// Fetch trending section, crea dinamicamente los divs en los que van los gif poniendolos como background image
async function getTrendingGif() {
    const resp = await fetch('https://api.giphy.com/v1/gifs/trending?&api_key=' + apiKey);
    const dt = await resp.json();
    return dt;
}
getTrendingGif().then(function (response) {
    let trendingGifs = response.data;
    createGridWithGifos('grid_container', 'trending', trendingGifs);
})
    .catch((error) => {
        return ('Error al adquirir giphy trending:' + error)
    });