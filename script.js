console.log("Start")
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  // Pad minutes and seconds with leading zeros if needed
  const formattedMins = mins < 10 ? '0' + mins : '' + mins;
  const formattedSecs = secs < 10 ? '0' + secs : '' + secs;

  return `${formattedMins}:${formattedSecs}`;
}
let currentSong=new Audio();
const playMusic=(name, artist, pause=false)=>{
    //let audio=new Audio(`/spotify/songs/`+name+`-`+artist+`.mp3`);
    
    currentSong.src="/spotify/songs/"+name+"-"+artist+".mp3";
    if(!pause){
        currentSong.play();
        play.src="pause.svg"
    }
    document.querySelector(".songinfo").innerHTML=name.replaceAll("%20", " ");
    document.querySelector(".songtime").innerHTML=`00:00/00:00`;
}
async function getSongs(){
    let a=await fetch("http://192.168.56.1:3000/spotify/songs/");
    let response = await a.text();
    let div=document.createElement("div");
    div.innerHTML= response;
    
    let as=div.getElementsByTagName("a");
    let songs=[];
    for(let index = 0; index<as.length; index++){
        const element=as[index];
        if(element.href.endsWith(".mp3")){
            s=element.href.split("songs/")[1]
            songs.push(s.split(".mp3")[0]);
        }
    }
    return songs;
}
async function main(){

    

    //get the list of songs
    let songs=await getSongs();
    let s=songs[0].split("-")[0].replaceAll("%20", " ");
    let r=songs[0].split("-")[1].replaceAll("%20", " ");
    playMusic(s,r,true);
    
    //show all the songs in the playlist
    let songUL=document.querySelector(".songList").getElementsByTagName("ul")[0];
    
    songs.forEach((song)=>{
        const li=document.createElement('li');
        li.innerHTML=`<img class="invert" src="music.svg">
                                <div class="info">
                                    <div>${song.split("-")[0].replaceAll("%20", " ")}</div>
                                    <div>${song.split("-")[1].replaceAll("%20", " ")}</div>
                                </div>
                                <div class="playnow">
                                    <span>Play now</span>
                                    <img class="invert" id="playhere" src="play.svg">
                                </div>`
        songUL.appendChild(li);
        
        
        
    })
    
    
    //attach an event listener to each songs
    
    Array.from(songUL.childNodes).forEach(e=>{
        //let g=e.getElementsByTagName("div")[0];
        
        e.addEventListener("click",element=>{
            playMusic(e.querySelector(".info").firstElementChild.innerText.trim().replaceAll(" ","%20"), e.querySelector(".info").lastElementChild.innerText.trim().replaceAll(" ","%20"));
        })
    })

    //attach eventlistener to p,p,n
    //let play=document.querySelector(".songbuttons").getElement("play")[0];
    
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src="pause.svg"
            playhere.src="pause.svg"
        }
        else{
            currentSong.pause();
            play.src="play.svg"
            playhere.src="play.svg"
        }
    })

    //listen for time update event
    currentSong.addEventListener("timeupdate",()=>{
        
        document.querySelector(".songtime").innerHTML = `${formatTime(parseInt(currentSong.currentTime))}/${formatTime(parseInt(currentSong.duration))}`
        
        document.querySelector(".circle").style.left=`${(currentSong.currentTime*100)/currentSong.duration}%`;
    })
    
} 
main();