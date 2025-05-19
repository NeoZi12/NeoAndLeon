import { useEffect, useState } from "react";
import classes from "./Register.module.css";
import axios from "axios";

export default function Register() {
  const [successMessage, setSuccessMessage] = useState("");
  const [cities, setCities] = useState([]);

  useEffect(() => {
    axios
      .get("/login/cities")
      .then((res) => {
        const validCities = res.data.filter(
          (el) => el.name_heb && el.name_heb.trim().length > 0
        );
        setCities(validCities);
      })
      .catch((err) => {
        console.error("Error fetching cities:", err);
      });
  }, []);

  const fetchData = () => {
    return axios
      .post("/login/register", info)
      .then((res) => {
        const name = info.first_name;
        setSuccessMessage(`${name} has been registered successfully!`);
        return true;
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.status === 400 &&
          error.response.data.error === "Email already exists."
        ) {
          setErrors((prev) => ({ ...prev, email: "Email already exists." }));
        } else {
          console.error("Unexpected error:", error);
        }
        return false;
      });
  };

  const [info, setInfo] = useState({
    first_name: "",
    last_name: "",
    user_name: "",
    password: "",
    gender: "",
    city: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!info.first_name.trim())
      newErrors.first_name = "First name is required.";
    if (!info.last_name.trim()) newErrors.last_name = "Last name is required.";
    if (!info.user_name.trim()) newErrors.user_name = "Username is required.";
    if (!info.password) newErrors.password = "Password is required.";
    else if (info.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    if (!info.gender) newErrors.gender = "Gender is required.";
    if (!info.city) newErrors.city = "City is required.";
    if (!info.email) newErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(info.email))
      newErrors.email = "Invalid email format.";

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      fetchData().then(() => {
        setInfo({
          first_name: "",
          last_name: "",
          user_name: "",
          password: "",
          gender: "",
          city: "",
          email: "",
        });
      });
      setTimeout(() => setSuccessMessage(""), 5000);
    }
  };

  return (
    <div className={classes.loginContainer}>
      <h2>Register</h2>
      {successMessage && (
        <div className={classes.success}>{successMessage}</div>
      )}
      <form onSubmit={handleSubmit} className={classes.loginForm}>
        <div>
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={info.first_name}
            onChange={handleChange}
            className={classes.input}
          />
          {errors.first_name && (
            <p className={classes.error}>{errors.first_name}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={info.last_name}
            onChange={handleChange}
            className={classes.input}
          />
          {errors.last_name && (
            <p className={classes.error}>{errors.last_name}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            name="user_name"
            placeholder="Username"
            value={info.user_name}
            onChange={handleChange}
            className={classes.input}
          />
          {errors.user_name && (
            <p className={classes.error}>{errors.user_name}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={info.password}
            onChange={handleChange}
            className={classes.input}
          />
          {errors.password && (
            <p className={classes.error}>{errors.password}</p>
          )}
        </div>

        <div>
          <select
            name="gender"
            value={info.gender}
            onChange={handleChange}
            className={classes.input}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && <p className={classes.error}>{errors.gender}</p>}
        </div>

        <div>
          <select
            name="city"
            value={info.city}
            onChange={handleChange}
            className={classes.input}
          >
            <option value="">Select City</option>
            {cities.map((el, idx) => {
              const name = el.name_heb.trim();
              const formattedName =
                name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
              return (
                <option key={idx} value={formattedName}>
                  {formattedName}
                </option>
              );
            })}
          </select>
          {errors.city && <p className={classes.error}>{errors.city}</p>}
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={info.email}
            onChange={handleChange}
            className={classes.input}
          />
          {errors.email && <p className={classes.error}>{errors.email}</p>}
        </div>

        <button type="submit" className={classes.button}>
          Register
        </button>
      </form>
    </div>
  );
}
