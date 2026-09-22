"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Conversation = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function CopilotPage() {
  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [
    activeConversationId,
    setActiveConversationId,
  ] = useState<string | null>(null);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [input, setInput] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [pageLoading, setPageLoading] =
    useState(true);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const bottomRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    initializeCopilot();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function initializeCopilot() {
    try {
      setPageLoading(true);

      const response = await fetch(
        "/api/ai/conversations",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to load conversations."
        );
      }

      const items: Conversation[] =
        data.conversations ?? [];

      setConversations(items);

      if (items.length > 0) {
        await openConversation(items[0].id);
      } else {
        await createNewChat();
      }
    } catch (error) {
      console.error(
        "Copilot initialization error:",
        error
      );
    } finally {
      setPageLoading(false);
    }
  }

  async function refreshConversationList() {
    try {
      const response = await fetch(
        "/api/ai/conversations",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return;
      }

      setConversations(
        data.conversations ?? []
      );
    } catch (error) {
      console.error(
        "Conversation refresh error:",
        error
      );
    }
  }

  async function openConversation(
    id: string
  ) {
    try {
      setActiveConversationId(id);
      setMessages([]);
      setSidebarOpen(false);

      const response = await fetch(
        `/api/ai/conversations/${id}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to load conversation."
        );
      }

      setMessages(data.messages ?? []);
    } catch (error) {
      console.error(
        "Conversation open error:",
        error
      );

      setMessages([
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Unable to load this conversation.",
        },
      ]);
    }
  }

  async function createNewChat() {
    try {
      const response = await fetch(
        "/api/ai/conversations",
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to create conversation."
        );
      }

      const conversation: Conversation =
        data.conversation;

      setConversations((current) => [
        conversation,
        ...current,
      ]);

      setActiveConversationId(
        conversation.id
      );

      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `# Welcome to Nexora AI

I'm your intelligent workspace copilot.

I can help you with:

- Workflows
- Automations
- Projects
- Business ideas
- Technical questions
- Professional writing
- Productivity

**What would you like to work on today?**`,
        },
      ]);

      setSidebarOpen(false);
    } catch (error) {
      console.error(
        "Create chat error:",
        error
      );
    }
  }

  async function renameConversation(
    id: string,
    currentTitle: string
  ) {
    const title = window.prompt(
      "Enter conversation name:",
      currentTitle
    );

    if (!title?.trim()) {
      return;
    }

    try {
      const response = await fetch(
        `/api/ai/conversations/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to rename conversation."
        );
      }

      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === id
            ? {
                ...conversation,
                title:
                  data.conversation.title,
              }
            : conversation
        )
      );
    } catch (error) {
      console.error(
        "Rename conversation error:",
        error
      );
    }
  }

  async function deleteConversation(
    id: string
  ) {
    const confirmed =
      window.confirm(
        "Delete this conversation permanently?"
      );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/ai/conversations/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to delete conversation."
        );
      }

      const remaining =
        conversations.filter(
          (conversation) =>
            conversation.id !== id
        );

      setConversations(remaining);

      if (
        activeConversationId === id
      ) {
        if (remaining.length > 0) {
          await openConversation(
            remaining[0].id
          );
        } else {
          await createNewChat();
        }
      }
    } catch (error) {
      console.error(
        "Delete conversation error:",
        error
      );
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const message = input.trim();

    if (
      !message ||
      loading ||
      !activeConversationId
    ) {
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    };

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/ai/chat",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            message,
            conversationId:
              activeConversationId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Something went wrong."
        );
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.answer,
      };

      setMessages((current) => [
        ...current,
        assistantMessage,
      ]);

      await refreshConversationList();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Nexora AI is temporarily unavailable.";

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `### Error

${errorMessage}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const activeConversation =
    conversations.find(
      (conversation) =>
        conversation.id ===
        activeConversationId
    );

  return (
    <div className="relative flex h-[calc(100vh-110px)] min-h-[650px] overflow-hidden rounded-3xl border border-white/10 bg-[#080b12] shadow-2xl">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="absolute inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
          aria-label="Close sidebar"
        />
      )}

      {/* Conversations Sidebar */}
      <aside
        className={`absolute inset-y-0 left-0 z-40 flex w-[280px] flex-col border-r border-white/10 bg-[#0b0e15] transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="border-b border-white/10 p-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-bold text-black">
              N
            </div>

            <div>
              <p className="font-semibold text-white">
                Nexora AI
              </p>

              <p className="text-xs text-white/40">
                AI Copilot
              </p>
            </div>
          </div>

          <button
            onClick={createNewChat}
            className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            + New Chat
          </button>
        </div>

        <div className="px-4 pb-2 pt-4">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/30">
            Conversations
          </p>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {conversations.map(
            (conversation) => {
              const active =
                conversation.id ===
                activeConversationId;

              return (
                <div
                  key={conversation.id}
                  className={`group rounded-2xl border transition ${
                    active
                      ? "border-white/10 bg-white/10"
                      : "border-transparent hover:bg-white/[0.05]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      openConversation(
                        conversation.id
                      )
                    }
                    className="w-full px-3 pb-1 pt-3 text-left"
                  >
                    <p className="truncate text-sm font-medium text-white/90">
                      {
                        conversation.title
                      }
                    </p>
                  </button>

                  <div className="flex items-center gap-2 px-3 pb-3">
                    <button
                      type="button"
                      onClick={() =>
                        renameConversation(
                          conversation.id,
                          conversation.title
                        )
                      }
                      className="text-xs text-white/35 transition hover:text-white"
                    >
                      Rename
                    </button>

                    <span className="text-white/15">
                      •
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        deleteConversation(
                          conversation.id
                        )
                      }
                      className="text-xs text-red-400/70 transition hover:text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </aside>

      {/* Main Copilot */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-white/10 bg-black/10 px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setSidebarOpen(true)
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white lg:hidden"
            >
              ☰
            </button>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white font-bold text-black">
              N
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold text-white sm:text-lg">
                {activeConversation?.title ||
                  "Nexora AI"}
              </h1>

              <div className="mt-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />

                <span className="text-xs text-white/40">
                  AI workspace copilot
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={createNewChat}
            className="hidden rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white sm:block"
          >
            + New Chat
          </button>
        </header>

        {/* Messages */}
        <section className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
            {pageLoading ? (
              <div className="py-16 text-center">
                <div className="mx-auto mb-4 flex w-fit gap-2">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white/60" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white/60 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white/60 [animation-delay:300ms]" />
                </div>

                <p className="text-sm text-white/40">
                  Loading Nexora AI...
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role ===
                    "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[90%] rounded-3xl px-5 py-4 text-sm leading-7 sm:max-w-[78%] ${
                      message.role ===
                      "user"
                        ? "rounded-br-md bg-white text-black"
                        : "rounded-bl-md border border-white/10 bg-white/[0.05] text-white/90"
                    }`}
                  >
                    {message.role ===
                    "assistant" ? (
                      <div
                        className="
                        space-y-3

                        [&_h1]:mt-5
                        [&_h1]:text-xl
                        [&_h1]:font-bold
                        [&_h1]:text-white

                        [&_h2]:mt-5
                        [&_h2]:text-lg
                        [&_h2]:font-semibold
                        [&_h2]:text-white

                        [&_h3]:mt-4
                        [&_h3]:font-semibold
                        [&_h3]:text-white

                        [&_p]:leading-7

                        [&_strong]:font-semibold
                        [&_strong]:text-white

                        [&_ul]:ml-5
                        [&_ul]:list-disc
                        [&_ul]:space-y-1

                        [&_ol]:ml-5
                        [&_ol]:list-decimal
                        [&_ol]:space-y-1

                        [&_li]:pl-1

                        [&_blockquote]:border-l-2
                        [&_blockquote]:border-white/20
                        [&_blockquote]:pl-4
                        [&_blockquote]:italic
                        [&_blockquote]:text-white/60

                        [&_a]:text-white
                        [&_a]:underline
                        [&_a]:underline-offset-4

                        [&_code]:rounded-md
                        [&_code]:bg-black/40
                        [&_code]:px-1.5
                        [&_code]:py-0.5
                        [&_code]:font-mono
                        [&_code]:text-[13px]

                        [&_pre]:my-4
                        [&_pre]:overflow-x-auto
                        [&_pre]:rounded-2xl
                        [&_pre]:border
                        [&_pre]:border-white/10
                        [&_pre]:bg-black/60
                        [&_pre]:p-4

                        [&_pre_code]:bg-transparent
                        [&_pre_code]:p-0

                        [&_table]:my-4
                        [&_table]:w-full
                        [&_table]:border-collapse

                        [&_th]:border
                        [&_th]:border-white/10
                        [&_th]:bg-white/[0.06]
                        [&_th]:p-2
                        [&_th]:text-left
                        [&_th]:font-semibold
                        [&_th]:text-white

                        [&_td]:border
                        [&_td]:border-white/10
                        [&_td]:p-2

                        [&_hr]:my-5
                        [&_hr]:border-white/10
                      "
                      >
                        <ReactMarkdown
                          remarkPlugins={[
                            remarkGfm,
                          ]}
                        >
                          {
                            message.content
                          }
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">
                        {
                          message.content
                        }
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {/* AI Thinking */}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-3xl rounded-bl-md border border-white/10 bg-white/[0.05] px-5 py-4">
                  <div className="mb-2 text-xs text-white/40">
                    Nexora AI is
                    thinking...
                  </div>

                  <div className="flex gap-2">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-white/60" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-white/60 [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-white/60 [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </section>

        {/* Input */}
        <footer className="border-t border-white/10 bg-black/20 p-4 sm:p-6">
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex max-w-4xl items-end gap-3 rounded-3xl border border-white/10 bg-white/[0.05] p-3 shadow-xl"
          >
            <textarea
              value={input}
              onChange={(event) =>
                setInput(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key ===
                    "Enter" &&
                  !event.shiftKey
                ) {
                  event.preventDefault();

                  event.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder="Ask Nexora AI anything..."
              rows={1}
              className="max-h-40 min-h-[48px] flex-1 resize-none bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-white/30"
            />

            <button
              type="submit"
              disabled={
                !input.trim() ||
                loading ||
                !activeConversationId
              }
              className="flex h-12 min-w-[72px] items-center justify-center rounded-2xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading
                ? "..."
                : "Send"}
            </button>
          </form>

          <p className="mt-3 text-center text-xs text-white/30">
            Nexora AI can make
            mistakes. Verify important
            information.
          </p>
        </footer>
      </main>
    </div>
  );
}