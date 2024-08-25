import Navigation from "@/layout/Navigation"

const LayoutProfile = ({children}) => {
    return (
        <>
        <Navigation/>
        <main>{children}</main>
        </>
    )
}

export default LayoutProfile