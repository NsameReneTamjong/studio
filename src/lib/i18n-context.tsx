
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
  courses: { en: "My Subjects", fr: "Mes Matières" },
  grades: { en: "Report Card", fr: "Bulletin de Notes" },
  attendance: { en: "Attendance", fr: "Présences" },
  aiFeedback: { en: "AI Feedback", fr: "Feedback IA" },
  schedule: { en: "Schedule", fr: "Emploi du temps" },
  schools: { en: "Schools", fr: "Écoles" },
  feedback: { en: "Feedback", fr: "Feedback" },
  announcements: { en: "Announcements", fr: "Annonces" },
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
  addSchool: { en: "Add School", fr: "Ajouter une École" },
  viewMap: { en: "View Map", fr: "Voir la Carte" },
  sendAnnouncement: { en: "Send Announcement", fr: "Envoyer une Annonce" },
  allSchools: { en: "All Schools", fr: "Toutes les Écoles" },
  documents: { en: "Documents", fr: "Documents" },
  download: { en: "Download", fr: "Télécharger" },
  reportCard: { en: "Report Card", fr: "Bulletin de Notes" },
  idCard: { en: "ID Card", fr: "Carte d'Identité" },
  receipt: { en: "Receipt", fr: "Reçu de Paiement" },
  academicYear: { en: "Academic Year", fr: "Année Académique" },
  fees: { en: "Fees & Receipts", fr: "Frais & Reçus" },
  chat: { en: "Live Chat", fr: "Chat en direct" },
  noConversations: { en: "No conversations yet", fr: "Aucune conversation pour le moment" },
  selectContact: { en: "Select a contact to start chatting", fr: "Sélectionnez un contact pour commencer à discuter" },
  attendanceRecords: { en: "Attendance Records", fr: "Registres de présence" },
  present: { en: "Present", fr: "Présent" },
  absent: { en: "Absent", fr: "Absent" },
  late: { en: "Late", fr: "Retard" },
  viewDetails: { en: "View Details", fr: "Voir Détails" },
  createAccount: { en: "Create Account", fr: "Créer un Compte" },
  matricule: { en: "Matricule / ID", fr: "Matricule / ID" },
  confirmPassword: { en: "Confirm Password", fr: "Confirmer le mot de passe" },
  alreadyHaveAccount: { en: "Already have an account?", fr: "Déjà un compte ?" },
  dontHaveAccount: { en: "Don't have an account?", fr: "Pas encore de compte ?" },
  register: { en: "Register", fr: "S'inscrire" },
  profile: { en: "Profile", fr: "Profil" },
  editProfile: { en: "Edit Profile", fr: "Modifier le Profil" },
  personalInfo: { en: "Personal Information", fr: "Informations Personnelles" },
  fullName: { en: "Full Name", fr: "Nom Complet" },
  changePassword: { en: "Change Password", fr: "Changer le mot de passe" },
  currentPassword: { en: "Current Password", fr: "Mot de passe actuel" },
  newPassword: { en: "New Password", fr: "Nouveau mot de passe" },
  updateProfile: { en: "Update Profile", fr: "Mettre à jour le profil" },
  changesSaved: { en: "Changes Saved", fr: "Changements Enregistrés" },
  profileUpdateSuccess: { en: "Your profile has been updated successfully.", fr: "Votre profil a été mis à jour avec succès." },
  addSubject: { en: "Add Optional Subject", fr: "Ajouter une Matière Facultative" },
  viewMaterials: { en: "View Materials", fr: "Voir les Supports" },
  materials: { en: "Course Materials", fr: "Supports de Cours" },
  availableSubjects: { en: "Available Optional Subjects", fr: "Matières Facultatives Disponibles" },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("fr");

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
