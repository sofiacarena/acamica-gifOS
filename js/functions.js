// Definición de APi key
const apiKey = 'HEOKf6qRLuAMWFUfxVAnSiw5Ol3GVbOH';
//Toggle class hidden
function hiddenToggle(elementId) {
    let element = document.getElementById(elementId);
    element.classList.toggle("hidden");
}
// Cambio de la clase a hidden, parametro: id del elemento a modificar
function changeClassToHidden(elementId) {
    let element = document.getElementById(elementId);
    element.className = "hidden";
}
// Cambio de la clase a hidden, parametro: id del elemento a modificar
function changeClassToDisplay(elementId) {
    let element = document.getElementById(elementId);
    element.className = "display";
}
// Modifica el valor true o false de la variable elementIsClicked
var elementIsClicked = true;
function clickHandler() {
    if (elementIsClicked == false) {
        return elementIsClicked = true;
    } else if (elementIsClicked == true) {
        return elementIsClicked = false;
    }
}
// Función que devuelve un numero de una posición que existe en el array del parámetro
function getRandomNumber(arr) {
    let randomPosition = Math.floor((arr.length - 0) * Math.random());
    return randomPosition;
}
// Crea divs dentro del container x, uno para cada posicion del array dado
//parametros: id donde se van a crear los div, string que diferencie los divs que van a ser creados
// y arr de los datos a insertar en los divs
function createGridWithGifos(x, y, arr){
    for (let i = 0; i < arr.length; i++) {
        let grid = document.getElementById(x);
        let gridDivs = document.createElement('div');
        grid.appendChild(gridDivs);
        // determina si en la posicion i del array, width es mayor o menos a 356 y añade class diferentes
        if (arr[i].images.fixed_height.width <= '356') {
            gridDivs.className = y + '_gif_container min';
        } else {
            gridDivs.className = y + '_gif_container max';
        }
        let gifContainers = document.getElementsByClassName(y + '_gif_container');
        // background de los div con gifs extraidos del array de datos
        gifContainers[i].setAttribute('style', 'background:url(' + (arr[i].images.fixed_height.url) + ') center center; background-size: cover');
        gifContainers[i].addEventListener('click', () => {
            window.open(arr[i].url, '_blank');
        })
        // agrega padding bottom segun la clase max  o min
        let gifMax = document.getElementsByClassName('max');
        for (let j = 0; j < gifMax.length; j++) {
            gifMax[j].style.paddingBottom = '50%';
        }
        let gifMin = document.getElementsByClassName('min');
        for (let k = 0; k < gifMin.length; k++) {
            gifMin[k].style.paddingBottom = '100%';
        }
    }
}
// genera un array con posiciones random del array dado y
// ejecuta la funcion createGridWithGifos
function createRandomSearchGrid (x, y, arr){
    let dt = [];
    while (dt.length <= 11) {
        let number = getRandomNumber(arr);
        // si el numero random obtenido no se encuentra en el array, se incluye
        // de esta manera no se repitiran posiciones 
        if (dt.includes(arr[number]) == false) {
            dt.push(arr[number]);
        } 
    }
    createGridWithGifos(x, y, dt);
}
// ejecuta getSearchResults con el valor de la búsqueda, crea el display de los resultados,
// guarda terminos buscados en local storage y crea botones de búsquedas pasadas
function createResults(searchValue) {
    getSearchResults(searchValue).then(function (response) {
        let searchGifs = response.data;   
        let x = document.getElementById('search');
        // si existe elemento con id 'search_grid_container' borra dos últimos hijos
        if (document.getElementById('search_grid_container')) {
            x.removeChild(x.lastChild);
            x.removeChild(x.lastChild);
        }
        // si existe elemento con id 'searched_title' se elimina
        if (document.getElementById('searched_title')) {
            let searchedTitle = document.getElementById('searched_title');
            searchedTitle.remove();
        }
        // si no se encuentran resultados de búsqueda, crea un titulo indicando esto
        if (searchGifs.length == 0){
            let r = document.createElement('div');
            r.id = 'searched_title'
            r.innerHTML = 'No se han encontrado resultados de #' + searchValue;
            x.appendChild(r);
            return false;
        }
        // creación del div que va a contener el display de los resultados de búsqueda
        let y = document.createElement("div");
        y.id = 'search_grid_container';
        x.appendChild(y);
        // titulo que muestra el termino buscado
        let z = document.createElement('h2');
        z.id = 'searched_title';
        z.innerHTML = searchValue.toLowerCase() + ' (resultados)';
        y.before(z);
        // ejecucion de la funcion utilizando el div previamente creado y el array resultado del fetch de búsqueda
        createRandomSearchGrid('search_grid_container', 'searched', searchGifs);
        if (searched.includes(searchValue) == false) {
            searched.push(searchValue);
            //guarda array searched si el valor del input no coincide con uno de los ya existentes en el array 
            localStorage.setItem('search', searched);
            // cuando haya al menos un elemento en el array, se crea el div donde estan los botones de busquedas pasadas
            if (searched.length > 0) {
                //creación div container
                let searchedContainer = document.getElementById('searched_container');
                // set display como class del container
                searchedContainer.setAttribute('class', 'display');
                // crea div, inserta el valor de la búsqueda en él 
                let x = document.createElement("div");
                x.innerHTML = '#' + searchValue;
                x.setAttribute('class', 'searched_items');
                searchedContainer.appendChild(x);
                let y = document.querySelectorAll('.searched_items');
                y.forEach(function (element) {
                    element.addEventListener('click', () => {
                        createResults(element.innerHTML.substring(1));
                    });
                });
            }
        }
    });
}
// fetch búsqueda gifs por id y ejecuta createGridWithGuifos, utitlizando los pararmetros de entrada 
//y el array devuelto por la resolucion de la promesa
function getSaveGifByIDAndGrid(x, y, id) {
    const gifsId = fetch('https://api.giphy.com/v1/gifs?api_key=' + apiKey + '&ids=' + id)
        .then(response => {
            return response.json();
        })
        .then(dt => {
            let gifsById = dt.data;
            createGridWithGifos(x, y, gifsById);
            return dt
        });
}
// copia x en el clipboard 
function getLink(x) {
    let aux = document.createElement("input");
    aux.setAttribute("value", x);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
}