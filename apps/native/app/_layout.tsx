import "@/global.css";
import {
	PixelifySans_400Regular,
	PixelifySans_500Medium,
	PixelifySans_600SemiBold,
	PixelifySans_700Bold,
	useFonts,
} from "@expo-google-fonts/pixelify-sans";
import { Tiny5_400Regular } from "@expo-google-fonts/tiny5";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { AppThemeProvider } from "@/contexts/app-theme-context";
import { queryClient } from "@/utils/orpc";

export const unstable_settings = {
	initialRouteName: "(drawer)",
};

function StackLayout() {
	return (
		<Stack screenOptions={{}}>
			<Stack.Screen name="(drawer)" options={{ headerShown: false }} />
			<Stack.Screen
				name="modal"
				options={{ presentation: "modal", title: "Modal" }}
			/>
		</Stack>
	);
}

export default function Layout() {
	const [fontsLoaded] = useFonts({
		PixelifySans_400Regular,
		PixelifySans_500Medium,
		PixelifySans_600SemiBold,
		PixelifySans_700Bold,
		Tiny5_400Regular,
	});

	if (!fontsLoaded) {
		return null;
	}

	return (
		<QueryClientProvider client={queryClient}>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<KeyboardProvider>
					<AppThemeProvider>
						<HeroUINativeProvider>
							<StackLayout />
						</HeroUINativeProvider>
					</AppThemeProvider>
				</KeyboardProvider>
			</GestureHandlerRootView>
		</QueryClientProvider>
	);
}
