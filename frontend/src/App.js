import logo from './logo.svg';
import './App.css';
import {ToastContainer} from "react-toastify";
import {Route, Routes} from "react-router-dom";
import MainLayout from "./Components/Pages/LayoutPages/MainLayout";
import Home from "./Components/Pages/Home";

function App() {
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
             <Routes>
                <Route path='/' element={<MainLayout element={<Home/>}/>}/>
             </Routes>
        </>
    );
}

export default App;
