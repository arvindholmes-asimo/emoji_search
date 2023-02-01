// Docs : https://www.google.com/intl/en/chrome/demos/speech.html


let emojiContainer = document.getElementById('emoji-container');
let searchBtn = document.getElementById('search-btn');
let micBtn = document.getElementById('mic-btn');
let searchInput = document.getElementById('search-input');
let notification = document.querySelector('.notification');
let network = document.querySelector('.network');
let networkStatus = network.querySelector('.status')
let copiedEmoji = document.getElementById('emoji-copied');
let emojisJson = [];
let uniqueCategories = [];
let recognition = null;



// Speech Recognition Config

const grammar = '#JSGF V1.0;';
try {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
        recognition = new webkitSpeechRecognition();
        // const speechRecognitionList = new SpeechGrammarList();
        // speechRecognitionList.addFromString(grammar, 1);

        // recognition.grammars = speechRecognitionList;
        recognition.lang = 'en-US';

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        // After speech recognition
        recognition.onresult = (event) => {
            const speechToText = event.results[0][0].transcript;
            searchInput.value = speechToText;
            // handleEmojiSearch(speechToText);
        }
    }
} catch (error) {
    console.log(error);
}

// Load from JSON file
(async () => {
    try {
        let res = await fetch('./emoji.json');
        emojisJson = await res.json();
        renderEmojis(emojisJson);
        uniqueCategories = _.forEach(emojisJson ,)
        
    } catch (e) {
        console.log(e);
    }
})();



// Copy to Clipboard
function copyToClipBoard(index) {
    copiedEmoji.textContent = emojisJson[index].emoji;
    navigator.clipboard.writeText(emojisJson[index].emoji);
    notification.classList.add('active');

    setTimeout(() => {
        notification.classList.remove('active');
    }, 5000);
}



// Render Emojis
function renderEmojis(emojis) {
    emojiContainer.textContent = "";

    emojis.forEach((emoji, i) => {
        let cardTemplate = `
        <div class="card" onclick="copyToClipBoard(${i})">
        <div class="card__body">
            <p class="emoji-icon">${emoji.emoji}</p>
        </div>
        <div class="card__footer">
            <p class="emoji-name">${emoji.aliases[0]}</p>
        </div>
    </div>
        `;

        emojiContainer.insertAdjacentHTML("beforeend", cardTemplate);

    });

}



// Search Functionalities

//  1. Search by Typing
searchBtn.addEventListener('click', handleSearchByBtn);
function handleSearchByBtn() {
    let searchText = searchInput.value;
    handleEmojiSearch(searchText);
};


//  2. Search by Speech
micBtn.addEventListener('click', handleSearchByMic);
function handleSearchByMic() {
    recognition.start();
    console.log('Ready to receive a color command.');
}



// Search function
function handleEmojiSearch(searchText) {
    searchText = searchText.toLowerCase();
    let filteredEmojis = emojisJson.filter(emoji => {
        const { aliases, tags } = emoji;
        let isExistsInAliases = aliases.some((alias) => alias.toLowerCase().includes(searchText));
        if (!isExistsInAliases) {
            // check in tags
            let isExistsInTags = tags.some((tag) => tag.toLowerCase().includes(searchText));
            return isExistsInTags;
        } else {
            // filter this item
            return true;
        }
    });

    renderEmojis(filteredEmojis);
}





window.addEventListener('online', (event) => {
    network.style.background = "green";
    
    networkStatus.textContent = "Back online"
 });

window.addEventListener('offline', (event) => {
    network.style.background = "red";
    networkStatus.textContent = "Offline"
 });







