const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $(".player");
const cd = $(".cd");
const nameSong = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const progress = $("#progress");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playList = $(".playlist");

const PLAYER_STORAGE_KEY = "f8-player";

const app = {
  randomIndexSongArr: [],
  isRepeat: false,
  isRandom: false,
  currentIndex: 0,
  isPlaying: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "1 Click Pow Get Down",
      singer: "Raftaar x Fortnite",
      path: "./src/1.mp3",
      image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg",
    },
    {
      name: "2 Tu Phir Se Aana",
      singer: "Raftaar x Salim Merchant x Karma",
      path: "./src/2.mp3",
      image:
        "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg",
    },
    {
      name: "3 Naachne Ka Shaunq",
      singer: "Raftaar x Brobha V",
      path: "./src/3.mp3",
      image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg",
    },
    {
      name: "4 Mantoiyat",
      singer: "Raftaar x Nawazuddin Siddiqui",
      path: "./src/4.mp3",
      image:
        "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg",
    },
    {
      name: "5 Aage Chal",
      singer: "Raftaar",
      path: "./src/5.mp3",
      image:
        "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg",
    },
    {
      name: "6 Damn",
      singer: "Raftaar x kr$na",
      path: "./src/1.mp3",
      image: "https://picsum.photos/100",
    },
    {
      name: "7 Feeling You",
      singer: "Raftaar x Harjas",
      path: "./src/2.mp3",
      image:
        "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp",
    },
    {
      name: "8 Damn",
      singer: "Raftaar x kr$na",
      path: "./src/3.mp3",
      image: "https://picsum.photos/100",
    },
  ],
  // luu config
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },

  // xu li su kien
  handlEvent: function () {
    // xu li su kien cuon chuot
    const imageWidth = cd.offsetWidth;
    window.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const w = imageWidth - scrollTop;
      cd.style.width = w > 0 ? w + "px" : 0;
      cd.style.opacity = w / imageWidth > 0 ? w / imageWidth : 0;
    };

    // xu li su kien click nut play
    playBtn.onclick = () => {
      if (this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // xu li su kien chay nhac
    audio.onplay = () => {
      this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    // xu li su kien dung nhac
    audio.onpause = () => {
      this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // xu li khi song dang chay
    audio.ontimeupdate = () => {
      const progressPercent = Math.floor(
        (audio.currentTime / audio.duration) * 100
      );
      progress.value = progressPercent;
    };

    // xu li khi click progress bar
    progress.onchange = (e) => {
      const currentTimeSong = (e.target.value / 100) * audio.duration;
      audio.currentTime = currentTimeSong;
    };

    // xu li quay di nhac
    const cdThumbAnimate = cdThumb.animate(
      {
        transform: "rotate(360deg)",
      },
      {
        duration: 10000,
        iterations: Infinity,
      }
    );
    cdThumbAnimate.pause();

    // xu li khi click next song btn
    nextBtn.onclick = () => {
      this.nextSong();
    };
    // xu li khi click prev song btn
    prevBtn.onclick = () => {
      this.prevSong();
    };

    // xu li khi click random prevBtn
    randomBtn.onclick = () => {
      this.isRandom = !this.isRandom;
      this.setConfig("isRandom", this.isRandom);
      randomBtn.classList.toggle("active", this.isRandom);
      this.resetArr();
    };

    // xu li khi click repeat btn
    repeatBtn.onclick = () => {
      this.isRepeat = !this.isRepeat;
      this.setConfig("isRepeat", this.isRepeat);
      repeatBtn.classList.toggle("active", this.isRepeat);
    };

    // xu li next sau khi ket thuc bai hat
    audio.onended = () => {
      if (this.isRepeat) {
        audio.play();
      } else this.nextSong();
    };

    // xu li khi click vao playlist
    playList.onclick = (e) => {
      const songNode = e.target.closest(".song:not(.active)");
      const option = e.target.closest(".option");
      // neu click option
      if (option) {
        alert("con muon gi nua -_-");
      }

      // hoac click bai hat
      else if (songNode) {
        let targetIndexSong = songNode.getAttribute("data-index");
        this.currentIndex = targetIndexSong;
        this.loadCurrentSong();
        audio.play();
      }
    };

    // xu li su kien khi nhan nut right ban phim
    document.onkeydown = (e) => {
      e = e || window.event;
      if (e.keyCode == "39") {
        this.nextSong();
      } else if (e.keyCode == "37") {
        this.prevSong();
      }
    };
  },
  // check co tren viewport ko
  isInViewport: function (el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight)
    );
  },

  // load bai hat hien tai
  loadCurrentSong: function () {
    const song = this.songs[this.currentIndex];
    nameSong.innerText = song.name;
    cdThumb.style.backgroundImage = "url(" + song.image + ")";
    audio.src = song.path;
    this.render();
    const activeSong = $(".song.active");

    // check phan tu co tren viewport
    if (!this.isInViewport(activeSong)) {
      setTimeout(() => {
        activeSong.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 300);
    }
    // check cac phan tu dau tien co bi che lap ko
    if (activeSong.offsetTop < 100) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 300);
    }
  },

  // load config
  loadConfig: function () {
    this.isRepeat = this.config.isRepeat;
    this.isRandom = this.config.isRandom;
  },

  // random song type 1 'random'

  randomSong1: function () {
    let newSong;
    do {
      newSong = Math.floor(Math.random() * this.songs.length);
    } while (newSong == this.currentIndex);
    this.currentIndex = newSong;
    this.loadCurrentSong();
    audio.play();
    console.log(this.currentIndex);
  },

  // random song type 2 'loai tru'
  randomSong2: function () {
    _this = this;

    // tim va xoa phan tu trong mang
    function findAndDeleteItem(arr, item) {
      const index = arr.findIndex((itemArr) => itemArr === item);
      arr.splice(index, 1);
    }
    // chon ngau nhien 1 bai hat trong mang
    function findRandomSong() {
      _this.currentIndex =
        _this.randomIndexSongArr[
          Math.floor(Math.random() * _this.randomIndexSongArr.length)
        ];
      findAndDeleteItem(_this.randomIndexSongArr, _this.currentIndex);
      // console.log(_this.randomIndexSongArr, _this.currentIndex);
      _this.loadCurrentSong();
      audio.play();
    }

    if (this.randomIndexSongArr.length == 0) {
      this.resetArr();
    }
    findRandomSong();
  },

  // random song type 3 'loai tru ngan gon'
  randomSong: function () {
    if (this.randomIndexSongArr.length === 0) {
      this.resetArr();
    }
    this.currentIndex = this.randomIndexSongArr.shift();
    this.loadCurrentSong();
    audio.play();
    // console.log(this.randomIndexSongArr, this.currentIndex);
  },

  resetArr: function () {
    this.randomIndexSongArr = Array.from(Array(this.songs.length).keys());
    this.shuffle(this.randomIndexSongArr);
  },

  // tron ngau nhien cac phan tu trong array (copy tren mang)
  shuffle: function (array) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  },

  nextSong: function () {
    if (this.isRandom) {
      this.randomSong();
    } else {
      this.currentIndex++;
      if (this.currentIndex >= this.songs.length) this.currentIndex = 0;
      this.loadCurrentSong();
      audio.play();
    }
  },
  prevSong: function () {
    if (this.isRandom) {
      this.randomSong();
    } else {
      this.currentIndex--;
      if (this.currentIndex < 0) this.currentIndex = this.songs.length - 1;
      this.loadCurrentSong();
      audio.play();
    }
  },

  // render
  render: function () {
    const htmls = this.songs.map((song, i) => {
      return `
            <div data-index=${i} class="song ${
        this.currentIndex == i ? "active" : ""
      }">
                <div class="thumb" style="background-image: url('${
                  song.image
                }')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
        `;
    });
    playList.innerHTML = htmls.join("");
  },
  start: function () {
    // load config
    this.loadConfig();

    // xu li su kien
    this.handlEvent();

    // load bai dau tien
    this.loadCurrentSong();

    // render
    this.render();

    // tai trang tai cua cac nut
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
    this.resetArr();
  },
};
app.start();
