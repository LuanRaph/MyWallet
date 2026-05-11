function dark_mode() {
    let tema = document.querySelector("html").getAttribute("data-bs-theme");
    let icon = document.getElementById("icon_mode");
    if (tema === "light") {
        document.querySelector("html").setAttribute("data-bs-theme", "dark");
        icon.classList.remove("bi-moon-stars-fill");
        icon.classList.add("bi-brightness-high-fill");
    } else {
        document.querySelector("html").setAttribute("data-bs-theme", "light");
        icon.classList.remove("bi-brightness-high-fill");
        icon.classList.add("bi-moon-stars-fill");
    }
}