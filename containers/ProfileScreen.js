import React, { useState, useEffect } from "react";
import axios from "axios";
import Constants from "expo-constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  Alert,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  TextInput,
  View,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";

const windowWidth = Dimensions.get("window").width;

const handleLoadData = async (
  userId,
  userToken,
  setIsLoading,
  setEmail,
  setUsername,
  setDescription,
  setImageUri
) => {
  try {
    if (userId) {
      const response = await axios.get(
        `https://express-airbnb-api.herokuapp.com/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setEmail(response.data.email);
      setUsername(response.data.username);
      setDescription(response.data.description);
      if (response.data.photo && response.data.photo.length > 0) {
        setImageUri(response.data.photo[0].url);
      }
    }
    setIsLoading(false);
  } catch (error) {
    console.log(error.response);
    if (error.response?.data?.error) {
      Alert.alert(error.response?.data?.error);
    }
  }
};

const handlePickPhoto = async (setImageUri, setUpdatedImage) => {
  //Authorization for image gallery access
  const cameraRollPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();

  // only if user allows permission to camera roll
  if (cameraRollPerm && cameraRollPerm.status === "granted") {
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!pickerResult.cancelled) {
      //Save selected image
      setImageUri(pickerResult.uri);
      setUpdatedImage(true);
    }
  }
};

const handleTakePhoto = async (setImageUri, setUpdatedImage) => {
  //Authorization for camera access AND image gallery access
  const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
  // const cameraRollPerm = await ImagePicker.requestCameraRollPermissionsAsync();

  // only if user allows permission to camera AND image gallery access
  if (
    cameraPerm &&
    cameraPerm.status === "granted"
    // &&
    // cameraRollPerm &&
    // cameraRollPerm.status === "granted"
  ) {
    const pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!pickerResult.cancelled) {
      //Save selected image
      setImageUri(pickerResult.uri);
      setUpdatedImage(true);
    }
  }
};

const handleUpdateImage = async (
  username,
  userToken,
  imageUri,
  setImageUri,
  setUpdatedImage
) => {
  try {
    if (imageUri && imageUri.includes(".")) {
      const extension = imageUri.split(".")[1];
      const name = `${username.replace(" ", "_")}.${extension}`;
      const formData = new FormData();
      formData.append("photo", {
        uri: imageUri,
        name: name,
        type: `image/${extension}`,
      });

      const response = await axios.put(
        "https://express-airbnb-api.herokuapp.com/user/upload_picture",
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (response.data.photo && response.data.photo.length > 0) {
        setImageUri(response.data.photo[0].url);
      }
    }
    setUpdatedImage(false);
  } catch (error) {
    console.log(error.response);
    if (error.response?.data?.error) {
      Alert.alert(error.response?.data?.error);
    }
  }
};

const handleUpdateInfo = async (
  userToken,
  email,
  username,
  description,
  setUpdatedInfo,
  updatedEmail,
  setUpdatedEmail,
  updatedName,
  setUpdatedName
) => {
  try {
    const data = { description };
    if (updatedEmail) {
      data["email"] = email;
    }
    if (updatedName) {
      data["username"] = username;
    }
    const response = await axios.put(
      "https://express-airbnb-api.herokuapp.com/user/update",
      data,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    setUpdatedName(false);
    setUpdatedEmail(false);
    setUpdatedInfo(false);
  } catch (error) {
    console.log(error.response);
    if (error.response?.data?.error) {
      Alert.alert(error.response?.data?.error);
    }
  }
};

export default function ProfileScreen({ userId, userToken, setIdToken }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatedImage, setUpdatedImage] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState(false);
  const [updatedEmail, setUpdatedEmail] = useState(false);
  const [updatedName, setUpdatedName] = useState(false);
  const [warning, setWarning] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    handleLoadData(
      userId,
      userToken,
      setIsLoading,
      setEmail,
      setUsername,
      setDescription,
      setImageUri
    );
  }, [userId, userToken]);

  useEffect(() => {
    if (warning && email && username && description) {
      setWarning("");
    }
  }, [warning, email, username, description]);

  const handleSubmit = async () => {
    if (!updatedImage && !updatedInfo && !updatedEmail && !updatedName) {
      Alert.alert("Aucune modification à mettre à jour !");
      return;
    }
    if (!email || !description || !username) {
      setWarning("Please fill all fields");
      return;
    }
    setUpdating(true);
    if (updatedImage) {
      await handleUpdateImage(
        username,
        userToken,
        imageUri,
        setImageUri,
        setUpdatedImage
      );
    }
    if (updatedInfo || updatedEmail || updatedName) {
      await handleUpdateInfo(
        userToken,
        email,
        username,
        description,
        setUpdatedInfo,
        updatedEmail,
        setUpdatedEmail,
        updatedName,
        setUpdatedName
      );
    }
    setUpdating(false);
  };

  return (
    <SafeAreaView style={styles.window}>
      {isLoading ? (
        <ActivityIndicator size="large" color="red" />
      ) : (
        <KeyboardAwareScrollView>
          <View
            style={[styles.section, styles.sectionSmall, styles.sectionCenter]}
          >
            <View style={styles.row}>
              <View style={styles.imageView}>
                {imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ) : (
                  <FontAwesome5 name="user" size={50} color="grey" />
                )}
              </View>

              <View style={styles.imageButtons}>
                <TouchableOpacity
                  onPress={() => {
                    handlePickPhoto(setImageUri, setUpdatedImage);
                  }}
                >
                  <MaterialIcons name="photo-library" size={30} color="grey" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleTakePhoto(setImageUri, setUpdatedImage);
                  }}
                >
                  <MaterialIcons name="photo-camera" size={30} color="grey" />
                </TouchableOpacity>
              </View>
            </View>
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
                setUpdatedEmail(true);
              }}
            />
            <TextInput
              style={[styles.input, styles.inputOneLine, styles.inputUnderline]}
              placeholder="username"
              autoCapitalize="none"
              value={username}
              onChangeText={(txt) => {
                setUsername(txt);
                setUpdatedName(true);
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
                setUpdatedInfo(true);
              }}
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
              {updating ? (
                <ActivityIndicator size="large" color="red" />
              ) : (
                <TouchableOpacity onPress={handleSubmit}>
                  <Text style={[styles.grey, styles.buttonTxt]}>Update</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.button}>
              <TouchableOpacity
                onPress={() => {
                  setIdToken(null, null);
                }}
              >
                <Text style={[styles.grey, styles.buttonTxt]}>Log out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      )}
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
  imageView: {
    height: 120,
    width: 120,
    borderColor: "red",
    borderWidth: 1,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 50,
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
  grey: {
    color: "#7f7b7b",
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
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageButtons: {
    justifyContent: "space-between",
    height: 100,
  },
  warning: {
    color: "red",
    marginBottom: 10,
  },
});
