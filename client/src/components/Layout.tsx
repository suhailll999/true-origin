import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="w-screen flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex items-center justify-center w-full h-[calc(100vh-4rem)]">{children}</main>
      <Footer />
    </section>
  );
};

export default Layout;
