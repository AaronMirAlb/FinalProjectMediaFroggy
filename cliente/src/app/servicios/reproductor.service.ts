import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReproductorService {
  private audioElement: HTMLAudioElement;

  isPaused:boolean=true
  currentProgress: number = 0;
  totalDuration: any;
  playlist:any
  positionPlaying:number=0
  songs:any[]=[]
  songPlaying:any
  volumeLocal:number

  constructor() {
    this.audioElement = new Audio();
    this.audioElement.addEventListener('timeupdate', () => {
      this.currentProgress = this.audioElement.currentTime;
    });
    this.audioElement.addEventListener('loadedmetadata', () => {
      this.totalDuration = this.audioElement.duration
      console.log("Duracion total: "+this.totalDuration)
    });
    this.audioElement.addEventListener('ended', () => {
      this.handleSongEnd();
    });

    let savedVolumeLocal = localStorage.getItem("volumeLocal") || "[]"
    this.volumeLocal = JSON.parse(savedVolumeLocal);
  }

  ngOnInit()
  {
    this.audioElement.autoplay=true

  }
  ngOnChanges()
  {
    this.getTotalDuration()
  }

  reproduce(song:any) {
    this.songPlaying = song;
    this.audioElement.src = this.songPlaying.file;
    this.audioElement.play();
    this.isPaused=false
    //Falta enviar la cancion al compReproductor para actualizar nombre etc etc
    return this.getTotalDuration()
  }

  reproducePlaylist(songs: any[], songOrder: number) {
    this.songs = songs;
    this.positionPlaying=songOrder
    this.reproduce(this.songs[songOrder]);
  }

//Funcion que devuelve
  reproducing()
  {
    return this.songPlaying
  }

  playPausa():boolean {
      if (this.audioElement.paused) {
        this.audioElement.play();
        this.isPaused = false;
      } else {
        this.audioElement.pause();
        this.isPaused = true;
    }
    return this.isPaused;
  }

  detener() {
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
    this.isPaused = true;
  }

  previousSong(){
    if(this.positionPlaying>0)
    {
      this.positionPlaying--
      this.reproduce(this.songs[this.positionPlaying])
      return this.songs[this.positionPlaying]
    }
  }

  nextSong(){  
    if(this.songs.length>this.positionPlaying+1)
    {
      this.positionPlaying++
      this.reproduce(this.songs[this.positionPlaying])
      return this.songs[this.positionPlaying]
    }
  }

  updateVolume(volume:any) {
    this.audioElement.volume = volume;
    this.setVolumeLocal(volume)
  }

  setVolumeLocal(volume:number){
    this.volumeLocal = volume
    localStorage.setItem("volumeLocal", JSON.stringify(this.volumeLocal))
  }

  getVolumeLocal()
  {
    return this.volumeLocal
  }

  onProgressChange() {
    this.audioElement.currentTime = this.currentProgress;
  }

  handleSongEnd()
  { 
    this.nextSong()
  }

  async getTotalDuration()
  {
    return this.totalDuration
  }

  /*
audioElement.play();
Pause: Pausa la reproducción del audio.
typescript
Copy code
audioElement.pause();
Stop: Detiene la reproducción del audio y lo reinicia al principio.
typescript
Copy code
audioElement.pause();
audioElement.currentTime = 0;
CurrentTime: Obtiene o establece la posición actual de reproducción del audio (en segundos).
typescript
Copy code
// Obtener la posición actual
const currentTime = audioElement.currentTime;

// Establecer la posición actual
audioElement.currentTime = 30; // Ir a los 30 segundos
Duration: Obtiene la duración total del audio (en segundos).
typescript
Copy code
const duration = audioElement.duration;
Volume: Obtiene o establece el volumen del audio (entre 0 y 1).
typescript
Copy code
// Obtener el volumen actual
const volume = audioElement.volume;

// Establecer el volumen
audioElement.volume = 0.5; // Establecer volumen al 50%
Muted: Obtiene o establece si el audio está silenciado.
typescript
Copy code
// Obtener el estado de silencio
const isMuted = audioElement.muted;

*/

// Establecer el estado de silencio
muteUnmuted(){
  //editar boton pa que cambie su imagen segun estado
  this.audioElement.muted = !this.audioElement.muted; // Silenciar el audio

}

//Loop: Obtiene o establece si el audio debe repetirse en bucle.
/*
// Obtener el estado de bucle
const isLooping = audioElement.loop;
/*
// Establecer el estado de bucle
audioElement.loop = true; // Repetir en bucle
Ended: Evento que se dispara cuando la reproducción del audio ha finalizado.
typescript
Copy code
audioElement.addEventListener('ended', () => {
  // Acciones a realizar cuando el audio ha finalizado
});
*/


}
