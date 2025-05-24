import React from "react";
import classes from "./userCard.module.css";
import { useAuth } from "../../context/AuthContext";

export default function UserView() {
  const { user } = useAuth();

  if (!user) {
    return <div className={classes.message}>Not logged in</div>;
  }

  return (
    <div className={classes.container}>
      <main className={classes.main}>
        <h2 className={classes.title}>User Details</h2>
        <div className={classes.card}>
          <p>
            <span>First Name:</span> {user.first_name}
          </p>
          <p>
            <span>Last Name:</span> {user.last_name}
          </p>
          <p>
            <span>Username:</span> {user.user_name}
          </p>
          <p>
            <span>Email:</span> {user.email}
          </p>
          <p>
            <span>City:</span> {user.city}
          </p>
          <p>
            <span>Gender:</span> {user.gender === "male" ? "Male" : "Female"}
          </p>
        </div>
      </main>
    </div>
  );
}
