import { supabase } from '../lib/supabase'
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin'
import React from 'react'
import { AppState, SafeAreaView } from 'react-native'

AppState.addEventListener("change", (state) => {
    if (state === "active") {
        supabase.auth.startAutoRefresh();
    } else {
        supabase.auth.stopAutoRefresh();
    }
});

const SignInScreen = async () => {
    const hasPlayService = await GoogleSignin.hasPlayServices()

    if (hasPlayService) {
        GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
            webClientId: '129145861576-9pbbfpes15i89n4t1lcepvaglqsa5hln.apps.googleusercontent.com',
        })
    }

    return (
        <SafeAreaView>
            {hasPlayService ? <GoogleSigninButton
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={async () => {
                    try {
                        const userInfo = await GoogleSignin.signIn()
                        if (userInfo.idToken) {
                            const { data, error } = await supabase.auth.signInWithIdToken({
                                provider: 'google',
                                token: userInfo.idToken,
                            })
                            console.log(error, data)
                        } else {
                            throw new Error('no ID token present!')
                        }
                    } catch (error: any) {
                        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                            // user cancelled the login flow
                        } else if (error.code === statusCodes.IN_PROGRESS) {
                            // operation (e.g. sign in) is in progress already
                        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                            // play services not available or outdated
                        } else {
                            // some other error happened
                        }
                    }
                }}
            /> : null}

        </SafeAreaView>
    )
}

export default SignInScreen
