import { NavLink } from "react-router";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center mx-auto">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="text-lg text-muted-foreground mb-8">
                Sorry, the page you are looking for does not exist.
            </p>
            <NavLink
                to="/"
                className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/80 transition"
            >
                Go back home
            </NavLink>
        </div>
    );
}
