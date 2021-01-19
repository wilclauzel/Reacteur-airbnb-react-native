import React, { useState, useEffect } from "react";
import axios from "axios";
import Constants from "expo-constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import InputSecure from "../components/Share/InputSecure";
import {
  Alert,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Text,
  Image,
  TextInput,
  View,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function SignUpScreen({ navigation, setIdToken }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [warning, setWarning] = useState("");

  useEffect(() => {
    if (
      warning &&
      email &&
      username &&
      description &&
      password &&
      confirmPassword &&
      password === confirmPassword
    ) {
      setWarning("");
    }
  }, [warning, email, username, description, password, confirmPassword]);

  const handleSubmit = async () => {
    if (!email || !password || !description || !username || !confirmPassword) {
      setWarning("Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      setWarning("Passwords must be the same");
      return;
    }
    try {
      const response = await axios.post(
        "https://express-airbnb-api.herokuapp.com/user/sign_up",
        {
          email: email,
          password: password,
          username: username,
          description: description,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setIdToken(response.data.id, response.data.token);
    } catch (error) {
      console.log(error);
      console.log(error.response);
      if (error.response?.data?.error) {
        Alert.alert(error.response?.data?.error);
      } else {
        Alert.alert("Connection failed");
      }
    }
  };

  return (
    <SafeAreaView style={styles.window}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor={"transparent"}
      />
      <KeyboardAwareScrollView>
        <View>
          <View
            style={[styles.section, styles.sectionSmall, styles.sectionCenter]}
          >
            <Image
              source={require("../assets/airbnb_logo.png")}
              style={styles.logo}
              resizeMode="contain"
            ></Image>
            <Text style={[styles.grey, styles.title]}>Sign up</Text>
          </View>

          <View style={[styles.section, styles.sectionBig, styles.sectionLeft]}>
            <TextInput
              style={[styles.input, styles.inputOneLine, styles.inputUnderline]}
              placeholder="email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={(txt) => {
                setEmail(txt);
              }}
            />
            <TextInput
              style={[styles.input, styles.inputOneLine, styles.inputUnderline]}
              placeholder="username"
              autoCapitalize="none"
              value={username}
              onChangeText={(txt) => {
                setUsername(txt);
              }}
            />
            <TextInput
              style={[styles.input, styles.inputThreeLines, styles.inputBorder]}
              placeholder="Describe yourself in a few words ..."
              autoCapitalize="none"
              multiline={true}
              textAlignVertical="top"
              numberOfLines={5}
              value={description}
              onChangeText={(txt) => {
                setDescription(txt);
              }}
            />
            <InputSecure
              placeholder="password"
              value={password}
              setValue={setPassword}
              styles={[
                styles.input,
                styles.inputOneLine,
                styles.inputUnderline,
              ]}
            />
            <InputSecure
              placeholder="confirm password"
              value={confirmPassword}
              setValue={setConfirmPassword}
              styles={[
                styles.input,
                styles.inputOneLine,
                styles.inputUnderline,
              ]}
            />
          </View>

          <View
            style={[styles.section, styles.sectionSmall, styles.sectionCenter]}
          >
            {warning ? (
              <Text style={styles.warning}>{warning}</Text>
            ) : (
              <Text></Text>
            )}
            <View style={styles.button}>
              <TouchableOpacity onPress={handleSubmit}>
                <Text style={[styles.grey, styles.buttonTxt]}>Sign up</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate("SignIn");
              }}
            >
              <View style={styles.row}>
                <Text style={[styles.grey]}>Already have an account ?</Text>
                <Text style={[styles.grey, styles.buttonTxtMin]}>Sign in</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  window: {
    marginTop: Platform.OS === "android" ? Constants.statusBarHeight : 0,
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-around",
    alignItems: "center",
  },
  section: {
    width: windowWidth,
    paddingHorizontal: 20,
    marginVertical: 40,
  },
  sectionSmall: {
    flex: 0.9,
  },
  sectionBig: {
    flex: 1.2,
  },
  sectionCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  sectionLeft: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  grey: {
    color: "#7f7b7b",
  },
  logo: {
    height: 70,
    width: 70,
  },
  title: {
    marginTop: 20,
    fontSize: 26,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    width: windowWidth - 50,
    marginVertical: 10,
    fontSize: 16,
  },
  inputUnderline: {
    borderBottomColor: "red",
    borderBottomWidth: 1,
  },
  inputBorder: {
    borderColor: "red",
    borderWidth: 1,
  },
  inputOneLine: {
    height: 30,
  },
  inputThreeLines: {
    height: 90,
    paddingHorizontal: 10,
  },
  button: {
    width: windowWidth / 2,
    height: 60,
    marginBottom: 20,
    borderRadius: 25,
    borderColor: "red",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTxt: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonTxtMin: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  warning: {
    color: "red",
    marginBottom: 10,
  },
});
