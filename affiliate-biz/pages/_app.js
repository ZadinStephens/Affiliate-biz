// pages/_app.js
import "../styles/basic.css";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "../supabaseClient";
import Layout from "../components/Layout";

export default function MyApp({ Component, pageProps }) {
  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionContextProvider>
  );
}
