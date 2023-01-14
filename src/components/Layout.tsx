import React from "react";

type Props = {};

const Layout: React.FC<React.PropsWithChildren<Props>> = ({ children }) => {
  return (
    <main className="bg-gray-100 py-20 px-5 min-h-screen">
      <section className="max-w-5xl mx-auto">{children}</section>
    </main>
  );
};

export default Layout;
