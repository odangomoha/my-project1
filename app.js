// IndexedDB setup
let db;
const request = indexedDB.open("NotesDB", 1);

request.onupgradeneeded = function (e) {
    db = e.target.result;
    db.createObjectStore("notes", { autoIncrement: true });
};

request.onsuccess = function (e) {
    db = e.target.result;
    displayNotes();
};

request.onerror = function () {
    console.log("Error opening IndexedDB");
};

// Save note
document.getElementById("saveNote").addEventListener("click", () => {
    const noteText = document.getElementById("noteInput").value;
    if (noteText.trim() === "") return;

    const transaction = db.transaction("notes", "readwrite");
    const store = transaction.objectStore("notes");
    store.add(noteText);
    transaction.oncomplete = () => {
        document.getElementById("noteInput").value = "";
        displayNotes();
    };
});

// Display notes
function displayNotes() {
    const notesList = document.getElementById("notesList");
    notesList.innerHTML = "";

    const transaction = db.transaction("notes", "readonly");
    const store = transaction.objectStore("notes");
    store.openCursor().onsuccess = function (e) {
        const cursor = e.target.result;
        if (cursor) {
            const li = document.createElement("li");
            li.textContent = cursor.value;
            notesList.appendChild(li);
            cursor.continue();
        }
    };
}

// Register service worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
        .then(() => console.log("Service Worker registered"))
        .catch(err => console.log("Service Worker registration failed", err));
}
