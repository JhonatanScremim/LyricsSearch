const form = document.querySelector('#form')
const searchInput = document.querySelector('#search')
const songsContainer = document.querySelector('#songs-container')
const prevAndNextContainer = document.querySelector('#prev-and-next-container')

const apiURL = `https://api.lyrics.ovh`;

const fetchData = async url => {
    const response = await fetch(url) 
    return await response.json();
}

const getMoreSongs = async url =>{
    const data = await fetchData(`https://cors-anywhere.herokuapp.com/${url}`)

    insertSongsIntoPage(data);
}

const insertSongsIntoPage = songsInfo => {
    
    songsContainer.innerHTML = songsInfo.data.map(song => `
    <li CLASS="song">
    <span class="song-artist"><strong>${song.artist.name}</strong> - ${song.title}</span>
    <button class="btn" data-artist="${song.artist.name}" data-song-title="${song.title}">Ver letra</button>
    </li>
    `).join('')


    if(songsInfo.prev || songsInfo.next){
        prevAndNextContainer.innerHTML = `
        ${songsInfo.prev ? `<button class="btn" onClick="getMoreSongs('${songsInfo.prev}')">Anterioes</button>` : '' }
        ${songsInfo.next ? `<button class="btn" onClick="getMoreSongs('${songsInfo.next}')">Próximas</button>` : '' }
        `
        return
    }

    prevAndNextContainer.innerHTML = ''
}

const fetchSongs =  async term => {
const data = await fetchData(`${apiURL}/suggest/${term}`)

insertSongsIntoPage(data);

//    fetch(`${apiURL}/suggest/${term}`)
//       .then(response => response.json())
//        .then(data => {
//            console.log(data)
//        })
}

form.addEventListener('submit', event => { 
    event.preventDefault()

    const searchTerm = searchInput.value.trim()
    // trim() removerá todos os espaços em branco no final e no começo da string

    if(!searchTerm){
        songsContainer.innerHTML = `<li class="warning-message">Por favor, digite um termo valido</li>`
        return
    }
    
    fetchSongs(searchTerm)
})

const fetchLyrics = async(artist, songTitle) => { 
    const data = await fetchData(`${apiURL}/v1/${artist}/${songTitle}`)

    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>')
    
    songsContainer.innerHTML = `
    <li class="lyrics-container">
        <h2>
            <strong>${songTitle}</strong> - ${artist}
        </h2>    
        <p class="lyrics">${lyrics}</p>
    </li>
    `
}

songsContainer.addEventListener('click', event =>{
    const clickedElement = event.target

    if(clickedElement.tagName === 'BUTTON'){
        const artist = clickedElement.getAttribute('data-artist')
        const songTitle = clickedElement.getAttribute('data-song-title')

        prevAndNextContainer.innerHTML = ''
    
        fetchLyrics(artist, songTitle)
    }
})
