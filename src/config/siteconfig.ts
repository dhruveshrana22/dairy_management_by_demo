// const prod: boolean = process.env.NODE_ENV === "production";

// const live: boolean = process.env?.REACT_APP_DEV_LIVE === "live";
// const staging: boolean = process.env?.REACT_APP_DEV_LIVE === "staging";

const baseUrl: string = "https://bizwise.onrender.com/";

// Site configuration type
interface SiteConfig {
  siteName: string;
  siteIcon: string;
  footerText: string;
  apiUrl: string;
  csvUrl: string;
  sailsUrl: string;
  google: {
    analyticsKey: string;
  };
  tinyEditorKey: string;
  dashboard: string;
}

// Endpoint type
interface Endpoint {
  logIn: string;
  signUp: string;
}

// Site configuration object
const siteConfig: SiteConfig = {
  siteName: "React",
  siteIcon: "ion-flash",
  footerText: `© ${new Date().getFullYear()} test`,

  apiUrl: baseUrl,
  csvUrl: `${baseUrl}ExmpleCSV`,
  sailsUrl: baseUrl,

  google: {
    analyticsKey: "UA-xxxxxxxxx-1",
  },
  tinyEditorKey: "e3tq72z0kgbpfay3800n06hqbu1su39v084nye4weku75ib6",
  dashboard: "/dashboard",
};

// Endpoint configuration object
const endpoint: Endpoint = {
  logIn: "api/signin",
  signUp: "api/signup",
};

// Export base URL and configurations
const BaseUrl: string = siteConfig?.apiUrl;

export { siteConfig, endpoint, BaseUrl };
