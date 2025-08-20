import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
        
import { getDatabase, ref, set, get, query, orderByChild, limitToLast, onValue, onChildAdded, onChildRemoved, push, onDisconnect } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";
        
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
  
  const firebaseConfig = {
    apiKey: "AIzaSyCNHqAisuVQ9jLZSWaq4I9pXsJv0ihsqok",
    authDomain: "fahrrad-imperium-3.firebaseapp.com",
    databaseURL: "https://fahrrad-imperium-3-default-rtdb.firebaseio.com",
    projectId: "fahrrad-imperium-3",
    storageBucket: "fahrrad-imperium-3.appspot.com",
    messagingSenderId: "194464378570",
    appId: "1:194464378570:web:aa3f1a23a9ba1dd2f84e33",
    measurementId: "G-MCG352721W"
  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const auth = getAuth(app);

let currentUser = null;
let customUserName = null;
        
function reload() {
    location.reload();
}
        
        
const storedUsername = localStorage.getItem('username');

setInterval(() => {
    if (storedUsername) {
        updateCoinsInDatabase();
        updatePrestigeCountInDatabase();
        updateOnlineStatus();
    }
}, 2500);

if (!storedUsername) {    
    document.getElementById('usernamePopup').style.display = 'flex';
        
}

function createAccount() {
    const username = document.getElementById('usernameInput').value;
    const email = username + "@example.com";
    const password = "password";
   
    const usersRef = ref(db, 'users/' + username);
    get(usersRef)
        .then((snapshot) => {
            if (snapshot.exists()) { 
                alert('Der Benutzername wird bereits verwendet. Bitte wählen Sie einen anderen.');
            } else {
                createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        localStorage.setItem('username', username);
                                                                       
                        const userId = userCredential.user.uid;
                        const userRef = ref(db, `users/${userId}`);
                        set(userRef, {
                        customUserName: username,
                        coins: 0,
                        prestigeCount: 0,
                        online: 0
                        });

                    document.getElementById('usernamePopup').style.display = 'none';
                    location.reload();
                    });
            }
        })
        .catch((error) => {
            console.error('Fehler beim Überprüfen des Benutzernamens:', error);
        });
}

document.getElementById('createButton').addEventListener('click', createAccount);

function signInUser(username) {
    const email = username + "@example.com";
    const password = "password";

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            localStorage.setItem('username', username);
            //updateUIForLoggedInUser();
        })
        .catch((error) => {
            document.getElementById('usernamePopup').style.display = 'block';
            console.error("Fehler bei der Anmeldung: ", error);
        });
}

function loadUserDataFromFirebase(userId) {
    const userRef = ref(db, `users/${userId}`);
    get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
            const userData = snapshot.val();            
        } else {
            console.log('Benutzerdaten nicht gefunden');
        }
    }).catch((error) => {
        console.error('Fehler beim Laden der Benutzerdaten:', error);
    });
}


function updateCoinsInDatabase() {
    if (auth.currentUser) { 
        const progressData = JSON.parse(localStorage.getItem('FI3test7'));
        if (progressData && 'coins' in progressData) {
            const coins = progressData.coins;
            const userId = auth.currentUser.uid;
            const userCoinsRef = ref(db, `users/${userId}/coins`);
            set(userCoinsRef, coins); 
        }
    } 
}

function updatePrestigeCountInDatabase() {
    if (auth.currentUser) {
        const progressData = JSON.parse(localStorage.getItem('FI3test7'));
        if (progressData && 'prestigeCount' in progressData) {
            const prestigeCount = progressData.prestigeCount;
            const userId = auth.currentUser.uid;
            const userPrestigeCountRef = ref(db, `users/${userId}/prestigeCount`);
            set(userPrestigeCountRef, prestigeCount); 
        }
    } 
}

function updateOnlineStatus() {
    if (auth.currentUser) {
            const userId = auth.currentUser.uid;
            const userOnlineRef = ref(db, `users/${userId}/online`);
            const currentTime = new Date().getTime();
            
            set(userOnlineRef, currentTime);
    } 
}
                        
        onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        getCustomUserName(user).then((name) => {
            customUserName = name;
            console.log('Custom username loaded:', customUserName); // Debug-Log hinzufügen
        });
    } else {
        currentUser = null;
        customUserName = null;
    }
});

        function getCustomUserName(user) {
            const userRef = ref(db, 'users/' + user.uid);
            return get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    return snapshot.val().customUserName;
                } else {
                    return user.email;
                }
            });
        }
        
