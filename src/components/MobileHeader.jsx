import DepositWithDrawBtn from "@/components/DepositWithDrawBtn";
import LoggedInButtons from "@/components/LoggedInButtons";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AlignJustify, BadgeDollarSign } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { doSignInWithGoogle, doSignOut } from "@/firebase/auth";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"


export default function MobileHeader() {
  const { userLoggedIn, currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  function onSignOut() {
    doSignOut();
    navigate(0);
  }

  function handleOpen() {
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

  return (
    <div className="flex h-16 items-center justify-between px-4 text-white md:hidden">
      <Drawer direction="left" open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <AlignJustify
            className="cursor-pointer"
            onClick={handleOpen}
            size={24}
          />
        </DrawerTrigger>
        <DrawerContent
          aria-describedby={undefined}
          className="flex h-full w-full flex-col justify-between overflow-y-auto rounded-none border-gray-500 bg-gray-800 text-white sm:w-[80vw] sm:rounded-r-lg sm:border-r"
        >
          <DrawerHeader className="mt-8 flex items-center gap-2">
            <DrawerTitle
              className="flex flex-1 cursor-pointer items-center justify-center text-3xl font-extrabold text-white sm:text-4xl"
              onClick={handleClose}
            >
              <BadgeDollarSign className="mr-2 inline-block size-8 pt-1" />
              <span> Sweep Stakes</span>
            </DrawerTitle>
          </DrawerHeader>

          <nav className="flex flex-1 flex-col items-start space-y-12 overflow-y-auto p-8">
            <NavLink
              to="/home"
              className="text-lg transition duration-300 hover:text-gray-300"
              onClick={handleClose}
            >
              Home
            </NavLink>
            <NavLink
              to="/wallet"
              className="text-lg transition duration-300 hover:text-gray-300"
              onClick={handleClose}
            >
              Wallet
            </NavLink>
            <NavLink
              to="/profile"
              className="text-lg transition duration-300 hover:text-gray-300"
              onClick={handleClose}
            >
              Profile
            </NavLink>
            <NavLink
              to="/portfolio"
              className="text-lg transition duration-300 hover:text-gray-300"
              onClick={handleClose}
            >
              Portfolio
            </NavLink>
            <NavLink
              to="/terms"
              className="text-lg transition duration-300 hover:text-gray-300"
              onClick={handleClose}
            >
              Terms & Uses
            </NavLink>

            {userLoggedIn && (
              <Button
                className="border-none bg-transparent p-0 text-lg font-normal shadow-none transition duration-300 hover:bg-transparent hover:text-[#0ea5e9]"
                onClick={() => {
                  handleClose();
                  onSignOut();
                }}
              >
                Log Out
              </Button>
            )}
          </nav>

          <div className="mt-auto flex w-full flex-col gap-2 p-4">
            <div className="flex w-full items-center justify-center gap-10">
              {userLoggedIn ? (
                <DepositWithDrawBtn />
              ) : (
                <LoggedInButtons doSignInWithGoogle={doSignInWithGoogle} />
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <div className="flex flex-1 items-center justify-between">
        <h1 className="flex flex-1 items-center justify-center text-2xl font-bold">
          <BadgeDollarSign className="mr-2 inline-block size-8" />
          <span> Sweep Stakes</span>
        </h1>
        {userLoggedIn && (
          <Avatar className="ml-2">
            <AvatarImage src={currentUser?.photoURL} />
            <AvatarFallback>
              {getInitials(currentUser?.displayName || "User")}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}
