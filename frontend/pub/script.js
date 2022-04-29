const parseJSON = async (url) => {
    const response = await fetch (url)
    return response.json()
}

const swiperComponent = (data, component) => {
    return `    
    <div class="swiper">
        <div class="swiper-wrapper"> 
            ${data.map(photoInfo => component(photoInfo)).join("")}
        </div> 
    </div>
    `
    
}

const swiperSlideComponent = ({title, link, photographer}) => {
    return `
    <div class="swiper-slide">
        <h2 class="title">${title}</h2>
        <h3>Photographer: ${photographer}</h3>
        <p>Source:<br> ${link}</p>
        <img src="${link}">      
        <button class="deleteBtn">Delete this entry</button>
    </div>
    `
}

const formComponent = `
    <div class="addNew">
        <h1>Add new image</h1>
        <form id="form">
            <input type="text" id="title" name="title" placeholder="Title" required>
            <input type="text" id="link" name="link" placeholder="URL" required>
            <input type="text" id="photographer" name="photographer" placeholder="Photographer's name" required>
            <input type="file" id="picture" name="picture" required>
            <button id="addBtn">Submit image</button>
        </form>
    </div>
`;

const  loadEvent = async () => {

    const rootElement = document.getElementById("root")
    const result = await parseJSON("/image-list")
    
    rootElement.insertAdjacentHTML("afterbegin", formComponent)

    rootElement.insertAdjacentHTML("beforeend", swiperComponent(result, swiperSlideComponent))
  

    const swiper = new Swiper(".swiper", {
        loop: true
    })

    const sendForm = document.getElementById("form");

    sendForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const today = new Date();
        const todayDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

        const formData = new FormData();

        formData.append("link", document.getElementById("link").value);
        formData.append("title", document.getElementById("title").value);
        formData.append("upload_date", todayDate); 
        formData.append("photographer", document.getElementById("photographer").value);
        formData.append("picture", document.getElementById("picture").files[0]);
        formData.append("id");
         
        const fetchSettings = {
            method: "POST",
            body: formData
        }

        fetch("/", fetchSettings)
            .then(async data => {
                if (data.status === 200){
                    const res = await data.json()
                    console.log(res);

                    const title = res.title
                    const link = res.link
                    const photographer = res.photographer
                        

                    /* rootElement.insertAdjacentHTML("beforeend", swiperComponent(result, swiperSlideComponent(res))) */
                    swiper.appendSlide((result, swiperSlideComponent({title, link, photographer}))) 
                    swiper.update(); 
                    console.dir(data)
                    /* res.send({response: "Image gallery has been updated!"}) */
                    
                }
            })
            .catch(error => {
                e.target.outerHTML= `Error`
                console.dir(error);
            })
    })

    const removeButtons = document.getElementsByClassName("deleteBtn"); 
    
    Array.from(removeButtons).forEach((removeButton) => {
        removeButton.addEventListener('click', () => {
          removeButton.parentNode.remove();
          let id = removeButton.parentNode.getAttribute("data-swiper-slide-index")
          let title = {title: removeButton.parentNode.getElementsByClassName("title")[0].innerHTML}
          console.log(title);
          fetch('/delete/' + id , {
            method: 'DELETE',
            header: {'Content-Type': 'application/json'},
            body: JSON.stringify(title)
          })
          .then(res => res.text()) // or res.json()
          .then(res => console.log(res))
        });

      });

/*      swiper.removeSlide(swiper.realIndex)
        console.log(swiper.realIndex);
        swiper.update() */
      
        
       

       
  
}

window.addEventListener("load", loadEvent)