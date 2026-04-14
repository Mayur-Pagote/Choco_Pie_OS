document.addEventListener('DOMContentLoaded', () => {
    const gameText = document.getElementById('game-text');
    const sceneBg = document.getElementById('scene-bg');
    const choicesContainer = document.getElementById('choices-container');
    const toggleAudioBtn = document.getElementById('toggle-audio');
    const startScreen = document.getElementById('start-screen');
    const uiOverlay = document.getElementById('ui-overlay');
    const menuDescription = document.getElementById('menu-description');
    const menuActions = document.getElementById('menu-actions');
    const startGameBtn = document.getElementById('start-game-btn');
    const instructionsBtn = document.getElementById('instructions-btn');
    const bgm = document.getElementById('bgm');

    let currentNode = 'start';
    let isTypewriting = false;
    let audioContext = null;
    let sfxGain = null;
    let isSoundOn = false;
    let currentTrackIndex = 0;
    let inventory = [];
    const ghostLayer = document.getElementById('ghost-layer');

    const introCopy = "A cursed pixel-horror story waits inside Blackwood Manor. Every choice pulls you deeper into the dark.";
    const instructionsCopy = "Choose one action at a time to guide the story. Turn on sound for the full eerie atmosphere, read the text clues carefully, and if an ending catches you, use the restart choice to begin again.";
    const playlist = [
        'assets/audio/Come-Play-with-Me(chosic.com).mp3',
        'assets/audio/its-in-the-fog(chosic.com).mp3',
        'assets/audio/Labyrinth-of-Lost-Dreams-MP3(chosic.com).mp3'
    ];

    function setMenuState(showInstructions) {
        menuDescription.textContent = showInstructions ? instructionsCopy : introCopy;
        menuActions.innerHTML = '';

        if (showInstructions) {
            const backBtn = document.createElement('button');
            backBtn.className = 'pixel-btn';
            backBtn.textContent = 'Back';
            backBtn.onclick = () => setMenuState(false);
            menuActions.appendChild(backBtn);
            return;
        }

        menuActions.appendChild(startGameBtn);
        menuActions.appendChild(instructionsBtn);
    }

    function startGame() {
        currentNode = 'start';
        inventory = [];
        startScreen.classList.add('hidden');
        uiOverlay.classList.remove('hidden');
        if (!isSoundOn) {
            toggleAudio(true);
        }
        updateScene();
    }

    function typeWriter(text, i = 0) {
        if (i < text.length) {
            isTypewriting = true;
            gameText.innerHTML = text.substring(0, i + 1) + '<span class="cursor">_</span>';
            setTimeout(() => typeWriter(text, i + 1), 30);
            return;
        }

        gameText.innerHTML = text;
        isTypewriting = false;
        showChoices();
    }

    function showChoices() {
        const node = story[currentNode];
        choicesContainer.innerHTML = '';

        node.choices.forEach(choice => {
            // Check if player meets requirements for this choice
            if (choice.requiredItem && !inventory.includes(choice.requiredItem)) {
                return;
            }
            // Check if player already has an item they are about to take (hide if duplicate)
            if (choice.addItem && inventory.includes(choice.addItem)) {
                return;
            }

            const btn = document.createElement('button');
            btn.className = 'pixel-btn';
            btn.textContent = choice.text;
            btn.onclick = () => selectChoice(choice);
            choicesContainer.appendChild(btn);
        });
    }

    function selectChoice(choice) {
        if (isTypewriting) {
            return;
        }

        if (choice.addItem) {
            inventory.push(choice.addItem);
        }

        currentNode = choice.next;
        updateScene();
    }

    function updateScene() {
        const node = story[currentNode];
        choicesContainer.innerHTML = '';

        sceneBg.classList.remove('scene-active');
        sceneBg.classList.add('scene-fade');
        ghostLayer.style.display = 'none';

        setTimeout(() => {
            sceneBg.style.backgroundImage = `url('${node.image}')`;
            sceneBg.className = `scene-fade pixelated ${node.effect || ''}`.trim();

            sceneBg.classList.remove('scene-fade');
            sceneBg.classList.add('scene-active');

            if (node.ghostImage) {
                ghostLayer.style.backgroundImage = `url('${node.ghostImage}')`;
                ghostLayer.style.display = 'block';
            }

            if (currentNode === 'caught_ending' && isSoundOn) {
                playSfx(100, 'sawtooth', 1.0);
            }

            typeWriter(node.text);
        }, 1000);
    }

    function initSfxAudio() {
        if (audioContext) {
            return;
        }

        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        sfxGain = audioContext.createGain();
        sfxGain.gain.setValueAtTime(0.35, audioContext.currentTime);
        sfxGain.connect(audioContext.destination);
    }

    function updateSoundLabel() {
        toggleAudioBtn.textContent = isSoundOn ? 'Sound: On' : 'Sound: Off';
    }

    function loadTrack(index) {
        currentTrackIndex = index;
        bgm.src = playlist[currentTrackIndex];
        bgm.load();
    }

    async function playPlaylist() {
        loadTrack(currentTrackIndex);
        bgm.volume = 0.45;

        try {
            await bgm.play();
            isSoundOn = true;
            updateSoundLabel();
        } catch (error) {
            isSoundOn = false;
            updateSoundLabel();
        }
    }

    function stopPlaylist() {
        bgm.pause();
        bgm.currentTime = 0;
    }

    function toggleAudio(forceOn = false) {
        initSfxAudio();
        isSoundOn = forceOn ? true : !isSoundOn;

        if (isSoundOn) {
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }

            playPlaylist();
            return;
        }

        stopPlaylist();
        updateSoundLabel();
    }

    function playNextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;

        if (!isSoundOn) {
            return;
        }

        playPlaylist();
    }

    function playSfx(freq, type, duration) {
        if (!isSoundOn || !audioContext) {
            return;
        }

        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioContext.currentTime);
        gain.gain.setValueAtTime(0.24, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

        osc.connect(gain);
        gain.connect(sfxGain);
        osc.start();
        osc.stop(audioContext.currentTime + duration);
    }

    bgm.addEventListener('ended', playNextTrack);
    toggleAudioBtn.addEventListener('click', toggleAudio);
    startGameBtn.addEventListener('click', startGame);
    instructionsBtn.addEventListener('click', () => setMenuState(true));

    setMenuState(false);
    uiOverlay.classList.add('hidden');
    sceneBg.classList.remove('scene-fade');
    sceneBg.classList.add('scene-active');
    updateSoundLabel();
});
