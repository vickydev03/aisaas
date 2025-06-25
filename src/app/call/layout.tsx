import React from "react";

function CallLayout({ children }: { children: React.ReactNode }) {
  return <div className="h-screen bg-black ">{children}</div>;
}

export default CallLayout;
