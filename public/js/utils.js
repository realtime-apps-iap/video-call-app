function showSnackbar() {
    var sb = document.getElementById("snackbar");
    sb.className = "show";
    setTimeout(function() {
        sb.className = sb.className.replace("show", "");
    }, 3000);
}

function copyLink() {
    const el = document.createElement("textarea");
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    el.setSelectionRange(0, 99999);
    document.execCommand("copy");
    document.body.removeChild(el);
    console.log("Copied room link: " + el.value);
    showSnackbar();
}