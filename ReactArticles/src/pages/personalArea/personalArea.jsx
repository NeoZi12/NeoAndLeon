import React, { useEffect, useState } from "react";
import classes from "./personalArea.module.css";

import { useAuth } from "../../context/AuthContext";
import UserView from "../../components/userCard/userCard";
import EventCard from "../../components/EventCard/EventCard";
import axios from "axios";

export default function PersonalArea() {
  const { user } = useAuth();
  const [userEvents, setUserEvents] = useState();

  useEffect(() => {
    const logged = localStorage.getItem("logged");
    if (logged === "true" && user) {
      axios
        .post("/personal-area", { user_id: user.user_id })
        .then((res) => {
          setUserEvents(res.data);
          console.log("✅ Events loaded:", res.data);
        })
        .catch((err) => {
          console.error("❌ Error loading events:", err);
        });
    }
  }, [user]);

  return (
    <div className={classes.container}>
      <header className={classes.header}>
        <h1>Personal Area</h1>
        <p>Welcome, {user?.first_name} 👋</p>
      </header>

      <section className={classes.userSection}>
        <UserView />
      </section>

      <section className={classes.eventsSection}>
        <h2>My Events </h2>
        {userEvents ? (
          <div className={classes.eventGrid}>
            {userEvents.map((el) => (
              <EventCard key={el.event_id} event={el} />
            ))}
          </div>
        ) : (
          <p className={classes.noEvents}>No events to Show</p>
        )}
      </section>
    </div>
  );
}
