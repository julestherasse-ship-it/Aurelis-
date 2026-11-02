import { renderToString } from "react-dom/server";
import { PreviewApp } from "./app";

export function renderPreview(): string {
  return renderToString(<PreviewApp />);
}
