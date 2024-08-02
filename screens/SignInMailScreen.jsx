import { supabase } from "../lib/supabase";
import React, { useState } from "react";
import {
  Alert,
  AppState,
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { formStyles } from "../styles/default";
import { Card } from "react-native-paper";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const SignInMailScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  return (
    <SafeAreaView>
      <Card style={{
        ...styles.container,
        marginHorizontal: 10,
      }}>
        <Text style={{
          fontSize: 21,
          marginBottom: 15,
          fontWeight: "bold",
          borderBottomWidth: 1,
          paddingBottom: 10,
        }}>Sign In</Text>
        <View style={formStyles.formGroup}>
          <Text style={formStyles.header}>Email</Text>
          <TextInput
            style={formStyles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        <View style={formStyles.formGroup}>
          <Text style={formStyles.header}>Password</Text>
          <TextInput
            style={formStyles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            autoCapitalize="none"
          />
        </View>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Button
            title="Sign in"
            disabled={loading}
            onPress={() => signInWithEmail()}
          />
        </View>
        <View style={styles.verticallySpaced}>
          <Button
            title="Sign up"
            disabled={loading}
            onPress={() => signUpWithEmail()}
          />
        </View>
      </Card>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});

export default SignInMailScreen;
