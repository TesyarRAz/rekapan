import { View, Text, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState, useEffect } from "react";
import HomeScreen from "./screens/HomeScreen";
import CreateScreen from "./screens/CreateScreen";
import UpdateScreen from "./screens/UpdateScreen";
import SnackIcon from "./assets/icon.png";
// import SignInScreen from "./screens/SignInScreen";
import SignInMailScreen from "./screens/SignInMailScreen";
import { useAuthStore } from "./stores/auth";
import { supabase } from "./lib/supabase";

const Stack = createNativeStackNavigator();

export default function App() {
  // bikin state buat session
  const { setSession, session } = useAuthStore();

  // Splashscreen State
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise((resolve) => globalThis.setTimeout(resolve, 5000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, [setSession]);

  if (!appIsReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={SnackIcon}
          style={{
            width: 200,
            height: 200,
          }}
        />
        <Text
          style={{
            fontSize: 24,
          }}
        >
          Ilham Arrahman
        </Text>
        <Text>2130511030</Text>
      </View>
    );
  }

  // bikin navigasi buat pindah pindah screen
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {session ? (
          <>
            <Stack.Screen
              name="home"
              options={{
                title: "Kelola Keuangan Anda",
                headerTitleAlign: "center",
              }}
              component={HomeScreen}
            />
            <Stack.Screen
              name="create"
              component={CreateScreen}
              options={{
                title: "Tambahkan Data",
                headerTitleAlign: "center",
              }}
            />
            <Stack.Screen
              name="update"
              options={{
                title: "Edit Data",
                headerTitleAlign: "center",
              }}
              component={UpdateScreen}
            />
          </>
        ) : (
          <>
            {/* <Stack.Screen
              name="signin"
              options={{
                title: "Sign In",
                headerTitleAlign: "center",
              }}
            >
              {(props) => <SignInScreen {...props} />}
            </Stack.Screen> */}
            <Stack.Screen
              name="signin-mail"
              options={{
                title: "Sign In via Mail",
                headerTitleAlign: "center",
              }}
              component={SignInMailScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
