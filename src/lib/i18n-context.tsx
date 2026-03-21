
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "fr";

interface TranslationDict {
  [key: string]: {
    en: string;
    fr: string;
  };
}

const translations: TranslationDict = {
  dashboard: { en: "Dashboard", fr: "Tableau de bord" },
  students: { en: "Students", fr: "Élèves" },
  staff: { en: "Staff", fr: "Personnel" },
  courses: { en: "Courses", fr: "Cours" },
  grades: { en: "Report Card", fr: "Bulletin de Notes" },
  attendance: { en: "Attendance", fr: "Présences" },
  aiFeedback: { en: "AI Feedback", fr: "Feedback IA" },
  schedule: { en: "Schedule", fr: "Emploi du temps" },
  schools: { en: "Schools", fr: "Écoles" },
  logout: { en: "Logout", fr: "Déconnexion" },
  welcome: { en: "Welcome back", fr: "Bon retour" },
  myChildren: { en: "My Children", fr: "Mes Enfants" },
  platformOverview: { en: "Platform Overview", fr: "Aperçu de la plateforme" },
  overview: { en: "Overview", fr: "Vue d'ensemble" },
  save: { en: "Save", fr: "Enregistrer" },
  cancel: { en: "Cancel", fr: "Annuler" },
  login: { en: "Login", fr: "Connexion" },
  selectRole: { en: "Select your role", fr: "Sélectionnez votre rôle" },
  email: { en: "Email Address", fr: "Adresse Email" },
  password: { en: "Password", fr: "Mot de passe" },
  signIn: { en: "Sign In", fr: "Se Connecter" },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("fr"); // Default to French as it's common in CM

  useEffect(() => {
    const savedLang = localStorage.getItem("edu-nexus-lang") as Language;
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("edu-nexus-lang", lang);
  };

  const t = (key: string) => {
    if (!translations[key]) return key;
    return translations[key][language];
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};
