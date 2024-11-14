import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children, center = true }: { children: React.ReactNode, center?: boolean }) => {
  return (
    <section className="w-screen h-screen overflow-x-hidden">
      <Header />
      <main className={`flex flex-col gap-3 ${center && "items-center justify-center"} w-full min-h-[calc(100vh-4rem)]`}>{children}</main>
      <Footer />
    </section>
  );
};

export default Layout;