function checkOnlineStatus() {
    const containerRef = query(ref(db, 'users'));
    setInterval(() => {
        onValue(containerRef, (snapshot) => {
            const container = document.getElementById('containerMember');
            container.innerHTML = '';

            const users = [];
            snapshot.forEach((userSnapshot) => {
                const user = userSnapshot.val();
                user.id = userSnapshot.key;
                users.push(user);
            });

            users.sort((a, b) => a.customUserName.localeCompare(b.customUserName));

            const onlineUsers = users.filter(user => {
                const currentTime = new Date().getTime();
                const lastOnlineTime = user.online || 0;
                const timeDifference = (currentTime - lastOnlineTime) / 1000;
                return timeDifference <= 20;
            });

            const offlineUsers = users.filter(user => !onlineUsers.includes(user));

            const sortedUsers = onlineUsers.concat(offlineUsers);

            sortedUsers.forEach((userData) => {
                const userDiv = document.createElement('div');
                userDiv.className = 'leaderboard-entry';

                const nameDiv = document.createElement('div');
                nameDiv.className = 'username';
                nameDiv.textContent = userData.customUserName;

                const onlineDiv = document.createElement('div');
                onlineDiv.className = 'online-status-dot';

                const currentTime = new Date().getTime();
                const lastOnlineTime = userData.online || 0;
                const timeDifference = (currentTime - lastOnlineTime) / 1000;
                if (timeDifference <= 20) {
                    onlineDiv.classList.add('online-dot');
                } else {
                    onlineDiv.classList.add('offline-dot');
                }

                userDiv.appendChild(nameDiv);
                userDiv.appendChild(onlineDiv);
                container.appendChild(userDiv);
            });
        });
    }, 5000);
}


checkOnlineStatus();

        
let unreadMessages = 0;

function showPing() {
    const pingDiv = document.getElementById('ping');
    pingDiv.textContent = unreadMessages;
    pingDiv.style.display = 'flex';
}

function hidePing() {
    const pingDiv = document.getElementById('ping');
    pingDiv.style.display = 'none';
}

const sessionStartTime = new Date().getTime() - (3 * 60 * 60 * 1000);

onChildAdded(ref(db, 'messages'), (snapshot) => {
    const data = snapshot.val();

    if (data.timestamp >= sessionStartTime) {
        // Warten, bis customUserName verfügbar ist
        if (!customUserName) {
            const checkInterval = setInterval(() => {
                if (customUserName) {
                    clearInterval(checkInterval);
                    displayMessage(data);
                }
            }, 100);
        } else {
            displayMessage(data);
        }
    }
});

function displayMessage(data) {
    const messageContainerTop = document.createElement('div');
    messageContainerTop.className = data.sender === customUserName ? 'my-message' : 'other-message';

    const senderDiv = document.createElement('div');
    senderDiv.className = data.sender === customUserName ? 'my-message-sender' : 'other-message-sender';
    senderDiv.textContent = data.sender;

    const messageContainer = document.createElement('div');
    messageContainer.className = 'message-container';

    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.textContent = data.message;

    const timeDiv = document.createElement('div');
    timeDiv.className = data.sender === customUserName ? 'my-message-timestamp' : 'other-message-timestamp';
    timeDiv.textContent = new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    messageContainer.appendChild(textDiv);
    messageContainer.appendChild(timeDiv);

    messageContainerTop.appendChild(senderDiv);
    messageContainerTop.appendChild(messageContainer);

    document.getElementById('chatBox').appendChild(messageContainerTop);
    scrollToBottom();
}

function scrollToBottom() {
    const chatBox = document.getElementById('chatBox');
    chatBox.scrollTop = chatBox.scrollHeight;
}


