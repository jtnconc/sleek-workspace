import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FloppyDisk } from "@phosphor-icons/react";
import { useWorkspace } from "@/workspace/store";
import { extractContact, extractReminder, extractTask } from "@/lib/note-parser";
import { parseNightsFromText, parseRateFromText } from "@/lib/notes-calculator";
import {
  getNotesBaseFontSize,
  registerNotesEditor,
  subscribeNotesBaseFontSize,
  resetEditorSelection,
  restoreNotesCaret,
  saveNotesCaret,
  notifyNotesTableChange,
  clearNotesTableSelection,
  getNotesTableSelection,
} from "./notes-format";

import { CallHistoryPanel } from "./CallHistoryPanel";
import { NotesTableOverlay } from "./NotesTableOverlay";

export function NotesTool() {
  const {
    noteText,
    setNoteText,
    widgets,
    saveNoteToWidget,
    addReminder,
    addContact,
    addTask,
    addWidgetItem,
    notesHistoryOpen,
    setNotesHistoryOpen,
  } = useWorkspace();
  const editorRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  /** Plain notes saved into the Notes widget(s), merged into the history panel. */
  const savedNotes = useMemo(
    () =>
      widgets.flatMap((w) => (w.content.kind === "notes" ? w.content.items : [])),
    [widgets],
  );
  const [plain, setPlain] = useState("");
  const charCount = plain.length;
  const nightsInfo = useMemo(() => parseNightsFromText(plain), [plain]);
  const rateInfo = useMemo(() => parseRateFromText(plain), [plain]);
  // --- Keystroke work is deferred so the input event itself stays cheap. ---
  const frameRef = useRef<number | null>(null);
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setNoteTextRef = useRef(setNoteText);
  setNoteTextRef.current = setNoteText;

  /** Push the editor HTML into the store (debounced away from keystrokes). */
  const flushNoteText = useCallback(() => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = null;
    const el = editorRef.current;
    if (el) setNoteTextRef.current(el.innerHTML);
  }, []);

  /** Coalesce plain-text derivation into one animation frame. */
  const scheduleUpdate = useCallback(() => {
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      setPlain(editorRef.current?.textContent ?? "");
    });
  }, []);

  useEffect(() => {
    const onSelection = () => {
      // Remember where the caret is while the editor has focus, so the
      // position survives unmount/remount (switching tools and back).
      if (document.activeElement === editorRef.current) saveNotesCaret();
      scheduleUpdate();
    };
    document.addEventListener("selectionchange", onSelection);
    return () => document.removeEventListener("selectionchange", onSelection);
  }, [scheduleUpdate]);

  useEffect(
    () => () => {
      saveNotesCaret();
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    },
    [],
  );


  // Keep the DOM in sync only when the incoming value differs (restore/version).
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (el.innerHTML !== noteText) {
      el.innerHTML = noteText;
      setPlain(el.textContent ?? "");
    }
  }, [noteText]);

  useEffect(() => {
    registerNotesEditor(editorRef.current);
    return () => registerNotesEditor(null);
  }, []);

  // The editor owns its base typography: the configured Settings size is
  // applied to the contentEditable root synchronously on every mount (before
  // paint, so there is no initial flash) and re-applied whenever it changes.
  // Explicitly sized spans inside the note still override this.
  useLayoutEffect(() => {
    const apply = (px: number) => {
      const el = editorRef.current;
      if (el) el.style.fontSize = `${px}px`;
    };
    apply(getNotesBaseFontSize());
    return subscribeNotesBaseFontSize(apply);
  }, []);

  // Notes should be ready to type in the moment the tool opens: focus the
  // editor and restore the previous selection (end of content if none).
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const id = requestAnimationFrame(() => {
      el.focus();
      const sel = window.getSelection();
      if (!sel) return;
      if (!restoreNotesCaret(el)) {
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);


  const saveCurrentNote = useCallback(() => {
    const el = editorRef.current;
    if (!el?.textContent?.trim() && !el?.querySelector("img")) return;
    flushNoteText();
    saveNoteToWidget();
    el.innerHTML = "";
    resetEditorSelection(el);
    setPlain("");
  }, [flushNoteText, saveNoteToWidget]);



  return (
    <div className="-mb-3 flex h-full min-h-0 flex-1 flex-col pb-1 sm:-mb-4">
      <div className="flex min-h-0 flex-1 gap-4 overflow-hidden">
        <div
          ref={paperRef}
          className="notes-paper relative min-h-[280px] flex-1 overflow-y-auto rounded-xl"
          onClick={(e) => {
            editorRef.current?.focus();
            const target = e.target as HTMLElement;
            const sel = getNotesTableSelection();
            if (sel && !target.closest(".notes-table-cell-selected")) {
              clearNotesTableSelection();
            }
          }}
        >
          
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            suppressHydrationWarning
            role="textbox"
            aria-multiline="true"
            aria-label="Notes"
            spellCheck
            autoCorrect="on"
            autoCapitalize="sentences"
            data-gramm="false"
            onFocus={() => scheduleUpdate()}
            onBlur={() => {
              flushNoteText();
            }}
            onKeyDown={(e) => {
              if (e.key !== "Enter" || e.shiftKey) return;
              const el = e.currentTarget;
              const text = el.textContent ?? "";
              const trimmed = text.trimEnd();
              const isReminder = trimmed.endsWith("*");
              const isContact = trimmed.endsWith("#");
              const isTask = trimmed.endsWith("/");
              const isHistory = trimmed.endsWith("'h");
              if (!isReminder && !isContact && !isTask && !isHistory) return;
              e.preventDefault();

              if (isHistory) {
                setNotesHistoryOpen(true);
                const withoutTrigger = text.slice(0, text.lastIndexOf("'h"));
                el.innerHTML = "";
                el.textContent = withoutTrigger;
                resetEditorSelection(el);
                setPlain(withoutTrigger);
                setNoteText(withoutTrigger);
                return;
              }

              if (isReminder) {
                const { title, date, time } = extractReminder(text);
                if (!title) return;
                addReminder(title, date, time);
              } else if (isTask) {
                const { title, date, time } = extractTask(text);
                if (!title) return;
                addTask(title, date, time);
              } else {
                const draft = extractContact(text);
                if (!draft.name) return;
                addContact(draft);
              }

              el.innerHTML = "";
              resetEditorSelection(el);
              setPlain("");
              setNoteText("");

            }}

            onPaste={(e) => {
              // Clean external clipboard HTML so dangerous markup never lands
              // in the editor (and thus never gets persisted or re-rendered).
              const html = e.clipboardData.getData("text/html");
              if (!html) return; // plain-text paste is inert; let it through

              // Pasting a table (Excel/Sheets/Word) while the caret sits
              // inside one of our own tables distributes the pasted grid
              // into our existing cells instead of nesting a second table.
              const anchor = document.getSelection()?.anchorNode ?? null;
              const anchorEl =
                anchor instanceof Element ? anchor : anchor?.parentElement ?? null;
              const targetCell = anchorEl?.closest("td, th") as HTMLTableCellElement | null;
              const targetTable = targetCell?.closest(
                "table[data-notes-table]",
              ) as HTMLTableElement | null;

              if (targetCell && targetTable && targetCell.parentElement) {
                const doc = new DOMParser().parseFromString(html, "text/html");
                const pastedTable = doc.querySelector("table");

                if (pastedTable) {
                  e.preventDefault();
                  const grid = Array.from(pastedTable.rows).map((r) =>
                    Array.from(r.cells).map((c) => c.textContent?.trim() ?? ""),
                  );

                  const startRow = Array.from(targetTable.rows).indexOf(
                    targetCell.parentElement as HTMLTableRowElement,
                  );
                  const startCol = targetCell.cellIndex;

                  grid.forEach((rowValues, i) => {
                    const destRow = targetTable.rows[startRow + i];
                    if (!destRow) return;

                    rowValues.forEach((value, j) => {
                      const destCell = destRow.cells[startCol + j];
                      if (destCell) destCell.textContent = value || "\u00A0";
                    });
                  });

                  notifyNotesTableChange();
                  return;
                }
              }

              e.preventDefault();
              const plainText = e.clipboardData.getData("text/plain") ?? "";
              const safeHtml = plainText
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/\n/g, "<br>");
              document.execCommand("insertHTML", false, safeHtml);
            }}
            onInput={() => {
              scheduleUpdate();
              // Persisting to the store is expensive (whole-workspace save),
              // so it happens once the user pauses instead of per keystroke.
              if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
              syncTimerRef.current = setTimeout(flushNoteText, 400);
            }}
            className="notes-editor min-h-full w-full outline-none"
          />
          <NotesTableOverlay containerRef={paperRef} editorRef={editorRef} />
        </div>

        {notesHistoryOpen && <CallHistoryPanel notes={savedNotes} />}
      </div>

      <footer className="mt-auto flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-border py-2">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          {plain.trim().length > 0 && (
            <span className="rounded-full bg-[rgba(100,116,139,0.15)] px-2.5 py-1 text-[11px] font-medium text-slate-700">
              {charCount} {charCount === 1 ? "carácter" : "caracteres"}
              {rateInfo && ` | Total $${rateInfo.total.toFixed(2)}`}
              {nightsInfo && ` | ${nightsInfo.nights} ${nightsInfo.nights === 1 ? "noche" : "noches"}`}
            </span>
          )}



        </div>


        <div className="flex shrink-0 items-center gap-1">
          {plain.trim().length > 0 && (
            <button
              type="button"
              onClick={saveCurrentNote}
              aria-label="Save note"
              className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <FloppyDisk className="size-[14px]" />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
