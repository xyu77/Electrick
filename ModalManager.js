// ===== ModalManager.js =====

let showConfirmModal = false;
let yesButton, noButton;

function drawConfirmModal() {
  push();
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(16);
  noStroke();
  fill(255, 230);
  rect(width / 2, height / 2, 300, 150, 20);

  fill(0);
  text("Save screen before clear canvas?", width / 2, height / 2 - 30);
  pop();
}

function createModalButtons() {
  if (!yesButton) {
    yesButton = createButton("Yes ✅");
    yesButton.position(width / 2 - 70, height / 2 + 20);
    yesButton.style("padding", "8px 16px");
    yesButton.style("font-weight", "bold");
    yesButton.style("border-radius", "6px");
    yesButton.mousePressed(() => {
      saveCanvas("electrick-canvas", "png");
      clearCanvasAndLines();
      hideModalButtons();
    });
  }

  if (!noButton) {
    noButton = createButton("No ❌");
    noButton.position(width / 2 + 10, height / 2 + 20);
    noButton.style("padding", "8px 16px");
    noButton.style("font-weight", "bold");
    noButton.style("border-radius", "6px");
    noButton.mousePressed(() => {
      hideModalButtons();
    });
  }
}

function hideModalButtons() {
  if (yesButton) {
    yesButton.remove();
    yesButton = null;
  }
  if (noButton) {
    noButton.remove();
    noButton = null;
  }
  showConfirmModal = false;
}

function clearCanvasAndLines() {
  cmoLineList = [];
  currentlyDrawing = false;
}
