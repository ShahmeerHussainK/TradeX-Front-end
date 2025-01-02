import axios from "@/api/axios";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function AppLayout() {
  const { setIsVerified, currentUser } = useAuth();
  const Navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      async function verifyUser() {
        try {
          const { data } = await axios.post("/login", null, {
            headers: { Authorization: `Bearer ${currentUser.accessToken}` },
          });
          if (data.uid === currentUser.uid) {
            setIsVerified(true);
          }
        } catch (error) {
          console.error(error.message);
          setIsVerified(false);
        }
      }
      verifyUser();
    } else {
      setIsVerified(false);
    }
  }, [currentUser, Navigate, setIsVerified]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-800">
      <header>
        <Header />
        <MobileHeader />
      </header>
      <main className="flex-grow text-gray-200">
        <Outlet />
      </main>
      <footer className="h-16">
        <Footer />
      </footer>
    </div>
  );
}
