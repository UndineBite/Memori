$(document).ready(function () {
  loadUserProfile();
});

function loadUserProfile() {
  let username = localStorage.getItem("username") || "Guest User";
  let email = localStorage.getItem("userEmail") || "guest@example.com";
  $("#username").text(username);
  $("#user-email").text("Email: " + email);
}

function editProfile() {
  let newUsername = prompt("Enter new username:");
  if (newUsername) {
      localStorage.setItem("username", newUsername);
      $("#username").text(newUsername);
  }
}

function createGroup() {
  let newGroup = prompt("Enter new group name:");
  if (newGroup) {
      let groupList = $("#user-groups");
      let newListItem = $("<li>").text("📖 " + newGroup);
      groupList.append(newListItem);
  }
}
