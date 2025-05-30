
let songUL;
let songs;
let currfolder;
let folders=[];
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  // Pad minutes and seconds with leading zeros if needed
  const formattedMins = mins < 10 ? '0' + mins : '' + mins;
  const formattedSecs = secs < 10 ? '0' + secs : '' + secs;

  return `${formattedMins}:${formattedSecs}`;
}
let currentSong=new Audio();
const playMusic=(folder,name, artist, pause=false)=>{
    //let audio=new Audio(`/spotify/songs/`+name+`-`+artist+`.mp3`);
    currfolder=folder;
    currentSong.src=`https://github.com/debasrita09/Spotify-clone-1/tree/main/songs/${currfolder}/`+name+"-"+artist+".mp3";
    
    if(!pause){
        currentSong.play();
        play.src="pause.svg"
    }
    document.querySelector(".songinfo").innerHTML=name.replaceAll("%20", " ");
    document.querySelector(".songtime").innerHTML=`00:00/00:00`;
}

//fetch songs
async function getSongs(folder){
    currfolder=folder.replaceAll(" ", "%20");
    let a=await fetch(`https://github.com/debasrita09/Spotify-clone-1/tree/main/songs/${currfolder}/`);
    let response = await a.text();
    let div=document.createElement("div");
    div.innerHTML= response;
    
    let as=div.getElementsByTagName("a");
     songs=[];
    for(let index = 0; index<as.length; index++){
        const element=as[index];
        
        if(element.href.endsWith(".mp3")){
            
            let r=element.href;
            let s=r.split(`${currfolder}/`)[1];
            songs.push(s.split(".mp3")[0]);
            
        }
    }
    return songs;
}

//fetch folders
async function getfolders(){
    let b=await fetch(`https://github.com/debasrita09/Spotify-clone-1/tree/main/songs/`);
    let c=await b.text();
   
    let div=document.createElement("div");
    div.innerHTML=c;

    let aa=div.getElementsByTagName("a");
    
    for(let index=1; index<aa.length; index++){
        const ele=aa[index].href.replaceAll(" ", "%20");
        
        let ele1=ele.split("songs/")[1];
        let ele2=ele1.replaceAll(" ", "%20");
        
        let ele3=ele2.split("/")[0];
        
        folders.push(ele3);
        
        
    }
    
    
}

//console.log(folders);
async function main(){

    await getfolders();
    console.log(folders);
    Array.from(folders).forEach(async folder=>{
        let f= await fetch(`https://github.com/debasrita09/Spotify-clone-1/tree/main/songs/${folder}/info.json`)
        let response=await f.json();
        const card=document.createElement("li");
        card.classList.add("card");
        card.id=`${folder}`;
        card.innerHTML=`<div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"
                                fill="none">
                                <!-- Green circular background -->
                                <circle cx="16" cy="16" r="16" fill="grey" />

                                <!-- Solid black play icon centered with padding -->
                                <g transform="translate(4, 4)">
                                    <path
                                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                        fill="#000000" />
                                </g>
                            </svg>



                        </div>
                        <img src="https://github.com/debasrita09/Spotify-clone-1/tree/main/songssongs/${folder}/${folder}.jpg">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>`
        document.querySelector(".cardContainer").appendChild(card);

    })

    //get the list of songs
    
    songs=await getSongs("Party Songs");
    let s=songs[0].split("-")[0].replaceAll("%20", " ");
    let r=songs[0].split("-")[1].replaceAll("%20", " ");
    playMusic("Party Songs",s,r,true);
    
    //show all the songs in the playlist
    songUL=document.querySelector(".songList").getElementsByTagName("ul")[0];
    
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
            playMusic(currfolder,e.querySelector(".info").firstElementChild.innerText.trim().replaceAll(" ","%20"), e.querySelector(".info").lastElementChild.innerText.trim().replaceAll(" ","%20"));
        })
    })

    //attach eventlistener to play
    
    
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src="https://github.com/debasrita09/Spotify-clone-1/blob/main/pause.svg"
            
        }
        else{
            currentSong.pause();
            play.src="https://github.com/debasrita09/Spotify-clone-1/blob/main/play.svg"
            
        }
    })

    //listen for time update event
    currentSong.addEventListener("timeupdate",()=>{
        
        document.querySelector(".songtime").innerHTML = `${formatTime(parseInt(currentSong.currentTime))}/${formatTime(parseInt(currentSong.duration))}`
        
        document.querySelector(".circle").style.left=`${(currentSong.currentTime*100)/currentSong.duration}%`;
    })


    //add event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        
        let seek=(e.offsetX*100)/e.target.getBoundingClientRect().width;
        
        document.querySelector(".circle").style.left=`${seek}%`
        currentSong.currentTime=(seek/100)*currentSong.duration;

    })


    //add listener to hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left="0px";
    })
    //add event listener to close the left extension
    document.querySelector(".logodiv").lastElementChild.addEventListener("click", ()=>{
        document.querySelector(".left").style.left="-120%";
    })

    
    //add event listener to previous and next button
    previous.addEventListener("click",()=>{
        currfolder=currfolder.replaceAll(" ", "%20")
        let now1=currentSong.src.split(`songs/${currfolder}`)[1];
        let now2=now1.split(".mp3")[0];
        
        let index=-1*songs.indexOf(now2);
        
        if(index!=0){
            
            let prevname=songs[index-1].split("-")[0];
            let prevartist=songs[index-1].split("-")[1];
            playMusic(currfolder,prevname, prevartist);
        }
    })
    next.addEventListener("click",()=>{
        currfolder=currfolder.replaceAll(" ", "%20")
        let now1=currentSong.src.split(`songs/${currfolder}/`)[1];
        
        let now2=now1.split(".mp3")[0];
        
        let index=-1* songs.indexOf(now2);
        
        if(index!=(songs.length-1)){
            
            let nextname=songs[index+1].split("-")[0];
            let nextartist=songs[index+1].split("-")[1];
            playMusic(currfolder,nextname, nextartist);
        }
    })

    //add event listener to volume button
    document.querySelector(".range").addEventListener("change", (e)=>{
        currentSong.volume=parseInt(e.target.value)/100;
        
    })
    document.querySelector(".volume").firstElementChild.addEventListener("click", ()=>{
        if(currentSong.volume==0){
            currentSong.volume=0.5;
            volimg.src="https://github.com/debasrita09/Spotify-clone-1/blob/main/volume.svg";
            document.querySelector(".range").value=50;
        }
        else {
            currentSong.volume=0;
            volimg.src="https://github.com/debasrita09/Spotify-clone-1/blob/main/mute.svg";
            document.querySelector(".range").value=0;
        }
    })
    
    //load playlist acc to card clicked
    document.querySelector(".cardContainer").childNodes.forEach(e=>{
        e.addEventListener("click",async item=>{
            
            let album=item.target.parentNode.id;
            console.log(album);

            songs=await getSongs(`${album}`);

            let s=songs[0].split("-")[0].replaceAll("%20", " ");
            let r=songs[0].split("-")[1].replaceAll("%20", " ");
            playMusic(album,s,r);
            
            songUL.innerHTML=" "
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
        })

        
    })


} 
main();