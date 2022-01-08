(function (){
    let btn = document.querySelector("#firstButton");
    let divcontainer = document.querySelector("#container");
    let mytemplate = document.querySelector("#mytemp");
    let divBreadCrumb = document.querySelector("#DivBreadCrumb");
    let aRootPath = document.querySelector(".path");
    let folders = [];
    let fid = -1;
    let cfid =-1;

    btn.addEventListener("click", addfolder);
    aRootPath.addEventListener("click", navigateBreadCrumb);

    function addfolder(){
        let fname = prompt("Folder's name?");
        if(!!fname){
            let exists = folders.some(f => f.name == fname);
            if(exists == false){
                fid++;
                folders.push({
                    id : fid,
                    name: fname,
                    pid : cfid
                });
                addfolderHTML(fname, fid, cfid);
                savetostorage();
            } else{
                alert(fname + " already exist");
            }
        } else{
            alert("Please enter a name.")
        }
    }

    function editFolder() {
        let divFolder = this.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        let ofname = divName.innerHTML;

        let nfname = prompt("Enter new name for " + ofname);
        if (!!nfname) {
            if (nfname != ofname) {
                let exists = folders.filter(f => f.pid == cfid).some(f => f.name == nfname);
                if (exists == false) {
                   // ram
                   let folder = folders.filter(f => f.pid == cfid).find(f => f.name == ofname);
                   folder.name = nfname;

                   // html
                   divName.innerHTML = nfname;

                   // storage
                   saveToStorage();
                } else {
                    alert(nfname + " already exists");
                }
            } else {
                alert("This is the old name only. Please enter something new.");
            }
        } else {
            alert("Please enter a name");
        }
    }

    function deleteFolder() {
        let divFolder = this.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        let fidtbd = divFolder.getAttribute("fid");

        let flag = confirm("Are you sure you want to delete " + divName.innerHTML + "?");
        if (flag == true) {
            let exists = folders.some(f => f.pid == fidtbd);
            if(exists == false){
                // ram
                let fidx = folders.findIndex(f => f.id == fidtbd);
                folders.splice(fidx, 1);

                // html
                divcontainer.removeChild(divFolder);

                // storage
                savetostorage();
            } else {
                alert("Can't delete. Has children.");
            }
        }
    }

    function navigateBreadCrumb(){
        let fname = this.innerHTML;
        cfid = parseInt(this.getAttribute("fid"));

        divcontainer.innerHTML = "";
        folders.filter(f => f.pid == cfid).forEach(f =>{
            addfolderHTML(f.name, f.id, f.pid);
        });

        while(this.nextSibling){
            this.parentNode.removeChild(this.nextSibling);
        }
    }

    function ViewFolder(){
        let DivFolder = this.parentNode;
        let DivName = DivFolder.querySelector("[purpose = 'name']");
        cfid = parseInt(DivFolder.getAttribute("fid"));

        let apathTemplate = mytemplate.content.querySelector(".path");
        let aPath = document.importNode(apathTemplate, true);

        aPath.innerHTML = DivName.innerHTML;
        aPath.setAttribute("fid", cfid);
        aPath.addEventListener("click", navigateBreadCrumb);
        divBreadCrumb.appendChild(aPath);

        divcontainer.innerHTML ="";
        folders.filter(f => f.pid == cfid).forEach(f => {
            addfolderHTML(f.name, f.id, f.pid);
        })
    }

    function addfolderHTML(fname, fid, pid){
        let divFolderTemplate = mytemplate.content.querySelector(".folder");
        let divFolder = document.importNode(divFolderTemplate, true);

        let divName = divFolder.querySelector("[purpose='name']");
        let spanEdit = divFolder.querySelector("[action= 'edit']");
        let spanDelete = divFolder.querySelector("[action= 'delete']");
        let spanView = divFolder.querySelector("[action= 'view']");
        

        divFolder.setAttribute("fid", fid);
        divFolder.setAttribute("pid", pid);
        divName.innerHTML = fname;
        spanEdit.addEventListener("click", editFolder);
        spanDelete.addEventListener("click", deleteFolder);
        spanView.addEventListener("click", ViewFolder);

        divcontainer.appendChild(divFolder);

    }

    function savetostorage(){
        let fjson = JSON.stringify(folders);
        localStorage.setItem("data", fjson);
    }

    function loadfromstroage(){
        let fjson = localStorage.getItem("data");
        if(!!fjson){
            folders = JSON.parse(fjson);
            folders.forEach(f =>{
                if(f.id > fid){
                    fid = f.id;
                }

                if(f.pid === cfid){
                    addfolderHTML(f.name, f.id, f.pid);
                }
            });
        }
    }

    loadfromstroage();

})();