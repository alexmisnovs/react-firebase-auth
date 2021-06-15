import { useContext } from "react";
import AuthContext from "../../store/auth-context";
import classes from "./DashboardPageContent.module.css";

const DashboardPageContent = () => {
  const authCtx = useContext(AuthContext);
  return (
    <section className={classes.starting}>
      <h3>Welcome "{authCtx.userEmail}" to your Dashboard!</h3>
    </section>
  );
};

export default DashboardPageContent;
