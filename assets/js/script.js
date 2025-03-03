
// carousel js code
let i = 0;
let image = document.getElementById("image");
let data = [
            {
                image: "https://assets.gadgetandgear.com/upload/media/meko-web947.png"

            },{
                image: "https://assets.gadgetandgear.com/upload/media/logitech__1920x570_1659.png"
            },{
                image: "https://assets.gadgetandgear.com/upload/media/iphone-16-pro_1920x570_6755.png"
            },{
                image: "https://assets.gadgetandgear.com/upload/media/uag_home-banner_1920x570_6724.png"
            }
            ];
            setInterval(function(){
                let item = data[i++];
                image.src = item.image;
                if(data.length === i){
                    i = 0;
                }
            },1500)