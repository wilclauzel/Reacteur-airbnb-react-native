import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

/* Containers */
import HomeScreen from "./containers/HomeScreen";
import RoomScreen from "./containers/RoomScreen";
import ProfileScreen from "./containers/ProfileScreen";
import SignInScreen from "./containers/SignInScreen";
import SignUpScreen from "./containers/SignUpScreen";
import SettingsScreen from "./containers/SettingsScreen";
import AroundMeScreen from "./containers/AroundMeScreen";

/* Components */
import HeaderBar from "./components/Share/HeaderBar";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const updateAsyncStorage = async (userId, token) => {
  try {
    if (token) {
      AsyncStorage.setItem("userId", userId);
      AsyncStorage.setItem("userToken", token);
    } else {
      AsyncStorage.removeItem("userId");
      AsyncStorage.removeItem("userToken");
    }
    return true;
  } catch (error) {
    console.log(error);
    Alert.alert("Unaccess to local storage");
    return false;
  }
};

export default function App() {
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setIdToken = async (userId, token) => {
    const res = await updateAsyncStorage(userId, token);
    if (res) {
      setUserId(userId);
      setUserToken(token);
      setIsAuthenticated(token ? true : false);
    }
  };

  useEffect(() => {
    // Fetch the token from storage then navigate to first screen
    const bootstrapAsync = async () => {
      const userToken = await AsyncStorage.getItem("userToken");
      const userId = await AsyncStorage.getItem("userId");
      setUserId(userId);
      setUserToken(userToken);
      setIsAuthenticated(userToken ? true : false);
    };

    bootstrapAsync();
  }, []);

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        // No token found, user isn't signed in
        <Stack.Navigator>
          <Stack.Screen
            name="SignIn"
            options={{ header: () => null, animationEnabled: false }}
          >
            {(props) => <SignInScreen {...props} setIdToken={setIdToken} />}
          </Stack.Screen>
          <Stack.Screen
            name="SignUp"
            options={{ header: () => null, animationEnabled: false }}
          >
            {(props) => <SignUpScreen {...props} setIdToken={setIdToken} />}
          </Stack.Screen>
        </Stack.Navigator>
      ) : (
        // User is signed in
        <Stack.Navigator>
          <Stack.Screen
            name="Tab"
            options={{
              header: () => {
                return <HeaderBar />;
              },
              animationEnabled: false,
            }}
          >
            {() => (
              <Tab.Navigator
                tabBarOptions={{
                  activeTintColor: "tomato",
                  inactiveTintColor: "gray",
                }}
              >
                <Tab.Screen
                  name="Home"
                  options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name={"ios-home"} size={size} color={color} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator headerMode="none">
                      <Stack.Screen
                        name="Home"
                        options={
                          {
                            // headerMode: "none",
                            // title: "My App",
                            // headerStyle: { backgroundColor: "green" },
                            // headerTitleStyle: { color: "black" },
                            // header: () => null,
                          }
                        }
                      >
                        {(props) => <HomeScreen {...props} />}
                      </Stack.Screen>
                      <Stack.Screen
                        name="Room"
                        options={
                          {
                            // title: "My  prefered Room",
                          }
                        }
                      >
                        {(props) => <RoomScreen {...props} />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
                <Tab.Screen
                  name="AroundMe"
                  options={{
                    // tabBarLabel: "Around me",
                    tabBarIcon: ({ color, size }) => (
                      <MaterialCommunityIcons
                        name="map-marker-outline"
                        size={size}
                        color={color}
                      />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator headerMode="none">
                      <Stack.Screen
                        name="AroundMe"
                        options={
                          {
                            //title: "AroundMe", tabBarLabel: "AroundMe"
                          }
                        }
                      >
                        {(props) => <AroundMeScreen {...props} />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
                <Tab.Screen
                  name="Profile"
                  options={{
                    tabBarLabel: "My profile",
                    tabBarIcon: ({ color, size }) => (
                      <AntDesign name="user" size={size} color={color} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator headerMode="none">
                      <Stack.Screen
                        name="Profile"
                        options={{
                          title: "User Profile",
                        }}
                      >
                        {(props) => (
                          <ProfileScreen
                            userId={userId}
                            userToken={userToken}
                            setIdToken={setIdToken}
                          />
                        )}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
              </Tab.Navigator>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
