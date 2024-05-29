import * as React from "react";
import { StaticImage } from "gatsby-plugin-image";

export default function Home() {
  return (
    <div>
      <h3>Home Page "My Products"</h3> <br />
      <StaticImage src="../images/landscape.jpeg" alt="Landscape" />
    </div>
  );
}
