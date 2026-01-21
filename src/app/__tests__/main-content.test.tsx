import { test, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MainContent } from "../main-content";

// Mock the dependencies
vi.mock("@/lib/contexts/file-system-context", () => ({
  FileSystemProvider: ({ children }: any) => <div data-testid="file-system-provider">{children}</div>,
}));

vi.mock("@/lib/contexts/chat-context", () => ({
  ChatProvider: ({ children }: any) => <div data-testid="chat-provider">{children}</div>,
}));

vi.mock("@/components/chat/ChatInterface", () => ({
  ChatInterface: () => <div data-testid="chat-interface">Chat Interface</div>,
}));

vi.mock("@/components/editor/FileTree", () => ({
  FileTree: () => <div data-testid="file-tree">File Tree</div>,
}));

vi.mock("@/components/editor/CodeEditor", () => ({
  CodeEditor: () => <div data-testid="code-editor">Code Editor</div>,
}));

vi.mock("@/components/preview/PreviewFrame", () => ({
  PreviewFrame: () => <div data-testid="preview-frame">Preview Frame</div>,
}));

vi.mock("@/components/HeaderActions", () => ({
  HeaderActions: () => <div data-testid="header-actions">Header Actions</div>,
}));

vi.mock("@/components/ui/resizable", () => ({
  ResizableHandle: ({ className }: any) => <div data-testid="resizable-handle" className={className} />,
  ResizablePanel: ({ children, defaultSize, minSize, maxSize }: any) => (
    <div data-testid="resizable-panel" data-default-size={defaultSize} data-min-size={minSize} data-max-size={maxSize}>
      {children}
    </div>
  ),
  ResizablePanelGroup: ({ children, direction, className }: any) => (
    <div data-testid="resizable-panel-group" data-direction={direction} className={className}>
      {children}
    </div>
  ),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
});

test("renders with default preview view", () => {
  render(<MainContent />);

  // Preview should be visible by default
  expect(screen.getByTestId("preview-frame")).toBeDefined();

  // Code view components should not be visible
  expect(screen.queryByTestId("file-tree")).toBeNull();
  expect(screen.queryByTestId("code-editor")).toBeNull();
});

test("toggle buttons exist and are correctly labeled", () => {
  render(<MainContent />);

  const previewButton = screen.getByRole("tab", { name: /preview/i });
  const codeButton = screen.getByRole("tab", { name: /code/i });

  expect(previewButton).toBeDefined();
  expect(codeButton).toBeDefined();
});

test("preview button is active by default", () => {
  render(<MainContent />);

  const previewButton = screen.getByRole("tab", { name: /preview/i });
  const codeButton = screen.getByRole("tab", { name: /code/i });

  // Preview tab should be active (selected)
  expect(previewButton.getAttribute("data-state")).toBe("active");
  expect(codeButton.getAttribute("data-state")).toBe("inactive");
});

test("clicking code button switches to code view", async () => {
  const user = userEvent.setup();
  render(<MainContent />);

  const codeButton = screen.getByRole("tab", { name: /code/i });

  // Initially, preview should be visible
  expect(screen.getByTestId("preview-frame")).toBeDefined();

  // Click the code button
  await user.click(codeButton);

  // Now code view should be visible
  expect(screen.getByTestId("file-tree")).toBeDefined();
  expect(screen.getByTestId("code-editor")).toBeDefined();

  // Preview should not be visible
  expect(screen.queryByTestId("preview-frame")).toBeNull();

  // Code button should be active
  expect(codeButton.getAttribute("data-state")).toBe("active");
});

test("clicking preview button switches back to preview view", async () => {
  const user = userEvent.setup();
  render(<MainContent />);

  const previewButton = screen.getByRole("tab", { name: /preview/i });
  const codeButton = screen.getByRole("tab", { name: /code/i });

  // Switch to code view first
  await user.click(codeButton);
  expect(screen.getByTestId("file-tree")).toBeDefined();

  // Switch back to preview
  await user.click(previewButton);

  // Preview should be visible again
  expect(screen.getByTestId("preview-frame")).toBeDefined();

  // Code view should not be visible
  expect(screen.queryByTestId("file-tree")).toBeNull();
  expect(screen.queryByTestId("code-editor")).toBeNull();

  // Preview button should be active
  expect(previewButton.getAttribute("data-state")).toBe("active");
});

test("toggle buttons work correctly in sequence", async () => {
  const user = userEvent.setup();
  render(<MainContent />);

  const previewButton = screen.getByRole("tab", { name: /preview/i });
  const codeButton = screen.getByRole("tab", { name: /code/i });

  // Start with preview (default)
  expect(screen.getByTestId("preview-frame")).toBeDefined();
  expect(previewButton.getAttribute("data-state")).toBe("active");

  // Switch to code
  await user.click(codeButton);
  expect(screen.getByTestId("file-tree")).toBeDefined();
  expect(screen.getByTestId("code-editor")).toBeDefined();
  expect(screen.queryByTestId("preview-frame")).toBeNull();
  expect(codeButton.getAttribute("data-state")).toBe("active");

  // Switch back to preview
  await user.click(previewButton);
  expect(screen.getByTestId("preview-frame")).toBeDefined();
  expect(screen.queryByTestId("file-tree")).toBeNull();
  expect(screen.queryByTestId("code-editor")).toBeNull();
  expect(previewButton.getAttribute("data-state")).toBe("active");

  // Switch to code again
  await user.click(codeButton);
  expect(screen.getByTestId("file-tree")).toBeDefined();
  expect(screen.getByTestId("code-editor")).toBeDefined();
  expect(screen.queryByTestId("preview-frame")).toBeNull();
  expect(codeButton.getAttribute("data-state")).toBe("active");
});

test("renders correct components based on view state", async () => {
  const user = userEvent.setup();
  render(<MainContent />);

  const codeButton = screen.getByRole("tab", { name: /code/i });

  // Preview view shows only PreviewFrame
  expect(screen.getByTestId("preview-frame")).toBeDefined();
  expect(screen.queryByTestId("file-tree")).toBeNull();
  expect(screen.queryByTestId("code-editor")).toBeNull();

  // Switch to code view
  await user.click(codeButton);

  // Code view shows FileTree and CodeEditor, but not PreviewFrame
  expect(screen.queryByTestId("preview-frame")).toBeNull();
  expect(screen.getByTestId("file-tree")).toBeDefined();
  expect(screen.getByTestId("code-editor")).toBeDefined();
});

test("chat interface is always visible regardless of toggle state", async () => {
  const user = userEvent.setup();
  render(<MainContent />);

  const codeButton = screen.getByRole("tab", { name: /code/i });

  // Chat should be visible in preview view
  expect(screen.getByTestId("chat-interface")).toBeDefined();

  // Switch to code view
  await user.click(codeButton);

  // Chat should still be visible in code view
  expect(screen.getByTestId("chat-interface")).toBeDefined();
});
