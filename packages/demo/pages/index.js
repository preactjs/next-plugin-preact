import React from "react";
import dynamic from "next/dynamic";

const L = dynamic(() => import("../lazy"));

export default function App() {
  return (
    <div>
      Hello world!
      <L />
    </div>
  );
}
