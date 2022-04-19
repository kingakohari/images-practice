const parseJSON = async (url) => {
    const response = await fetch (url)
    return response.json()
}

const swiperComponent = (data, component) => {
    return `    
    <div class="swiper">
        <div class="swiper-wrapper"> 
            ${data.map(image => component(image)).join("")}
        </div>
    </div>
    `
}

const swiperSlideComponent = ({filename, title, link, photographer}) => {
    return `
    <div class="swiper-slide">
        <h2>${title}</h2>
        <h3>Photographer: ${photographer}</h3>
        <p>Source:<br> ${link}</p>
        <img src="${link}">
    </div>
    `
}

const  loadEvent = async () => {

    const rootElement = document.getElementById("root")
    const result = await parseJSON("/image-list")
    
    rootElement.insertAdjacentHTML("beforeend", swiperComponent(result, swiperSlideComponent))

    const swiper = new Swiper(".swiper", {
        loop: true
    })

    console.log(swiper);

}

window.addEventListener("load", loadEvent)