// valor de 'gifs_id' en local storage
let gifsIdsStorage = localStorage.getItem('gifs_id');
// ejecución de getSaveGifByIDAndGrid que va a generar el grid 
//donde se van a ver los gifs creados utilizando los ids guardados en localStorage
if (gifsIdsStorage) {getSaveGifByIDAndGrid('misguifos_container', 'misguifos', gifsIdsStorage)};