const messageInput = document.getElementById('messageInput');
messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        const timestamp = new Date().getTime();
        set(ref(db, 'messages/' + timestamp), {
            message: message,
            sender: customUserName,
            timestamp: timestamp
        });
        messageInput.value = '';
    }
}

document.getElementById('sendButton').addEventListener('click', sendMessage);

        function updateLeaderboardCoins() {
    const leaderboardRef = query(ref(db, 'users'), orderByChild('coins'), limitToLast(5));
    onValue(leaderboardRef, (snapshot) => {
        const leaderboardContainer = document.querySelector('.button-row-container-rank-coins');
        leaderboardContainer.innerHTML = '';

        const users = [];
        snapshot.forEach((userSnapshot) => {
            const user = userSnapshot.val();
            user.id = userSnapshot.key;
            users.unshift(user);
        });

        for (let i = users.length; i < 5; i++) {
            users.push({ customUserName: 'Unbekannt', coins: 0 });
        }

        users.forEach((userData, index) => {
            const userDiv = document.createElement('div');
            userDiv.className = 'leaderboard-entry';

            const rankDiv = document.createElement('div');
            rankDiv.className = 'rank';
            rankDiv.textContent = `${index + 1}.`;

            const nameDiv = document.createElement('div');
            nameDiv.className = 'username';
            nameDiv.textContent = userData.customUserName;

            const coinsDiv = document.createElement('div');
            coinsDiv.className = 'coins';
            coinsDiv.innerHTML = `${formatNumber(userData.coins)} <img src='coin.svg' style='width: calc(var(--base-size) * 0.9); margin: 0; margin-left: calc(var(--base-size) * 0.1); transform: translateY(20%);'/>`;


            userDiv.appendChild(rankDiv);
            userDiv.appendChild(nameDiv);
            userDiv.appendChild(coinsDiv);

            leaderboardContainer.appendChild(userDiv);
        });
    });
}

updateLeaderboardCoins();

function updateLeaderboardPrestigeCount() {
    const leaderboardRef = query(ref(db, 'users'), orderByChild('prestigeCount'), limitToLast(5));
    onValue(leaderboardRef, (snapshot) => {
        const leaderboardContainer = document.querySelector('.button-row-container-rank-prestige-level');
        leaderboardContainer.innerHTML = '';

        const users = [];
        snapshot.forEach((userSnapshot) => {
            const user = userSnapshot.val();
            user.id = userSnapshot.key;
            users.unshift(user);
        });

        for (let i = users.length; i < 5; i++) {
            users.push({ customUserName: 'Unbekannt', prestigeCount: 0 });
        }

        users.forEach((userData, index) => {
            const userDiv = document.createElement('div');
            userDiv.className = 'leaderboard-entry';

            const rankDiv = document.createElement('div');
            rankDiv.className = 'rank';
            rankDiv.textContent = `${index + 1}.`;

            const nameDiv = document.createElement('div');
            nameDiv.className = 'username';
            nameDiv.textContent = userData.customUserName;

            const prestigeCountDiv = document.createElement('div');
            prestigeCountDiv.className = 'prestigeCount';
            prestigeCountDiv.innerHTML = `${formatNumber(userData.prestigeCount)} <img src='prestige.svg' style='width: calc(var(--base-size) * 0.9); margin: 0; margin-left: calc(var(--base-size) * 0.1); transform: translateY(20%);'/>`;

            userDiv.appendChild(rankDiv);
            userDiv.appendChild(nameDiv);
            userDiv.appendChild(prestigeCountDiv);

            leaderboardContainer.appendChild(userDiv);
        });
    });
}

updateLeaderboardPrestigeCount();

        function formatNumber(number) {
    const suffixes = ['', 'K', 'M', 'B', 'T', 'aa', 'ab', 'ac', 'ad', 'ae', 'af', 'ag', 'ah', 'ai', 'aj', 'ak', 'al', 'am', 'an', 'ao', 'ap', 'aq', 'ar', 'as', 'at', 'au', 'av', 'aw', 'ax', 'ay', 'az'];
    
    let i = 0;
    while (number >= 1e3 && i < suffixes.length - 1) {
        number /= 1e3;
        i++;
    }

    return (number.toFixed(2) + suffixes[i]).replace('.00', '');
}
