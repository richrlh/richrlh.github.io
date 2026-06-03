const playlistContainer = document.getElementById("playlist");
const modal = document.getElementById("songModal");
const addSongBtn = document.getElementById("addSongBtn");
const saveSongBtn = document.getElementById("saveSong");
const cancelSongBtn = document.getElementById("cancelSong");
let currentlyPlaying = null;

/* LOAD PLAYLIST */
function getPlaylist() {
    return JSON.parse(
        localStorage.getItem("feralGremlinPlaylist")
    ) || [];
}

function savePlaylist(list) {
    localStorage.setItem(
        "feralGremlinPlaylist",
        JSON.stringify(list)
    );
}

function renderPlaylist() {
    const songs = getPlaylist();
    playlistContainer.innerHTML = "";
    if (songs.length === 0) {
        playlistContainer.innerHTML = `
            <p>No songs added yet.</p>
        `;
        return;
    }

    songs.forEach((song, index) => {
        const songCard = document.createElement("div");
        songCard.classList.add("song-card");
        songCard.innerHTML = `
            <div class="song-info">
                <strong>${index + 1}. ${song.name}</strong>
            </div>

            <div class="song-controls">
                <button
                    class="playMusic-btn"
                    onclick="togglePlay(${index})"
                >
                    ▶ Play
                </button>

                <button
                    class="deleteMusic-btn"
                    onclick="deleteSong(${index})"
                >
                    🗑
                </button>
            </div>
        `;
        playlistContainer.appendChild(songCard);
    });
}

/* MODAL */
addSongBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
});

cancelSongBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
});

/* SAVE SONG */
saveSongBtn.addEventListener("click", () => {

    const songName =
        document.getElementById("songName").value.trim();

    const youtubeLink =
        document.getElementById("youtubeLink").value.trim();

    const audioFile =
        document.getElementById("audioFile").files[0];

    if (!songName) {
        alert("Please enter a song name.");
        return;
    }

    const playlist = getPlaylist();
    if (audioFile) {
        const reader = new FileReader();
        reader.onload = function(event){

            playlist.push({
                name: songName,
                type: "audio",
                source: event.target.result
            });

            savePlaylist(playlist);
            renderPlaylist();
            modal.classList.add("hidden");
            clearInputs();
        };

        reader.readAsDataURL(audioFile);
        return;
    }

    if (youtubeLink) {
        playlist.push({
            name: songName,
            type: "youtube",
            source: youtubeLink
        });

        savePlaylist(playlist);
        renderPlaylist();
        modal.classList.add("hidden");
        clearInputs();
        return;
    }

    alert(
        "Please upload an audio file or enter a YouTube link."
    );
});

/* PLAY SONG */
function togglePlay(index) {
    const songs = getPlaylist();
    const song = songs[index];

    if(song.type !== "audio"){
        alert(
            "YouTube links are stored successfully, but audio playback for YouTube links will be implemented later."
        );

        return;
    }

    if(currentlyPlaying){
        currentlyPlaying.pause();
    }

    currentlyPlaying = new Audio(song.source);
    currentlyPlaying.play();
}

/* DELETE SONG */
function deleteSong(index){
    const songs = getPlaylist();
    songs.splice(index,1);
    savePlaylist(songs);
    renderPlaylist();
}

function clearInputs(){
    document.getElementById("songName").value = "";
    document.getElementById("youtubeLink").value = "";
    document.getElementById("audioFile").value = "";
}

renderPlaylist();
