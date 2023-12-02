import Header from "./Header";
import Footer from "./Footer";


function MainLayout({element}) {
    return (
        <>
            <Header/>
            <div className="container">
                {element}
            </div>
            <Footer/>
        </>

    )
}

export default MainLayout