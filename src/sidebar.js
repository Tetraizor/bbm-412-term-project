const toggleSidebar = document.getElementById("toggleSidebar");
const sidebar = document.getElementById("sidebar");
const categoryTabs = document.querySelectorAll(".category-tab");
const categoryContents = document.querySelectorAll(".category-content");

// Toggle Sidebar Visibility
toggleSidebar.addEventListener("click", () => {
    sidebar.classList.toggle("visible");

    // Highlight the first category by default when sidebar is opened
    if (sidebar.classList.contains("visible") && categoryTabs.length > 0) {
        categoryTabs[0].classList.add("active");
        categoryContents.forEach(content => content.classList.add("hidden"));
        document.getElementById(categoryTabs[0].dataset.category).classList.remove("hidden");
    }
});

// Handle Category Switching
categoryTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        // Remove 'active' class from all tabs
        categoryTabs.forEach((tab) => tab.classList.remove("active"));

        // Add 'active' class to the clicked tab
        tab.classList.add("active");

        const selectedCategory = tab.dataset.category;

        // Hide all category contents
        categoryContents.forEach((content) => {
            content.classList.add("hidden");
        });

        // Show the selected category content
        document.getElementById(selectedCategory).classList.remove("hidden");
    });
});

document.getElementById('createEnergySphereButton').addEventListener('click',  () => {
    console.log("a");
});

