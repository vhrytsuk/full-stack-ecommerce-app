const en = {
  common: {
    brand: "Storefront",
  },
  nav: {
    home: "Home",
    contact: "Contact",
    about: "About",
  },
  header: {
    accountMenu: "Account menu",
    wishlist: "Wishlist",
    basket: "Shopping basket",
    home: "Storefront home",
    welcome: "Welcome",
    myAccount: "My account",
    profile: "Profile",
    settings: "Settings",
    signIn: "Sign in",
    signUp: "Sign up",
    signOut: "Sign out",
  },
  auth: {
    signIn: {
      title: "Sign in",
      subtitle: "Welcome back. Enter your details to continue.",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      passwordLabel: "Password",
      submit: "Sign in",
      noAccount: "Don't have an account?",
      signUpLink: "Sign up",
    },
    signUp: {
      title: "Sign up",
      subtitle: "Create your account to continue.",
      nameLabel: "Name",
      namePlaceholder: "Jane Doe",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      passwordLabel: "Password",
      submit: "Sign up",
      hasAccount: "Already have an account?",
      signInLink: "Sign in",
    },
  },
} as const;

export default en;
