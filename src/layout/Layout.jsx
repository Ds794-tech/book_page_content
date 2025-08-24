import React from "react";
import { Link, Outlet } from "react-router-dom";
import Books from "../view/Books";


const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-blue-600 text-white p-4">
                <h1 className="text-xl font-bold">Create Page of Book</h1>
            </header>
            <main className="flex-grow">
                <Outlet />
            </main>
            <footer className="bg-gray-200 text-center p-4">
                &copy; 2024 Book Creation
            </footer>
        </div>
    );
}

export default Layout;