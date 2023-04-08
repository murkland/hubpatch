import { Editor } from './editor';

const saveFileInput = document.getElementById("save")! as HTMLInputElement;
const patchCardsTable = document.getElementById("patch-cards")!;
const totalMB = document.getElementById("total-mb")!;
const downloadButton = document.getElementById(
    "download"
)! as HTMLButtonElement;
const addPatchCardSelect = document.getElementById(
    "add-patch-card"
)! as HTMLSelectElement;

function downloadBlob(blob: Blob) {
    const objectURL = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = "bn5.sav";
    a.href = objectURL;
    a.textContent = "download";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objectURL);
}

function populatePatchCards() {
    for (let i = 1; i < Editor.PATCH_CARD_INFO.length; ++i) {
        const { name, nameJa, mb } = Editor.PATCH_CARD_INFO[i];
        const option = document.createElement("option");
        addPatchCardSelect.appendChild(option);
        option.textContent = `${name}・${nameJa} (${mb} MB)`;
        option.value = i.toString();
    }
}

addPatchCardSelect.addEventListener("change", () => {
    if (addPatchCardSelect.value == "") {
        return;
    }
    const id = parseInt(addPatchCardSelect.value);
    editor.setPatchCardCount(editor.getPatchCardCount() + 1);
    editor.setPatchCard(editor.getPatchCardCount() - 1, id, true);
    addPatchCardSelect.value = "";
    update();
});

function deletePatchCard(editor: Editor, i: number) {
    const n = editor.getPatchCardCount();
    for (; i < n - 1; ++i) {
        const { id, enabled } = editor.getPatchCard(i + 1);
        editor.setPatchCard(i, id, enabled);
    }
    editor.setPatchCardCount(editor.getPatchCardCount() - 1);
}

const MAX_MB = 80;

function update() {
    const tbody = patchCardsTable.querySelector("tbody");
    tbody.innerHTML = "";

    let total = 0;
    for (let i = 0, n = editor.getPatchCardCount(); i < n; ++i) {
        const { id, enabled } = editor.getPatchCard(i);
        const patchCard = Editor.PATCH_CARD_INFO[id];
        if (enabled) {
            total += patchCard.mb;
        }

        const tr = document.createElement("tr");
        tbody.appendChild(tr);

        if (!enabled) {
            tr.className = "text-body-tertiary";
        }

        const deleteTd = document.createElement("td");
        tr.appendChild(deleteTd);

        const deleteButton = document.createElement("button");
        deleteButton.className = "btn btn-danger btn-sm";
        deleteButton.innerHTML = `<i class="bi bi-x"></i>`;
        deleteButton.onclick = ((i: number) => {
            deletePatchCard(editor, i);
            update();
        }).bind(null, i);
        deleteTd.appendChild(deleteButton);

        const nameTd = document.createElement("td");
        tr.appendChild(nameTd);
        nameTd.textContent = `${patchCard.name}・${patchCard.nameJa}`;

        const mbTd = document.createElement("td");
        tr.appendChild(mbTd);
        mbTd.textContent = patchCard.mb.toString();
    }
    totalMB.textContent = total.toString();

    for (const option of addPatchCardSelect.querySelectorAll("option")) {
        if (option.value == "") {
            continue;
        }
        const { mb } = Editor.PATCH_CARD_INFO[parseInt(option.value, 10)];
        option.disabled = total + mb > MAX_MB;
    }
}

let editor: Editor;

downloadButton.addEventListener("click", () => {
    if (editor == null) {
        return;
    }
    editor.rebuild();
    const blob = new Blob([new Uint8Array(editor.toSRAMDump())]);
    downloadBlob(blob);
});

saveFileInput.addEventListener("change", () => {
    if (saveFileInput.files.length == 0) {
        return;
    }

    const file = saveFileInput.files[0];

    (async () => {
        const buf = await file.arrayBuffer();

        try {
            const raw = Editor.sramDumpToRaw(buf);
            const gameInfo = Editor.sniff(raw);
            editor = new Editor(raw, gameInfo);
        } catch (e) {
            alert(`Failed to load save: ${e}`);
            return;
        }

        update();
        downloadButton.disabled = false;
        addPatchCardSelect.disabled = false;
    })();
});

populatePatchCards();
