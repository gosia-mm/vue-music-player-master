<template>
  <div id="app">
    <section class="player" v-if="!openedPlaylist">
      <img
        class="cover-image"
        v-bind:class="coverObject"
        :src="current.cover"
      />
      <div class="header">
        <button class="repeat">
          <font-awesome-icon icon="retweet" />
        </button>
        <button class="shuffle">
          <font-awesome-icon icon="random" />
        </button>
        <button class="replay">
          <font-awesome-icon icon="redo-alt" />
        </button>
        <button class="open-playlist" @click="openPlaylist()">
          <font-awesome-icon icon="bars" />
        </button>
      </div>
      <div class="song-details">
        <h2 class="artist">{{ current.artist }}</h2>
        <p class="song-title">{{ current.title }}</p>
      </div>
      <div class="volume-bar">
        <vue-slider v-model="value" />
      </div>
      <div class="controls">
        <button class="share">
          <font-awesome-icon icon="share-alt" />
        </button>
        <button class="prev" @click="prev" v-if="songs.length > 1">
          <font-awesome-icon icon="step-backward" />
        </button>
        <div class="play-pause-progress">
          <vue-ellipse-progress
            :progress="40"
            :size="60"
            :thickness="5"
            lineMode="normal"
            emptyColor="#fff"
            color="#d3d5de"
          >
            <button class="play" v-if="!isPlaying" @click="play">
              <font-awesome-icon icon="play" />
            </button>
            <button class="pause" v-else @click="pause">
              <font-awesome-icon icon="pause" />
            </button>
          </vue-ellipse-progress>
        </div>
        <button class="next" @click="next" v-if="songs.length > 1">
          <font-awesome-icon icon="step-forward" />
        </button>
        <button class="like">
          <font-awesome-icon icon="heart" />
        </button>
      </div>
    </section>
    <section class="playlist" v-else>
      <div class="header">
        <button class="back" @click="closePlaylist">
          <font-awesome-icon icon="reply" />
        </button>
        <h3>Playlist</h3>
      </div>
      <div class="songlist">
        <ul>
          <li v-for="song in songs" :key="song.title" class="song">
            <div class="details" @click="play(song)">
              <p class="duration-and-artist">
                {{ song.duration }} | {{ song.artist }}
              </p>
              <h2 class="song-title">
                {{ song.title }}
              </h2>
            </div>
            <div class="actions">
              <button class="share onplaylist">
                <font-awesome-icon icon="share-alt" />
              </button>
              <button class="like onplaylist">
                <font-awesome-icon icon="heart" />
              </button>
            </div>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
import { formatTimer } from "./helpers/timer";
import { deleteElement, threatSongs, shuffleArray } from "./helpers/utils";
import songs from "./mocks/songs";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/antd.css";

export default {
  components: { VueSlider },
  name: "App",
  data() {
    return {
      current: {},
      coverObject: { cover: true, animated: false },
      index: 0,
      isPlaying: false,
      currentlyTimer: "00:00",
      songs: shuffleArray(songs),
      player: new Audio(),
      openedPlaylist: false,
      value: 75
    };
  },
  methods: {
    listenersWhenPlay() {
      this.player.addEventListener("timeupdate", () => {
        var playerTimer = this.player.currentTime;

        this.currentlyTimer = formatTimer(playerTimer);
        this.current.percent = (playerTimer * 100) / this.current.seconds;
        this.current.isPlaying = true;
      });
      this.player.addEventListener(
        "ended",
        function () {
          this.next();
        }.bind(this)
      );
    },
    setCover() {
      this.coverObject.animated = true;

      setTimeout(() => {
        this.coverObject.animated = false;
      }, 1000);
    },
    setCurrentSong() {
      this.current = this.songs[this.index];
      this.play(this.current);
      this.setCover();
    },
    play(song) {
      if (typeof song.src !== "undefined") {
        this.current.isPlaying = false;
        this.index = this.songs.indexOf(this.current);
        this.current = song;
      }

      this.isPlaying = true;
      this.setCover();
      this.listenersWhenPlay();
      this.closePlaylist();
    },
    pause() {
      this.isPlaying = false;
    },
    next() {
      this.current.isPlaying = false;
      this.index = this.songs.indexOf(this.current);
      this.index++;
      if (this.index > this.songs.length - 1) {
        this.index = 0;
      }
      this.setCurrentSong();
    },
    prev() {
      this.current.isPlaying = false;
      this.index = this.songs.indexOf(this.current);
      this.index--;
      if (this.index < 0) {
        this.index = this.songs.length - 1;
      }
      this.setCurrentSong();
    },
    removeSongFromPlaylist(song) {
      if (this.songs.length > 1) {
        if (this.index > 0) {
          this.index--;
        }
        this.current.isPlaying = false;
        this.songs = deleteElement(this.songs, song);
        this.setCurrentSong();
      }
    },
    openPlaylist() {
      this.openedPlaylist = true;
    },
    closePlaylist() {
      this.openedPlaylist = false;
    }
  },
  mounted() {
    this.songs = threatSongs(this.songs);
    this.current = this.songs[this.index];
    this.openedPlaylist = false;
    this.value = 20;
  }
};
</script>

<style>
@import "./assets/styles/main.css";
</style>
