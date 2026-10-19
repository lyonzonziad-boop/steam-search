import { useState, useEffect } from "react";
import type { GridGame } from "../components/GameGrid";

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
  avatarColor: string;
  createdAt: string;
  wishlist: GridGame[];
}

interface StoredAccount extends UserProfile {
  passwordHash: string;
  verificationCode?: string;
}

const STORAGE_USERS_KEY = "steamfinder_users_db";
const STORAGE_SESSION_KEY = "steamfinder_active_session";

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const session = localStorage.getItem(STORAGE_SESSION_KEY);
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  });

  // Sauvegarde la session
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    }
  }, [currentUser]);

  // Récupérer la base de comptes locale
  function getDb(): StoredAccount[] {
    try {
      const data = localStorage.getItem(STORAGE_USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  function saveDb(users: StoredAccount[]) {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  }

  // 1. Inscription initiale (envoie le code par mail)
  function register(username: string, email: string, password: string): { success: boolean; code?: string; error?: string } {
    const db = getDb();
    const cleanEmail = email.toLowerCase().trim();

    if (db.some((u) => u.email === cleanEmail)) {
      return { success: false, error: "Cet email est déjà associé à un compte." };
    }

    // Code de vérification à 6 chiffres
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const colors = ["#0ea5e9", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"];
    const avatarColor = colors[Math.floor(Math.random() * colors.length)];

    const newUser: StoredAccount = {
      id: "usr_" + Date.now(),
      username: username.trim(),
      email: cleanEmail,
      isVerified: false,
      avatarColor,
      createdAt: new Date().toLocaleDateString("fr-FR"),
      wishlist: [],
      passwordHash: btoa(password), // encodage
      verificationCode: code,
    };

    db.push(newUser);
    saveDb(db);

    return { success: true, code };
  }

  // 2. Vérification du code email
  function verifyEmailCode(email: string, code: string): { success: boolean; error?: string } {
    const db = getDb();
    const cleanEmail = email.toLowerCase().trim();
    const userIndex = db.findIndex((u) => u.email === cleanEmail);

    if (userIndex === -1) return { success: false, error: "Compte introuvable." };

    const user = db[userIndex];
    if (user.verificationCode !== code.trim()) {
      return { success: false, error: "Code de vérification incorrect." };
    }

    user.isVerified = true;
    delete user.verificationCode;
    db[userIndex] = user;
    saveDb(db);

    const { passwordHash, verificationCode, ...profile } = user;
    setCurrentUser(profile);
    return { success: true };
  }

  // 3. Connexion
  function login(email: string, password: string): { success: boolean; error?: string } {
    const db = getDb();
    const cleanEmail = email.toLowerCase().trim();
    const user = db.find((u) => u.email === cleanEmail);

    if (!user || user.passwordHash !== btoa(password)) {
      return { success: false, error: "Email ou mot de passe incorrect." };
    }

    if (!user.isVerified) {
      return { success: false, error: "Veuillez vérifier votre adresse email d'abord." };
    }

    const { passwordHash, verificationCode, ...profile } = user;
    setCurrentUser(profile);
    return { success: true };
  }

  // 4. Déconnexion
  function logout() {
    setCurrentUser(null);
  }

  // 5. Sauvegarde automatique de la wishlist sur le compte
  function syncWishlist(newWishlist: GridGame[]) {
    if (!currentUser) return;
    const updated = { ...currentUser, wishlist: newWishlist };
    setCurrentUser(updated);

    const db = getDb();
    const index = db.findIndex((u) => u.id === currentUser.id);
    if (index !== -1) {
      db[index].wishlist = newWishlist;
      saveDb(db);
    }
  }

  return { currentUser, register, verifyEmailCode, login, logout, syncWishlist };
}