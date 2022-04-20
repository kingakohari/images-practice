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
        <button id="deleteBtn">Delete this entry</button>
    </div>
    `
}

const formComponent = `
    <div class="addNew">
        <h1>Add new image</h1>
        <form id="form">
            <input type="text" name="title" placeholder="Title" required>
            <input type="text" name="link" placeholder="URL (if not on hard drive)">
            <input type="text" name="photographer" placeholder="Photographer's name" required>
            <input type="file" name="picture">
            <button id="addBtn">Submit image</button>
        </form>
    </div>
`;

const  loadEvent = async () => {

    const rootElement = document.getElementById("root")
    const result = await parseJSON("/image-list")
    
    rootElement.insertAdjacentHTML("afterbegin",formComponent)

    rootElement.insertAdjacentHTML("beforeend", swiperComponent(result, swiperSlideComponent))

    const swiper = new Swiper(".swiper", {
        loop: true
    })

    console.log(swiper);

}

window.addEventListener("load", loadEvent)