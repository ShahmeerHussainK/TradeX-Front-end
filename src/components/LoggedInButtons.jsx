import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function LoggedInButtons({ doSignInWithGoogle }) {
  const navigate = useNavigate();
  return (
    <div className="flex w-full flex-col items-center justify-center gap-5 md:flex-row">
      <Button
        onClick={() => navigate("/login")}
        className="text-base w-full text-sky-500 hover:scale-105 hover:text-sky-600 hover:transition-all"
      >
        Login
      </Button>
      <Button
        className="bg-sky-500 w-full text-white hover:scale-105 hover:bg-sky-600 hover:transition-all"
        variant="secondary"
        onClick={() => navigate("/signup")}
      >
        Sign Up
      </Button>
    </div>
  );
}

export default LoggedInButtons;
