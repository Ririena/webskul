import Navigation from "@/layout/Navigation";

const PostinganLayout = ({ children }) => {
    return (
        <>
            <Navigation />
            <main>{children}</main>
        </>
    );
};

export default PostinganLayout
