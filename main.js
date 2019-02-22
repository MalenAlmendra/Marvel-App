// Variables
const cuerpo=document.querySelector('body')
const container= document.getElementById('items')
const search=document.getElementById('search')
const todo=document.getElementById('All')
const comics=document.getElementById('comics')
const series=document.getElementById('series')
const characters=document.getElementById('characters')
const publickey="e037ab4222c43e57da1ad8f7bed9d013"
const hash= "0182fae7f6ba6321c0b1569cd4659e1f"
const arrayCharacters=[]
//Fragmentos
const fCharacters=document.createDocumentFragment()


//Librería AJAX
const ajax = request =>{
    return new Promise((resolve,reject)=>{
        const xhr= new XMLHttpRequest()
        xhr.open(request.method,request.url,true)
        xhr.addEventListener('load',e=>{
            resolve(e.target)
        })
        xhr.send()
    })
}
//Función para llenar el Select con todos los personajes de la petición
const searchCharacters=async ()=>{
    const url=`https://gateway.marvel.com:443/v1/public/characters?apikey=${publickey}&hash=${hash}`
    const peticion={method:'GET',url}
    const respuesta=await ajax(peticion)

    if(respuesta.status==200){
        const personajes=JSON.parse(respuesta.responseText).data.results
        for (const personaje of personajes) {
            arrayCharacters.push(personaje.name)
        }
    }
}

const chargeCharacters= async()=>{
    
    if (arrayCharacters.length==0) await searchCharacters();
    for (const personaje of arrayCharacters) {
        const opcion=document.createElement('option')
        opcion.value=personaje
        opcion.text=personaje
        characters.appendChild(opcion)
    }
}

//Llamada a API Marvel y Guardado de objetos
const showMarvel= async ()=>{
    
    const url=`https://gateway.marvel.com:443/v1/public/characters?&limit=20&ts=1&apikey=${publickey}&hash=${hash}&limit=20`
    const req={
        method:'GET',
        url:url 
    }
    const response= await ajax(req)
    //Valido el estado de la petición
    switch(response.status){
        case 200:
            draw(JSON.parse(response.responseText).data.results)
            break
        case 404:
            console.log('No funca vieja!')
            break
        case 405: 
            console.log('No tenes permiso al endpoint')
            break
        case 409: 
            console.log('UUUhh se rompió mal!')
            break
        default: 
            console.log('No se que pasó, pero seguro que no anda! :/')
            break
    }
}


const draw= data=>{
    const fContainer=document.createDocumentFragment()
    data.forEach(comic => {
        const item= document.createElement('div')
        item.className='item'
        const title= document.createElement('h2')
        const image= document.createElement('img')

        title.textContent=comic.name
        image.src=`${comic.thumbnail.path}/portrait_incredible.${comic.thumbnail.extension}`
        image.className='comicImage';
        item.appendChild(title)
        item.appendChild(image)

        fContainer.appendChild(item)
    });

    container.appendChild(fContainer)
}

todo.addEventListener('click',()=>{showMarvel()})
