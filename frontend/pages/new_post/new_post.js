document.getElementById('cazzoCulo').addEventListener('click', function() {
    fetch('http://localhost/backend/script/post_handler.php', {
        method: "DELETE"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Errore nella richiesta DELETE');
        }
        return response.text();
    })
    .then(data => console.log(data))
    .catch(error => console.log('Error:', error));
});