function setupLoginForm() {
  const loginForm = document.getElementById("login-form");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const alertBox = document.getElementById("message");
  let timeout;

  async function handleSubmit(e) {
    e.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
      const response = await fetch("/spoof/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const { accessToken, message, success } = await response.json();

        alertBox.innerText = message;
        alertBox.parentElement.classList.add("visible");

        if (success) {
          // Store tokens securely (e.g., in local storage or HTTP-only cookies)
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("username", username);
        }

        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }

        timeout = setTimeout(() => {
          alertBox.parentElement.classList.remove("visible");
          if (success) {
            window.location.href = "/spoof/dashboard";
          }
        }, 2000);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  loginForm.addEventListener("submit", handleSubmit);
}

document.addEventListener("DOMContentLoaded", setupLoginForm);
