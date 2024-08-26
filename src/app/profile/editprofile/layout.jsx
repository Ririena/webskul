import BottomNavigation from "@/components/navigation/BottomNavigation"
import Navigation from "@/layout/Navigation"
import { Toaster } from "@/components/ui/toaster"
const LayoutEditProfile = ({children}) => {
    return (
        <>
        <main>{children}</main>
        <Toaster/>
        </>
    )
}

export default LayoutEditProfile