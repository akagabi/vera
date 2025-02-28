import { useEffect, useState } from "react";
import CurrencyConverter from "./components/CurrencyConverter";
import { Workbox } from "workbox-window";
import "./App.css";

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      const wb = new Workbox(`${import.meta.env.BASE_URL}sw.js`);

      wb.addEventListener("waiting", () => {
        setIsUpdateAvailable(true);
      });

      wb.register().catch((error) => {
        console.error("Service worker registration failed:", error);
      });
    }

    // Handle online/offline status
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col funny-background">
      <main className="flex-1 container mx-auto px-4 py-8">
        {!isOnline && (
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md mb-4 text-sm">
            You are currently offline. Using last known exchange rates.
          </div>
        )}

        {isUpdateAvailable && (
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md mb-4 text-sm">
            A new version is available. Please refresh the page to update.
          </div>
        )}

        <CurrencyConverter />
      </main>

      <footer className="border-t py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Currency Converter PWA - Works Offline</p>
          <p className="text-xs mt-1">
            Exchange rates provided by{" "}
            <a
              href="https://exchangerate.host"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              exchangerate.host
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
