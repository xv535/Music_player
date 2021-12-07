"use strict";

import tracks from "./data.js";

const log = console.log.bind(document);

const  musicPlayerSection = document.querySelector('.music-player-section'),
    backToHomeBtn = document.querySelector('.music-player-section .back-btn'),
    playlist = document.querySelector('.playlist'),
    navBtn = document.querySelector('.music-player-section .nav-btn'),
    backToPlayer = document.querySelector('.playlist .back-btn');

///////   Carousel   /////////////
let carouselIndex = 0;

function createCaruselItem() {
    const carouselElem = document.createElement('div');
    carouselElem.classList.add("carousel");
    
    tracks.forEach((item, i) => {
        carouselElem.innerHTML += `
        <img src="${item.cover}"  alt="">
        `;
        document.querySelector(".home-section").prepend(carouselElem);
    });
}
createCaruselItem();

const carousel = [...document.querySelectorAll('.carousel img')];//! 
carousel[0].classList.add('active');


const changeCarousel = () => {
    carousel[carouselIndex].classList.toggle('active');

    if (carouselIndex >= carousel.length - 1) {
        carouselIndex = 0;
    } else {
        carouselIndex++;
    }
    carousel[carouselIndex].classList.toggle('active'); //! так нет задержки на последнем слайде

};
setInterval(changeCarousel, 3000);

//-------toggling music player
let clickCount = 1;

musicPlayerSection.addEventListener("click", () => {
    //checking for double click
    if (clickCount >= 2) {
        musicPlayerSection.classList.add('active');
        clickCount = 1;
        return;
    }
    clickCount++;
    setTimeout(() => {
        clickCount = 1;
    }, 400);
});

//------back from music player
backToHomeBtn.addEventListener("click", () => {
    musicPlayerSection.classList.remove('active');
});

//------access playlist
navBtn.addEventListener("click", () => {
    playlist.classList.add('active');
});

//------back from playlist to music player
backToPlayer.addEventListener("click", () => {
    playlist.classList.remove('active');
});

//------music

const music = document.querySelector('#audio-source');

const seekBar = document.querySelector('.music-seek-bar');
const songName = document.querySelector('.current-song-name');
const artistName = document.querySelector('.artist-name');
const coverImage = document.querySelector('.cover');
const currentMusicTime = document.querySelector('.current-time');
const musicDuration = document.querySelector('.duration');



let currentMusic = 0;

// select all buttons here

const forwardBtn = document.querySelector('i.fa-forward');
const backwardBtn = document.querySelector('i.fa-backward');
const playBtn = document.querySelector('i.fa-play');
const pauseBtn = document.querySelector('i.fa-pause');
const repeatBtn = document.querySelector('span.fa-redo-alt');
const volumeBtn = document.querySelector('span.fa-volume-up');
const volumeSlider = document.querySelector('.volume-slider');


function createPlaylist() {

    tracks.forEach((item, i) => {
        const elem = document.createElement('div');
        elem.classList.add("queue");
        elem.innerHTML += `
        <div class="queue-cover">
            <img src="${item.cover}" alt="">
            <i class="fas fa-pause"></i>
        </div>
        <p class="name">${item.title}</p>
        `;
        document.querySelector(".playlist").append(elem);
    });
}
createPlaylist();


const queue = [...document.querySelectorAll('.queue')];
// set up default track 
const setTrack = (i) => {
    
    seekBar.value = 0;
    let track = tracks[i];
    currentMusic = i;

    music.src = track.src;
    songName.innerHTML = track.title;
    artistName.innerHTML = track.artist;
    coverImage.src = track.cover;

    setTimeout(() => {
        seekBar.max = music.duration;
        musicDuration.innerHTML = formatTime(music.duration);
    }, 200);
    currentMusicTime.innerHTML = '00 : 00';
    queue.forEach(item => item.classList.remove('active'));
    queue[currentMusic].classList.add('active');
};

function formatTime(time) {
    let min = Math.floor(time / 60);
    if (min < 10) {
        min = `0` + min;
    }
    let sec = Math.floor(time % 60);
    if (sec < 10) {
        sec = `0` + sec;
    }
    return `${min} : ${sec}`;
}



function playMusic(track) {
    playBtn.addEventListener('click', () => {
        music.play();
        playBtn.classList.remove('active');
        pauseBtn.classList.add('active');
    });
}

function pauseMusic() {
    pauseBtn.addEventListener('click', () => {
        music.pause();
        playBtn.classList.add('active');
        pauseBtn.classList.remove('active');
    });
}

forwardBtn.addEventListener('click', () => {
    if (currentMusic < tracks.length - 1) {
        currentMusic++;
    } else {
        currentMusic = 0;
    }
    setTrack(currentMusic);
    playBtn.click();
});
backwardBtn.addEventListener('click', () => {
    if (currentMusic <= 0) {
        currentMusic = tracks.length - 1;
    } else {
        currentMusic--;
    }
    setTrack(currentMusic);
    playBtn.click();
});

// seekbar events
setInterval(() => {
    seekBar.value = music.currentTime;
    currentMusicTime.innerHTML = formatTime(music.currentTime);

    if (music.currentTime == seekBar.max) {
        if (repeatBtn.className.includes("active")) {
            setTrack(currentMusic);
            playBtn.click();
        } else {
            forwardBtn.click();
        }
    }
}, 500);

seekBar.addEventListener("change", () => {
    music.currentTime = seekBar.value;
});

repeatBtn.addEventListener("click", () => {
    repeatBtn.classList.toggle("active");
});

volumeBtn.addEventListener("click", () => {
    volumeBtn.classList.toggle("active");
    volumeSlider.classList.toggle("active");
});

setInterval(() => {
    if (volumeBtn.classList.contains("active")) {
        volumeBtn.classList.remove("active");
        volumeSlider.classList.remove("active");
    }
}, 10000);

volumeSlider.addEventListener("input", () => {
    music.volume = volumeSlider.value;
});

queue.forEach((item, i) => {
    item.addEventListener("click", () => {
        if (!item.classList.contains("active")) {
            // item.classList.add("active");
            setTrack(i);
            playBtn.click();
        } else {
            pauseBtn.click();
            item.classList.remove("active");
        }
    });
});

playMusic();
pauseMusic();
setTrack(0);