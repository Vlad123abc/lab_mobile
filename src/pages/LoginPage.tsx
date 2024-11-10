import React, { useContext, useState } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonAlert,
} from "@ionic/react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../App";

const LoginPage: React.FC = () => {
  const { setToken } = useContext(AuthContext);
  const { setUname } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const history = useHistory();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/login", {
        name: username,
        pass: password,
      });
      if (response.status === 200) {
        const token = response.data.token;
        console.log(token);
        localStorage.setItem("token", token);
        setToken(token);
        console.log("setting user name:" + username);
        setUname(username);
        setUsername(username);
        history.push("/cars");
      }
    } catch (error) {
      setAlertMessage("Login failed. Please check your credentials.");
      setShowAlert(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Username</IonLabel>
          <IonInput
            value={username}
            onIonChange={(e) => setUsername(e.detail.value!)}
            placeholder="Enter your username"
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Password</IonLabel>
          <IonInput
            type="password"
            value={password}
            onIonChange={(e) => setPassword(e.detail.value!)}
            placeholder="Enter your password"
          />
        </IonItem>
        <IonButton
          expand="block"
          onClick={handleLogin}
          className="ion-margin-top"
        >
          Login
        </IonButton>
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Login Error"
          message={alertMessage}
          buttons={["OK"]}
        />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
