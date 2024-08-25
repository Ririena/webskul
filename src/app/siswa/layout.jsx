import Navigation from "@/layout/Navigation";

const LayoutSiswa = ({ children }) => {
    return (
        <>
            <Navigation />
         
                <main>{children}</main>
        </>
    );
};

export default LayoutSiswa;
