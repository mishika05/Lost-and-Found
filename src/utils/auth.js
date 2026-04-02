export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export const loginUser = (email, password) => {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    return true;
  }
  return false;
};

export const signupUser = (email, password) => {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  const exists = users.find((u) => u.email === email);
  if (exists) return false;

  users.push({ email, password });
  localStorage.setItem("users", JSON.stringify(users));
  return true;
};

export const logoutUser = () => {
  localStorage.removeItem("user");
};