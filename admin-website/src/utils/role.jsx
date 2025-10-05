// Utility to get roleID from localStorage userdetails
export function getRoleId() {
  let userDetails = {};
  try {
    userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};
  } catch (e) {
    userDetails = {};
  }
  return Number(userDetails.roleID);
}
