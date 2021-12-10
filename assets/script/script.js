const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const USER_CONFIG_KEY = 'admin';
const player = $('.player');
const playlist = $('.playlist');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const shufBtn = $('.btn-shuffle');
const reptBtn = $('.btn-repeat');
const progress = $('#progress');
const volAdj = $('#control-vol');
console.log(volAdj);
const app = {
    currentIndex: 0,
    isPlaying: false,
    isShuffle: false,
    isRepeat: false,
    audioVol: 1.0,
    config: JSON.parse(localStorage.getItem(USER_CONFIG_KEY)) || {},
    songs: [
        {
            name: 'Gimme! Gimme! Gimme! (A Man After Midnight)',
            artist: 'ABBA',
            path: './assets/music/ABBA - Gimme! Gimme! Gimme! (A Man After Midnight).mp3',
            image: './assets/img/ABBA\ -\ Gimme!\ Gimme!\ Gimme!\ \(A\ Man\ After\ Midnight\).jpg'
        },
        {
            name: 'High On Life',
            artist: 'Martin Garrix',
            path: './assets/music/Martin Garrix - High on life.mp3',
            image: './assets/img/Martin Garrix - High on life.jpg'
        },
        {
            name: 'Pizza',
            artist: 'Martin Garrix',
            path: './assets/music/Martin Garrix - Pizza.mp3',
            image: './assets/img/Martin Garrix - Pizza.jpg'
        },
        {
            name: 'Used To Love',
            artist: 'Martin Garrix',
            path: './assets/music/Martin Garrix - Used to love.mp3',
            image: './assets/img/Martin Garrix - Used to love.jpg'
        },
        {
            name: 'BIG CITY BOI',
            artist: 'BINZ',
            path: './assets/music/TOULIVER x BINZ - BIGCITYBOI.mp3',
            image: './assets/img/BINZ - Big city boi.jpg'
        },
        {
            name: '\'How You Like That\'',
            artist: 'BLACKPINK',
            path: './assets/music/BLACKPINK - How You Like That.mp3',
            image: './assets/img/BLACKPINK - How You Like That.jpg'
        },
        {
            name: 'Take Me To Church',
            artist: 'Hozier',
            path: './assets/music/Hozier - Take Me To Church.mp3',
            image: './assets/img/Hozier - Take Me To Church.jpg'
        },
        {
            name: 'Believer',
            artist: 'Imagine Dragons',
            path: './assets/music/Imagine Dragons - Believer.mp3',
            image: './assets/img/Imagine Dragons - Believer.jpg'
        },
        {
            name: 'Demons',
            artist: 'Imagine Dragons',
            path: './assets/music/Imagine Dragons - Demons.mp3',
            image: './assets/img/Imagine Dragons - Demons.jpg'
        },
        {
            name: 'Counting Stars',
            artist: 'Imagine Dragons',
            path: './assets/music/OneRepublic - Counting Stars.mp3',
            image: './assets/img/OneRepublic - Counting Stars.jpg'
        },
        {
            name: '\'U R\'',
            artist: 'LOONA (이달의소녀)',
            path: './assets/music/LOONA (이달의소녀) - U R.mp3',
            image: './assets/img/LOONA (이달의소녀) - U R.jpg'
        },
        {
            name: '\'Voice (목소리)\'',
            artist: 'LOONA (이달의소녀)',
            path: './assets/music/LOONA 이달의 소녀  Voice (목소리) .mp3',
            image: './assets/img/LOONA 이달의 소녀Voice (목소리).jpg'
        },
    ],
    setConfig: function(key, value){
        this.config[key] = value;
        localStorage.setItem(USER_CONFIG_KEY,JSON.stringify(this.config));

    },
    render: function(){
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" 
                    style="background-image: url('${song.image}')"
                    >
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="artist">${song.artist}</p>
                    </div>
                    <div class="option">
                        <span class="ti-more"></span>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function(){
        const _this = this; 
        const cdWidth = cd.offsetWidth;
        // Xử lý CD quay/ dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform:'rotate(360deg)'}
        ],{
            duration: 10000, //10s
            iterations: Infinity,
        })
        cdThumbAnimate.pause();
        // Xử lý phóng to/ thu nhỏ CD
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth/cdWidth;
        }
        // Xử lý khi click play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause();
                cdThumbAnimate.pause();
            }else{
                audio.play();
                cdThumbAnimate.play();
            }
        }
        // Xử lý trạng thái play
        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add('playing');
        }
        // Xử lý trạng thái pause
        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove('playing');
        }
        // Xử lý timeline của bài hát
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPerc = Math.floor(audio.currentTime / audio.duration *100);
                progress.value = progressPerc;
            }
        }
        // Xử lý khi tua 
        progress.oninput= function(e){
            // audio.currentTime = e.target.value/100*audio.duration;
            const seekTime = audio.duration/100 * e.target.value;
            audio.currentTime = seekTime;
        }
        volAdj.oninput = function(e){
            // volAdj.value = e.target.value;
            audio.volume = e.target.value/100;
            _this.setConfig('audioVol', audio.volume);
        }
        // Xử lý khi ấn nút next
        nextBtn.onclick = function(){
            if(_this.isShuffle){
                _this.playRandomSong();
            }else{
                _this.loadNextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
            cdThumbAnimate.play();
        }
        prevBtn.onclick = function(){
            if(_this.isShuffle){
                _this.playRandomSong();
            }else{
                _this.loadPrevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
            cdThumbAnimate.play();
        }
        // Xử lý bật tắt nút shuffle
        shufBtn.onclick = function(e){
            _this.isShuffle = !_this.isShuffle;
            _this.setConfig('isShuffle', _this.isShuffle);
            shufBtn.classList.toggle('active', _this.isShuffle);
        }
        // Xử lý bật loop bài hát
        reptBtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            reptBtn.classList.toggle('active', _this.isRepeat);
        }
        // Xử lý audio khi kết thúc
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            }else{
                nextBtn.click();
            }
        }
        playlist.onclick = function(e){
            const songNode =  e.target.closest('.song:not(.active)');
            if( songNode || e.target.closest('.option')){
                    // Xử lý khi click vào bài hát trong playlist
                    if(songNode){
                        _this.currentIndex = Number(songNode.dataset.index);
                        _this.loadCurrentSong();
                        _this.render();
                        audio.play();
                        cdThumbAnimate.play();
                    }

            }
           
        }
    },
    scrollToActiveSong: function(){
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }, 300)
    },
    loadConfig: function(){
        this.isShuffle = this.config.isShuffle;
        this.isRepeat = this.config.isRepeat;
        volAdj.value = this.config.audioVol * 100;
        shufBtn.classList.toggle('active', this.isShuffle);
        reptBtn.classList.toggle('active', this.isRepeat);
    },
    loadCurrentSong: function(){
        heading.textContent = `${this.currentSong.artist} - ${this.currentSong.name}`;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
        audio.volume = volAdj.value/100;
    },
    loadNextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >=this.songs.length){
            this.currentIndex = 0;
        };
        this.loadCurrentSong();
    },
    loadPrevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;
        };
        this.loadCurrentSong();
    },
    playRandomSong(){
        let newSongIndex
        do{
            newSongIndex = Math.floor(Math.random()*this.songs.length);
        }while(newSongIndex === this.currentIndex)
        this.currentIndex = newSongIndex;
        this.loadCurrentSong();
    },
    // playOnSelect(){ 
    //     const songs = $$('.song');
    //     const _this = this;
    //     songs.forEach((song,index)=>{
    //         song.onclick = function(){
    //             _this.currentIndex = index;
    //             _this.loadCurrentSong();
    //             _this.render();
    //             console.log(_this);
    //             _this.playOnSelect();
    //         }
    //     })
    // },
    start: function(){
        // gán cấu hình từ config vào app
        this.loadConfig();
        // định nghĩa các thuộc tính cho object
        this.defineProperties();
        // lắng nghe và xử lý các sự kiện
        this.handleEvents();
        // tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();
        // render playlist
        this.render();
        // this.playOnSelect();
    },
}
app.start();