import GlobalStyle from "styles/globalStyle";
import { ThemeProvider } from "styled-components";
import { defaultTheme } from "styles/defaultTheme";
import { Provider as ReduxProvider } from "react-redux";
import { StylesProvider } from "@mui/styles";
import store from "src/store/store";
import UserProvider from "src/providers/userProvider";
import Layout from "src/components/layout";
import Notifications from "src/components/notifications";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
	return (
		<>
			<Head>
				<title>Twitter</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<ReduxProvider store={store}>
				<StylesProvider injectFirst>
					<ThemeProvider theme={defaultTheme}>
						<GlobalStyle />
						<UserProvider>
							<Notifications>
								<Layout>
									<Component {...pageProps} />
								</Layout>
							</Notifications>
						</UserProvider>
					</ThemeProvider>
				</StylesProvider>
			</ReduxProvider>
		</>
	);
}

export default MyApp;
