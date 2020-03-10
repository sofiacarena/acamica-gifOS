const video = document.querySelector('video');
let gifsIdsStorage = localStorage.getItem('gifs_id');
function getStreamAndRecord() {
    // permiso para utilizar cámara y obtención del stream
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            width: { max: 750 },
            height: 350
        }
    })
        .then(function (stream) {
            video.srcObject = stream;
            // play stream en el elemento video previamente declarado
            video.play();
            const recorder = RecordRTC(stream, {
                type: 'gif',
                frameRate: 1,
                quality: 10,
                width: 360,
                hidden: 240,
                onGifRecordingStarted: function () {
                    console.log('started')
                }
            });
            // inicio de captura de video click en capturar
            document.getElementById('camera_capturar_btns').addEventListener('click', () => {
                recorder.startRecording();
            });
            // fin captura de video click en listo
            document.getElementById('recording_listo_btns').addEventListener('click', () => {
                recorder.stopRecording(() => {
                    console.log('Recording Stopped');
                    // obtencion del blob del gif grabado
                    let blob = recorder.getBlob();
                    // url del gif creado, extraído del blob
                    let url = URL.createObjectURL(blob);
                    // url como link del background del div de vista previa del gif grabado
                    let preview = document.getElementById('preview_gif');
                    preview.setAttribute('style', 'background:url(' + url + ') center center; background-size: cover');
                    // url como source de la imagen del gif subido
                    let uploadedGif = document.getElementById('view_uploaded_gif');
                    uploadedGif.src = url;
                    let form = new FormData();
                    form.append('file', blob, 'myGif.gif');
                    // click en Subir Guifo ejecuta el post de form a la API de Giphy
                    document.getElementById('subir_btn').addEventListener('click', () => {
                        fetch('https://upload.giphy.com/v1/gifs?&api_key=' + apiKey, {
                            method: 'Post',
                            body: form
                        })
                            .then(response => {return response.json()})
                            .then(dt => {
                                hiddenToggle('subiendo_container');
                                hiddenToggle('subido_container');
                                // id obtenido de la respuesta del gif subido
                                let id = dt.data.id;
                                // adición a Local Storage
                                if (gifsIdsStorage != null){
                                    let idsStorage = gifsIdsStorage + ',' + id;
                                    localStorage.setItem("gifs_id", idsStorage);
                                }else{
                                    localStorage.setItem("gifs_id", id);
                                }
                                // copia del link del gif subido al portapapeles 
                                document.getElementById('link_btn').addEventListener('click', () => {
                                    let gifUrl = 'https://giphy.com/gifs/' + id;
                                    getLink(gifUrl);
                                });
                                console.log('Success: gif uploaded to giphy');
                            })
                            .catch(error => console.error('Error:', error));
                    });
                    // descarga del blob del gif subido cuando se hace click en el boton indicado para la descarga
                    document.getElementById('download_btn').addEventListener('click', () => {
                        invokeSaveAsDialog(blob);
                    });
                });
            })
        });
}
// Redirige la locación a index.html
function relocateToIndex() {
    location.href = 'index.html';
}
// click en los botones de cierre de los títulos de crear guifos lleva a index.html
let closeBtns = document.getElementsByClassName('create_btn_close');
Array.prototype.forEach.call(closeBtns, function (closeBtn) {
    closeBtn.addEventListener('click', relocateToIndex, true);
});
// click en la imagen de la flecha, en el boton cancelar 
// y en el boton cancelar de subida de gif lleva a index.html
[document.querySelector('#arrow'), document.getElementById('cancelar_btn'), 
    document.getElementById('cancelar_upload_btn')].forEach(element => {
        element.addEventListener('click', relocateToIndex, true);
});
// click en Comenzar
document.getElementById('comenzar_btn').addEventListener('click', () => {
    // oculta panel actual
    hiddenToggle('crear_guifos_container');
    // muestra panel siguiente
    hiddenToggle('chequeo_container');
    getStreamAndRecord();
});
// click en Capturar
document.getElementById('camera_capturar_btns').addEventListener('click', () => {
    // oculta botones actuales
    hiddenToggle('camera_capturar_btns');
    // muestra botones siguientes
    hiddenToggle('recording_listo_btns');
    // modifica el contenido del título
    document.getElementById('chequeo_title').textContent = 'Capturando Tu Guifo';
});
//click en Listo
document.getElementById('recording_listo_btns').addEventListener('click', () => {
    // oculta panel actual
    hiddenToggle('chequeo_container');
    // muestra panel siguiente
    hiddenToggle('vista_previa_container');
});
// click en Subir Guifo 
document.getElementById('subir_btn').addEventListener('click', () => {
    // oculta panel actual
    hiddenToggle('vista_previa_container');
    // muestra panel siguiente
    hiddenToggle('subiendo_container');
});
// click en Repetir Captura
document.getElementById('repetir_btn').addEventListener('click', () => {
    getStreamAndRecord();
    // oculta panel actual
    hiddenToggle('vista_previa_container');
    // vuelve al panel de chequeo
    hiddenToggle('chequeo_container');
    // muestra los botones
    hiddenToggle('camera_capturar_btns');
    // oculta botones actuales
    hiddenToggle('recording_listo_btns');
    // modifica el contenido del título
    document.getElementById('chequeo_title').textContent = 'Un Chequeo Antes De Empezar';
});
// click en el boton que dice listo en el ultimo panel de crear guifos lleva a misguifos.html
document.getElementById('fin_btn').addEventListener('click', () => {
    location.href = 'misguifos.html';
});
// ejecución de getSaveGifByIDAndGrid que va a generar el grid 
//donde se van a ver los gifs creados utilizando los ids guardados en localStorage
if (gifsIdsStorage){getSaveGifByIDAndGrid('uploaded_guifos_container', 'uploaded', gifsIdsStorage)};
