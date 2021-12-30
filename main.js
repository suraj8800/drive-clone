(function(){
    let btn = document.querySelector("#firstButton");
    let divcontainer = document.querySelector("#container");
    let mytemplate = document.querySelector("#mytemp");
    let fid = 0
    let folders = [];

    btn.addEventListener("click", addFolder );
    
    function addFolder(){
        let fname = prompt("folder name?");
        if(!fname){
            return;
        }
        
        fid++;
        addFolderInpage(fname, fid);

        folders.push({
            id : fid,
            name : fname
        });
        presistFoldersToStorage();
    }

    function editFolder(){
        let divfolder = this.parentNode;
        let divname  = divfolder.querySelector("[purpose='name']");

        let fname = prompt("Enter the new folder name");
        if(!fname){
            return
        }
        divname.innerHTML = fname;

        let fid = parseInt(divfolder.getAttribute("fid"));
        let folder = folders.find(f => f.id == fid);
        folder.name = fname;
        presistFoldersToStorage();
    }

    function deleteFolder(){
        let divfolder = this.parentNode;
        let divname = divfolder.querySelector("[purpose='name']");

        let flag = confirm("Do you want to delete the folder "+ divname.innerHTML);
        if(flag == true){
            divcontainer.removeChild(divfolder);
            
            let fid = parseInt(divfolder.getAttribute("fid"));
            let idx = folders.findIndex(f => f.id == fid);
            folders.splice(idx, 1);
            presistFoldersToStorage();
        }
    }
    
    function addFolderInpage(fname, fid){
        let divfoldertemplate = mytemplate.content.querySelector(".folder");
        let divfolder = document.importNode(divfoldertemplate, true);
        let divname = divfolder.querySelector("[purpose='name']");
        divname.innerHTML = fname;
        divfolder.setAttribute("fid", ++fid);

        let spanDelete = divfolder.querySelector("span[action=delete]")
        spanDelete.addEventListener("click", deleteFolder);

        let spanEdit = divfolder.querySelector("span[action=edit]");
        spanEdit.addEventListener("click", editFolder);
        divcontainer.appendChild(divfolder);
    }

    function presistFoldersToStorage(){
        console.log(folders);
        let fjson = JSON.stringify(folders);
        localStorage.setItem("data", fjson);
    }

    function LoadFolderFromStorage(){
        let fjson = localStorage.getItem("data");
        if(!!fjson){
            folders = JSON.parse(fjson);
            folders.forEach(function(f){
                addFolderInpage(f.name, f.id);
            });
        }
    }

    LoadFolderFromStorage();
    
})();