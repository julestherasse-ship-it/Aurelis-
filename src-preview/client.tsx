import { hydrateRoot } from "react-dom/client";
import { PreviewApp } from "./app";

const root = document.getElementById("aurelis-preview-root");
if (root) hydrateRoot(root, <PreviewApp />);
