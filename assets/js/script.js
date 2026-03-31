let projects = JSON.parse(localStorage.getItem("projects")) || [];
let editIndex = null;

const form = document.getElementById("projectForm");
const projectList = document.getElementById("projectList");
const submitBtn = document.getElementById("submitBtn");

if (!form || !projectList) {
    console.log("Form or projectList not found");
} else {
    function saveToLocalStorage() {
        localStorage.setItem("projects", JSON.stringify(projects));
    }

    function renderProjects() {
        projectList.innerHTML = "";

        projects.forEach((proj, index) => {
            const card = document.createElement("div");
            card.classList.add("project-card");

            card.innerHTML = `
                <img src="${proj.image || 'assets/images/default.jpg'}" class="project-img"/>
                <div class="project-content">
                    <h3>${proj.name}</h3>
                    <p><strong>Duration:</strong> ${proj.start} - ${proj.end}</p>
                    <p>${proj.desc}</p>
                    <p><small>Tech: ${proj.tech.join(", ")}</small></p>
                    <div class="actions">
                        <button onclick="editProject(${index})" class="edit-btn">Edit</button>
                        <button onclick="deleteProject(${index})" class="delete-btn">Delete</button>
                    </div>
                </div>
            `;
            projectList.appendChild(card);
        });
    }

    window.deleteProject = function(index) {
        if(confirm("Are you sure you want to delete this project?")) {
            projects.splice(index, 1);
            saveToLocalStorage();
            renderProjects();
        }
    }

    window.editProject = function(index) {  
        const proj = projects[index];

        document.getElementById("projectName").value = proj.name;
        document.getElementById("startDate").value = proj.start;
        document.getElementById("endDate").value = proj.end;
        document.getElementById("description").value = proj.desc;

        document.querySelectorAll(".checkbox-group input").forEach(cb => {
            cb.checked = proj.tech.includes(cb.value);
        });

        editIndex = index;
        submitBtn.innerText = "Update Project";
        window.scrollTo(0, form.offsetTop - 100);
    }

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const name = document.getElementById("projectName").value;
        const start = document.getElementById("startDate").value;
        const end = document.getElementById("endDate").value;
        const desc = document.getElementById("description").value;
        const imageInput = document.getElementById("image");

        const tech = [];
        document.querySelectorAll(".checkbox-group input:checked").forEach(cb => {
            tech.push(cb.value);
        });

        const processData = (imageUri) => {
            const newProject = { name, start, end, desc, tech, image: imageUri };

            if (editIndex !== null) {
                projects[editIndex] = newProject;
                editIndex = null;
                submitBtn.innerText = "Submit";
            } else {
                projects.push(newProject);
            }

            saveToLocalStorage();
            renderProjects();
            form.reset();
        };

        if (imageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = () => processData(reader.result);
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            // Keep old image if editing and no new file selected
            const oldImage = (editIndex !== null) ? projects[editIndex].image : "";
            processData(oldImage);
        }
    });

    renderProjects();
}