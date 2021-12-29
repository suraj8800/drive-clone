(function(){
    let btn = document.querySelector("#firstButton");
    let divcontainer = document.querySelector("#container");
    let mytemplate = document.querySelector("#mytemp");

    btn.addEventListener("click", function(){
        let fname = prompt("folder name?");
        if(!fname){
            return;
        }

        let divfoldertemplate = mytemplate.content.querySelector(".folder");
        let divfolder = document.importNode(divfoldertemplate, true);
        let divname = divfolder.querySelector("[purpose='name']");


        divname.innerHTML = fname;
        divcontainer.appendChild(divfolder);
    })
    
})();