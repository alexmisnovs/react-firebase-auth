import { useRef, useContext, useState } from "react";
import AuthContext from "../../store/auth-context";
import classes from "./ProfileForm.module.css";

const ProfileForm = () => {
  const newPasswordInputRef = useRef();
  const authCtx = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [emailChanged, setEmailChanged] = useState(false);
  const submitHandler = event => {
    setIsLoading(true);
    event.preventDefault();

    const enteredNewPassword = newPasswordInputRef.current.value;

    // add validation
    let changePasswordUrlFirebase = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${process.env.REACT_APP_FIREBASE_AUTH_API_KEY}`;

    fetch(changePasswordUrlFirebase, {
      method: "POST",
      body: JSON.stringify({
        idToken: authCtx.token,
        password: enteredNewPassword,
        returnSecureToken: false,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(res => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then(data => {
            //TODO: show an error to the user
            let errorMessage = "Changing password failed";
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            // could set Error message in the state
            throw new Error(errorMessage);
          });
        }
      })
      .then(data => {
        setEmailChanged(true);
        console.log(data);
        setTimeout(() => {
          authCtx.logout();
        }, 4000);
      })
      .catch(err => {
        alert(err.message);
      });
  };
  return (
    <form onSubmit={submitHandler} className={classes.form}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input minLength="7" ref={newPasswordInputRef} type="password" id="new-password" />
      </div>
      <div className={classes.action}>
        {isLoading && <p>Loading..</p>}
        {emailChanged && (
          <p>Thanks, your password was changed! You will now be redirected to Login page.</p>
        )}
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
