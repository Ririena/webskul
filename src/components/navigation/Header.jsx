import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import Link from "next/link";
import { ModeToggle } from "../ui/ModeToggle";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { LogIn, UserPlus } from "lucide-react"; // Lucide icons

export default function Header() {
  return (
    <Navbar className="dark:shadow-lg " position="sticky">
      <NavbarBrand>
        <Link href="/">
          <p className="font-bold text-inherit">Logo</p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4 " justify="center">
        <NavbarItem>
          <Link href="/siswa" className="text-foreground">
            Daftar Siswa
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link
            href="/postingan"
            aria-current="page"
            className="text-foreground"
          >
            Postingan
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/profile/editprofile" className="text-foreground">
            Edit Profile
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">Sesi Member</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-2 bg-white dark:bg-neutral-800 rounded-lg shadow-lg">
              <DropdownMenuLabel className="font-semibold text-gray-700 dark:text-gray-300">
                Area Autentikasi
              </DropdownMenuLabel>
              <Separator className="my-1" />
              <DropdownMenuItem className="flex items-center gap-2">
                <Link href="/login" className="flex items-center gap-2">
                  <LogIn className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span>Login</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Link href="/register" className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span>Register</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </NavbarItem>
        <NavbarItem>
          <ModeToggle />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
