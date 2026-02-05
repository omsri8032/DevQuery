"use client";

import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { useThemeStore } from "@/store/useThemeStore";

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor").then((mod) => mod.default),
    { ssr: false }
);

interface RTEProps {
    value: string;
    onChange: (value: string | undefined) => void;
}

export default function RTE({ value, onChange }: RTEProps) {
    const { theme } = useThemeStore();

    return (
        <div data-color-mode={theme === "dark" ? "dark" : "light"}>
            <MDEditor
                value={value}
                onChange={onChange}
                preview="edit"
                height={300}
                style={{ borderRadius: "0.5rem", overflow: "hidden" }}
                textareaProps={{
                    placeholder: "Type your question here... (Markdown supported)"
                }}
            />
        </div>
    );
}
