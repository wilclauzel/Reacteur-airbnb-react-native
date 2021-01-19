import React, { useState, useEffect } from "react";
import axios from "axios";
import Constants from "expo-constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
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
import InputSecure from "../components/Share/InputSecure";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function SignInScreen({ navigation, setIdToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [warning, setWarning] = useState("");

  useEffect(() => {
    if (warning && email && password) {
      setWarning("");
    }
  }, [warning, email, password]);

  const handleSubmit = async () => {
    if (!email || !password) {
      setWarning("Please fill all fields");
      return;
    }
    try {
      const response = await axios.post(
        "https://express-airbnb-api.herokuapp.com/user/log_in",
        { email: email, password: password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setIdToken(response.data.id, response.data.token);
    } catch (error) {
      console.log(error);
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
        <View style={styles.container}>
          <View style={[styles.section, styles.sectionCenter]}>
            <Image
              source={require("../assets/airbnb_logo.png")}
              style={styles.logo}
              resizeMode="contain"
            ></Image>
            <Text style={[styles.grey, styles.title]}>Sign in</Text>
          </View>

          <View style={[styles.section, styles.sectionLeft]}>
            <TextInput
              style={styles.input}
              placeholder="email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={(txt) => {
                setEmail(txt);
              }}
            />
            <InputSecure
              placeholder="password"
              value={password}
              setValue={setPassword}
              styles={[styles.input]}
            />
          </View>

          <View style={[styles.section, styles.sectionCenter]}>
            {warning ? (
              <Text style={styles.warning}>{warning}</Text>
            ) : (
              <Text></Text>
            )}
            <View style={styles.button}>
              <TouchableOpacity onPressOut={handleSubmit}>
                <Text style={[styles.buttonTxt, styles.grey]}>Sign in</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate("SignUp");
              }}
            >
              <View style={styles.row}>
                <Text style={[styles.grey]}>No account ?</Text>
                <Text style={[styles.grey, styles.buttonTxtMin]}>Register</Text>
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
    justifyContent: "space-around",
    alignItems: "center",
  },
  container: {
    justifyContent: "space-around",
    alignItems: "center",
  },
  section: {
    width: windowWidth,
    height: windowHeight / 5,
    paddingHorizontal: 20,
    marginVertical: 40,
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
    height: 110,
    width: 110,
  },
  title: {
    marginTop: 30,
    fontSize: 26,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    width: windowWidth - 50,
    height: 30,
    marginVertical: 10,
    fontSize: 16,
    borderBottomColor: "red",
    borderBottomWidth: 1,
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
